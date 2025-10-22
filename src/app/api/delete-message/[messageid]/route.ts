import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { ca } from "zod/locales";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;
    if(!session || !session.user) {
        return Response.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(updateResult.modifiedCount === 0) {
            return Response.json({ status: false, message: "Message not found or could not be deleted" }, { status: 404 });
        }
        return Response.json({ status: true, message: "Message deleted successfully" }, { status: 200 });
    }catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({ status: false, message: "Internal Server Error" }, { status: 500 });
    }
}