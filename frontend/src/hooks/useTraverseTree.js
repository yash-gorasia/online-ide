// src/hooks/useTraverseTree.js
const useTraverseTree = () => {
  // Insert a new node into the tree
  const insertNode = (tree, parentId, node) => {
    if (!tree) return tree;

    if (tree._id === parentId) {
      return {
        ...tree,
        items: [...tree.items, node],
      };
    }

    if (tree.items) {
      return {
        ...tree,
        items: tree.items.map((item) => insertNode(item, parentId, node)),
      };
    }

    return tree;
  };

  // Delete a node from the tree
  const deleteNode = (tree, nodeId) => {
    if (!tree) return null;

    if (tree._id === nodeId) {
      return null;
    }

    if (tree.items && tree.items.length > 0) {
      const newItems = tree.items.map((item) => deleteNode(item, nodeId)).filter((item) => item !== null);

      return {
        ...tree,
        items: newItems,
      };
    }

    return tree;
  };

  // Update a node's name in the tree
  const updateNode = (tree, nodeId, newName) => {
    if (!tree) return tree;

    if (tree._id === nodeId) {
      return {
        ...tree,
        name: newName,
      };
    }

    if (tree.items) {
      return {
        ...tree,
        items: tree.items.map((item) => updateNode(item, nodeId, newName)),
      };
    }

    return tree;
  };

  return { insertNode, deleteNode, updateNode };
};

export default useTraverseTree;