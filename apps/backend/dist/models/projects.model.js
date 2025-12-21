import mongoose, { Schema, Types } from "mongoose";
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    owner: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [{ type: Types.ObjectId, ref: "User", default: [] }],
}, {
    timestamps: true,
});
projectSchema.index({
    title: "text",
    description: "text",
});
export const Project = mongoose.model("Project", projectSchema);
