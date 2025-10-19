import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();
    const {username, content} = await request.json();
    try{
        const user = await UserModel.findOne({username})
    if(!user) {
        return Response.json({ status: false, message: "User not found" }, { status: 404 });
    }
    if(!user.isAcceptingMessages) {
        return Response.json({ status: false, message: "User is not accepting messages" }, { status: 403 });
    }
    const newMessage = {message: content, createdAt: new Date()};
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({ status: true, message: "Message sent successfully" }, { status: 200 });
    }catch (error) {
        console.error("Error sending message:", error);
        return Response.json({ status: false, message: "Internal Server Error" }, { status: 500 });
    }

}