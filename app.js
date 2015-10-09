var express = require('express'),
    Promise = require('bluebird'),
    http = require('http'),
    path = require('path'),
    app = express(),
    api_key = 'key-27d2e6bfc477cdf511fedcbd6f28951c',
    domain = 'mailgun.choiclement.com',
    mailgun = require('mailgun-js')({apiKey: api_key, domain: domain}),
    bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('port', process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, 'public')));

app.post('/sendEmail', urlencodedParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    } else {
        var data = {
            from: 'Color Memory <postmaster@mailgun.choiclement.com>',
            to: req.body.email,
            subject: 'Color Memory Ranking',
            text: 'Congratulations '+req.body.name+',\n\n your score of '+req.body.score+' is ranked '+req.body.rank+' on the all time leaderboards.\n\n  Thanks for playing!'
        };
        mailgun.messages()
        .send(data, function (error, body) {
            console.log(body);
            res.send(200);
        });
    }
});


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
