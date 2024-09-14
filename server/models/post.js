const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    name: String,
    image: String,
    userId : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    rates : {
        type : Number,
        default : 0
    },
    peopleRated: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                
            }
        }
    ],
    comments: [
        {
            comment :{
                type : String
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        }
    ],
    
    createdAt : {
        type : Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema);