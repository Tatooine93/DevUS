const ConversationModel = require('../models/conversation.model');

module.exports.createConversation = async (req, res) => {

    const {senderId, receiverId} = req.body;

    try {
        const conversation = await ConversationModel.create({members: [senderId, receiverId]});
        res.status(201).json({ conversation: conversation._id });
    }

    catch(err) {
        //const errors = signUpErrors(err);
        res.status(200).send(err);
    }
};

module.exports.userConversation = async (req, res) => {

    try {
        const conversation = await ConversationModel.find({
            members: {$in:[req.params.userId]},
        });
        res.status(200).json(conversation)
    }
    catch(err) {
        res.status(500).json(err);
    }
};