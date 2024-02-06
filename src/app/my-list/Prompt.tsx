import React, { useState} from 'react';
import DisplayTree, {CurrentItem, ItemState} from './TreeRenderer';

export default function Prompt(props: {addItem: (data: string) => void, curItem: CurrentItem}){
    const [message, setMessage] = useState('');

    function onSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        props.addItem(message);

        setMessage("");
    }

    return (
        <>
        { props.curItem.state === 'select' ? (
            <form onSubmit={onSubmit}>
              <input 
                autoFocus 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                onBlur={(e) => {e.target.focus();}}
              />
              <input type="submit" value={"Add data"} />
            </form>
          ): (<></>)}
        </>
    )
}