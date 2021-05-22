import React, {useRef, useState, } from 'react';
import Tile from '../Tile/Tile';
import './chessboard.css';
import Referee from '../../referee/Referee'
import {VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, TeamType, initializeBoardState} from '../../constants'
import Checker from '../../referee/boardChecks'
import { PROMOTED_PIECE , IMAGE, CLICKED} from '../PopUp/PopUp';

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
    function newGame(){
        setPieces(initializeBoardState())
        setActivePlayer(TeamType.WHITE)
        setCheckMate([false, ' '])
   }
    function deepCopy() {
        const oldBoardState : Piece[] = [];
        pieces.forEach(p => oldBoardState.push({image : p.image, x : p.x,  y : p.y,
                                                team : p.team, type : p.type, 
                                                enPassantable : p.enPassantable,
                                                canCastle: p.canCastle,
                                                promoted: p.promoted}))
        return oldBoardState
    }

    function switchPlayer(){
        const nextPlayer = activePlayer === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
        setActivePlayer(nextPlayer) 
    }

    function revert(){
        if (activePiece){
            activePiece.style.position = 'relative';
            activePiece.style.removeProperty('left');
            activePiece.style.removeProperty('top');
        }
    }

    function promotePieces(){
        const promotedPiece = pieces.find(p => p.promoted === true)
        if (promotedPiece){
            const id = pieces.indexOf(promotedPiece)
            pieces[id] = {image : IMAGE, x : promotedPiece.x,  y: promotedPiece.y, taken : false,
                        team : promotedPiece.team, type : PROMOTED_PIECE, enPassantable : false,
                        promoted : false}
        }
    }

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
    
    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            if (CLICKED){
                promotePieces()
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

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j-- ){
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++ ) {
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