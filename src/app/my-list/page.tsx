'use client'

import React, { useState } from 'react';
import Tree, {defaultTree} from './Tree'
import DisplayTree from './TreeRenderer';
import "./style.css";

var id = 10;

export default function Home() {
  const [tree, setTree] = useState(defaultTree);
  const [selection, setSelection] = useState('root');
  const [newElement, setNewElement] = useState('');
  const [optionSelection, setOptionSelection] = useState('');

  function hasChild(parentName : string, targetName : string, tree: Tree){
    if(parentName == targetName)
      return true;

    for (const child of tree[parentName].children){
      if(hasChild(child, targetName, tree))
        return true;
    }

    return false;
  }

  function removeItemParentReferences(name: string, tree: Tree){
    // Have to define item variable or else type script complains due to bug: https://github.com/microsoft/TypeScript/issues/10530
    const item = tree[name];

    if(item.parent !== undefined){
      for(const parent of item.parent){
        tree[parent].children = tree[parent].children.filter(e => e !== name);
      }
    }
  }

  function setParent(name : string, parentName: string, tree: Tree){
    // Return if we are trying to set the parent to the element's own child
    if(hasChild(name, parentName, tree))
      return;

    // const newData = {...tree};

    // Remove child entry from parent
    removeItemParentReferences(name, tree);

    tree[name].parent = [parentName];
    tree[parentName].children.push(name);
    // setTree(newData);
  }

  function deleteItemRecursive(name : string, tree : Tree){
    for (const child of tree[name].children)
      deleteItemRecursive(child, tree);

    delete tree[name];
  }

  function getItemNameAbove(name: string, tree: Tree) : string | undefined{
    const item = tree[name];
    
    if(item.parent !== undefined){
      const parent = tree[item.parent[0]];
      const index = parent.children.indexOf(name);
      
      if(index == 0)
        return item.parent[0];

      return parent.children[index - 1];
    }

    return undefined;
  }

  function deleteItem(name : string, tree: Tree){
    // const newData = {...tree};

    // Remove child entry from parent
    removeItemParentReferences(name, tree);

    deleteItemRecursive(name, tree);
    // setTree(newData);
  }

  function addItem(data: string, parent: string, tree: Tree){
    const name = id.toString();
    tree[name] = {
      "data": data,
      "children": [],
      "parent": [parent]
    }

    tree[parent].children.push(name);
    id += 1;
  }

  function addData(){
    const newData = {...tree};
    
    addItem(newElement, selection, newData);
    
    setTree(newData);
    setNewElement('');
  }

  function splitItem(name : string, pos : number){
    console.log("Split item");
    const newTree = {...tree};
    
    const newData = newTree[name].data.substring(pos);
    newTree[name].data = newTree[name].data.substring(0, pos);

    const parent = newTree[name].parent;
    const setParent = parent === undefined ? name : parent[0];

    // addItem(newData, setParent, newTree);
    const newName = id.toString();
    newTree[newName] = {
      "data": newData,
      "children": [],
      "parent": [setParent]
    }

    if(parent === undefined)
      newTree[setParent].children.splice(0,0,newName);
    else
      newTree[setParent].children.splice(newTree[setParent].children.indexOf(name)+1,0,newName);

    id += 1;
    
    setTree(newTree);
  }

  function joinItem(name : string){
    const itemAbove = getItemNameAbove(name, tree);
    
    if(itemAbove === undefined)
      return;

    const newTree = {...tree};

    for(const child of tree[name].children){
      setParent(child, itemAbove, newTree);
    }
    
    newTree[itemAbove].data += " " + newTree[name].data;
    
    deleteItem(name, newTree);
    setTree(newTree);
  }

  function handleEditData(id : string, data : string){
    console.log(id);
    const newData = {...tree};
    newData[id].data = data;
    setTree(newData);
  }

  function handleSelection(name : string){
    if(optionSelection == ''){
      setSelection(name);  
    }else{
      const newTree = {...tree};
      setParent(optionSelection, name, newTree);
      setTree(newTree);
      setOptionSelection(''); 
    }
  }

  function handleOptionSelection(name: string){
    setOptionSelection(name); 
  }

  function handleDelete(){
    const newTree = {...tree};
    deleteItem(optionSelection, newTree);
    setOptionSelection('');
    setTree(newTree);
  }

  return (
    <main >
      <div>Hello world</div>
      
      <p>This is a list</p>
      {optionSelection != '' ? (
        <button onClick={handleDelete}>Delete item</button>
      ) : ( 
        <></> 
      )}
      
      <div className="dataHolder">
        <DisplayTree tree={tree} name="root" treeProps={{showOptions:(optionSelection == ''), curSelection:selection}} callbacks={{onClick:handleSelection, onEditData:handleEditData, onSelectOption:handleOptionSelection, onJoin:joinItem, onSplit:splitItem}}   />
      </div>

      <input value={newElement} onChange={e => setNewElement(e.target.value)} />
      <button onClick={addData}>Add data</button>
    </main>
  );
}
