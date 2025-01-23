import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        isFolder: { type: Boolean, required: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null }, // Points to the parent
        path: { type: String, required: true }, // For storing the full path for easy lookup
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], // Only for folders
        content: { type: String, default: '' }, // Only for files
    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

export default File;
