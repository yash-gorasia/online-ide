import path from 'path';
import fs from 'fs';
import File from '../models/fileModel.js';

async function createFileOrFolder(req, res) {
    try {
        const { userId, name, isFolder, parentId } = req.body;

        // Find parent folder
        const parent = parentId ? await File.findById(parentId) : await File.findOne({ user: userId, parent: null }); // Default to root folder
        if (!parent) {
            return res.status(404).json({ error: 'Parent folder not found' });
        }

        // Define the physical path for the new file/folder
        const newPath = path.join(parent.path, name);

        // Handle file creation if it's not a folder
        if (!isFolder) {
            // Ensure the uploads folder exists
            const uploadsDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Create an empty file in the uploads folder
            fs.writeFileSync(newPath, ''); // Create an empty file

            // Create new file entry in the database
            const newFile = await File.create({
                user: userId,
                name,
                isFolder: false,
                parent: parent._id,
                path: newPath, // Store the physical file path
                items: [],
                content: '', // Empty content for now
            });

            // Update parent's items if it's a folder
            if (parent.isFolder) {
                parent.items.push(newFile._id);
                await parent.save();
            }

            res.status(201).json(newFile);
        } else {
            // Create the folder physically in the uploads folder
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath, { recursive: true });
            }

            // Create new folder entry in the database
            const newFolder = await File.create({
                user: userId,
                name,
                isFolder: true,
                parent: parent._id,
                path: newPath, // Store the physical folder path
                items: [],
            });

            // Update parent's items if it's a folder
            if (parent.isFolder) {
                parent.items.push(newFolder._id);
                await parent.save();
            }

            res.status(201).json(newFolder);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create file or folder' });
    }
}

async function writeToFile(req, res) {
    try {
        const { id, content } = req.body;
        const file = await File.findById(id);

        if (!file || file.isFolder) {
            return res.status(404).json({ error: 'File not found or is a folder' });
        }

        fs.writeFileSync(file.path, content);
        res.json({ message: 'File updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to write to file' });
    }
}


async function getFileTree(req, res) {
    try {
        const { userId } = req.params;


        // Find root folder for the user
        let root = await File.findOne({ user: userId, parent: null });

        if (!root) {
            const rootFolderPath = path.join(process.cwd(), 'uploads', 'root');
            if (!fs.existsSync(rootFolderPath)) {
                fs.mkdirSync(rootFolderPath, { recursive: true });
            }
            root = await File.create({
                user: userId,
                name: 'root',
                isFolder: true,
                parent: null,
                path: rootFolderPath,
            })
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
                    tree.items.push({ _id: child._id, name: child.name, isFolder: false });
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

async function renameFileOrFolder(req, res) {
    try {
        const { id, name } = req.body;
        const file = await File.findById(id);
        file.name = name;
        file.path = path.join(path.dirname(file.path), name);
        await file.save();
        res.json(file);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to rename file/folder' });
    }
}



export {
    getFileTree,
    createFileOrFolder,
    writeToFile,
    deleteFileOrFolder,
    renameFileOrFolder,
};
