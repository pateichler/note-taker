export default interface Tree{
    [key: string]: {
        data: string,
        children: string[],
        parent?: string[]
    }
}

function setParent(tree : Tree, name: string){
    tree[name].children.map((child) => {
        tree[child].parent = [name];
        setParent(tree, child);
    })
}
  
const initTree : Tree = {
    "root": {
        "data": "This is a test application for a proto type note system.",
        "children": ["1"]
    },
  
    "1": {
        "data": "Controls",
        "children": ["2", "3", "4", "5", "6"]
    },
  
    "2": {
        "data": "cmd + enter: Edit current selected note.",
        "children": []
    },
  
    "3": {
        "data": "cmd + I: Move selected note to parent.",
        "children": []
    },

    "4": {
        "data": "cmd + K: Move selected note to first child.",
        "children": []
    },

    "5": {
        "data": "cmd + L: Move selected note to next sibling.",
        "children": []
    },

    "6": {
        "data": "cmd + J: Move selected note to previous sibling.",
        "children": []
    },
}

setParent(initTree, "root");

export let defaultTree = initTree;