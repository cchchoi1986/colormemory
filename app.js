var express = require('express'),
    path = require('path'),
    app = express(),
    api_key = 'key-XXXXXXXXXXXXXXXXXXXXXXX',
    domain = 'mydomain.mailgun.org',
    mailgun = require('mailgun-js')({apiKey: api_key, domain: domain}),
    bodyParser = require('body-parser');
 
// var data = {
//   from: 'Excited User <me@samples.mailgun.org>',
//   to: 'serobnic@mail.ru',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!'
// };
// mailgun.messages()
// .send(data, function (error, body) {
//   console.log(body);
// });
        // username: 'cchchoi1986',
        // password: 'key-27d2e6bfc477cdf511fedcbd6f28951c',

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('port', process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.bodyParser());

app.post('/sendEmail', urlencodedParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    } else {
        console.log('hihi');
        console.log(req.body);
    }
});


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
