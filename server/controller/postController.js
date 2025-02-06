const Post = require("../models/post");
const User = require("../models/user");
require("dotenv").config()
const cloudinary = require('../config/cloudinary');

const uploadPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, uploadedFile) => {
            if (error) {
                return res.status(500).json({ error: 'Upload failed' });
            }
            const newPost = new Post({
                name: req.body.name,
                image: uploadedFile.secure_url, 
                userId: req.body.userId,
            });
            const savedPost = await newPost.save();
            await savedPost.populate({
                path: 'userId',
                select: 'username profileImg _id',
            });
            
            res.status(200).json({
                success: true,
                message: 'File uploaded successfully!',
                post: savedPost,
            });
        }).end(req.file.buffer); 
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const showPost = async (req,res) =>{
    postId = req.query.postId
    try {
        const post = await Post.findById(postId).populate({
            path: 'peopleRated.user',
            select: 'username profileImg _id ',
            model: 'User'
        }).populate({
            path: 'comments.user',
            select: 'username profileImg _id ',
            model: 'User'
        }).populate({
            path: 'userId',
            model: 'User'
        });
        if (post) {
          res.json(post);
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
const showPostJustForProfile = async (req,res) =>{
    const userId = req.query.userId
    try {
        const post = await Post.find({userId:userId }).select("image rates name comments").sort({createdAt:-1})
        if (post) {
          res.json(post);
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path: 'userId',
            model: 'User'
        }).populate({
            path: 'peopleRated.user',
            select: 'username profileImg _id',
            model: 'User'
        }).populate({
            path: 'comments.user',
            select: 'username profileImg -_id',
            model: 'User'
        });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const addRate = async (req, res) => {
    const data = {
        postId: req.body.postId,
        userId: req.body.userId,
    }

    try {
        const posts = await Post.findById(data.postId);

        if (!posts) {
            return res.status(404).json({ error: "Post not found" });
        }
        let test = false;
        if (posts.peopleRated && posts.peopleRated.length > 0) {
            
            test = posts.peopleRated.find((element) => element.user.toString() === data.userId);
        }
        if (test) {
            return res.json({ error: "User has already rated this post" });
        } else {
            posts.rates += 1;
            posts.peopleRated.push({ user: data.userId });
            posts.save();
            res.status(200).send(posts);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const addComment = async (req,res) =>{
    const data = {
        postId: req.body.postId,
        userId: req.body.userId,
        comment: req.body.comment,
    }
    try {
        const posts = await Post.findById(data.postId);

        if (!posts) {
            return res.status(404).json({ error: "Post not found" });
        }else {
            
            posts.comments.push({ user:data.userId , comment : data.comment});
            posts.save();
            res.status(200).send(posts);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

}
const RemovePost = async (req, res) => {
    const data = {
        postId: req.body.postId,
    }
    console.log(data);
    
    try {
        const posts = await Post.findById(data.postId);
        if (!posts) {
            return res.status(404).json({ error: "Post not found" });
        }
        else{
            await Post.findByIdAndDelete(data.postId);
            res.json({ message: "Post successfully removed" });

        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const updatePost = async (req, res) => {
    const {postId,name}= req.body
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { name },{ new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const RemoveRate = async (req, res) => {
    const data = {
        postId: req.body.postId,
        userId: req.body.userId,
    }

    try {
        const posts = await Post.findById(data.postId);
        if (!posts) {
            return res.status(404).json({ error: "Post not found" });
        }
        let test = false;
        if (posts.peopleRated && posts.peopleRated.length > 0) {
            test = posts.peopleRated.find((element) => element.user.toString() === data.userId);
        }
        if (test) {
            newPeopleRated = posts.peopleRated.filter(ele => ele.user.toString() !== data.userId)
            posts.peopleRated = newPeopleRated
            posts.rates = posts.rates - 1 
            posts.save()
            return res.json("removing rate");
        } else {
            
            res.status(200).send("user doesn't rated");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const postMarkes = async (req, res) => {
    const data = {
        postId: req.body.postId,
        userId: req.body.userId,
    }
    try {
        const finduser = await User.findById(data.userId);

        if (!finduser) {
            return res.status(404).json({ error: "user not found" });
        }
        let test = false;
        if (finduser.postMarkes && finduser.postMarkes.length > 0) {
            
            test = finduser.postMarkes.find((element) => element.post.toString() === data.postId);
        }
        if (test) {
            newpostMarked = finduser.postMarkes.filter(ele => ele.post.toString() !== data.postId)
            finduser.postMarkes = newpostMarked
            finduser.save()
            res.json(finduser)
        }
         else {
            finduser.postMarkes.push({ post: data.postId });
            finduser.save();
            res.status(200).send(finduser);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {updatePost,getPosts,RemovePost ,uploadPost,addRate , RemoveRate ,addComment,showPost ,postMarkes,showPostJustForProfile}