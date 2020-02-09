var nodemailer = require('nodemailer');

function sendMail(mail) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PWD,
        }
    });

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: mail.to,
        subject: mail.subject,
        text: "",
        html: mail.body,
    }, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendMail: sendMail,
};