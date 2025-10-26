import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
        .min(3, { message: "Message content must be at least 3 characters long" })
        .max(500, { message: "Message content cannot exceed 500 characters" })
});