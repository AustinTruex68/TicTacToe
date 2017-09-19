$(document).ready(function() {
    var selectedCharacter = '';
    var enemyCharacter = '';
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
            $("#submitCharacterSelect").removeClass('disabled');
        } else if (selectedCharacter === "caveman") {
            selectedCharacter = '';
            $('#caveManSelected').first().children().removeClass('selectedCharacter');
            $("#submitCharacterSelect").addClass('disabled');
        } else {
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "caveman";
            $("#submitCharacterSelect").removeClass('disabled');
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
            $("#submitCharacterSelect").addClass('disabled');
        } else {
            $(this).first().children().addClass('selectedCharacter');
            selectedCharacter = "dinosaur";
            $("#submitCharacterSelect").removeClass('disabled');
        }
    });

    //submit selected char and enemy char info
    $("#submitCharacterSelect").on('click', function() {
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
        turn = selectedCharacter;
        yourTurnGo(turn);

        swal({
            title: "BEGIN THE BATTLE!",
            button: "Bring it on!"
        })
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
            console.log($(this).hasClass('dinosaurTaken'));

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
                    }, 2000);
                }
            }
        });
    }

    //enemy will go in a random spot since I am not smart enough to make it more awesome
    function enemyTurnGo(turn, spotsTaken) {
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
    };

    //check if you won function
    function checkForYouWinner() {
        for (var x = 0; x < winningCombos.length; x++) {
            if (winningCombos[x].includes(yourLastSpot)) {
                yourWinningComboStatus[x] = yourWinningComboStatus[x] + 1;
                if (yourWinningComboStatus[x] === 3) {
                    alert('YOU WON');
                    yourWins++;
                    $("#yourWins").text(yourWins);
                    yourMoves = 0;
                    enemyLosses++;
                    $("#enemyLosses").text(enemyLosses);
                    winnerFound = true;
                    setTimeout(function() {
                        endGame();
                    }, 2000);
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
                    alert('ENEMY WON');
                    enemyWins++;
                    $("#enemyWins").text(enemyWins);
                    enemyMoves = 0;
                    yourLosses++;
                    $("#yourLosses").text(yourLosses);
                    winnerFound = true;
                    setTimeout(function() {
                        endGame();
                    }, 2000);

                }
            }
        }
    };

    function checkForATie() {
        if (openBoardSpots.length === 0 && winnerFound === false) {
            winnerFound = true;
            alert('wow... the cat won.. really?');
            enemyMoves = 0;
            yourMoves = 0;
        }
    }

    //stop game and reset if wanted
    function endGame() {
        // openBoardSpots = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
        $('#gameReset').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#gameReset').modal('show');
    }
});