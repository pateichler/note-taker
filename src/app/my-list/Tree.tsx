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
        "data": "subject",
        "children": ["1"]
    },
  
    "1": {
        "data": "Test parent",
        "children": ["2", "3"]
    },
  
    "2": {
        "data": "Test child 1",
        "children": ["4"]
    },
  
    "3": {
        "data": "Test child 2",
        "children": []
    },
  
    "4": {
        "data": "Test sub child",
        "children": []
    },
}

setParent(initTree, "root");

export let defaultTree = initTree;