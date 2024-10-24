const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wendell.connelly67@ethereal.email',
        pass: 'KzBrbs9XahskkNnnKt'
    }
});

const sendEmailNotification = async (recipient, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"Lead Notification" <your-email@example.com>', // Sender address
            to: recipient, 
            subject: subject, 
            text: text,
        });

        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        return false;
    }
};

module.exports = {
    sendEmailNotification,
};
