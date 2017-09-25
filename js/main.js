$(document).ready(function() {
    var selectedCharacter = '';
    var enemyCharacter = '';
    var selectedDifficulty = '';
    var turn = '';
    var cavemanPiece = "assets/cavemanPiece.png";
    var dinosaurPiece = "assets/dinoPiece.png";
    //set modal options (disable proceeding with no team)
    $('#teamSelect').modal({
        backdrop: 'static',
        keyboard: false
    });


    //open character select
    $('#teamSelect').modal('show');


    //caveman selected
    $('#caveManSelected').on('click', function() {
        if (selectedCharacter === "dinosaur") {
            selectedCharacter = '';
            $('#dinosaurSelected').first().children().removeClass('selectedCharacter');
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "caveman";
            $(".easyDifficulty").removeClass('disabled');
            $(".hardDifficulty").removeClass('disabled');
        } else if (selectedCharacter === "caveman") {
            selectedCharacter = '';
            $('#caveManSelected').first().children().removeClass('selectedCharacter');
            $(".easyDifficulty").addClass('disabled');
            $(".hardDifficulty").addClass('disabled');
        } else {
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "caveman";
            $(".easyDifficulty").removeClass('disabled');
            $(".hardDifficulty").removeClass('disabled');
        }
    });

    //dinosaur selected
    $('#dinosaurSelected').on('click', function() {
        if (selectedCharacter === "caveman") {
            selectedCharacter = '';
            $('#caveManSelected').first().children().removeClass('selectedCharacter');
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "dinosaur";
        } else if (selectedCharacter === "dinosaur") {
            selectedCharacter = '';
            $('#dinosaurSelected').first().children().removeClass('selectedCharacter');
            $(".easyDifficulty").addClass('disabled');
            $(".hardDifficulty").addClass('disabled');
        } else {
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "dinosaur";
            $(".easyDifficulty").removeClass('disabled');
            $(".hardDifficulty").removeClass('disabled');
        }
    });

    //difficulty buttons
    $('.easyDifficulty').on('click', function() {
        if ($(".easyDifficulty").hasClass('disabled')) {
            swal({
                title: "SELECT A CHARACTER & DIFFICULTY!",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            if (selectedDifficulty === "hard") {
                selectedDifficulty = '';
                $('.hardDifficulty').removeClass('selectedDifficulty');
                $(this).addClass('selectedDifficulty');
                selectedDifficulty = "easy";
            } else if (selectedDifficulty === "easy") {
                selectedDifficulty = '';
                $('.easyDifficulty').removeClass('selectedDifficulty');
                $("#submitCharacterSelect").addClass('disabled');
            } else {
                $(this).addClass('selectedDifficulty');
                selectedDifficulty = "easy";
                $("#submitCharacterSelect").removeClass('disabled');
            }
        }
    });

    // not yet supported
    // $('.hardDifficulty').on('click', function() {
    //     if ($(".hardDifficulty").hasClass('disabled')) {
    //         swal({
    //             title: "SELECT A CHARACTER & DIFFICULTY!",
    //             timer: 2000,
    //             showConfirmButton: false
    //         });
    //     } else {
    //         if (selectedDifficulty === "easy") {
    //             selectedDifficulty = '';
    //             $('.easyDifficulty').removeClass('selectedDifficulty');
    //             $(this).addClass('selectedDifficulty');
    //             selectedDifficulty = "hard";
    //         } else if (selectedDifficulty === "hard") {
    //             selectedDifficulty = '';
    //             $('.hardDifficulty').removeClass('selectedDifficulty');
    //             $("#submitCharacterSelect").addClass('disabled');
    //         } else {
    //             console.log($(this));
    //             $(this).addClass('selectedDifficulty');
    //             selectedDifficulty = "hard";
    //             $("#submitCharacterSelect").removeClass('disabled');
    //         }
    //     }
    // });

    //submit selected char and enemy char info
    $("#submitCharacterSelect").on('click', function() {
        if ($("#submitCharacterSelect").hasClass('disabled')) {
            swal({
                title: "SELECT A CHARACTER & DIFFICULTY!",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            $('#teamSelect').modal('hide');

            if (selectedCharacter === "caveman") {
                enemyCharacter = 'dinosaur';
            } else {
                enemyCharacter = 'caveman';
            }
            //selected team
            $("#yourTeamPic").attr({
                src: 'assets/' + selectedCharacter + '.png'
            });
            $("#yourTeam").text(selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1));

            //enemy team
            $("#enemyTeamPic").attr({
                src: 'assets/' + enemyCharacter + '.png'
            });
            $("#enemyTeam").text(enemyCharacter.charAt(0).toUpperCase() + enemyCharacter.slice(1));

            //turn set
            $("#currentTurn").text(selectedCharacter);
            $('#selectedDifficulty').text(selectedDifficulty);
            turn = selectedCharacter;
            yourTurnGo(turn);

            swal({
                title: "BEGIN THE BATTLE!",
                timer: 1000,
                showConfirmButton: false
            });
        }
    });

    //begin game and handle game logic
    var openBoardSpots = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
    var winningCombos = [
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2'],
        ['a3', 'b3', 'c3'],
        ['a1', 'b2', 'c3'],
        ['a3', 'b2', 'c1'],
        ['a1', 'a2', 'a3'],
        ['b1', 'b2', 'b3'],
        ['c1', 'c2', 'c3']
    ]
    //your stats and data
    var yourWinningComboStatus = [0, 0, 0, 0, 0, 0, 0, 0];
    var yourSpots = [];
    var yourLastSpot = '';
    var yourMoves = 0;
    var yourAllTimeMoves = 0;
    var yourWins = 0;
    var yourLosses = 0;
    //neutral data
    var spotsTaken = [];
    var winnerFound = false;
    var catsWins = 0;
    //enemy stats and data
    var enemyWinningComboStatus = [0, 0, 0, 0, 0, 0, 0, 0];
    var enemySpots = [];
    var enemyLastSpot = '';
    var enemyMoves = 0;
    var enemyAllTimeMoves = 0;
    var enemyWins = 0;
    var enemyLosses = 0;

    //your turn
    function yourTurnGo(turn) {
        $("#playTable td").on('click', function() {
            if (turn === selectedCharacter && !$(this).hasClass('dinosaurTaken') && !$(this).hasClass('cavemanTaken')) {
                $(this).addClass(selectedCharacter + 'Taken');
                $(this).find('img').attr({
                    src: 'assets/' + selectedCharacter + 'Piece.png'
                });

                yourMoves++;
                yourAllTimeMoves++;
                $("#yourMoves").text(yourMoves);
                $("#yourAllTimeMoves").text(yourAllTimeMoves);

                turn = enemyCharacter;
                spotsTaken.push($(this).attr('id'));
                yourSpots.push($(this).attr('id'));
                yourLastSpot = $(this).attr('id');
                //remove selected from available spots
                for (var i = 0; i < openBoardSpots.length; i++) {
                    if ($(this).attr('id') === openBoardSpots[i]) {
                        openBoardSpots.splice(i, 1);
                    }
                }
                $("#currentTurn").text(enemyCharacter);
                //check to see if you won
                checkForYouWinner();
                checkForATie();
                //delay enemy turn for dramatic effect
                if (winnerFound === false) {
                    setTimeout(function() {
                        enemyTurnGo(turn, spotsTaken);
                    }, 1000);
                }
            }
        });
    }

    //enemy will go in a random spot since I am not smart enough to make it more awesome
    function enemyTurnGo(turn, spotsTaken) {
        console.log(selectedDifficulty);
        // if (selectedDifficulty === 'easy') {
        var goHere = Math.floor(Math.random() * openBoardSpots.length);
        $("#" + openBoardSpots[goHere]).addClass(enemyCharacter + 'Taken');
        $("#" + openBoardSpots[goHere]).find('img').attr({
            src: 'assets/' + enemyCharacter + 'Piece.png'
        });
        enemyMoves++;
        enemyAllTimeMoves++;
        $("#enemyMoves").text(enemyMoves);
        $("#enemyAllTimeMoves").text(enemyAllTimeMoves);

        spotsTaken.push(openBoardSpots[goHere]);
        enemySpots.push(openBoardSpots[goHere]);
        enemyLastSpot = openBoardSpots[goHere];
        openBoardSpots.splice(goHere, 1);
        turn = selectedCharacter;
        $("#currentTurn").text(selectedCharacter);
        checkForEnemyWinner();
        checkForATie();
        yourTurnGo(turn);

        // console.log(yourWinningComboStatus);
        // var closeCombo = [];
        for (var i = 0; i < yourWinningComboStatus.length; i++) {
            if (yourWinningComboStatus[i] === 2) {
                // console.log(winningCombos[i]);
                // console.log(yourSpots);
                for (var x = 0; x < yourSpots.length; x++) {
                    if (yourSpots[x] === winningCombos[i][x]) {
                        var comboHolder = winningCombos[i];
                        for (var y = 0; y < winningCombos[i].length; y++) {
                            if (!winningCombos[i][x].includes(comboHolder[y])) {
                                console.log(enemySpots);
                                console.log(comboHolder[y]);
                                for (var t = 0; t < enemySpots.length; t++) {
                                    if (enemySpots[t] !== comboHolder[y]) {
                                        console.log("you should go =-" + comboHolder[y]);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
        // } else {

        // }
    };

    //check if you won function
    function checkForYouWinner() {
        for (var x = 0; x < winningCombos.length; x++) {
            if (winningCombos[x].includes(yourLastSpot)) {
                yourWinningComboStatus[x] = yourWinningComboStatus[x] + 1;
                if (yourWinningComboStatus[x] === 3) {
                    // alert('YOU WON');
                    yourWins++;
                    $("#yourWins").text(yourWins);
                    yourMoves = 0;
                    enemyMoves = 0;
                    enemyLosses++;
                    $("#enemyLosses").text(enemyLosses);
                    winnerFound = true;

                    $('#winnerModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#winnerModal").modal('show');
                    $(".winLoseNext").on('click', function() {
                        endGame(true);
                    });
                }
            }
        }
    };

    //check if the enemy won function
    function checkForEnemyWinner() {
        for (var x = 0; x < winningCombos.length; x++) {
            if (winningCombos[x].includes(enemyLastSpot)) {
                enemyWinningComboStatus[x] = enemyWinningComboStatus[x] + 1;
                if (enemyWinningComboStatus[x] === 3) {
                    enemyWins++;
                    $("#enemyWins").text(enemyWins);
                    enemyMoves = 0;
                    yourMoves = 0;
                    yourLosses++;
                    $("#yourLosses").text(yourLosses);
                    winnerFound = true;
                    $('#loserModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#loserModal").modal('show');
                    $(".winLoseNext").on('click', function() {
                        endGame(true);
                    });

                }
            }
        }
    };

    //check for cats game, show the cat wins if so
    function checkForATie() {
        if (openBoardSpots.length === 0 && winnerFound === false) {
            enemyMoves = 0;
            yourMoves = 0;
            catsWins++;
            winnerFound = true;
            $("#catsWins").text(catsWins);
            $('#catsModal').modal({
                backdrop: 'static',
                keyboard: false
            });


            $('#catsModal').modal('show');
            endGame(false);

        }
    }

    //stop game and reset if wanted
    function endGame(showReset) {
        clearGame();
        if (showReset) {
            $('#gameReset').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#gameReset').modal('show');
        }
    }

    // clear the game board and some stats
    function clearGame() {
        openBoardSpots = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
        yourWinningComboStatus = [0, 0, 0, 0, 0, 0, 0, 0];
        enemyWinningComboStatus = [0, 0, 0, 0, 0, 0, 0, 0];
        winnerFound = false;
        enemySpots = [];
        yourSpots = [];
        yourLastSpot = '';
        enemyLastSpot = '';
        spotsTaken = [];

        for (i = 0; i < openBoardSpots.length; i++) {
            console.log('in for loop of piece reset');
            $("#" + openBoardSpots[i]).find('img').attr({
                src: 'assets/blankPiece.png'
            })
            $("#" + openBoardSpots[i]).removeClass();
        }
        $(".playAgain").on('click', function() {
            restartGame();
        });

        $(".doNotPlayAgain").on('click', function() {
            location.reload();
        });
    }

    //restart the game
    function restartGame() {
        swal({
            title: "BEGIN THE BATTLE!",
            timer: 1000,
            showConfirmButton: false

        });

        $("#currentTurn").text(selectedCharacter);
        turn = selectedCharacter;
        yourTurnGo(turn);
    }
});