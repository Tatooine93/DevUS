const router = require('express').Router();
const conversationController = require('../controllers/conversation.controller');

//new conversation
router.post("/", conversationController.createConversation);


//get conversation of a user
router.get('/:userId', conversationController.userConversation);



module.exports = router;