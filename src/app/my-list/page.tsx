'use client'

import React, { useState, useEffect } from 'react';
import Tree, {defaultTree} from './Tree'
import DisplayTree, {CurrentItem, ItemState} from './TreeRenderer';
import Prompt from './Prompt';
import "./style.css";
import { ItemEditCallbacks } from './ItemEdit';

var id = 10;

export default function Home() {
  const [tree, setTree] = useState(defaultTree);
  // const [selection, setSelection] = useState('root');
  
  // const [optionSelection, setOptionSelection] = useState('');
  const [curItem, setCurItem] = useState<CurrentItem>({name: 'root', state: 'select', onScreen: true});

  //TODO: replace in future
  const [editData, setEditData] = useState("");

  function getCurItem(state: ItemState){
    if(curItem.name === '' || curItem.state !== state)
      return undefined;
    
    return curItem.name;
  }

  function resetCurItem(){
    //TODO: maybe want to select last selected item
    setCurItem({name: "root", state:"select", onScreen: true});
  }

  function setItemName(name: string){
    setCurItem({...curItem, name: name});
  }

  function setItemState(state: ItemState){
    setCurItem({...curItem, state: state});
  }

  function moveSelection(dir: 'up' | 'down' | 'left' | 'right'){
    const element = tree[curItem.name];

    if(curItem.state === 'select'){
      switch(dir){
        case 'up':
          const parent = element.parent;
          if(parent !== undefined)
            setItemName(parent[0]);
          break;
        case 'down':
          if(element.children.length > 0)
            setItemName(element.children[0]);
          break;
        case 'left':
          const prevSibling = getRelativeSibling(curItem.name, -1, tree);
          if(prevSibling !== undefined)
            setItemName(prevSibling);
          break;
        case 'right':
          const nextSibling = getRelativeSibling(curItem.name, 1, tree);
          if(nextSibling !== undefined)
            setItemName(nextSibling);
          break;
      }
    }
  }

  // function editSelection(){
  //   if(curItem.state === 'select'){
  //     setItemState("edit");
  //   }
  // }

  function handleKeyPress(event: KeyboardEvent){
    var stopProp = false;

    if(event.metaKey){
      stopProp = true;
      switch(event.key){
        case 'i':
          moveSelection("up");
          break;
        case 'k':
          moveSelection("down");
          break;
        case 'j':
          moveSelection("left");
          break;
        case 'l':
          moveSelection("right");
          break;
        case 'Enter':
          handleEdit(curItem.name);
        default:
          stopProp = false;
      }
    }

    if(stopProp)
      event.preventDefault();
  }

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  function getRelativeSibling(name: string, dir: number, tree: Tree){
    const parent = tree[name].parent;
    if(parent === undefined)
      return undefined;

    const pElement = tree[parent[0]];
    const index = pElement.children.indexOf(name) + dir;

    if(index >= 0 && index < pElement.children.length)
      return pElement.children[index];
    
    return undefined;
  }

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

  function addData(data: string){
    const curSelection = getCurItem("select");
    if(curSelection === undefined)
      return;

    const newData = {...tree};
    
    addItem(data, curSelection, newData);
    
    setTree(newData);
    // setNewElement('');
  }

  function getData(name: string){
    return tree[name].data;
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
    setCurItem({...curItem, name: newName, state: "edit"});
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
    setCurItem({...curItem, name: itemAbove, state: "select"});
  }

  // function handleEditData(id : string, data : string){
  //   console.log(id);
  //   const newData = {...tree};
  //   newData[id].data = data;
  //   setTree(newData);

  //   if(getCurItem("edit") === id)
  //     setCurItem({...curItem, name: id, state: "select"});
  //     // resetCurItem();
  // }

  function handleSaveData(){
    const newData = {...tree};
    
    newData[curItem.name].data = editData;
    setTree(newData);
    setEditData("");

    setCurItem({...curItem, state: "select"});
  }

  function handleSelection(name : string){
    const curOption = getCurItem("option");

    if(curOption === undefined){
      // setSelection(name);
      setCurItem({...curItem, name: name, state: "select"});
    }else{
      const newTree = {...tree};
      setParent(curOption, name, newTree);
      setTree(newTree);
      // setOptionSelection(''); 
      resetCurItem();
    }
  }

  function handleOptionSelection(name: string){
    // setOptionSelection(name);
    setCurItem({...curItem, name: name, state: "option"});
  }

  function handleDelete(){
    const curOption = getCurItem("option");
    if(curOption === undefined)
      return;

    const newTree = {...tree};
    deleteItem(curOption, newTree);
    // setOptionSelection('');
    resetCurItem();
    setTree(newTree);
  }

  function handleEdit(name: string){
    setCurItem({...curItem, name: name, state:"edit"});
    setEditData(tree[name].data);
  }

  function handleScreenChange(onScreen: boolean, textAreaRef: HTMLTextAreaElement | null){
    console.log("Screen change!");
    console.log(textAreaRef);
    console.log(curItem);
    setCurItem({...curItem, onScreen: onScreen});
    console.log(curItem);
  }

  var editCallbacks : ItemEditCallbacks = {onSaveData: handleSaveData, onJoin:joinItem, onSplit:splitItem, onChange:setEditData}

  return (
    <main >
      <div>Hello world</div>
      
      <p>This is a list</p>
      
      <div className="dataHolder">
        <DisplayTree tree={tree} name="root" 
          currentItem={curItem}
          callbacks={{
            onClick:handleSelection, 
            onDoubleClick: handleEdit,
            onSelectOption:handleOptionSelection,
            onItemScreen:handleScreenChange,
            editCallbacks:editCallbacks
          }}
          isDescendantOfCurItem={false} // Todo: remove
          editData={editData}
        />
      </div>
      
      <Prompt 
        addItem={addData}
        getData={getData}
        curItem={curItem}
        editCallbacks={editCallbacks}
        editData={editData}
      />

      {getCurItem("option") !== undefined ? (
        <button onClick={handleDelete}>Delete item</button>
      ) : ( 
        <></> 
      )}
    </main>
  );
}
