import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username, email, password} = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            });
        }else{
            const existingUserByEmail = await UserModel.findOne({email});
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
            if(existingUserByEmail){
                if(existingUserByEmail.isVerified) {
                    return Response.json({
                        success: false,
                        message: "Email is already registered and verified. Please log in."
                    }, {
                        status: 400
                    });
                }else{
                    const hashedPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // OTP valid for 1 hour
                    await existingUserByEmail.save();
                }
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // OTP valid for 1 hour
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                });
                await newUser.save();


                // Send verification email
                const emailResponse = await sendVerificationEmail(email, username, verifyCode);
                if(!emailResponse.success) {
                    return Response.json({
                        success: false,
                        message: "Failed to send verification email. Please try again."
                    }, { status: 500 });
                }
                return Response.json({
                    success: true,
                    message: "User registered successfully. Please verify your email."
                }, {
                    status: 201
                });
            }
        }
    }catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        },{
            status: 500
        })
    }
}

