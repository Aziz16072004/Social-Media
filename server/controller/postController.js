const Post = require("../models/post");
const User = require("../models/user");
const bucket = require('../config/firebaseConfig'); // Import the Firebase bucket

const uploadPost = async (req, res) => {
    try {
        const file = req.file; // Ensure file is being populated correctly
        if (!file) {
            return res.status(400).send({ success: false, message: 'No file uploaded.' });
        }

        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `uploads/${timestamp}-${file.originalname}`; 
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error('Error during upload:', err); // Log error for debugging
            return res.status(500).send({ success: false, message: err.message });
        });

        blobStream.on('finish', async () => {
            // Use the appropriate URL for your Firebase setup
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

            const newPost = new Post({
                name: req.body.name,
                image: publicUrl,
                userId: req.body.userId,
            });

            try {
                const savedPost = await newPost.save();
                await savedPost.populate({
                    path: 'userId',
                    model: 'User'
                });
                res.status(201).send({ success: true, data: savedPost });
            } catch (saveError) {
                console.error('Error saving post:', saveError);
                res.status(500).send({ success: false, message: saveError.message });
            }
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Error uploading post:', error); // Log the complete error object
        res.status(500).send({ success: false, message: error.message });
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