const router = require('express').Router();
const messageController = require('../controllers/message.controller');

//add
router.post("/", messageController.createMessage);


//get 
router.get('/:conversationId', messageController.conversationMessage);

module.exports = router;
module.exports = router;