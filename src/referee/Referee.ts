
import { PieceType, TeamType, Piece, AXIS } from "../constants"
import { isPawnNormalMove, isEnPassant, isPawnStartingMove, isFriendlyPiece, unsetEnPassant, setEnPassant } from "./pawnLogic"
import { isLegalBishopMove, isLegalRookMove, isLegalQueenMove, isLegalKingMove, isLegalNightMove, isCastleMove} from "./pieceLogic"
import Checker from './boardChecks'
import {CLICKED} from '../components/PopUp/PopUp'
import { executeMove } from "./executeMove"

export default class Referee{
    
    enPassantPawnLogic(px: number, py: number, x : number, y: number, team : TeamType, 
                        boardState : Piece [], startingPawnMove : boolean, enPassant: boolean){
        if (startingPawnMove){
            setEnPassant(px, py, boardState)
        } else if (enPassant){
            this.takePiece(x, py, team, boardState)
            unsetEnPassant(boardState)
        }
        else{
            this.takePiece(x, y, team, boardState)
            unsetEnPassant(boardState)
        }
    }


    promote(px: number, py: number, x : number, y: number, boardState : Piece []){
        const piece = boardState.find(p => p.x === px && p.y === py)
        if (piece && piece.type === PieceType.PAWN && piece.team === TeamType.WHITE && y === 7){
            piece.promoted = true
        }   
        else if (piece && piece.type === PieceType.PAWN && piece.team === TeamType.BLACK && y === 0){
            piece.promoted = true
        } else if (piece){
            piece.promoted = false
        }
    } 

    noCastle(px: number, py: number, boardState : Piece []){
        const piece = boardState.find(p => p.x === px && p.y === py)
        if (piece){
            piece.canCastle = false
        }
    }
    takePiece(x : number, y: number, team : TeamType, boardState : Piece []){
        const piece = boardState.find(p => p.x === x && p.y === y && p.team !== team)  
                if (piece) {
            piece.taken = true
        }
    }

    endMove(px : number, py : number, x : number, y: number, team : TeamType, 
            boardState : Piece [], valid : any, startingPawnMove: boolean, enPassant: boolean){
        if (!isFriendlyPiece(x, y, team, boardState)){
            this.promote(px, py, x, y, boardState)
            this.noCastle(px, py, boardState)
            this.enPassantPawnLogic(px, py, x, y, team, boardState, startingPawnMove, enPassant)
            executeMove(px, py, x, y, boardState)
            const checker = new Checker(null);
            const inCheck = checker.isMyKingInCheck(team, boardState, 0)
            if (inCheck){
                valid.value = false
            }  else {
                valid.value = true
            }      
        }
    }
    isValidMove(px : number, py : number, x : number, y : number, type : PieceType, 
                team : TeamType, boardState : Piece [],  activePlayer : TeamType) : boolean{
        if (!CLICKED){
            return false
        }  
        // Only the active player can move
        if (team !== activePlayer){
            return false
        }
        // A non-move is not a move
        if (px === x && py === y){
            return false
        }
        // A move off the board is not a move
        if (!(AXIS.includes(px) &&  AXIS.includes(py) &&  AXIS.includes(x) && AXIS.includes(y))){
            return false
        }
        var valid = { value: false }
        const dx = x - px
        const dy = y - py

        switch(type){
            case PieceType.PAWN : {
                if (isPawnStartingMove(px, py, x, y, team, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, true, false)
                }
                if (isPawnNormalMove(px, py, x, y, team, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                if (isEnPassant(px, py, x, y, team, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, true)
                }
                break;
            }
            case PieceType.NIGHT : {
                if (isLegalNightMove(px, py, dx, dy, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                break;
            }
            case PieceType.BISHOP : {
                if (isLegalBishopMove(px, py, dx, dy, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                break;
            }
            case PieceType.ROOK : {
                if (isLegalRookMove(px, py, dx, dy, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                break;
            }
            case PieceType.QUEEN : {
                if (isLegalQueenMove(px, py, dx, dy, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                break;
            }
            case PieceType.KING : {
                if (isLegalKingMove(px, py, dx, dy, boardState)){
                    this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
                if (isCastleMove(px, py, dx, dy, activePlayer, boardState)){
                    if (activePlayer === TeamType.WHITE){
                        if (dx === -2){ 
                            const piece = boardState.find(p => p.x === 0 && p.y === 0)
                            if (piece){
                                piece.teleported = true
                            }
                        }
                        if (dx === 2){ 
                            const piece = boardState.find(p => p.x === 7 && p.y === 0)
                            if (piece){
                                piece.teleported = true
                            }
                        }
                    }
                    if (activePlayer === TeamType.BLACK){
                        if (dx === -2){ 
                            const piece = boardState.find(p => p.x === 0 && p.y === 7)
                            if (piece){
                                piece.teleported = true
                            }
                        }
                        if (dx === 2){ 
                            const piece = boardState.find(p => p.x === 7 && p.y === 7)
                            if (piece){
                                piece.teleported = true
                            }
                        }
                    }
                this.endMove(px, py, x, y, team, boardState, valid, false, false)
                }
            break;
            }
        }
    return valid.value
    }
}