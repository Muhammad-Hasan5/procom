import mongoose, { Schema, Types } from "mongoose";
export const notificationSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: [
            "WELCOME_TO_APP",
            "PROJECT_CREATED",
            "PROJECT_ENDED",
            "MEMBER_ADDED",
            "MEMBER_REMOVED",
            "OWNER_CHANGED",
            "TASK_CREATED",
            "NOTE_ADDED",
            "CALL_INVITATION",
        ],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export const Notification = mongoose.model("Notification", notificationSchema);
