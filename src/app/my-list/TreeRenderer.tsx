import React, { useState } from 'react';
import Tree from './Tree'

type ItemFunction = (name: string) => void;

interface Item {
  name: string,
  data: string
}

interface TreeProps {
  showOptions: boolean,
  curSelection: string
}

interface ItemEditCallbacks {
  onJoin: ItemFunction,
  onEditData: (name: string, newData: string) => void,
  onSplit: (name: string, position: number) => void
}

interface ItemCallbacks {
  onClick: ItemFunction,
  onSelectOption: ItemFunction,
  editCallbacks: ItemEditCallbacks
}


function ItemEdit(props: { item: Item, onExit: () => void, callbacks: ItemEditCallbacks }) {

  const [editText, setEditText] = useState(props.item.data);

  function saveData() {
    props.callbacks.onEditData(props.item.name, editText);
    props.onExit();
  }

  function handleKeyInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.code === "Backspace" && e.currentTarget.selectionStart == 0)
      props.callbacks.onJoin(props.item.name);
    else if (e.code === "Enter") {
      e.preventDefault();

      if (e.nativeEvent.shiftKey) {
        if (e.currentTarget.selectionStart == 0)
          return;

        // e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.selectionStart);
        // setEditText(editText.substring(0, e.currentTarget.selectionStart));
        props.callbacks.onSplit(props.item.name, e.currentTarget.selectionStart);
        props.onExit();
      } else {
        saveData();
      }
    }
  }

  return (
    <textarea
      defaultValue={props.item.data}
      autoFocus
      onChange={(e) => {
        setEditText(e.target.value);
      }}
      onKeyDown={(e) => {
        handleKeyInput(e);
      }}
      onBlur={(e) => {
        saveData();
      }}
    />
  )

}

function DisplayItem(props: { item: Item, treeProps: TreeProps, callbacks: ItemCallbacks }) {
  const [edit, setEdit] = useState(false);
  // const [editText, setEditText] = useState(props.item.data);

  // if(edit == false && editText != props.item.data){
  //     console.log("Not equal");
  //     console.log("Data: " + props.item.data);
  //     setEditText(props.item.data);
  //     setEdit(true);
  // }

  function handleEditClose() {
    setEdit(false);
    // props.callbacks.onEditData(props.item.name,target.value);
  }



  // console.log("Rendering item " + props.item.name);

  return (
    <li key={props.item.name}
      onClick={() => { props.callbacks.onClick(props.item.name) }}
      onDoubleClick={() => { setEdit(true) }}
      className={"item " + (props.treeProps.curSelection == props.item.name ? 'selected' : '')}
    >
      { edit ? (
          <ItemEdit item={props.item} onExit={handleEditClose} callbacks={props.callbacks.editCallbacks} />
      ): (<p>{props.item.data}</p>)
      }

      { props.treeProps.showOptions ? (
        <button onClick={() => props.callbacks.onSelectOption(props.item.name)} style={{ marginLeft: 10 + 'px' }}>:</button>
        ) : ( <></> )
      }
    </li >
  )
}

export default function DisplayTree(props: { name: string, tree: Tree, treeProps: TreeProps, callbacks: ItemCallbacks }) {
  const obj = props.tree[props.name];

  return (
    <ul>
      <DisplayItem item={{ name: props.name, data: obj.data }} treeProps={props.treeProps} callbacks={props.callbacks} />
      
      {obj.children.length > 0 ? (
        obj.children.map((child) => {
          return (
            <DisplayTree key={child.toString()} {...props} name={child.toString()} />
          );
        })
      ) : (
        <></>
      )}
    </ul>
  );
}