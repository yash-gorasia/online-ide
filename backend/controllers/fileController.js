import fs from 'fs/promises';
import path from 'path';

async function generateFileTree(directory) {
    const tree = {};

    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                currentTree[file] = {};
                await buildTree(filePath, currentTree[file]);
            } else {
                currentTree[file] = null;
            }
        }
    }

    await buildTree(directory, tree);
    return tree;
}

// Controller function to handle the request
async function getFileTree(req, res) {
    try {
        const fileTree = await generateFileTree('./user'); // Adjust the directory as needed
        return res.json({ tree: fileTree });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate file tree' });
    }
}

export { getFileTree };
