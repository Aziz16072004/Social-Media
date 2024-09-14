const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema(
    {
      message: {
        text: { 
            type: String, 
            required: true 
        },
        image :String,
      },
      users: Array,
      decription:{
        format:String,
        postId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Message', MessageSchema);