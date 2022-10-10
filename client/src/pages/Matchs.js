import React, { useContext, useEffect, useRef, useState } from 'react';
import Conversation from '../components/conversation/Conversation';
import Message from '../components/conversation/Message';
import axios from 'axios';
import { UidContext } from '../components/AppContext';
import { io } from 'socket.io-client';


const Matchs = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef(io("ws://localhost:8900"));
    const uid = useContext(UidContext);
    const scrollRef = useRef();

/*     useEffect(() => {
        socket.current = io("ws://localhost:8900");
    }); */

    useEffect(() => {
        socket.current.emit("addUser", uid);
        socket.current.on("getUsers", users => {
            console.log(users);
        })
    },[uid]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios({
                    method: "get",
                    url: `${process.env.REACT_APP_API_URL}api/conversation/${uid}`,
                    withCredentials: true,
                    });
                    setConversations(res.data);
                    
            }
            catch(err) {
                console.log(err);
            }
        }
        getConversations();
    }, [uid]);

    useEffect(() => {
        const getMessages = async () => {
        try {
            const res = await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}api/message/${currentChat?._id}`,
                withCredentials: true,
                });
                setMessages(res.data);
        }
        catch(err) {
            console.log(err);
        }
    }
    getMessages();
    },[currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            conversationId: currentChat._id,
            senderId: uid,
            text: newMessage,
        };

        const receiverId = currentChat.members.find(member => member !== uid);

        socket.current.emit("sendMessage", {
            senderId: uid,
            receiverId,
            text: newMessage,
        });


        try {
            const res = await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/message/`,
                data: message
                });
                setMessages([...messages, res.data.message]);
                setNewMessage('');

        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    },[]);

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage]);
    },[arrivalMessage, currentChat]);

    useEffect (() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    },[messages])

    return (
        <>
            <div className='matchs'>
                <div className='chatMenu'>
                    <div className='chatMenuWrapper'>
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c) } key={c._id}>
                                <Conversation conversation={c} currentUser={uid} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='chatBox'>
                    <div className='chatBoxWrapper'>
                        {
                            currentChat ? 
                        <>
                            <div className='chatBoxTop'>
                                {messages.map((m) => (
                                    <div ref={scrollRef}>
                                    <Message message={m} own={m.senderId === uid} key={m._id}/>
                                    </div>
                                ))}
                            </div>
                            <div className='chatBoxBottom'>
                                <textarea
                                className='chatMessageInput'
                                placeholder='Écrivez quelque chose...'
                                onChange={(e) => setNewMessage(e.target.value)}
                                value={newMessage}
                                key={uid}
                                ></textarea>
                                <button className='chatSubmitButton' onClick={handleSubmit}>Envoyer</button>
                            </div>
                        </> 
                        : 
                        <span className='noConversationText'>Sélectionner un match pour commencer une conversation.</span>}
                    </div>
                </div>

                <div className='chatOnline'>
                    <div className='chatOnlineWrapper'>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Matchs;