const mailer = require("nodemailer");
let transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "testprojectck@gmail.com",
    pass: "Daonhattan123", // generated ethereal password
  },
});
// send mail with defined transport object
module.exports.sendResetMail = async (email, token) => {
  var url = "http://localhost:9090/user/reset/" + token;
  await transporter.sendMail({
    from: "testprojectck@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Yêu cầu lấy lại mật khẩu", // Subject line
    text: "Hello", // plain text body
    html: `<h3> 
            Click vào đây để khôi phục mật khẩu: ${url} </h3>`,
  });
};

module.exports.sendInfo = async (email, OTP) => {
  await transporter.sendMail({
    from: "testprojectck@gmail.com", // sender address
    to: email, // list of receivers
    subject: "OTP chuyển tiền", // Subject line
    text: "Hello", // plain text body
    html: `<h3> Đây là tài khoản và mật khẩu của bạn
            <p>username: ${username}</p>
            <p>password: ${password}</p>
            </h3>`,
  });
};

module.exports.sendOTP = async (email, username, password) => {
  await transporter.sendMail({
    from: "testprojectck@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Chào mừng bạn đến với ví điên tử của chúng tôi", // Subject line
    text: "Hello", // plain text body
    html: `<h3> Đây là tài khoản và mật khẩu của bạn
            <p>username: ${username}</p>
            <p>password: ${password}</p>
            </h3>`,
  });
};
