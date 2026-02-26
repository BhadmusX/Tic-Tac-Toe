const p = document.querySelector("p");

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

const getplayerData = (playerNumber)=> {
   let name =  prompt(`Enter name for player ${playerNumber}`);
   if(!name) {
    name = `player${playerNumber}`;
   }
   return {name};
};

   let dataP1 = getplayerData(1);
    let playerOne = Player(dataP1.name, "X");

   let dataP2 = getplayerData(2);
   let playerTwo = Player(dataP2.name, "O");


const gameController = (function() {
    let gameOver = false;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    let activePlayer = playerOne;

    const switchPlayer = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    
    
    const playRound = (index) => {

        if (gameOver){
            console.log("The game is over. Reset to play again. ");
           return;
        }
        console.log(`Marking cell ${index} for ${activePlayer.name}..`);

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
                console.log(`${activePlayer.name} won this round`)
                gameOver = true;
                return;
            } else if(isTie){
                console.log("Its a tie try again");
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

    return { playRound, getActivePlayer: () => activePlayer, getGameOver: () => gameOver, getResetGame: () => resetGame() };
})();

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