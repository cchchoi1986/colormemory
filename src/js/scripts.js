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
        var array = [
            'assets/'+playDeck[i].src,
            'assets/'+playDeck[i+1].src,
            'assets/'+playDeck[i+2].src,
            'assets/'+playDeck[i+3].src
        ]
        $('.gamespace').append('<div class="row"><div class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[0]+'"></div><div class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[1]+'"></div><div class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[2]+'"></div><div class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[3]+'"></div></div>');
    }
    $('button.new-game').remove();
}

$('.new-game').on('click', function (e) {
    e.preventDefault();
    newGame()
    .then(function() {
        startGame();
    })
})