var nodemailer = require('nodemailer');
/*
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    XOAuth2: {
      user: 'chimidev@gmail.com',
      clientId: '25368686078-jevct2bif48os6g22ijgthtinbb73dku.apps.googleusercontent.com',
      clientSecret: 'jraEpnmPDNfdkuzguc1nxezY',
      refreshToken: '1/-tj4S_mqmY7Q4JVabxMQuW_1hkwkIaaWr7Vjsl0PmpI'
    }
  }
});

var mailOptions = {
  from: 'chimidev@gmail.com',
  to: 'trigger@applet.ifttt.com',
  subject: '#pomelo',
  html: 'no content'
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
  smtpTransport.close();
});
 */
/* var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL,
    // you can try with TLS, but port is then 587
    auth: {
        user: 'chimidev@gmail.com', // Your email id
        pass: 'Tr41lerpark257ers' // Your password
    }
};

var transporter = nodemailer.createTransport(smtpConfig);
// replace hardcoded options with data passed ()
var mailOptions = {
    from: 'chimidev@gmail.com', // sender address
    to: 'trigger@applet.ifttt.com', // list of receivers
    subject: '#pomelo', // Subject line
    text: 'this is some text', //, // plaintext body
}

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.error(error);
        return false;
    } else {
        console.log('Message sent: ' + info.response);
        return true;
    };
}); */

//
var sendmail = require('sendmail')();

sendmail({
    from: 'chimidev@gmail.com',
    to: 'trigger@applet.ifttt.com',
    subject: '#pomelo',
    html: 'Mail of test sendmail ',
}, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
