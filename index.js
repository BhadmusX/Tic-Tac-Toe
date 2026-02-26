const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn")
const displayCnt = document.querySelector(".display");
const display = document.createElement("p");
const warning = document.createElement("p");
displayCnt.appendChild(display);
display.classList.add("p");
displayCnt.appendChild(warning);


let playerOne;
let playerTwo;

const gameboard = ( () => {

    let board = ["", "", "", "", "", "", "", "", "",];

    const getBoard = () => board;

    const placeMark = (index, playermarker) => {
       if (board[index] === "") {
            board[index] = playermarker;
            return true; 
        }
        return false;
       
    };

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", "",];
        console.log("Game board has been resetted")
    };


    return {getBoard, placeMark, reset, };

}) ();

const Player = (name, marker) => {
    return { name, marker };
};

startBtn.addEventListener("click", () => {
    let p1Name = document.querySelector(".name1");
    let p2Name = document.querySelector(".name2");

    if(!p1Name.value) p1Name.value = "Player 1";
    if(!p2Name.value) p2Name.value = "Player 2";

   
    playerOne = Player(p1Name.value, "X");
    playerTwo = Player(p2Name.value, "O");

     p1Name.value = "";
    p2Name.value = "";

    
    gameController.setPlayers(playerOne, playerTwo);


    renderboard();

   
});



const gameController = (function() {
    let gameOver = false;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    
    let activePlayer;

    const setPlayers = (p1, p2) => {
        playerOne = p1;
        playerTwo = p2;
        activePlayer = playerOne;
    };

    const switchPlayer = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        display.textContent = `${gameController.getActivePlayer().name}'s turn..`;
    };
    
    
    const playRound = (index) => {

        if (gameOver){
            warning.textContent = "";
            warning.textContent = "The game is over. Hit the restart to play again. ";
           return;
        }
        console.log(`marking cell ${index} for ${gameController.getActivePlayer().name}`)

        const success = gameboard.placeMark(index, activePlayer.marker);
        renderboard();

        if(success) {
            const currentBoard = gameboard.getBoard();

            const isWin = winConditions.some(conditions => {
                const [a, b, c] = conditions;
                return (
                    currentBoard[a] !== "" &&
                    currentBoard[a] === currentBoard[b]&&
                    currentBoard[a] === currentBoard[c]
                );
            });
            const isTie = currentBoard.every(cell => cell !== "") && !isWin;
            if(isWin){
                display.textContent = "";
                display.textContent = `${activePlayer.name} won this round`;
                gameOver = true;
                return;
            } else if(isTie){
                display.textContent = "";
                display.textContent = "Its a tie try again";
                gameOver = true;
                return;
            }
            switchPlayer();
        } else {
            console.log("cell already taken!!");
        }

    };

     const resetGame = () => {
        gameboard.reset();
        gameOver = false;
        activePlayer = playerOne;
    };

    return { playRound, getActivePlayer: () => activePlayer, getGameOver: () => gameOver, getResetGame: () => resetGame(), setPlayers };
})();

restartBtn.addEventListener("click", () => {

    display.textContent = "";
    warning.textContent = "";

    gameController.getResetGame();

    renderboard();
});

const renderboard = () => {
    const board = gameboard.getBoard();

    board.forEach((cell, index) => {
        const sqaure =  document.querySelector(`[data-index="${index}"]`);
        sqaure.textContent = cell;
    });
}

renderboard();

const addClickEvents = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
        square.addEventListener("click", (e) => {
            const index = e.target.dataset.index;

            if(gameboard.getBoard()[index] !== "") return;

            gameController.playRound(index);
            renderboard();
        });
    });
}

addClickEvents();