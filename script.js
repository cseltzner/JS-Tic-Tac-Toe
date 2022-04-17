const GAME_SIZE = 9;

const gamePieces = document.querySelectorAll(".piece");

/**
 * Tic-tac-toe gameboard, able to handle arbitrary-sized square grids.
 */
class GameBoard {
    #gameArray
    #gameSize
    #currentTurn
    #gameOver

    constructor(gameSize) {
        this.#gameOver = false;
        this.#gameSize = gameSize
        this.#currentTurn = 'X'
        this.#gameArray = new Array(gameSize);
        this.#gameArray.fill(''); // Ensures array is empty initially
    }

    /**
     * Returns 'X' or 'O', depending on whose turn it currently is
     * 
     * @returns String 'X' or 'O' representing whose turn it is
     */
    getCurrentTurn() {
        return this.#currentTurn;
    }
    
    /**
     * Performs a move if possible and updates the internal array, which can be retrieved with getCurrentBoard(). 
     * Returns true if move was successful, and false otherwise
     * 
     * @param {Integer} position - Board position from 0 to gameSize that is to be filled with a playerID string
     * @param {String} playerID - String representing a player's piece. Usually X or O.
     * @returns Boolean, true if move was succesfully performed, false if unsuccessful (eg. if the position was already taken by a player)
     */
    performMove(position, playerID) {
        if (this.#gameOver) {
            return;
        }
        if (this.#gameArray[position] == "") {
            this.#gameArray[position] = playerID;
            if (this.#currentTurn == 'X') {
                this.#currentTurn = 'O'
            } else { this.#currentTurn = 'X' }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks internal gameboard to see if either player won or has tied. Returns -1 otherwise
     * 
     * @returns 1 if X wins, 2 if O wins, 3 if tie, -2 if game is already over, otherwise returns -1
     */
    checkForWinner() {
        if (this.#gameOver) {
            return -2;
        }
        // Check columns
        let xCount = 0;
        let oCount = 0;
        for (let j = 0; j < Math.sqrt(this.#gameSize); j++) {
            for (let i = j; i < this.#gameSize; i += Math.sqrt(this.#gameSize)) {
                if (this.#gameArray[i] == "X") {
                    xCount += 1;
                }
                if (this.#gameArray[i] == "O") {
                    oCount += 1;
                }
            }
            if (xCount == Math.sqrt(this.#gameSize)) {
                this.#gameOver = true;
                return 1;
            }
            if (oCount == Math.sqrt(this.#gameSize)) {
                this.#gameOver = true;
                return 2;
            }
            xCount = 0;
            oCount = 0;
    
        }



        // Check rows
        for (let j = 0; j < Math.sqrt(this.#gameSize); j++) {
            for (let i = (j * Math.sqrt(this.#gameSize)); i < (j + 1) * Math.sqrt(this.#gameSize); i++) {
                if (this.#gameArray[i] == 'X') {
                    xCount += 1;
                }
                if (this.#gameArray[i] == 'O') {
                    oCount += 1;
                }
            }
            if (xCount == Math.sqrt(this.#gameSize)) {
                this.#gameOver = true;
                return 1;
            }
            if (oCount == Math.sqrt(this.#gameSize)) {
                this.#gameOver = true;
                return 2;
            }
    
            xCount = 0;
            oCount = 0;    
        }


        // Check diagonals
    
        // Check top-left to bottom-right diagonal
        for (let i = 0; i < this.#gameSize; i += (Math.sqrt(this.#gameSize) + 1)) {
            if (this.#gameArray[i] == 'X') {
                xCount += 1;
            }
            if (this.#gameArray[i] == 'O') {
                oCount += 1;
            }
        }
        if (xCount == Math.sqrt(this.#gameSize)) {
            this.#gameOver = true;
            return 1;
        }
        if (oCount == Math.sqrt(this.#gameSize)) {
            this.#gameOver = true;
            return 2;
        }
        
        xCount = 0;
        oCount = 0;


        // Check top-right to bottom-left diagonal
        for (let i = Math.sqrt(this.#gameSize) - 1; i < this.#gameSize; i += (Math.sqrt(this.#gameSize) - 1)) {
            if (this.#gameArray[i] == 'X') {
                xCount += 1;
            }
            if (this.#gameArray[i] == 'O') {
                oCount += 1;
            }
        }

        if (xCount == Math.sqrt(this.#gameSize)) {
            this.#gameOver = true;
            return 1;
        }
        if (oCount == Math.sqrt(this.#gameSize)) {
            this.#gameOver = true;
            return 2;
        }


        // Check for tie
        for (let i = 0; i < this.#gameSize; i++) {
            if (this.#gameArray[i] == '') {
                // No winner, not a tie
                return -1;
            }
        }

        // Tie
        this.#gameOver = true;
        return 3;
    }

    /**
     * Returns current game board as an array
     * @returns current game board as an array
     */
    getCurrentBoard() {
        return this.#gameArray;
    }

    /**
     * Empties the current game board and optionally returns an empty board. 
     * Also allows for a new game to be played if game is already over
     * 
     * @returns empty game board
     */
    clearBoard() {
        this.#gameArray.fill('');
        this.#gameOver = false;
        this.#currentTurn = 'X';
        return this.#gameArray;
    }
}

const gameBoard = new GameBoard(GAME_SIZE);

gamePieces.forEach(piece => {
    piece.addEventListener('click', function() {
        gameBoard.performMove(piece.getAttribute('data-piece'), gameBoard.getCurrentTurn());
        updateUI();
        checkWin();
    })
})

document.querySelector('.reset-button').addEventListener('click', function() {
    gameBoard.clearBoard();
    updateUI();
    document.querySelector('.result-container').textContent = "";
})

function checkWin() {
    const isWon = gameBoard.checkForWinner();
    if (isWon == -1) {
        return;
    } else if (isWon == 1) {
        win('X');
    } else if (isWon == 2) {
        win('O');
    } else if (isWon == 3) {
        tie();
    }
}

function updateUI() {
    currentBoard = gameBoard.getCurrentBoard();
    for (let i = 0; i < currentBoard.length; i++) {
        gamePieces[i].textContent = currentBoard[i];
    }
}

function win(playerID) {
    document.querySelector('.result-container').textContent = `${playerID} wins!`;
}

function tie() {
    document.querySelector('.result-container').textContent = "It's a tie!";
}