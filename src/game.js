import React from 'react';
import './game.css';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {initGameBoard, calculateResult} from './gameUtil'

// ------------------------------------------------------
// Class Game
// ------------------------------------------------------
class Game extends React.Component {
    // ----------------
    // Constructor
    // ----------------
    constructor(props) {
        super(props);
        let size = 10
        let data = initGameBoard(size, size)
        let historyData = [{
            "oldGameBoard": data,
            "colNo": 0,
            "rowNo": 0,
            "emptyCellNum": (size * size),
            "xIsNext": true,
            "gameMessage": "Next player: X",
            "endGame": false,
        }]

        this.state = {
            inputtedSize: size,
            boardSize: size,
            historyGameBoard: historyData,
            currentActiveHistoryStep: 0,
            ascHistoryGameBoard: true,
        };

        this.handleInputtedSize = this.handleInputtedSize.bind(this);
        this.handleGameBoardGeneration = this.handleGameBoardGeneration.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleJumpToOldGameBoard = this.handleJumpToOldGameBoard.bind(this);
        this.handleSortHistory = this.handleSortHistory.bind(this);
    }

    // ----------------
    // Functions
    // ----------------
    handleInputtedSize(event) {
        this.setState({inputtedSize: event.target.value});
    }

    handleGameBoardGeneration(event) {
        let newSize = this.state.inputtedSize
        let data = initGameBoard(newSize, newSize)

        this.setState({
            boardSize: newSize,
            historyGameBoard: [{
                "oldGameBoard": data,
                "colNo": 0,
                "rowNo": 0,
                "emptyCellNum": (newSize * newSize),
                "xIsNext": true,
                "gameMessage": "Next player: X",
                "endGame": false,
            }],
            currentActiveHistoryStep: 0,
            ascHistoryGameBoard: true,
        });
        event.preventDefault();
    }

    copyTwoDimensionArray = (twoDimensionArray) => {
        let result = []
        twoDimensionArray.map((element) => {
            let newElement = []
            element.map((value) => {
                newElement.push({...value})
            })
            result.push(newElement)
        })
        return result
    }

    handleClick(x, y) {
        let newHistoryGameBoard = this.state.historyGameBoard.slice(0, this.state.currentActiveHistoryStep + 1)
        let importantData = newHistoryGameBoard[newHistoryGameBoard.length - 1]

        // Check game is ended or not
        if (importantData.endGame) {
            return
        }

        // Prepare new values
        let pattern = importantData.xIsNext ? 'X' : 'O'
        if (importantData.oldGameBoard[x][y].pattern !== "") return
        let newGameBoard = this.copyTwoDimensionArray(importantData.oldGameBoard)
        newGameBoard[x][y].pattern = pattern

        // Calculate result
        let result = calculateResult(newGameBoard, y, x, pattern, importantData.emptyCellNum)
        
        // Decrease emptyCellNum by 1
        let newEmptyCellNum = importantData.emptyCellNum - 1

        // Set game message
        let msg = 'Next player: ' + (!importantData.xIsNext ? 'X' : 'O')
        if (result === "win") {
            msg = "Game result: " + pattern + " wins the game"
        }
        else 
            if (result == "draw") {
                msg = "Game result: X and O draw the game"
            }
        
        // Update game status if it is ended
        let isEnd = false
        if (result === "win" || result === "draw" || newEmptyCellNum == 0) {
            isEnd = true
        }

        // Set state
        this.setState({
            historyGameBoard: newHistoryGameBoard.concat([{
                "oldGameBoard": newGameBoard,
                "colNo": y + 1,
                "rowNo": x + 1,
                "emptyCellNum": newEmptyCellNum,
                "xIsNext": !importantData.xIsNext,
                "gameMessage": msg,
                "endGame": isEnd,
            }]),
            currentActiveHistoryStep: newHistoryGameBoard.length,
        });
    }

    handleJumpToOldGameBoard(index) {
        if (index == this.state.currentActiveHistoryStep) return 
        this.setState({
            currentActiveHistoryStep: index,
        })
    }

    handleSortHistory() {
        this.setState({
            ascHistoryGameBoard: !this.state.ascHistoryGameBoard,
        })
    }
    
    // ----------------
    // Render
    // ----------------
    renderForm = () => {
        return (
            <form onSubmit={this.handleGameBoardGeneration}>
                <Row>  
                    <div>
                        <label className="headingLabel">Size</label>
                        <input 
                            type="number" 
                            className="headingInput"
                            onChange={this.handleInputtedSize}  
                            value={this.state.inputtedSize} 
                            min="5" 
                            max="32" 
                            required/>
                    </div>
                    <div>
                        <input type="submit" value="GENERATE" className="headingBtn" />  
                    </div>
                </Row>
            </form>
        );
    }

    renderSquare = (gameBoard, x, y) => {
        return (
            <button className={gameBoard[x][y].active ? "square sbg" : "square"} onClick={() => this.handleClick(x, y)}>
                {gameBoard[x][y].pattern}
            </button>
        );
    }

    renderBoard = (gameBoard) => {
        return (
            <>
            {   
                gameBoard.map((val, x) => {
                    let boxes = gameBoard.map((res, y) => {
                        return (
                            <div key={"C" + (x+1)*(y+1)}>
                                {this.renderSquare(gameBoard, x, y)}
                            </div>
                        )
                    })

                    return (
                        <div className="board-row" key={"R" + (x+1)}>
                            {boxes}
                        </div>
                    )
                })
            }
            </>
        );
    }

    renderHistoryMove = () => {
        let hgbArray = null
        let activeStep = this.state.currentActiveHistoryStep
        let ascHistory = this.state.ascHistoryGameBoard

        if (ascHistory) {
            hgbArray = this.state.historyGameBoard
        } else {
            hgbArray = this.state.historyGameBoard.slice(0).reverse()
        } 

        return (
            <div className="historyDiv">
            {   
                hgbArray.map((value, index) => {
                    let currentXTurn = value.xIsNext ? false : true

                    if (!ascHistory) {
                        index = hgbArray.length - 1 - index
                    }
                    
                    if (index == 0) {
                        return (<Button key="start" className={(index == activeStep) ? "historyBtn historyBtnActive" : "historyBtn"} onClick={() => this.handleJumpToOldGameBoard(index)} >Game started</Button>);
                    } else {
                        return (<Button key={index} className={(index == activeStep) ? "historyBtn historyBtnActive" : "historyBtn"} onClick={() => this.handleJumpToOldGameBoard(index)} >Step: {index} | Turn: {currentXTurn ? "X" : "O"} | Col: {value.colNo} | Row: {value.rowNo}</Button>);
                    }
                })
            }
            </div>  
        );
    }

    render() {
        let sortBtnName = this.state.ascHistoryGameBoard ? "SORT DESCENDING" : "SORT ASCENDING"
        let importantData = this.state.historyGameBoard[this.state.currentActiveHistoryStep]
        let gameBoard = this.copyTwoDimensionArray(importantData.oldGameBoard)

        return (
            <Container fluid="true">
                {this.renderForm()}
                <div className="gameBox">
                    <div className="status">
                        {importantData.gameMessage}
                    </div>
                    <Row>
                        <Col>{this.renderBoard(gameBoard)}</Col>
                        <Col>
                            <Button className="historyBtn sortHistory" onClick={() => this.handleSortHistory()}>{sortBtnName}</Button>
                            {this.renderHistoryMove()}
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

// ------------------------------------------------------
// Export
// ------------------------------------------------------
export default Game;