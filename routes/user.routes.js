const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// authentification //
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);

router.get('/logout', authController.logout);

// user display //
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.get('/match/:id', userController.matchInfo);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.patch('/like/:id', userController.likeUser);
router.patch('/unlike/:id', userController.unlikeUser);
router.patch('/match/:id', userController.matchUser);
router.patch('/unmatch/:id', userController.unmatchUser);


module.exports = router;

