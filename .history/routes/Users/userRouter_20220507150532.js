var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator')
const mailer = require('../../sendMail')
const bcrypt = require('bcrypt');
const Account = require('../../models/Account')
const ResetToken = require('../../models/ResetTokenModel');
const req = require('express/lib/request');
const validator = require('../validator/validatorAccount');
const { getMaxListeners } = require('../../app');
const crypto = require('crypto')



/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'Account Router' })
});


// giao diện trang đăng kí

router.get('/register', (req, res) => {
    let type = req.flash('type')
    let error = req.flash('message')
    res.render('register', { type: type, error: error })
})

// Gửi post đăng kí tài khoản
router.post('/register', validator, async(req, res) => {
    let result = validationResult(req)
    let { phone, name, email, address, birth } = req.body
    console.log({ phone, name, email, address, birth })
    var userPhone = await Account.findOne({ phone: phone })
    var userEmail = await Account.findOne({ email: email })

    if (userPhone || userEmail) {
        // return res.json({ code: 2, message: 'Trùng sdt' })
        req.flash('type', 'danger')
        req.flash('message', 'Số điện thoại hoặc email đã tồn tại')
        res.redirect('/user/register')
    } else {
        if (result.errors.length === 0) {
            let password = crypto.randomBytes(3).toString('hex')
            let username = randomUsername()
            let passwordHashed = (await bcrypt.hash(password, 10)).toString()
            let user = new Account({
                phone: phone,
                name: name,
                email: email,
                address: address,
                birth: birth,
                front_IDcard: 'abc',
                back_IDcard: 'abc',
                username: username,
                password: passwordHashed,
            })
            user.save().then(() => {
                mailer.sendInfo(email, username, password)
                res.render('index')
            })

        } else {
            let messages = result.mapped()
            let message = ''

            for (m in messages) {
                message = messages[m].msg
                break
            }
            return res.json({ code: 2, message: message })
        }
    }
})


// Quên mật khẩu
router.get('/forgot', (req, res) => {
    let type = req.flash('type')
    let error = req.flash('message')
    res.render('forgot-password', { error: error, type: type })
})

router.post('/forgot', async(req, res) => {
    let email = req.body.email
    let token = crypto.randomBytes(32).toString('hex')
        //Kiểm tra email có tồn tại trong database không
    var checkEmail = await Account.findOne({ email: email })
    if (checkEmail) {
        //Trường hợp email có trong hệ thống thì sẽ gửi yêu cầu cấp link reset mk cùng với token qua mail
        // và lưu vào database, link này có hạn là 10p kể từ lúc gửi đi
        await ResetToken({ token: token, email: email }).save()
            .then(() => {
                req.flash('message', 'Gửi yêu cầu thành công vui lòng kiểm tra email')
                req.flash('type', 'success')
                mailer.sendResetMail(email, token)
                res.redirect('/user/forgot')
            })
            .catch(err => {
                req.flash('message', err.message)
                req.flash('type', 'danger')
                res.redirect('/user/forgot')
            })
    } else {
        //Trường hợp email không tồn tại trong database
        req.flash('message', 'Email không tồn tại')
        req.flash('type', 'danger')
        res.redirect('/user/forgot')
    }
})

router.get('/reset/:token', async(req, res) => {
    let token = req.params.token
    let check = await ResetToken.findOne({ token: token })
    if (!check) {
        res.send('Token không hợp lệ hoặc đã hết hạn')
    } else {
        let type = req.flash('type')
        let error = req.flash('message')
        res.render('resetpassword', { type, error })
    }

})

router.post('/reset/:token', async(req, res) => {
    let token = req.params.token
    let { pass, confirm_pass } = req.body
    let email = ''
    console.log(token)
    if (pass !== confirm_pass) {
        req.flash('type', 'danger')
        req.flash('message', 'Mật khẩu không trùng khớp')
        return res.redirect('/user/reset/' + token)
    }
    ResetToken.findOne({ token: token }, (err, user) => {
        if (!err) {
            email = user.email
        } else {
            console.log(err)
        }
    })
    let hash = crypto.randomBytes(3).toString('hex')
    let passwordHashed = (await bcrypt.hash(hash, 10)).toString()
    console.log(passwordHashed)
    await Account.findOneAndUpdate({ email: email }, { $set: { password: passwordHashed } })
    await ResetToken.findOneAndDelete({ token: token })
    res.render('login')
})



router.get('/login', function(req, res, next) {
    res.json({ message: 'Login Account Router' })
})




function randomUsername() {
    let str = ''
    for (let i = 0; i <= 5; i++) {
        str += Math.floor(Math.random() * 10).toString();
    }
    return str
}


function createToken() {

    var rand = Math.random().toString(36).substr(2); // remove `0.`
    var token = rand + rand
    return token
}
console.log(randomUsername())
module.exports = router;