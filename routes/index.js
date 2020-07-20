var express = require('express');
var router = express.Router();
var multer = require('multer');

router.post("/imageUpload", function (req, res) {
    upload(req, res, function (err) {
        var image = req.file.filename;
        res.json(image)
        // Everything went fine.
    })
})

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
// multar
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './images/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({
    storage: storage
}).single('file');

// strip strip strip
var stripe = require("stripe")("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");

router.post("/charge", (req, res) => {
    console.log('------------------', req.body, '-----------------')
    var token = req.body.token;
    var email = req.body.email;
    var name = req.body.name;
    var amount = req.body.amount;
    fun();
    function fun() {
        const charge = stripe.charges.create({
            source: token,
            amount: amount,
            currency: 'usd',
        }, function (err, charge) {
            // asynchronously called
            console.log(err, charge);
            res.json({ data: charge, err: err })
        })
    }
})
