import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "MEMBER"],
            default: "MEMBER",
        },
        token: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED"],
            default: "PENDING",
        },
        expiresAt: {
            type: Date,
            required: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);