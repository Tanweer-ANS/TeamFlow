import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    description: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    }
}, { timestamps: true })

//Index
projectSchema.index({ organization: 1 });

export default mongoose.model("Project", projectSchema)