var $ = require('jquery'),
    Promise = require('bluebird'),
    totalScore = 0,
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
            { id: i, src: 'assets/'+playDeck[i].src },
            { id: i+1, src: 'assets/'+playDeck[i+1].src},
            { id: i+2, src:'assets/'+playDeck[i+2].src},
            { id: i+3, src: 'assets/'+playDeck[i+3].src}
        ];
        // console.log(array);
        $('.gamespace').append('<div class="row"><div id="card'+array[0].id+'" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[0].src+'"></div><div id="card'+array[1].id+'"" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[1].src+'"></div><div id="card'+array[2].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[2].src+'"></div><div id="card'+array[3].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[3].src+'"></div></div>');
    }
    $('button.new-game').remove();
    $('#card0').addClass('selected');
    $('.gamespace').focus();
}

$('html').on('keydown', function(key) {
    var selectedId = Number($('.selected')[0].id.replace('card',''));
    var newSelectedId = '#card';
    var newId = null;
    if (key.keyCode === 38) {
        newId = selectedId - 4;
        if (newId >= 0) {
            console.log('up');
            $('.selected').removeClass().addClass('card');
            $(newSelectedId+newId).addClass('selected');
        }
    }
    if (key.keyCode === 40) {
        newId = selectedId + 4;
        if (newId <= 15) {
            console.log('down');
            console.log(newSelectedId+newId);
            $('.selected').removeClass().addClass('card');
            $(newSelectedId+newId).addClass('selected');
        }
    }
    if (key.keyCode === 37) {
        newId = selectedId - 1;
        if (newId >= 0) {
            console.log('left');
            $('.selected').removeClass().addClass('card');
            $(newSelectedId+newId).addClass('selected');
        }
    }
    if (key.keyCode === 39) {
        newId = selectedId + 1;
        if (newId <= 15) {
            console.log('right');
            $('.selected').removeClass().addClass('card');
            $(newSelectedId+newId).addClass('selected');
        }
    }
    if (key.keyCode === 32) {
        $('.selected.card img.back').css({'zIndex': 0});
    }
});

$('.new-game').on('click', function (e) {
    e.preventDefault();
    newGame()
    .then(function() {
        startGame();
    })
})