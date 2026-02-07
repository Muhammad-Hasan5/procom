import mongoose, { Schema } from "mongoose";
const ChatMessageSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        default: null,
        index: true,
    },
    scope: {
        type: String,
        enum: ["group", "private"],
        required: true,
        index: true,
    },
    payload: {
        message: {
            type: String,
            required: true,
        },
    },
}, {
    timestamps: true
});
export const Message = mongoose.model("ChatMessage", ChatMessageSchema);
