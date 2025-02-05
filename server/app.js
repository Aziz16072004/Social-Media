const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const http = require('http');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const { Server } = require("socket.io");
const { requireAuth } = require('./middlewares/auth');

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://social-media-2-o8uj.onrender.com'],
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/storiesImgs', express.static(path.join(__dirname, 'storiesImgs')));

// API Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/home", requireAuth, require("./routes/homeRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/story", require("./routes/storyRoute"));
app.use("/api/notification", require("./routes/notificationRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/message", require("./routes/messageRoute"));

// -------------------------- Deployment ------------------------------



// -------------------------- React Deployment ------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    // Serve React static files
    app.use(express.static(path.join(__dirname1, "/client/build")));

    // Only serve React for non-API routes
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
        }
    });
}

// -------------------------- Database Connection ------------------------------
mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
connectDB();

// -------------------------- Socket.IO Setup ------------------------------
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://social-media-2-o8uj.onrender.com"
        ],
        credentials: true,
    },
});

// -------------------------- Socket.IO Events ------------------------------
let users = [];
const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
    }
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sending-message", (user) => {
        const findUser = users.find((findUser) => findUser.userId === user.to);
        if (findUser) {
            io.to(findUser.socketId).emit("receiving-message", true);
        } else {
            console.log("User not found");
        }
    });

    socket.on("send-message", (data) => {
        const findUser = users.find((findUser) => findUser.userId === data.to);
        if (findUser) {
            io.to(findUser.socketId).emit("receive-message", { fromSelf: false, message: data.message });
        } else {
            console.log("User not found");
        }
    });

    socket.on("send-notification", (data) => {
        const findUser = users.find((findUser) => findUser.userId === data.to);
        if (findUser) {
            io.to(findUser.socketId).emit("receive-notification", { sender: { profileImg: data.img, username: data.username }, description: data.message, read: false, createdAt: formatPostDate(data.createdAt) });
        } else {
            console.log("User not found");
        }
    });

    socket.on("addFriend", (data) => {
        const findUser = users.find((findUser) => findUser.userId === data.to);
        if (findUser) {
            io.to(findUser.socketId).emit("receive-addFriends", { user: { profileImg: data.img, username: data.username, _id: data.from } });
        } else {
            console.log("User not found");
        }
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// -------------------------- Start Server ------------------------------
server.listen(PORT, () => {
    console.log(`Server is running at ${process.env.URL || `http://localhost:${PORT}`}`);
});

// -------------------------- Helper Function ------------------------------
function formatPostDate(createdAt) {
    const postDate = new Date(createdAt);
    const currentDate = new Date();

    const yearDiff = currentDate.getFullYear() - postDate.getFullYear();
    const monthDiff = currentDate.getMonth() - postDate.getMonth();
    const dayDiff = currentDate.getDate() - postDate.getDate();

    if (yearDiff > 0) {
        return `${yearDiff === 1 ? 'year' : 'years'} ago`;
    } else if (monthDiff > 0) {
        return `${monthDiff === 1 ? 'month' : 'months'} ago`;
    } else if (dayDiff > 0) {
        return `${dayDiff === 1 ? 'day' : 'days'} ago`;
    } else {
        return 'Today';
    }
}
