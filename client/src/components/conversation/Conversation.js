import axios from 'axios';
import React, { useEffect, useState } from 'react';


function Conversation({conversation, currentUser}) {
    const [user, setUser] = useState('');

    useEffect( () => {
        const matchId = conversation.members.find(m=>m !== currentUser);

        const getUser = async() => {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/user/${matchId}`,
            withCredentials: true,
        })

        .then((res) => {
          //console.log(res);
            setUser(res.data);
            
        }, [conversation, currentUser])

        .catch((err) => console.log(err))
        };
        getUser();

    }, [conversation, currentUser]);

    return (
        <div className='conversation'>
            {/* <img className='conversationImg' src={user.picture ? user.picture : '/img/Wankul.png'} alt='conv-img'/>*/} 
            <img className='conversationImg' src='/img/Wankul.png' alt='conv-img'/>
            <span className='conversationName'>{user.pseudo}</span>
        </div>
        
    )
};

export default Conversation;