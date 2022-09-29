const MessageModel = require('../models/message.model');

module.exports.createMessage = async (req, res) => {

    const {conversationId, senderId, text} = req.body;

    try {
        const message = await MessageModel.create({conversationId, senderId, text});
        res.status(201).json({ message });
    }

    catch(err) {
        //const errors = signUpErrors(err);
        res.status(500).json(err);
    }
};

module.exports.conversationMessage = async (req, res) => {

    try {
        const message = await MessageModel.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(message)
    }
    catch(err) {
        res.status(500).json(err);
    }
};