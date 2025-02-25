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
    const availableCells = board[row][column].getValue() === 0;

    if (!availableCells) return;

    board[row][column].addMark(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const checkWinner = (activePlayer) => {
    // Check horizontal
    for (let r = 0; r < rows; r++) {
      if (board[r].every((cell) => cell.getValue() === activePlayer.mark)) {
        return activePlayer.name;
      }

      // Check vertical
      for (let c = 0; c < columns; c++) {
        if (board.every((row) => row[c].getValue() === activePlayer.mark)) {
          return activePlayer.name;
        }
      }

      // Check diagonal (top-left to bottom-right)
      if (
        [...Array(rows)].every(
          (_, i) => board[i][i].getValue() === activePlayer.mark
        )
      ) {
        return activePlayer.name;
      }

      // Check diagonal (top-right to bottom-left)
      if (
        [...Array(rows)].every(
          (_, i) => board[i][columns - 1 - i].getValue() === activePlayer.mark
        )
      ) {
        return activePlayer.name;
      }

      // Check tie
      if (board.flat().every((cell) => cell.getValue() !== 0)) {
        return "Tie";
      }
    }
  };

  return { getBoard, writeMark, printBoard, checkWinner };
}

function Cell() {
  let value = 0;

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
    {
      name: playerOneName,
      mark: 1,
    },
    {
      name: playerTwoName,
      mark: 2,
    },
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

    board.writeMark(row, column, getActivePlayer().mark);

    // check winner
    const winner = board.checkWinner(activePlayer);
    if (winner) {
      alert(winner === "Tie" ? "It's a tie!" : `${winner} wins!`);
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
