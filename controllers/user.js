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
    }


};