import React, { useState} from 'react';
import DisplayTree, {CurrentItem, ItemState} from './TreeRenderer';
import { text } from 'stream/consumers';

import ItemEdit, {ItemEditCallbacks} from './ItemEdit';

export default function Prompt(props: {addItem: (data: string) => void, getData: (name: string) => string, curItem: CurrentItem, editCallbacks: ItemEditCallbacks, editData: string}){
    const [message, setMessage] = useState('');

    function onSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        props.addItem(message);

        setMessage("");
    }
    
    if(props.curItem.state === 'select')
        return (
            <>
                {props.curItem.onScreen == false ? (
                    <div id='prompt-selection'>
                        <p>{props.getData(props.curItem.name)}</p>
                    </div>
                ) : (<></>)}

            
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
            </>
        )
    
    if(props.curItem.state === 'edit' && props.curItem.onScreen == false)
        return (
            <form id='prompt-message' onSubmit={onSubmit}>
                <ItemEdit curItem={props.curItem} callbacks={props.editCallbacks} editData={props.editData} />
            </form>
        )
    
    return <></>
}