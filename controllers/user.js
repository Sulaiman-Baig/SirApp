const http_status_codes = require('http-status-codes');
const hashedpassword = require("password-hash");
const nodemailer = require("nodemailer");
const sequelize = require("sequelize");
const op = sequelize.Op;
const jwt = require("jsonwebtoken");

const {
    User
} = require('../database/database');
module.exports = {

    async createUser(req, res, next) {
        try {
            const {
                name,
                email,
                password,
                gender
            } = req.body;

            User.findOne({
                where: { email: email },
            }).then(isUserExist => {
                if (isUserExist) {
                    res.json({ message: "This User already exists" });
                } else {

                    User.create({
                        name: name,
                        password: hashedpassword.generate(password),
                        email: email,
                        gender: gender
                    });
                    return res.status(http_status_codes.CREATED).json({ message: "User created successfully" });
                }
            });
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating User"
            });
        }
    },

    signInUser(req, res, next) {
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(isUserExist => {
            if (isUserExist) {
                const verify_password = hashedpassword.verify(
                    req.body.password, isUserExist.password
                );
                if (verify_password) {
                    const token = jwt.sign({
                        email: req.body.email,
                        userId: isUserExist.id
                    },
                        "very-long-string-for-secret", {
                        expiresIn: 3600
                    }
                    );

                    res.json({
                        message: "successfully login",
                        accessToken: token,
                        user: isUserExist
                    })
                } else {
                    res.json({
                        message: 'Invalid credentials'
                    })
                }
            } else {
                res.json({
                    message: 'Invalid credentials'
                })
            }
        })


    },

    async getbyId(req, res, next) {
        try {
            const user = await User.findOne({ where: { id: req.params.id } });
            return res.status(http_status_codes.OK).json(user);

        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single User"
            })
        }
    },

    async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            return res.status(http_status_codes.OK).json(users);
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Users"
            });
        }
    },

    async updateUser(req, res, next) {
        try {
            id = req.params.id;
            const {
                name,
                gender,
                imageUrl
            } = req.body
            User.update({
                name: name,
                gender: gender,
                imageUrl: imageUrl
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Updated successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured"
            })
        }
    },  

    async updatePassword(req, res, next) {
        try {
            id = req.params.id;
            const {
                password
            } = req.body
            User.update({
                password: hashedpassword.generate(password)
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Updated successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured"
            })
        }
    },

    async resetPassword(req, res, next) {
        try {
            const userId = req.params.id;
            const oldpassword = req.body.oldpassword;
            const newpassword = req.body.newpassword;
            User.findOne({
                where: { id: userId }
            })
                .then((isUser) => {
                    const isAuth = hashedpassword.verify(
                        oldpassword,
                        isUser.password
                    );
                    if (isAuth) {

                        isUser.update({
                            password: hashedpassword.generate(newpassword)
                        })
                            .then(() => {
                                res.json({ message: 'Password updated successfully' });
                            })
                    } else if (!isAuth) {
                        res.json({ message: 'Oops Password not updated' });
                    }
                })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Password"
            });
        }
    },

    async resetpassword_usingmail(req, res, next) {
        const reqData = req.body;
        User.findOne({
            where: { email: reqData.email }
        }).then(isUser => {
            if (isUser) {
                // send email

                var usermail = req.body.email;
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'Testermail018@gmail.com',
                        pass: 'gf87dgdf'
                    }
                });
                var mailOptions = {
                    from: ' ', // sender address
                    to: usermail, // list of receivers
                    subject: 'User Password Verification Code', // Subject line
                    text: 'Hi', // plain text body
                    html: 'Dear User<br>Please verify your email using the link below. <b style="font-size:24px;margin-left:30px"> Your code - ' + (isUser.id) * 109786 + '<b>' // html body

                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            manager: isUser,
                            verificationCode: (isUser.id) * 109786
                        });
                    }
                });
            } else {
                res.json({ message: "Email does not exit" });
            }
        }).catch(err => {
            console.log(err);
            res.json("Some Error Occured!");
        });
    },

    async follow(req, res, next) {
        try {
            const followerId = req.params.followerId;
            const followingId = req.params.followingId;

            const isFollowed = await Following.findOne({ where: { userId: followerId, followingId: followingId } });
            if (isFollowed) {

                res.json({ message: "Already followed" });

            } else if (isFollowed === null) {

                await Following.create({ userId: followerId, followingId: followingId });
                await Follower.create({ userId: followingId, followerId: followerId });
                res.json({ message: 'Successfully followed' });
            }
        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Following User"
            });
        }
    },

    async unfollow(req, res, next) {
        try {
            const followerId = req.params.followerId;
            const followingId = req.params.followingId;
            const isFollowed = await Following.findOne({ where: { userId: followerId, followingId: followingId } });
            if (isFollowed) {
                await Following.destroy({ where: { userId: followerId, followingId: followingId } });
                await Follower.destroy({ where: { userId: followingId, followerId: followerId } });
                res.json({ message: 'Successfully unfollowed' });
            } else if (isFollowed === null) {
                res.json({ message: "You are not following this user" });
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Following User"
            });
        }
    },

    async friendRequest(req, res, next) {
        try {

            const userId = req.params.userId;
            const friendId = req.params.friendId;
            const isRequestSent = await Friend.findOne({ where: { userId: userId, friendId: friendId, isFriend: false } });
            if (isRequestSent) {
                res.json({ message: 'Freind Request Already Sent' });
            } else {
                const isFriend = await Friend.findOne({ where: { userId: userId, friendId: friendId, isFriend: true } });
                if (isFriend) {
                    res.json({ message: "Already Friend" });
                } else if (isFriend === null) {
                    await Friend.create({ userId: userId, friendId: friendId, isFriend: false });
                    res.json({ message: 'Freind Request Sent Successfully' });
                }
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Sending Friend Request"
            });
        }
    },

    async checkFriendshipStatus(req, res, next) {
        try {
            const userId = req.params.userId;
            const friendId = req.params.friendId;
            const isRequestSent = await Friend.findOne({ where: { userId: userId, friendId: friendId, isFriend: false } });
            if (isRequestSent) {
                res.json({ message: 'Freind Request Sent' });
            } else {
                const isAlreadyFriendship = await Friendship.findOne({
                    where: {
                        [Op.or]:
                            [{
                                [Op.and]:
                                    [{ userId: userId },
                                    { friendId: friendId }]
                            },
                            {
                                [Op.and]:
                                    [{ userId: friendId },
                                    { friendId: userId }]
                            }]
                    }
                });
                if (isAlreadyFriendship) {
                    res.json({ message: "Already Friend" });
                } else {
                    res.json({ message: "No Friend Request is Sent" });
                }
            }
        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Checking Friend Request Status"
            });
        }
    },

    async getAllConversationsByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const conIds = [];
            const conversationsMap = await Conversation.findAll({
                where: {
                    [Op.or]:
                        [{ senderId: userId },
                        { receiverId: userId }]
                }
            });
            conversationsMap.forEach(conItem => {
                if (conItem.senderId !== userId) {
                    conIds.push(conItem.senderId)
                }
                if (conItem.receiverId !== userId) {
                    conIds.push(conItem.receiverId)
                }
            });
            const conversations = await User.findAll({ where: { id: conIds } });
            if (conversations.length > 0) {
                res.json(conversations);
            } else {
                res.json({ message: 'No Conversation is started yet!' });
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Conversations"
            });
        }
    },
    
    async cancelFriendRequest(req, res, next) {
        try {
            const userId = req.params.userId;
            const friendId = req.params.friendId;
            const cancelFriendReq = await Friend.findOne({ where: { userId: userId, friendId: friendId, isFriend: false } });
            if (cancelFriendReq) {
                await cancelFriendReq.destroy();
                res.json({ message: 'Cancel Freind Request  Successfully' });
            } else {
                res.json({ message: 'No Freind Request Exist' });
            }
        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Canceling Request"
            });
        }
    },

    async confirmFriendship(req, res, next) {
        try {
            userId = req.params.userId;
            friendId = req.params.friendId;
            const isAlreadyFriendship = await Friendship.findOne({
                where: {
                    [Op.or]:
                        [{
                            [Op.and]:
                                [{ userId: userId },
                                { friendId: friendId }]
                        },
                        {
                            [Op.and]:
                                [{ userId: friendId },
                                { friendId: userId }]
                        }]
                }
            });

            if (isAlreadyFriendship) {
                const requestToDelete = await Friend.destroy({
                    where: {
                        [Op.or]:
                            [{
                                [Op.and]:
                                    [{ userId: userId },
                                    { friendId: friendId }]
                            },
                            {
                                [Op.and]:
                                    [{ userId: friendId },
                                    { friendId: userId }]
                            }]
                    }
                })
                res.json({ message: 'Already Friends' });
            } else {
                Friendship.create({
                    userId: userId,
                    friendId: friendId
                });
                Friendship.create({
                    userId: friendId,
                    friendId: userId
                });
                const requestToDelete = await Friend.destroy({
                    where: {
                        [Op.or]:
                            [{
                                [Op.and]:
                                    [{ userId: userId },
                                    { friendId: friendId }]
                            },
                            {
                                [Op.and]:
                                    [{ userId: friendId },
                                    { friendId: userId }]
                            }]
                    }
                })
                res.json({ message: 'Friendship confirmed Successfully' });
            }
        } catch (error) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured while confirming friendship"
            })
        }
    },

    async unFriend(req, res, next) {
        try {
            userId = req.params.userId;
            friendId = req.params.friendId;
            const isAlreadyFriendship = await Friendship.findOne({
                where: {
                    [Op.or]:
                        [{
                            [Op.and]:
                                [{ userId: userId },
                                { friendId: friendId }]
                        },
                        {
                            [Op.and]:
                                [{ userId: friendId },
                                { friendId: userId }]
                        }]
                }
            });

            if (isAlreadyFriendship) {
                await Friendship.destroy({
                    where: {
                        [Op.and]:
                            [{ userId: userId },
                            { friendId: friendId }]
                    }
                });
                await Friendship.destroy({
                    where: {
                        [Op.and]:
                            [{ userId: friendId },
                            { friendId: userId }]
                    }
                });
                res.json({ message: 'Unfriend Successfully' });
            } else {
                res.json({ message: 'Both users are not friends yet!' });
            }
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured while  un-friendship"
            })
        }
    },

    async getFollowers(req, res, next) {
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
            const followers = await User.findAll({ where: { id: [...followerIds] } });
            return res.status(http_status_codes.OK).json(followers);

        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Followers"
            });
        }
    },

    async getFollowings(req, res, next) {
        try {
            followingIds = [];
            const userId = req.params.userid;
            const ids = await Following.findAll({
                attributes: [sequelize.fn('DISTINCT', sequelize.col('followingId')), 'followingId'],
                where: {
                    userId: userId
                }
            });
            await ids.forEach(id => {
                followingIds.push(id.followingId);
            });
            const followings = await User.findAll({ where: { id: [...followingIds] } });
            return res.status(http_status_codes.OK).json(followings);

        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Followings"
            });
        }
    },

    async isfollower(req, res, next) {
        try {
            const userId = req.params.userid;
            const followerId = req.params.followerId;
            const follower = await Follower.findOne({ where: { userId: userId, followerId: followerId } });
            if (follower) {
                const followerObject = await User.findOne({ where: { id: follower.followerId } });
                return res.status(http_status_codes.OK).json({ message: 'Follower', followerObject: followerObject });
            } else {
                return res.status(http_status_codes.NOT_FOUND).json({
                    message: "Not Follower"
                });
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching isfollower"
            });
        }
    },

    async isfollowing(req, res, next) {
        try {
            const userId = req.params.userid;
            const followingId = req.params.followingId;
            const following = await Following.findOne({ where: { userId: userId, followingId: followingId } });
            if (following) {
                const followingObject = await User.findOne({ where: { id: following.followingId } });
                return res.status(http_status_codes.OK).json({ message: 'Following', followingObject: followingObject });
            } else {
                return res.status(http_status_codes.NOT_FOUND).json({
                    message: "Not Following"
                });
            }
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching isfollowing"
            });
        }
    },

    async getAllFriends(req, res, next) {
        try {
            friendsIds = [];
            const userId = req.params.userId;
            const ids = await Friendship.findAll({
                attributes: [sequelize.fn('DISTINCT', sequelize.col('friendId')), 'friendId'],
                where: {
                    userId: userId
                }
            });
            await ids.forEach(id => {
                friendsIds.push(id.friendId);
            });
            const friends = await User.findAll({ where: { id: [...friendsIds] } });
            if (friends.length > 0) {
                return res.status(http_status_codes.OK).json(friends);
            } else if (friends.length === 0) {
                return res.status(http_status_codes.OK).json({ message: 'This user has no friend yet!' });
            }
        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Friends"
            });
        }
    },

    async getAllFriendRequests(req, res, next) {
        try {
            usersIds = [];
            const friendId = req.params.userId;
            const ids = await Friend.findAll({
                attributes: [sequelize.fn('DISTINCT', sequelize.col('userId')), 'userId'],
                where: {
                    friendId: friendId, isFriend: false
                }
            });
            await ids.forEach(id => {
                usersIds.push(id.userId);
            });
            const fRequests = await User.findAll({ where: { id: [...usersIds] } });
            if (fRequests.length > 0) { return res.status(http_status_codes.OK).json(fRequests); } else { res.json({ message: 'No Friend Requests Sent Yet' }) }

        } catch (err) {

            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Friend Requests"
            });
        }
    },

    async changeBlockStatus(req, res, next) {
        try {
            const user = await User.findOne({ where: { id: req.params.userId } });
            if (user.isBlocked) {
                await user.update({ isBlocked: false });
                return res.status(http_status_codes.OK).json({ message: 'User Un-Blocked successfully' });
            } else if (!user.isBlocked) {
                await user.update({ isBlocked: true });
                return res.status(http_status_codes.OK).json({ message: 'User Blocked successfully' });
            }

        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in changing user status"
            })
        }
    },

    async getById(req, res, next) {
        try {
            const user = await User.findOne({ where: { id: req.params.id } });
            return res.status(http_status_codes.OK).json(user);
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single user"
            })
        }
    },



};