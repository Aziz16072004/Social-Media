const mongoose = require('mongoose');
const storySchema = mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      image :String,
      createdAt:{
        type : Date,
        default: Date.now()
      }
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Story', storySchema);