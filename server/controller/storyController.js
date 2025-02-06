const Story = require("../models/story");
const cloudinary = require('../config/cloudinary');
require("dotenv").config()


const getStoriesForSwipper = async(req , res)=>{
    const userId = req.query.userId;
    try {
        const stories = await Story.find({user : userId}).sort({createdAt:-1}).populate({
            path: 'user',
            model: 'User',
            select: "username profileImg -_id"
        })
        const formattedStories = stories.map((story) => ({
            type: "image",
            url: story.image,
            duration: 4000,
            user:story.user,
            createdAt : story.createdAt
        }));
        console.log(formattedStories);
        res.json(formattedStories);
    } catch (error) {
        console.log(error);
    }
}
const getStories = async(req , res)=>{
    const userId = req.query.userId;
    try {
        const response = await Story.find({user : userId}).sort({createdAt:-1})
        res.json(response)
    } catch (error) {
        console.log(error);
    }
}
const getAllStories = async (req, res) => {
    try {
        const aggregatedData = await Story.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$user",
                    lastStory: { $first: "$$ROOT" },
                },
            },
        ]);

        // Extracting user ids from aggregated data
        const userIds = aggregatedData.map(item => item._id);

        // Populating user data
        const populatedData = await Story.populate(aggregatedData, {
            path: 'lastStory.user',
            model: 'User',
        });
        res.json(populatedData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const addStory = async (req, res) => {
    const userId = req.body.userId;
    
    try {
        // Check if the file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload the file to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, uploadedFile) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ error: 'Upload failed', details: error.message });
            }

            try {
                // Create a new Story document
                const story = new Story({
                    user: userId,
                    image: uploadedFile.secure_url,
                });

                // Save the story to the database
                const savedStory = await story.save();

                // Log and respond with the saved story
                console.log("Story saved:", savedStory);
                res.status(200).json(savedStory);
            } catch (dbError) {
                console.error("Database save error:", dbError);
                res.status(500).json({ error: 'Database error', details: dbError.message });
            }
        }).end(req.file.buffer);
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


module.exports = {getStories ,addStory , getStoriesForSwipper,getAllStories}

// const getAllStories = async (req, res) => {
//     try {
//         const stories = await Story.find().sort({ createdAt: -1 }).populate({
//             path: "user",
//             model: "User",
//         });
        // const formattedStories = stories.map((story) => ({
        //     type: "image",
        //     url: `/${story.image}`,
        //     duration: 4000,
        // }));
        // console.log(formattedStories);
        // res.json(formattedStories);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };