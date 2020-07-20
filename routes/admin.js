var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/check-auth');

router.post('/create', adminController.createAdmin);
router.post('/signin', adminController.signInAdmin);
router.post('/update/:id', adminController.updateAdmin);
router.post('/approve/:id', adminController.approveAdmin);
router.post('/disaprove/:id', adminController.disapproveAdmin);
router.post('/superadmin-to-admin/:id', adminController.superadminToAdmin);
router.post('/admin-to-superadmin/:id', adminController.adminToSuperAdmin);
 router.post('/updatepassword/:id' , adminController.updatePassword);
 router.post('/resetpassword/:id' , adminController.resetPassword);
 router.post('/mailsend' , adminController.resetpassword_usingmail);
 router.get('/getbyId/:id' , adminController.getbyId);
 router.get('/getall' , adminController.getAll);

module.exports = router;
