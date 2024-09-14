const Story = require("../models/story")
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
            url: `http://localhost:8000/${story.image}`,
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

const addStory = async(req , res)=>{
    const userId =req.body.userId
    try {
        const response = await Story.create({
            user : userId,
            image : `storiesImgs/${req.file.filename}`
          })
        res.json(response)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {getStories ,addStory , getStoriesForSwipper,getAllStories}

// const getAllStories = async (req, res) => {
//     try {
//         const stories = await Story.find().sort({ createdAt: -1 }).populate({
//             path: "user",
//             model: "User",
//         });
        // const formattedStories = stories.map((story) => ({
        //     type: "image",
        //     url: `http://localhost:8000/${story.image}`,
        //     duration: 4000,
        // }));
        // console.log(formattedStories);
        // res.json(formattedStories);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };