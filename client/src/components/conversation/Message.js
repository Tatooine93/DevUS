import React from 'react';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

const Message = ({message, own}) => {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className='messageTop'>
                <img className='messageImg' src='/img/Wankul.png' alt='mess-img'/>
                <p className='messageText'>{message.text}</p>
            </div>
            <div className='messageBottom'>{formatDistance(new Date(message.createdAt), Date.now(), {addSuffix: true, locale: fr})}</div>
        </div>
    )
};

export default Message