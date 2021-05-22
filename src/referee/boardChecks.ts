import { PieceType, TeamType, Piece, VERTICAL_AXIS, HORIZONTAL_AXIS } from "../constants"
import { isLegalBishopMove, isLegalRookMove, isLegalQueenMove, isLegalKingMove, isLegalNightMove} from "./pieceLogic"
import { isPawnNormalMove } from "./pawnLogic"
import { CLICKED } from '../components/PopUp/PopUp'
import Referee from "./Referee"

export default class Checker {   
    oldBoardState : Piece [] | null;

    constructor (boardState: Piece [] | null){
        this.oldBoardState = boardState
    }


    deepCopy(boardState : Piece []) {
        if (this.oldBoardState){
            for (let i = 0; i < this.oldBoardState.length; i ++){
                const p = this.oldBoardState[i]
                boardState[i] = {image : p.image, x : p.x, y : p.y, type : p.type, team : p.team,
                                enPassantable : p.enPassantable, canCastle : p.canCastle, taken : false,
                                promoted : false}
            }
        }
    } 

    isMyKingInCheck(team : TeamType, boardState : Piece [], increment : number) : boolean {
        const enemyTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
        const myKing = boardState.find(p => p.team === team && p.type === PieceType.KING) 
        for (let i = 0; i < boardState.length; i++){
            const p = boardState[i];
            if (myKing && p.team === enemyTeam) {
                const dx = myKing.x + increment - p.x
                const dy = myKing.y - p.y
                switch (p.type){
                    case PieceType.PAWN : {
                        if (isPawnNormalMove(p.x, p.y, myKing.x + increment, myKing.y, p.team, boardState)){
                            return true;
                        } break;
                    }
                    case PieceType.NIGHT : {
                        if (isLegalNightMove(p.x, p.y, dx, dy, boardState)){
                            return true;
                        } break;
                    }
                    case PieceType.BISHOP : {
                        if (isLegalBishopMove(p.x, p.y, dx, dy, boardState)){
                            return true;
                        } break;
                    }
                    case PieceType.ROOK : {
                        if (isLegalRookMove(p.x, p.y, dx, dy, boardState)){
                            return true;
                        } break;
                    }
                    case PieceType.QUEEN : {
                        if (isLegalQueenMove(p.x, p.y, dx, dy, boardState)){
                            return true;
                        } break;
                    }
                    case PieceType.KING : {
                        if (isLegalKingMove(p.x, p.y, dx, dy, boardState)){
                            return true;
                        } break;
                    }
                }

            }
        }
        return false
    }

    isCheckMate(team : TeamType, boardState : Piece []): boolean{
        const ref = new Referee()
        const enemyTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
        for (let j = VERTICAL_AXIS.length - 1; j >= 0; j-- ){
            for (let i = 0; i < HORIZONTAL_AXIS.length; i++ ) {
                for (let k = 0; k < boardState.length; k ++ ){
                    const p = boardState[k] 
                    if (p.team === enemyTeam)  {               
                        const legalMove = ref.isValidMove(p.x, p.y, i, j, p.type, enemyTeam, boardState, enemyTeam)
                        this.deepCopy(boardState)
                        if (legalMove || !CLICKED){
                            return false                       
                        } 
                    }
                }
            
            }
        }        
        return true

    }

}