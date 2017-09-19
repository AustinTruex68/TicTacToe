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

    //begin game
    var openBoardSpots = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
    var winningCombos = [
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2']
    ]
    var spotsTaken = [];
    var yourSpots = [];
    var enemySpots = [];

    //your turn
    function yourTurnGo(turn) {
        $("#playTable td").on('click', function() {
            console.log(turn);
            if (turn === selectedCharacter) {

                $(this).addClass(selectedCharacter + 'Taken');
                $(this).find('img').attr({
                    src: 'assets/' + selectedCharacter + 'Piece.png'
                });

                turn = enemyCharacter;
                spotsTaken.push($(this).attr('id'));
                yourSpots.push($(this).attr('id'));
                //remove selected from available spots
                for (var i = 0; i < openBoardSpots.length; i++) {
                    if ($(this).attr('id') === openBoardSpots[i]) {
                        openBoardSpots.splice(i, 1);
                    }
                }
                $("#currentTurn").text(enemyCharacter);
                //call enemy turn
                checkForWinner();
                enemyTurnGo(turn, spotsTaken);
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
        spotsTaken.push(openBoardSpots[goHere]);
        enemySpots.push(openBoardSpots[goHere]);
        openBoardSpots.splice(goHere, 1);
        turn = selectedCharacter;
        $("#currentTurn").text(selectedCharacter);
        checkForWinner();
        yourTurnGo(turn);
    };

    function checkForWinner() {
        // console.log(winningCombos);
        // console.log(yourSpots);
        // console.log(enemySpots);
        // var foundWinnerInYou = winningCombos[1].includes(yourSpots);
        // console.log(yourSpots);
        // console.log(winningCombos[1]);
        // console.log(foundWinnerInYou);


        for (var i = 0; i < yourSpots.length; i++) {
            if (winningCombos[0].indexOf(yourSpots[i]) === -1) {
                console.log("false");
            } else {
                console.log("tre");
            }
        }


        // for(var i =0; i < winningCombos.length; i ++){
        //     if ($.inArray(yourSpots, winningCombos)) {
        //         console.log();
        //     }
        // }
    };

});