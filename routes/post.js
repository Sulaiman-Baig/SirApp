var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');


router.post('/create/:userId', postController.createPost );
router.post('/update/:postId', postController.updatePost );
router.post('/delete/:postId', postController.deletePost );
router.post('/likepost/:postId/:userId', postController.likePost );
router.post('/commentonpost/:postId/:userId', postController.commentOnPost );
router.get('/get/:postId', postController.getPost );
router.get('/getallbyuserbyfollower/:userid', postController.getAllPostsByUserByFollower );
router.get('/getallposts/:userId', postController.getAllPosts );
router.get('/isliked/:userId/:postId' , postController.isLiked); 
router.get('/totallikes/:postId' , postController.totalLikes); 



module.exports = router;