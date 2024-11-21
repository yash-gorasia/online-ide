import fs from 'fs/promises';
import path from 'path';

async function generateFileTree(directory) {
    const root = {
        name: path.basename(directory),
        isFolder: true,
        items: []
    };

    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                const dirObject = {
                    name: file,
                    isFolder: true,
                    items: []
                };
                currentTree.push(dirObject);
                // Recurse into the directory
                await buildTree(filePath, dirObject.items);
            } else {
                const fileObject = {
                    name: file,
                    isFolder: false,
                    items: []
                };
                currentTree.push(fileObject);
            }
        }
    }

    await buildTree(directory, root.items);
    return root;
}

async function getFileTree(req, res) {
    try {
        const fileTree = await generateFileTree('./root');
        return res.json({ root: fileTree });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate file tree' });
    }
}

export { getFileTree };
