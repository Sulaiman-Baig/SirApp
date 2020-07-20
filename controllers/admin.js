const http_status_codes = require('http-status-codes');
const hashedpassword = require("password-hash");
const nodemailer = require("nodemailer");
const sequelize = require("sequelize");
const op = sequelize.Op;
const jwt = require("jsonwebtoken");

const {
    Admin
} = require('../database/database');
module.exports = {

    async createAdmin(req, res, next) {
        try {
            const {
                userName,
                email,
                password,

            } = req.body;


            Admin.findOne({
                where: {
                    [op.or]:
                        [
                            { email: email },
                            { userName: 'ezcarsuperadmin' }
                        ]
                },
            }).then(isAdminExist => {
                if (isAdminExist) {
                    res.json({ message: "This Admin already exists" });
                } else {

                    if (userName === 'ezcarsuperadmin') {
                        Admin.create({
                            userName: userName,
                            password: hashedpassword.generate(password),
                            email: email,
                            isSuperAdmin: true,
                            isApproved: true
                        });
                        return res.status(http_status_codes.CREATED).json({ message: " Super Admin created successfully" });

                    } else {

                        Admin.create({
                            userName: userName,
                            password: hashedpassword.generate(password),
                            email: email,
                            isSuperAdmin: false,
                            isApproved: false
                        });
                        return res.status(http_status_codes.CREATED).json({ message: "Admin created successfully" });
                    }
                }
            });
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Admin"
            });
        }
    },

    signInAdmin(req, res, next) {
        Admin.findOne({
            where: {
                email: req.body.email
            }
        }).then(isAdminExist => {
            if (isAdminExist) {
                const verify_password = hashedpassword.verify(
                    req.body.password, isAdminExist.password
                );
                if (verify_password) {
                    const token = jwt.sign({
                        email: req.body.email,
                        adminId: isAdminExist.id
                    },
                        "very-long-string-for-secret", {
                        expiresIn: 3600
                    }
                    );

                    res.json({
                        message: "successfully login",
                        accessToken: token,
                        admin: isAdminExist
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
            const admin = await Admin.findOne({ where: { id: req.params.id } });
            return res.status(http_status_codes.OK).json(admin);

        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single admin"
            })
        }
    },

    async getAll(req, res, next) {
        try {
            const admins = await Admin.findAll();
            return res.status(http_status_codes.OK).json(admins);
        } catch (err) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Admins"
            });
        }
    },

    async updateAdmin(req, res, next) {
        try {
            id = req.params.id;
            const {
                userName
            } = req.body
            Admin.update({
                userName: userName
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

    async approveAdmin(req, res, next) {
        try {
            id = req.params.id;
           
            Admin.update({
                isApproved: true
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Approved successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured"
            })
        }
    },

    async disapproveAdmin(req, res, next) {
        try {
            id = req.params.id;
           
            Admin.update({
                isApproved: false
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Disapproved successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured"
            })
        }
    },

    async superadminToAdmin(req, res, next) {
        try {
            id = req.params.id;
           
            Admin.update({
                isSuperAdmin: false
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Converted to Admin successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured"
            })
        }
    },

    async adminToSuperAdmin(req, res, next) {
        try {
            id = req.params.id;
           
            Admin.update({
                isSuperAdmin: true
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.OK).json({
                message: "Converted to SuperAdmin successfully"
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
            Admin.update({
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
            const adminId = req.params.id;
            const oldpassword = req.body.oldpassword;
            const newpassword = req.body.newpassword;
            Admin.findOne({
                where: { id: adminId }
            })
                .then((isAdmin) => {
                    const isAuth = hashedpassword.verify(
                        oldpassword,
                        isAdmin.password
                    );
                    if (isAuth) {

                        isAdmin.update({
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
                message: "Error Occurd in Fetching All Approved"
            });
        }
    },

    async resetpassword_usingmail(req, res, next) {
        const reqData = req.body;
        Admin.findOne({
            where: { email: reqData.email }
        }).then(isAdmin => {
            if (isAdmin) {
                // send email

                var adminmail = req.body.email;
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'Testermail018@gmail.com',
                        pass: 'gf87dgdf'
                    }
                });
                var mailOptions = {
                    from: ' ', // sender address
                    to: adminmail, // list of receivers
                    subject: 'Admin Password Verification Code', // Subject line
                    text: 'Hi', // plain text body
                    html: 'Dear Admin<br>Please verify your email using the link below. <b style="font-size:24px;margin-left:30px"> Your code - ' + (isAdmin.id) * 109786 + '<b>' // html body

                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            manager: isAdmin,
                            verificationCode: (isAdmin.id) * 109786
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