function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const writeMark = (row, column, player) => {
    if (board[row][column].getValue() !== null) return false;

    board[row][column].addMark(player);

    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue() || "-")
    );
    console.log(boardWithCellValues);
  };

  const checkWinner = (activePlayer) => {
    const mark = activePlayer.mark;

    // Check horizontal
    for (let r = 0; r < rows; r++) {
      if (board[r].every((cell) => cell.getValue() === mark)) {
        return activePlayer.name;
      }
    }

    // Check vertical
    for (let c = 0; c < columns; c++) {
      if (board.every((row) => row[c].getValue() === mark)) {
        return activePlayer.name;
      }
    }

    // Check diagonal (top-left to bottom-right)
    if ([...Array(rows)].every((_, i) => board[i][i].getValue() === mark)) {
      return activePlayer.name;
    }

    // Check diagonal (top-right to bottom-left)
    if (
      [...Array(rows)].every(
        (_, i) => board[i][columns - 1 - i].getValue() === mark
      )
    ) {
      return activePlayer.name;
    }

    // Check tie
    if (board.flat().every((cell) => cell.getValue() !== null)) {
      return "Tie";
    }

    return null;
  };

  return { getBoard, writeMark, printBoard, checkWinner };
}

function Cell() {
  let value = null;

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    { name: playerOneName, mark: "X" },
    { name: playerTwoName, mark: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Writing ${getActivePlayer().name}'s mark into cell [${row},${column}]...`
    );

    const moveSuccessful = board.writeMark(row, column, getActivePlayer().mark);
    if (!moveSuccessful) return;

    const winner = board.checkWinner(activePlayer);
    if (winner) {
      return winner === "Tie" ? "It's a tie!" : `${winner} wins!`;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  let game = GameController(); // Allow reassignment
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resetButton = document.querySelector(".reset");

  const winnerDiv = document.createElement("div");
  winnerDiv.classList.add("winner");
  document.body.appendChild(winnerDiv);

  const updateScreen = (winner = null) => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    if (winner) {
      winnerDiv.textContent = winner;
      winnerDiv.classList.add("show");
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
      winnerDiv.classList.remove("show");
    }

    board.forEach((row, i) => {
      row.forEach((cell, idx) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.cell = `${i},${idx}`;
        cellButton.textContent = cell.getValue() || "";

        if (winner) {
          cellButton.disabled = true;
        } else {
          cellButton.disabled = cell.getValue() !== null;
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;

    const [row, column] = selectedCell.split(",");

    const winner = game.playRound(row, column);
    updateScreen(winner);
  };

  const resetHandler = () => {
    game = GameController();
    updateScreen();
  };

  boardDiv.addEventListener("click", clickHandlerBoard);
  resetButton.addEventListener("click", resetHandler);
  updateScreen();
}

ScreenController();
