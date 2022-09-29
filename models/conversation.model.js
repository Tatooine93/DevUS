const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        },
    },

    {
        timestamps: true
    }
);

const ConversationModel = mongoose.model('conversation', conversationSchema);

module.exports = ConversationModel;