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
    ended = false;

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
        $('.gamespace').append('<div class="row"><div id="card'+array[0].id+'" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[0].src+'"></div><div id="card'+array[1].id+'"" class="card"><img  class="back" src="assets/card_bg.gif"><img class="front" src="'+array[1].src+'"></div><div id="card'+array[2].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[2].src+'"></div><div id="card'+array[3].id+'" class="card"><img class="back" src="assets/card_bg.gif"><img class="front" src="'+array[3].src+'"></div></div>');
    }
    $('div.new-game').remove();
    $('.instructions').removeClass('hidden');
    $('.reset-button').removeClass('hidden');
    $('#card0').addClass('selected');
    $('.gamespace').focus();
}

var sendEmail = function (email, name, score) {
    var allObjects = [],
        allScores = [];
    var rank;
    $.ajax({
        type: 'GET',
        url: 'https://sweltering-heat-9320.firebaseio.com/Records.json'
    })
    .success(function(res){
        return new Promise(function(resolve, reject) {
            for (var key in res) {
                if (res.hasOwnProperty(key)) {
                    allObjects.push(res[key]);
                }
            }
            resolve();
        })
        .then(function(){
            allObjects.forEach(function(obj) {
                allScores.push(obj.score);
            })
            allScores = allScores.sort().reverse();
            return allScores;
        })
        .then(function(){
            for (var i = 0; i < allScores.length; i++) {
                if (score === allScores[i]) {
                    rank = i+1;
                    return rank;
                }
            }
        })
        .then(function() {
            $.ajax({
                url: '/sendEmail',
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': name,
                    'email': email,
                    'rank': rank,
                    'score': score
                }
            })
            .success(function(e) {
                // console.log('success', e);
            })
            .error(function(e) {
                // console.log('error', e);
            })
        })
    })
    .error(function(res){
        // console.log('err getting all scores', res)
    });
}

var gameOn = function () {
    $('html').on('keydown', function(key) {
        if (!ended) {
            if (!loading) {
                var selectedId = ($('.selected')[0].id) ? Number($('.selected')[0].id.replace('card','')) : null;
                var regexColour = new RegExp(/colour./);
                var selectedColourId = ($('.selected img.front')[0]) ? $('.selected img.front')[0].src.match(regexColour)[0].replace('colour','') : null;
                var newSelectedId = '#card';
                var newId = null;
                if (key.keyCode === 38) {
                    key.preventDefault();
                    if (selectedId === 0 || selectedId === 1 || selectedId === 2 || selectedId === 3) {
                        $('.selected').removeClass().addClass('card');
                        $('.reset-button').addClass('selected');
                    } else {
                        newId = selectedId - 4;
                        if (newId >= 0) {
                            // console.log('up');
                            $('.selected').removeClass().addClass('card');
                            $(newSelectedId+newId).addClass('selected');
                        }
                    }
                }
                if (key.keyCode === 40) {
                    key.preventDefault();
                    if (selectedId === null) {
                        $('.selected').removeClass().addClass('reset-button');
                        $('#card0').addClass('selected');
                    } else {
                        newId = selectedId + 4;
                        if (newId <= 15) {
                            // console.log('down');
                            $('.selected').removeClass().addClass('card');
                            $(newSelectedId+newId).addClass('selected');
                        }
                    }
                }
                if (key.keyCode === 37) {
                    key.preventDefault();
                    if (selectedId === null) {
                        $('.selected').removeClass().addClass('reset-button');
                        $('#card0').addClass('selected');
                    } else {
                    newId = selectedId - 1;
                        if (newId >= 0) {
                            // console.log('left');
                            $('.selected').removeClass().addClass('card');
                            $(newSelectedId+newId).addClass('selected');
                        }
                    }
                }
                if (key.keyCode === 39) {
                    key.preventDefault();
                    if (selectedId === null) {
                        $('.selected').removeClass().addClass('reset-button');
                        $('#card0').addClass('selected');
                    } else {
                        newId = selectedId + 1;
                        if (newId <= 15) {
                            // console.log('right');
                            $('.selected').removeClass().addClass('card');
                            $(newSelectedId+newId).addClass('selected');
                        }
                    }
                }
                if (key.keyCode === 13) {
                    key.preventDefault();
                    if ($('.selected').text() === 'Restart Game') {
                        location.reload();
                    } else {
                        $('.selected.card img.back').css({'zIndex': 0});
                        if ($.inArray(selectedColourId, matchedColourIds) === -1) {
                            if (matchPair.length!=0) {
                                if (selectedId != matchPair[0].id) {
                                    if (matchPair.length > 0) {
                                        matchPair.push({ id: selectedId, colour: selectedColourId });
                                        if (matchPair[0].colour === matchPair[1].colour) {
                                            matchedColourIds.push(matchPair[0].colour);
                                            var clearCards = function () {
                                                $(newSelectedId+matchPair[0].id+' .back').addClass('cleared');
                                                $(newSelectedId+matchPair[1].id+' .back').addClass('cleared');
                                                $(newSelectedId+matchPair[0].id+' .front').addClass('cleared');
                                                $(newSelectedId+matchPair[1].id+' .front').addClass('cleared');
                                                matchPair = [];
                                                clearInterval(delay);
                                                loading = false
                                            };
                                            var lastLook = function () {
                                                loading = true
                                                delay = setInterval(clearCards, 200);
                                            }
                                            lastLook();
                                            totalScore++;
                                            $('.score').text(totalScore);
                                        } else {
                                            var delay;
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
                            }
                        } else {
                            console.log('color already matched');
                        }
                    }
                }
            }
            if (matchedColourIds.length > 7) {
                playerName = prompt("You win!  Please enter your name") || 'xxx';
                playerEmail = prompt("Please enter your email") || null;
                myFirebaseRef.push({
                    score: totalScore,
                    player: playerName,
                    email: playerEmail
                })
                sendEmail(playerEmail, playerName, totalScore);
                ended = true;
                $('.gamespace').html('<div class="restart">Press Enter to Restart</div>')
            }
        } else {
            location.reload();
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