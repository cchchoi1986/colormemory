var express = require('express'),
    Promise = require('bluebird'),
    http = require('http'),
    path = require('path'),
    app = express(),
    api_key = require('./key.js').API_KEY,
    domain = require('./key.js').DOMAIN,
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
            text: 'Congratulations '+req.body.name+',\n\nYour score of '+req.body.score+' is ranked '+req.body.rank+' on the all time leaderboards.\n\nThanks for playing!'
        };
        mailgun.messages()
        .send(data, function (error, body) {
            console.log(body);
            return res.sendStatus(200);
        });
    }
});


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
