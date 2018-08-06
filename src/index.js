import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    for (let i=0; i<3; i++){
      let row = [];
      for (let j=0; j<3; j++){
        row.push(this.renderSquare((i*3)+j));
      }
      squares.push(<div key={i} className="board-row">{ row }</div>);
    }
    console.log(squares);

    return (
      <div>
        {squares}
      </div>
    );
  }

}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentMove: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  //takes position 0-8 and returns [x,y] position on Board
  //i know there's probably a better way to do this but i can't
  //be bothered working out the maths and also doesn't hurt to
  //learn how to do switch statements in react :)
  //i know the breaks are unreachable but i feel i should keep them
  //there for good practise
  getPosition(i){
    switch (i) {
      case 0:
        return [1,1];
        break;
      case 1:
        return [1,2];
        break;
      case 2:
        return [1,3];
        break;
      case 3:
        return [2,1];
        break
      case 4:
        return [2,2];
        break;
      case 5:
        return [2,3];
        break;
      case 6:
        return [3,1];
        break;
      case 7:
        return [3,2];
        break;
      case 8:
        return [3,3]
        break;
      default:
        return [0,0];
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + " - (" + this.getPosition(step.currentMove) +")" :
      'Go to game start';
      if (this.state.stepNumber === move){
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
