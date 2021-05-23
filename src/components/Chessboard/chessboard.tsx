
/*
This is the chess board react based function.  It is the only element in our App.tsx and
it is responsible for keeping the Piece [] in sync with the displayed tiles of the 
chess board.  The boards state updates via React hooks which are all declared at 
the top of the function. 
*/

import React, {useRef, useState, } from 'react';
import Tile from '../Tile/tile';
import './chessboard.css';
import Referee from '../../Referee/referee'
import {AXIS, GRID_SIZE, Piece, TeamType, initializeBoardState} from '../../constants'
import Checker from '../../Referee/checker'
import {CLICKED} from '../Promotion/promotion';
import {promotePieces} from '../../Referee/pawnLogic'

export default function Chessboard(){
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null) 
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces]  = useState<Piece[]>(initializeBoardState());
    const [activePlayer, setActivePlayer] = useState<TeamType>(TeamType.WHITE);
    const [winner, setWinner]  = useState('');
    const [[checkMate, message], setCheckMate] = useState([false, '']);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    let board = [];
    
    // Returns the board state to the original board state
    function newGame(){
        setPieces(initializeBoardState())
        setActivePlayer(TeamType.WHITE)
        setCheckMate([false, ' '])
    }

    // Used To make a copy of the piece array.  This is useful to pass while 
    // cheking for check mate so the actual board state does not get changed 
    // in the process
    function deepCopy() {
        const oldBoardState : Piece[] = [];
        pieces.forEach(p => oldBoardState.push({image : p.image, x : p.x,  y : p.y,
                                                team : p.team, type : p.type, 
                                                enPassantable : p.enPassantable,
                                                canCastle: p.canCastle,
                                                promoted: p.promoted}))
        return oldBoardState
    }

    // Switches the game state from WHITE to BLACK and vice versa
    function switchPlayer(){
        const nextPlayer = activePlayer === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
        setActivePlayer(nextPlayer) 
    }

    // Returns the active piece to its original location.
    function revert(){
        if (activePiece){
            activePiece.style.position = 'relative';
            activePiece.style.removeProperty('left');
            activePiece.style.removeProperty('top');
            setPieces(pieces)
        }
    }

    // Tries to look for 'chess-piece' in the HTML of the clicked area 
    // to see if a player is trying to grab a piece
    function grabPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current
        const element = e.target as HTMLElement
        if (element.classList.contains('chess-piece') && chessboard){
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft)/GRID_SIZE));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 8 * GRID_SIZE)/GRID_SIZE)));
            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;
            element.style.position = 'absolute'; 
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element)    
        }
    
    }
    // Places the center of the active piece beneath the cursor
    function movePiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current
        if (activePiece && chessboard){
            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;
            activePiece.style.position = 'absolute'; 
            activePiece.style.left = `${x}px`;
            activePiece.style.top = `${y}px`;
        }
    }
    
    /* When the active piece is released we check to see if there was a piece promotion 
    using the variable CLICKED, then we check to see if the move made was a legal chess 
    move, this logic is done by files in the referee subdirectory. And finally we check 
    to see if the move that was made resulted in chekmate or stalemate. 
    */

    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            if (CLICKED){
                promotePieces(pieces)
            }  
            const x = Math.floor((e.clientX - chessboard.offsetLeft)/GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 8 * GRID_SIZE)/GRID_SIZE))
            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY)
            if (currentPiece){
                const oldBoardState = deepCopy()
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces, activePlayer);                               
                if (validMove){  
                    switchPlayer()
                    setPieces(pieces)
                } else {
                    setPieces(oldBoardState)
                    revert()
                }
            const boardState = deepCopy()
            const boardState2 = deepCopy()
            const checker = new Checker(boardState2);
            const oppponent = activePlayer === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
            const checkMate = checker.isCheckMate(activePlayer, boardState)
            if (checkMate){
                if(checker.isMyKingInCheck(oppponent, boardState, 0)){
                    const winner = activePlayer === TeamType.WHITE ? 'White Wins' : 'Black Wins'
                    setWinner(winner)
                    setCheckMate([true, 'Check Mate'])
                } else {
                    setWinner('Players Draw')
                    setCheckMate([true, 'Stale Mate'])
                }

            }
            }
        }
        setActivePiece(null);
    }


    // This code places 64 squares on the chessboard and for each square will look to see if their is 
    // a piece to place the image on. The HTML for the tiles is in the Tile subdirectory
    for (let j = AXIS.length - 1; j >= 0; j-- ){
        for (let i = 0; i < AXIS.length; i++ ) {
            const number = i + j;
            const piece = pieces.find(p => p.x === i && p.y === j) 
            let image = piece ? piece.image : undefined
            const promotedPiece = pieces.find(p => p.promoted === true)
            const team = promotedPiece && promotedPiece.y === 7 ? TeamType.WHITE : TeamType.BLACK 
            if (promotedPiece && promotedPiece.x === i && promotedPiece.y === j){
                board.push(<Tile key = {`${i}, ${j}`} image = {image} number = {number} team = {team} isPromotion = {true}/>);
            } else {
                board.push(<Tile key = {`${i}, ${j}`} image = {image} number = {number} team = {team} isPromotion = {false}/>);
            }
        }
    }

    // Continues the game if it is not over otherwise displays the game result and prompts the user to play again
    if (!checkMate){
    return <div 
    ref = {chessboardRef} 
    onMouseUp = {e => dropPiece(e)} 
    onMouseMove = {e => movePiece(e)} 
    onMouseDown = {e => grabPiece(e)} 
    className = 'chessboard'>{board}
    </div>;
    } else {
    return <div><div 
    ref = {chessboardRef} 
    className = 'chessboard grayed-out' >{board}
    </div><div className = 'check'>
    <div className = 'mate' > {message} <br></br> {winner} </div>
    </div>
    <button className = 'newgame' onClick = {newGame}> Play Again </button>
    </div>;
    }
}