var $ = require('jquery'),
    Promise = require('bluebird'),
    Firebase = require("firebase"),
    totalScore = 0,
    playDeck = [],
    matchPair = [],
    matchedColourIds = [],
    myFirebaseRef = new Firebase("https://sweltering-heat-9320.firebaseio.com/Records"),
    loading = false,
    playerName = '',
    started = false,
    allScores = [];

var newGame = function () {
    return new Promise(function(resolve, reject) {
        var deck = [ 'colour1.gif', 'colour2.gif', 'colour3.gif', 'colour4.gif', 'colour5.gif', 'colour6.gif', 'colour7.gif', 'colour8.gif' ];
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
            { id: i, src: 'assets/'+playDeck[i] },
            { id: i+1, src: 'assets/'+playDeck[i+1]},
            { id: i+2, src:'assets/'+playDeck[i+2]},
            { id: i+3, src: 'assets/'+playDeck[i+3]}
        ];
        // console.log(array);
        $('.gamespace').append('<div class="row"><div id="card'+array[0].id+'" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[0].src+'"></div><div id="card'+array[1].id+'"" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[1].src+'"></div><div id="card'+array[2].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[2].src+'"></div><div id="card'+array[3].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[3].src+'"></div></div>');
    }
    $('button.new-game').remove();
    $('.instructions').removeClass('hidden');
    $('#card0').addClass('selected');
    $('.gamespace').focus();
}

var gameOn = function () {
    $('html').on('keydown', function(key) {
        if (!loading) {
            var selectedId = Number($('.selected')[0].id.replace('card',''));
            var regexColour = new RegExp(/colour./);
            var selectedColourId = $('.selected img.front')[0].src.match(regexColour)[0].replace('colour','');
            var newSelectedId = '#card';
            var newId = null;
            // console.log('colour', selectedColourId);
            if (key.keyCode === 38) {
                key.preventDefault();
                newId = selectedId - 4;
                if (newId >= 0) {
                    // console.log('up');
                    $('.selected').removeClass().addClass('card');
                    $(newSelectedId+newId).addClass('selected');
                }
            }
            if (key.keyCode === 40) {
                key.preventDefault();
                newId = selectedId + 4;
                if (newId <= 15) {
                    // console.log('down');
                    $('.selected').removeClass().addClass('card');
                    $(newSelectedId+newId).addClass('selected');
                }
            }
            if (key.keyCode === 37) {
                key.preventDefault();
                newId = selectedId - 1;
                if (newId >= 0) {
                    // console.log('left');
                    $('.selected').removeClass().addClass('card');
                    $(newSelectedId+newId).addClass('selected');
                }
            }
            if (key.keyCode === 39) {
                key.preventDefault();
                newId = selectedId + 1;
                if (newId <= 15) {
                    // console.log('right');
                    $('.selected').removeClass().addClass('card');
                    $(newSelectedId+newId).addClass('selected');
                }
            }
            if (key.keyCode === 13) {
                key.preventDefault();
                $('.selected.card img.back').css({'zIndex': 0});
                // console.log('length', matchPair.length);
                // console.log('selectedId', selectedId);
                // if (matchPair[0]) {
                //     console.log('matchPair', matchPair[0].id, selectedId === matchPair[0].id);
                // })
                console.log('selected', selectedColourId, $.inArray(selectedColourId, matchedColourIds));
                if ($.inArray(selectedColourId, matchedColourIds) === -1) {
                    if (matchPair.length!=0) {
                        if (selectedId != matchPair[0].id) {
                            // console.log('not same id');
                            if (matchPair.length > 0) {
                                matchPair.push({ id: selectedId, colour: selectedColourId });
                                // console.log('> 0', matchPair);
                                if (matchPair[0].colour === matchPair[1].colour) {
                                    // console.log('matching', matchPair);
                                    matchedColourIds.push(matchPair[0].colour);
                                    console.log(matchedColourIds.length, matchedColourIds);
                                    totalScore++;
                                    $('.score').text(totalScore);
                                    matchPair = [];
                                } else {
                                    var delay;
                                    // console.log('not matching', matchPair);
                                    // console.log('huh', newSelectedId+matchPair[0].id, newSelectedId+matchPair[1].id);
                                    var hideCards = function () {
                                        $(newSelectedId+matchPair[0].id+' .back').css({'zIndex': 10});
                                        $(newSelectedId+matchPair[1].id+' .back').css({'zIndex': 10});
                                        matchPair = [];
                                        clearInterval(delay);
                                        loading = false
                                    };
                                    var lastLook = function () {
                                        loading = true
                                        delay = setInterval(hideCards, 200);
                                    }
                                    lastLook();
                                    totalScore--;
                                    $('.score').text(totalScore);
                                }
                            }
                        }
                    } else {
                        matchPair.push({ id: selectedId, colour: selectedColourId});
                        // console.log('new pair', matchPair);
                    }
                } else {
                    console.log('color already matched');
                }
            }
        }
        if (matchedColourIds.length > 7) {
            playerName = prompt("You win!  Please enter your name");
            playerEmail = prompt("Please enter your email");
            $('.gamespace').remove();
            myFirebaseRef.push({
                Score: totalScore,
                Player: playerName,
                Email: playerEmail
            });
            $.ajax({
                type: 'GET',
                url: 'https://sweltering-heat-9320.firebaseio.com/Records.json'
            })
            .success(function(res){
                // console.log('success', res);
                return new Promise(function(resolve, reject) {
                    for (var key in res) {
                        if (res.hasOwnProperty(key)) {
                            allScores.push(res[key]);
                        }
                    }
                    resolve();
                })
                .then(function(){
                    allScores = allScores.sort(function(a, b) {
                        return a.Score < b.Score;
                    });
                })
                .then(function(){
                    console.log(allScores);
                });
            })
            .error(function(res){
                console.log('err', res)
            });
        }
    });
}


$('html').on('keydown', function (key) {
    key.preventDefault();
    if (key.keyCode === 13 && !started) {
        started = true;
        newGame()
        .then(function () {
            startGame();
        })
        .then(function () {
            gameOn();
        })
    }
})