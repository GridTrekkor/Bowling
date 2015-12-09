var score = 0,
    currentFrame = 0,
    ninthFrame = 0, // implies frame 10
    secondTurn = false, // second roll in frame
    gameOver = false,
    thisRoll,
    frames = [],
    pinsLeft = 10;

// frames setup [frame total, first roll, second roll, third roll]
frames[0] = [0, 0, 0];
frames[1] = [0, 0, 0];
frames[2] = [0, 0, 0];
frames[3] = [0, 0, 0];
frames[4] = [0, 0, 0];
frames[5] = [0, 0, 0];
frames[6] = [0, 0, 0];
frames[7] = [0, 0, 0];
frames[8] = [0, 0, 0];
frames[9] = [0, 0, 0, 0];

function roll(pinsLeft) {
    return Math.floor(Math.random() * (pinsLeft + 1));
    //return 10;
}

function advanceFrame() {
    pinsLeft = 10;
    currentFrame++;
    secondTurn = false;
    document.getElementById('frame' + (currentFrame)).style.backgroundColor = "#FFF";
    if (currentFrame < 10) {
        document.getElementById('frame' + (currentFrame + 1)).style.backgroundColor = "#FB8";
    }
}

function updateScore() {
    var i = 0;
    score = 0;
    while (i < frames.length) {
        score += frames[i][0];
        document.getElementById('score').innerHTML = score;
        i++;
    }
}

function appendFrameText(text) {
    document.getElementById('frame' + (currentFrame + 1)).innerHTML += text;
}

function checkStrike(currentFrame, thisRoll) {

    // checkStrike and add points to previous frames only if not in tenth frame
    if (ninthFrame < 3) {
        if (frames[currentFrame - 1]) {
            if (frames[currentFrame - 1][1] == "X") {
                frames[currentFrame - 1][0] += thisRoll;
            }
        }
    }

    if (ninthFrame < 2) {
        if (frames[currentFrame - 2]) {
            if (frames[currentFrame - 2][1] == "X") {
                frames[currentFrame - 2][0] += thisRoll;
            }
        }
    }

}

function checkSpare(currentFrame, thisRoll) {
    if (frames[currentFrame - 1]) {
        if (frames[currentFrame - 1][2] == "/") {
            frames[currentFrame - 1][0] += thisRoll;
        }
    }
}

function bowl() {

    if (!gameOver) {

        console.clear();

        // first roll of frame
        if (!secondTurn) {
            thisRoll = roll(10);
            frames[currentFrame][0] = thisRoll;
            frames[currentFrame][1] = thisRoll;
            checkStrike(currentFrame, thisRoll);
            checkSpare(currentFrame, thisRoll);
            pinsLeft = 10 - frames[currentFrame][1];
        }

        // handle spare in final frame
        if (currentFrame == 9 && frames[9][2] == "/") {
            pinsLeft = 10;
            thisRoll = roll(10);
            frames[9][0] += thisRoll;
            frames[9][3] = thisRoll;
            appendFrameText("&nbsp;&nbsp;" + (thisRoll == 0 ? "&mdash;" : (thisRoll == 10 ? "X" : thisRoll)));
            gameOver = true;

            // second roll of frame
        } else if (pinsLeft > 0 && secondTurn) {
            thisRoll = roll(pinsLeft);
            frames[currentFrame][0] += thisRoll;
            frames[currentFrame][2] = thisRoll;
            checkStrike(currentFrame, thisRoll);
            if (frames[currentFrame][0] == 10) { // spare
                frames[currentFrame][2] = "/";
                appendFrameText("<b>/</b>");
            } else {
                appendFrameText(thisRoll == 0 ? "&mdash;" : thisRoll.toString());
            }

            if (currentFrame < 9) {
                advanceFrame();
            } else if (currentFrame == 9 && frames[9][2] != "/") {
                gameOver = true;
            }

        } else if (pinsLeft > 0 && !secondTurn) {
            document.getElementById('frame' + (currentFrame + 1)).innerHTML = thisRoll.toString() + "&nbsp;&nbsp;";
            secondTurn = true;
        } else if (pinsLeft == 0) { // strike
            frames[currentFrame][0] = 10;
            frames[currentFrame][1] = "X";
            document.getElementById('frame' + (currentFrame + 1)).innerHTML = "X";

            if (currentFrame < 9) {
                frames[currentFrame][2] = "";
                advanceFrame();
            }

            // handle strikes(s) in final frame
            if (currentFrame == 9) {
                if (ninthFrame == 2) {
                    frames[currentFrame][ninthFrame] = "X";
                    frames[currentFrame][0] = 20;
                    document.getElementById('frame10').innerHTML = "X&nbsp;&nbsp;X";
                }
                if (ninthFrame == 3) {
                    frames[currentFrame][ninthFrame] = "X";
                    frames[currentFrame][0] = 30;
                    document.getElementById('frame10').innerHTML = "X&nbsp;&nbsp;X&nbsp;&nbsp;X";
                    gameOver = true;
                }
                ninthFrame++;
            }

        }

        console.table(frames);

        updateScore();

    }

    //document.getElementById('score').innerHTML = frames.reduce((previous, current) => previous + current);
}
