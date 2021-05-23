/* 
This file handles the surprisingly complicated PAWN movement. This includes 
the PAWN's special starting move, special diagonal taking move, ability to take 
en passant, ability to be taken en passant, and promoting upon reaching the 
other side of the board. Also contains the ever useful function isFriendlyPiece().
This Section of code could be cleaned up a little bit but right now everything is 
working perfectly so if it ain't broke don't fix it.
*/


import { Piece, TeamType } from '../constants'
import {IMAGE, PROMOTED_PIECE} from '../components/Promotion/promotion'


// Checks to see if a piece is in the way, this is different from other pieces
// since normally if an enemy piece is on the square you are moving to 
// the piece is captured, a pawn however, is blockaded.
function pawnIsBlockaded(x : number, y: number, boardState : Piece []): boolean {
    const piece = boardState.find(p => p.x === x && p.y === y) 
    const occupied =  piece ? true : false
    return occupied
}

// Checks to see if a piece on a given square can be captured en passant
function checkEnPassant (x : number, y : number, boardState : Piece []) : boolean {
    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece && piece.enPassantable){
        return piece.enPassantable  
    } return false
}

// Sets the enPassantable flag to true for a pawn on a given square while unsetting that
// flag for every other piece. This function could probably be made more efficiently.
export function setEnPassant(x : number, y : number, boardState : Piece []){
        boardState.forEach(p => {
            if (p.x === x && p.y === y){
                p.enPassantable = true
            } else{
                p.enPassantable = false
            }
        })
    }

// Unsets the enPassantable flag for every piece. This function could probably be 
// made more efficiently.
export function unsetEnPassant( boardState : Piece []){
    boardState.forEach(p => {
            p.enPassantable = false
    })
}
// Returns true if the piece on square x, y belongs to the team
export function isFriendlyPiece(x : number, y: number, team : TeamType, boardState : Piece []): boolean {
    const piece = boardState.find(p => p.x === x && p.y === y)
    const occupied =  piece && piece.team === team ? true : false
    return occupied
}
// Returns true if a pawn is moving 2 squares forward
export function isPawnStartingMove(px : number, py : number, x : number, y : number, 
                                    team : TeamType, boardState : Piece []):boolean{
    const startingRow = team === TeamType.WHITE ? 1 : 6
    const increment = team === TeamType.WHITE ? 1 : - 1
    if ((py === startingRow && px === x) && (py === y - 2 * increment)){
        if (!pawnIsBlockaded(x, y, boardState) && !pawnIsBlockaded(x, y - increment, boardState)){
            return true
        }
    } return false
}
// Returns true if the the pawn can move from px, py to x, y this covers the case of capturing 
// diagonally.
export function isPawnNormalMove(px : number, py : number, x : number, y : number, 
                                team : TeamType, boardState : Piece []): boolean{
    const enemyTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
    const increment = team === TeamType.WHITE ? 1 : - 1
    if (py === y - increment && px === x){
        if (!pawnIsBlockaded(x, y, boardState)){
            return true;
        } 
    }
    if ((x === px + 1 || x === px -1) && (py === y - increment) && isFriendlyPiece(x, y, enemyTeam, boardState)) {
        return true
    } 
    return false 
} 

// Returns true if the pawn is executing an en passant move.  This move captures a piece which
// is not on the square that the pawn lands on which is unusual
export function isEnPassant(px : number, py : number, x : number, y : number,
                                 team : TeamType, boardState : Piece []): boolean{
    const enemyTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE
    const increment = team === TeamType.WHITE ? 1 : - 1
    if ((x === px + 1 || x === px -1) && (py === y - increment) && isFriendlyPiece(x, py, enemyTeam, boardState)) {
        if (checkEnPassant(x, py, boardState)){
            return true
        }
    }
    return false
}

// Promotes a pawn to a QUEEN, ROOK, BISHOP, or NIGHT
export function promotePieces(boardState : Piece []){
    const promotedPiece = boardState.find(p => p.promoted === true)
    if (promotedPiece){
        const id = boardState.indexOf(promotedPiece)
        boardState[id] = {image : IMAGE, x : promotedPiece.x,  y: promotedPiece.y, taken : false,
                    team : promotedPiece.team, type : PROMOTED_PIECE, enPassantable : false,
                    promoted : false}
    }
}