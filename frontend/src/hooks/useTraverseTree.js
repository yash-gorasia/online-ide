const useTravereTree = () => {
    const insertNode = (tree, path, name, isFolder) => {
        if(tree.name === path) {
            return {
                ...tree,
                items: [
                    ...tree.items,
                    {
                        name: name,
                        isFolder,
                        items: isFolder ? [] : null
                    },
                ],
            };
        }

        return {
            ...tree,
            items: tree.items.map((child) => {
                child.isFolder ? insertNode(child, child.name, name, isFolder) : child
            })
        }

        return tree
    }

    return {insertNode}
}

export default useTravereTree;