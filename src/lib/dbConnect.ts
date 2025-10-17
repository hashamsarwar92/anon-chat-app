import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        if (mongoose.connection.readyState >= 1) {
      console.log("Already connected (mongoose cached connection)");
      return;
    }
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database");
    }catch (error) {
        console.error("Error connecting to database", error);
        // process.exit(1);
    }
}
export default dbConnect;
