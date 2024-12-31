const useTraverseTree = () => {
  const insertNode = (tree, parentId, name, isFolder, actualId, path = '') => {
    if (tree._id === parentId) {
      const newPath = `${path}/${name}`;
      return {
        ...tree,
        items: [
          ...tree.items,
          {
            _id: actualId,
            name: name,
            isFolder,
            parentId: tree._id,
            path: newPath,
            items: isFolder ? [] : null,
          },
        ],
      };
    }

    const updatedItems = tree.items.map((child) =>
      insertNode(child, parentId, name, isFolder, actualId, tree.path)
    );

    return {
      ...tree,
      items: updatedItems,
    };
  };

  const deleteNode = (tree, id) => {
    // If the current node matches the id, remove it by returning an empty object
    if (tree._id === id) {
      return {}; // Return an empty object instead of null
    }

    // Otherwise, recursively filter out the node with the matching id
    const updatedItems = tree.items
      .map((child) => deleteNode(child, id))
      .filter((child) => Object.keys(child).length > 0); // Remove empty objects

    return {
      ...tree,
      items: updatedItems,
    };
  };

  return { insertNode, deleteNode };
};

export default useTraverseTree;