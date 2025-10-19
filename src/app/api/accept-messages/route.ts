import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;
    if(!session || !session.user) {
        return Response.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;
    const {acceptedMessages} = await request.json();

    try {
        // Process accepted messages
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptedMessages},
            {new: true}
        )

        if(!updatedUser) {
            return Response.json({ status: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ status: true, message: "Messages acceptance updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error accepting messages:", error);
        return Response.json({ status: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user) {
        return Response.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({ status: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ status: true, isAcceptingMessages: foundUser.isAcceptingMessages }, { status: 200 });
    } catch (error) {

        console.error("Error fetching message acceptance status:", error);
        return Response.json({ status: false, message: "Internal Server Error" }, { status: 500 });
    }
}