import React, { useState, useEffect, useRef } from 'react';
import Tree from './Tree';
import ItemEdit, {ItemEditCallbacks} from './ItemEdit';

const classNames = require('classnames');

type ItemFunction = (name: string) => void;

interface Item {
  name: string,
  data: string,
  isDescendantOfCurItem: boolean
}

export type ItemState = "select" | "edit" | "option" | ""

export interface CurrentItem {
  name: string,
  state: ItemState,
  onScreen: boolean
}

// interface TreeProps {
//   curItem: {
//     name: string,
//     state: ItemState
//   }
//   // curSelection: string,
//   // curEdit: string
// }



interface ItemCallbacks {
  onClick: ItemFunction,
  onDoubleClick: ItemFunction,
  onSelectOption: ItemFunction,
  onItemScreen: (onScreen: boolean, textAreaRef: HTMLTextAreaElement | null) => void,
  editCallbacks: ItemEditCallbacks
}




function DisplayItem(props: { item: Item, currentItem: CurrentItem, callbacks: ItemCallbacks, editData: string }) {
  // const [edit, setEdit] = useState(false);
  const isCurItem = (props.currentItem.name === props.item.name);
  const itemRef = useRef<HTMLLIElement>(null);
  const editBoxRef = useRef<HTMLTextAreaElement>(null);

  const [itemHeight, setItemHeight] = useState(0);

  // function isCurItem(){
  //   if(props.treeProps.curItem === undefined)
  //     return false;
    
  //   return (props.treeProps.curItem.name === props.item.name);
  // }

  // function isSelected(){
  //   return (isCurItem && props.treeProps.curItem.state === "select");
  // }

  // function isEditing(){
  //   return (isCurItem && props.treeProps.curItem.state === "edit");
  // }

  function isItem(state: ItemState){
    return (isCurItem && props.currentItem.state === state);
  }

  // function handleEdit(state: boolean){

  // }

  // function handleEditClose() {
  //   handleEdit(false);
  // }

  

  function handleScroll() {
    if(itemRef.current !== null){
      const rect = itemRef.current.getBoundingClientRect();
      
      
      const onScreen = rect.top > 0 || rect.bottom > 150;

      if(props.currentItem.onScreen != onScreen){
        props.callbacks.onItemScreen(onScreen, editBoxRef.current);
        
        if(onScreen == false)
          setItemHeight(rect.height - 10); // Todo: automatically account for padding
      }
        
    }
  }

  useEffect(() => {
    if(isCurItem){
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isCurItem, props.currentItem]);

  const itemClasses = classNames(
    'item',
    {
      'selected': isItem('select'),
      'optioned': isItem('option')
    }
  )

  console.log("Rendering item " + props.item.name);

  //TODO: If we want to start edit at double click selection, change paragraph element into a readonly input element and add the onDoubleClick to it. Then on the event read 
  // the selection start of currentTarget and either pass it to the top level app or store it as a ref in this element and pass it ItemElement when creating. 

  if(isItem("edit") && props.currentItem.onScreen == false)
    return (
      <li key={props.item.name}
        className={itemClasses}
        ref={itemRef}
        style={{height: itemHeight, backgroundColor: "red"}}
      >

      </li>
    )

  return (
    <li key={props.item.name}
      onClick={(e) => { if(isItem("edit") == false) {props.callbacks.onClick(props.item.name)} }}
      onDoubleClick={(e) => {props.callbacks.onDoubleClick(props.item.name); }}
      className={itemClasses}
      ref={itemRef}
    >
      { isItem("edit") ? (
          <ItemEdit curItem={props.currentItem} callbacks={props.callbacks.editCallbacks} editData={props.editData} />
      ): (<p>{props.item.data}</p>)
      }

      { props.currentItem.state !== "option" ? (
        <button onClick={(e) => {e.stopPropagation(); props.callbacks.onSelectOption(props.item.name);}} style={{ marginLeft: 10 + 'px' }}>:</button>
        ) : ( <></> )
      }
    </li >
  )
}

//TODO: Make isDescendantOfCurItem have default value of false
export default function DisplayTree(props: { name: string, tree: Tree, currentItem: CurrentItem, callbacks: ItemCallbacks, isDescendantOfCurItem: boolean, editData: string}) {
  const obj = props.tree[props.name];
  const descendant = props.isDescendantOfCurItem || props.name == props.currentItem.name;

  const cnames = classNames(
    {"optioned": (props.currentItem.name === props.name && props.currentItem.state === "option")}
  )

  return (
    <ul className={cnames}>
      <DisplayItem item={{ name: props.name, data: obj.data, isDescendantOfCurItem: descendant }} currentItem={props.currentItem} callbacks={props.callbacks} editData={props.editData} />
      
      {obj.children.length > 0 ? (
        obj.children.map((child) => {
          return (
            <DisplayTree key={child.toString()} {...props} name={child.toString()} isDescendantOfCurItem={descendant} />
          );
        })
      ) : (
        <></>
      )}
    </ul>
  );
}