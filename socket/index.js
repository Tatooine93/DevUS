const io = require("socket.io")(8900,{
    cors:{
        origin: "http://localhost:3000"
    }
});

let users = [];

const addUser = (uid, socketId) => {
    !users.some(user => user.uid === uid) &&
        users.push({uid, socketId});
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (uid) => {
    return users.find(user => user.uid === uid);
};

//when connect
io.on("connection", (socket) => {
    console.log("a user is connected.");
    // take userId and socketId from user
    socket.on("addUser", uid => {
        addUser(uid, socket.id);
        io.emit("getUsers", users);
    });

// send and get message
socket.on("sendMessage",({senderId, receiverId,text}) => {
    const user =getUser(receiverId);
    io.to(user.socketId).emit("getMessage",{
        senderId,
        text
    });
});

//when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});