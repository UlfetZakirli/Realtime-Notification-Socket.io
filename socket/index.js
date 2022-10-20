import {
    Server
} from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});
let onlineUser = []
const addNewUser = (username, socketId) => {
    !onlineUser.some((user) => user.username === username) &&
        onlineUser.push({
            username,
            socketId
        });
}
const removeUser = (socketId) => {
    onlineUser = onlineUser.filter(user => user.socketId !== socketId)
}

const getUser = () => {
    return onlineUser.find((user) => user.username === username)
}
io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id)
    })
    socket.on("sendNotification",({ senderName,receiverName,type})=>{
        const receiver=getUser(receiverName)
        io.to(receiver.socketId).emit("getNotification",{
            senderName,
            type
        })
    })
    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
})
io.listen(5000)