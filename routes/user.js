var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/check-auth');

router.post('/create', userController.createUser);
router.post('/signin', userController.signInUser);
router.post('/update/:id', userController.updateUser);
 router.post('/updatepassword/:id' , userController.updatePassword);
 router.post('/resetpassword/:id' , userController.resetPassword);
 router.post('/mailsend' , userController.resetpassword_usingmail);
 router.get('/getbyId/:id' , userController.getbyId);
 router.get('/getall' , userController.getAll);

module.exports = router;
