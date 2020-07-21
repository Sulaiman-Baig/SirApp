const http_status_codes = require('http-status-codes');
const {
    Post,
    Like,
    Comment,
    // Follower
} = require('../database/database');
const sequelize = require("sequelize");
module.exports = {

    async createPost(req, res, next) {
        try {

            const {
                posttext,
                postImage
            } = req.body;
            userId = req.params.userId;
            const post = await Post.create({
                postText: posttext,
                totalLikes: 0,
                totalComments: 0,
                userId: userId,
                postImage: postImage
            });
            return res.status(http_status_codes.CREATED).json(post);
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Post"
            });
        }
    },

    async updatePost(req, res, next) {
        try {
            const {
                posttext,
                postImage
            } = req.body;
            postId = req.params.postId;
            const post = await Post.update({
                postText: posttext,
                postImage: postImage
            }, {
                where: {
                    id: postId
                }
            });
            return res.status(http_status_codes.OK).json({
                message: 'Post Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Post"
            });
        }
    },

    async getPost(req, res, next) {
        try {
            postId = req.params.postId;
            const post = await Post.findOne({ where: { id: postId } });
            return res.status(http_status_codes.OK).json(post);
        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Post"
            });
        }
    },

    async getAllPostsByUserByFollower(req, res, next) {
        try {
            followerIds = [];
            const userId = req.params.userid;
            const ids = await Follower.findAll({
                attributes: [sequelize.fn('DISTINCT', sequelize.col('followerId')), 'followerId'],
                where: {
                    userId: userId
                }
            });
            await ids.forEach(id => {
                followerIds.push(id.followerId);
            });
            followerIds.push(userId);
            const posts = await Post.findAll({ where: { userId: followerIds } });
            return res.status(http_status_codes.OK).json(posts);
        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Post"
            });
        }
    },


    async deletePost(req, res, next) {
        try {
            postId = req.params.postId;
            const post = await Post.destroy({ where: { id: postId } });
            return res.status(http_status_codes.OK).json({ message: 'Post Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Post"
            });
        }
    },

    async likePost(req, res, next) {
        try {
            postId = req.params.postId;
            userId = req.params.userId;

            const postLikeByUser = await Like.findOne({ where: { userId: userId, postId: postId } });
            
            if (postLikeByUser) {
                await postLikeByUser.destroy();
                const postToDecreaseLikes = await Post.findOne({ where: { id: postId } });
                await postToDecreaseLikes.update({
                    totalLikes: postToDecreaseLikes.totalLikes - 1
                });
                return res.status(http_status_codes.OK).json({
                    message: 'This user disliked the post'
                });

            } else if (postLikeByUser === null) {
                const likedPost = await Like.create({
                    postId: postId,
                    userId: userId
                });
                const postToIncreaseLikes = await Post.findOne({ where: { id: postId } });
                await postToIncreaseLikes.update({
                    totalLikes: postToIncreaseLikes.totalLikes + 1
                });


                return res.status(http_status_codes.OK).json({
                    message: 'This user successfully liked the post'
                });
            }
        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Liking Post"
            });
        }
    },

    async commentOnPost(req, res, next) {
        try {
            postId = req.params.postId;
            userId = req.params.userId;
            const { comment } = req.body;



            const commentOnPost = await Comment.create({
                postId: postId,
                userId: userId,
                comment: comment
            });
            const postToIncreaseComments = await Post.findOne({ where: { id: postId } });
            await postToIncreaseComments.update({
                totalComments: postToIncreaseComments.totalComments + 1
            });


            return res.status(http_status_codes.OK).json({
                message: 'This user successfully commented on  the post'
            });

        }
        catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Commenting Post"
            });
        }
    },

    async isLiked(req, res, next) {
        try {
            const userId = req.params.userId;
            const postId = req.params.postId;
            const liked = await Like.findOne({ where: { userId: userId, postId: postId } });

            if (liked) {
                const LikedPostObject = await Post.findOne({ where: { id: liked.postId } });
                return res.status(http_status_codes.OK).json({ message: 'Liked Post', LikedPostObject: LikedPostObject });
            } else {
                return res.status(http_status_codes.NOT_FOUND).json({
                    message: "Not Liked"
                });
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching isLiked"
            });
        }
    },

    async totalLikes(req, res, next) {
        try {
            const postId = req.params.postId;
            const totalLikes = await Like.findAll({ where: { postId: postId } });
            const numberOfLikes = totalLikes.length;
            return res.status(http_status_codes.OK).json(numberOfLikes);

        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Total Likes Of Post"
            });
        }
    },

};