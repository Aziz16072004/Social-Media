const userSchema = require("../models/user");
const notificationSchema = require("../models/notification");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const path = require("path");

const Add_InsertUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const check = await userSchema.findOne({ email: email });
        if (check) {
            return res.status(200).json("existe")
        }
        
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new userSchema({
            username: username,
            email: email,
            password: hashedPassword,
        });
        res.json("nonexiste")
        await newUser.save();

       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registering user" });
    }
};


const checkUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userSchema.findOne({ email: email }).populate({
            path: 'friends.user',  
            model: 'User'  ,
            select : "username profileImg"
        });
        if (!user) {
            return res.json("nonexiste");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json("Incorrect password");
        }

        const token = jwt.sign({ _id: user._id }, "aziz secret code", { expiresIn: '1d' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });
        res.json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getUser = async (req ,res ) => {
    const id = req.params.id
    try {
        const check = await userSchema.findById(id).select('-postMarkes -__v').populate({
            path: 'requests.user',  
            model: 'User'  ,
            select : "username profileImg"
        }).populate({
            path: 'friends.user',  
            model: 'User',
            select : "username profileImg"
        })
        
        if (check){
            res.json(check)
        }
        else {
            res.json("user non existe")
        }
    } catch (error) {
        console.log(error);
    }
}

const getAllUsers = async (req ,res ) => {
    try {
        const check = await userSchema.find({}).select('username profileImg friends')
        res.json(check)
    } catch (error) {
        console.log(error);
    }
}
const getOneUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userSchema.findById(id).populate({
            path: 'friends.user',  
            model: 'User',
            select : "username profileImg"
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
};
const addFriend = async (req, res) => {
    const data = {
        sender: req.body.sender,
        recipient: req.body.recipient
    };

    try {
        const userRecipient = await userSchema.findById(data.recipient);
        const userSender = await userSchema.findById(data.sender);

        if (!userRecipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        if (!userSender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        if (data.sender === data.recipient) {
            return res.json("You can't send an invitation to yourself.");
        }

        const isRequestSent = userRecipient.requests.some(request => request.user.toString() === data.sender);

        if (isRequestSent) {
            return res.json("You have already sent an invitation.");
        }

        userRecipient.requests.push({ user: data.sender });
        userSender.pending.push({ user: data.recipient });
        userRecipient.newNotifi ++ ;
        await notificationSchema.insertMany([{
            sender : data.sender,
            receiver : data.recipient,
            description: 'wants to be friends'
        }])
        await userRecipient.save();
        await userSender.save();
        res.json("sending invitation successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const acceptfriend = async (req, res) => {
    const data = {
        sender: req.body.sender,
        recipient: req.body.recipient
    };

    try {
        const userReceipent = await userSchema.findById(data.recipient);
        const userSender = await userSchema.findById(data.sender).select('-postMarkes -__v -password -requests')
       
        if (!userReceipent) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        if (!userSender) {
            return res.status(404).json({ error: 'sender not found' });
        }

        const test = userReceipent.friends.find((findSender) => findSender.user.toString() === data.sender);
        if (test) {
            return res.json("You are already friends");
        }
        await notificationSchema.insertMany([{
            sender : data.recipient,
            receiver : data.sender,
            description: 'accept your friends request'
        }])       
        userReceipent.friends.push({ user: data.sender });
        userSender.friends.push({ user: data.recipient });
        userReceipent.requests = userReceipent.requests.filter((request) => request.user.toString() !== data.sender);     
        userSender.pending = userReceipent.pending.filter((pend) => pend.user.toString() !== data.recipient);     
        userSender.newNotifi ++ ;
        await userReceipent.save();
        await userSender.save();
        res.json(userSender);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const rejectfriend = async (req, res) => {
    const data = {
        sender: req.body.sender,
        recipient: req.body.recipient
    };
    try {
        const userReceipent = await userSchema.findById(data.recipient);
        const userSender = await userSchema.findById(data.sender).select('-postMarkes -__v -password -requests')
        if (!userReceipent) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        if (!userSender) {
            return res.status(404).json({ error: 'sender not found' });
        }
        const test = userReceipent.friends.find((findSender) => findSender.user.toString() === data.sender);
        if (test) {
            return res.json("You are already friends");
        }
        userReceipent.requests = userReceipent.requests.filter((request) => request.user.toString() !== data.sender); 
        userSender.pending = userSender.pending.filter((pend) => pend.user.toString() !== data.recipient); 
        userSender.newNotifi ++ ;
        await notificationSchema.insertMany([{
            sender : data.recipient,
            receiver : data.sender,
            description: 'reject your friends request'
        }])
        await userReceipent.save();
        await userSender.save();
        res.json("reject friend successfuly");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const postMarkes=  async (req,res) =>{
    const id = req.params.id
    try {
        const data = await userSchema.findById(id)
        await data.populate({
            path: 'postMarkes.post',
            model: 'Post',
            populate: [
                {
                    path: 'userId',
                    model: 'User',
                    select: '-_id -__v -postMarkes'
                },
                {
                    path: 'peopleRated.user',
                    model: 'User',
                    select: '-_id -__v -postMarkes'
                },
                {
                    path: 'comments.user',
                    model: 'User',
                    select: '-_id -email -__v -postMarkes '
                },
            ],
            
    })
        res.json(data.postMarkes)
    } catch (error) {
        res.json(error)
    }
}

const updateUser =  async (req, res) => {
    const data = {
        userId: req.params.id,
        username: req.body.username,
        newPassword: req.body.newPassword,
        profileImg: `uploads/${req.file.filename}`
    };
    try {
        const userData = await userSchema.findById(data.userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        userData.username = data.username;
        userData.profileImg = data.profileImg;

        userData.password = data.newPassword;
        await userData.save();
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {Add_InsertUser,checkUser,postMarkes , updateUser , getUser , getAllUsers,getOneUser,addFriend,acceptfriend,rejectfriend }
