import {CurrentItem} from './TreeRenderer'
import TextareaAutosize from 'react-textarea-autosize';

export interface ItemEditCallbacks {
    onJoin: (name: string) => void,
    onSaveData: () => void,
    onChange: (data: string) => void,
    onSplit: (name: string, position: number) => void
  }

export default function ItemEdit(props: { curItem: CurrentItem, callbacks: ItemEditCallbacks, editData: string }) {  

    // const [editText, setEditText] = useState(props.item.data);
  
    // function saveData() {
    //   props.callbacks.onEditData(props.item.name, editText);
    // }
  
    function handleKeyInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.code === "Backspace" && e.currentTarget.selectionStart == 0)
        props.callbacks.onJoin(props.curItem.name);
      else if (e.code === "Enter") {
        e.preventDefault();
  
        if (e.nativeEvent.shiftKey) {
          if (e.currentTarget.selectionStart == 0)
            return;
  
          // e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.selectionStart);
          // setEditText(editText.substring(0, e.currentTarget.selectionStart));
          props.callbacks.onSplit(props.curItem.name, e.currentTarget.selectionStart);
        } else {
          props.callbacks.onSaveData();
        }
      }
    }
  
    function handleScreenChange(onScreen: boolean){
      // TODO: Set global edit data if going off screen,
      // else set text data from global edit data
    }
  
    return (
      <TextareaAutosize 
        // defaultValue={props.item.data}
        // disabled={!props.curItem.onScreen}
        value={props.editData}
        className='edit-box'
        minRows={1}
        autoFocus
        onChange={(e) => {
          props.callbacks.onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          handleKeyInput(e);
        }}
        onBlur={(e) => {
          // saveData();
        }}
      />
    )
  
  }