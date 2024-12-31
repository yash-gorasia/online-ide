import path from 'path';
import File from '../models/fileModel.js';

async function createFileOrFolder(req, res) {
    try {
        const { userId, name, isFolder, parentId } = req.body;

        // Find parent folder
        const parent = parentId ? await File.findById(parentId) : null;

        const parentPath = parent ? parent.path : '/';

        // Create new file/folder
        const newFile = await File.create({
            user: userId,
            name,
            isFolder,
            parent: parentId || null,
            path: path.join(parentPath, name),
            items: [],
        });

        // Update parent's items if it's a folder
        if (parent && parent.isFolder) {
            parent.items.push(newFile._id);
            await parent.save();
        }

        res.status(201).json(newFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create file or folder' });
    }
}


 async function getFileTree(req, res) {
    try {
        const { userId } = req.params;
       
    
        // Find root folder for the user
        const root = await File.findOne({ user: userId, parent: null });

        if (!root) {
            return res.status(404).json({ error: 'Root folder not found' });
        }

        async function buildTree(node) {
            const children = await File.find({ parent: node._id });
            const tree = {
                _id: node._id,
                name: node.name,
                isFolder: node.isFolder,
                items: [],
            };
            for (const child of children) {
                if (child.isFolder) {
                    tree.items.push(await buildTree(child));
                } else {
                    tree.items.push({_id:child._id, name: child.name, isFolder: false });
                }
            }
            return tree;
        }

        const fileTree = await buildTree(root);
        res.json(fileTree);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve file tree' });
    }
}

 async function deleteFileOrFolder(req, res) {
    try {
        const { id } = req.params;

        async function deleteRecursively(fileId) {
            const file = await File.findById(fileId);
            if (file.isFolder) {
                const children = await File.find({ parent: fileId });
                for (const child of children) {
                    await deleteRecursively(child._id);
                }
            }
            await File.findByIdAndDelete(fileId);
        }

        await deleteRecursively(id);
        res.json({ message: 'File/Folder deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete file/folder' });
    }
}



export {
    getFileTree,
    createFileOrFolder,
    deleteFileOrFolder,
};
