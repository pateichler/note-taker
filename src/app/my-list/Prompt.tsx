import React, { useState} from 'react';
import DisplayTree, {CurrentItem, ItemState} from './TreeRenderer';
import { text } from 'stream/consumers';

export default function Prompt(props: {addItem: (data: string) => void, getData: (name: string) => string, curItem: CurrentItem}){
    const [message, setMessage] = useState('');

    function onSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        props.addItem(message);

        setMessage("");
    }

    return (
        <>
        {props.curItem.onScreen == false ? (
            <div id='prompt-selection'>
                <p>{props.getData(props.curItem.name)}</p>
            </div>
        ) : (<></>)}

        { props.curItem.state === 'select' ? (
            <form id='prompt-message' onSubmit={onSubmit}>
                
                <input 
                    className='message'
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