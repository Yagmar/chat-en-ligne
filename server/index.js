const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/userRoutes')
const messageRoute = require('./routes/messagesRoutes')
require("dotenv").config();
const socket = require('socket.io')


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoute)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected Successfull");
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
})

const io = socket(server,{
    cors:{
        origin: "http://localhost:3000",
        credentials: true,
    },
})

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket= socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId,socket.id)
    })

    socket.on("send-msg", (data)=>{
        console.log("sendmgs", {data});
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})