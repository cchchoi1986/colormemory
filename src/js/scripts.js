var $ = require('jquery'),
    Promise = require('bluebird'),
    playDeck = [];

var newGame = function () {
    return new Promise(function(resolve, reject) {
        var deck = [
            { id: 1, src: 'colour1.gif' },
            { id: 2, src: 'colour2.gif' },
            { id: 3, src: 'colour3.gif' },
            { id: 4, src: 'colour4.gif' },
            { id: 5, src: 'colour5.gif' },
            { id: 6, src: 'colour6.gif' },
            { id: 7, src: 'colour7.gif' },
            { id: 8, src: 'colour8.gif' }
        ];
        var combined = deck.concat(deck);

        while (combined.length > 0) {
            var index = Math.floor(Math.random()*combined.length);
            // console.log(index);
            playDeck.push(combined.splice(index,1)[0]);
            // console.log('length',combined.length);
            // console.log('playing Deck', playDeck.length , playDeck);
        };
        resolve();
    });
};

var startGame = function () {
    for (var i = 0; i < playDeck.length; i+=4) {
        $('#gamespace').append('<div class="row"><div class="card"><img src="assets/'+playDeck[i].src+'"></div><div class="card"><img src="assets/'+playDeck[i+1].src+'"></div><div class="card"><img src="assets/'+playDeck[i+2].src+'"></div><div class="card"><img src="assets/'+playDeck[i+3].src+'"></div></div>');
    }
    // for (var i = 0; i < playDeck.length; i++) {
    //     $('#gamespace').append('<div class="card"><img src="assets/'+playDeck[i].src+'"></div>');
    // }
}

$('.new-game').on('click', function (e) {
    e.preventDefault();
    $('#gamespace').html('');
    newGame()
    .then(function() {
        startGame();
    })
})