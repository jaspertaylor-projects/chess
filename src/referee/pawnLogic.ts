import { Piece, TeamType } from '../constants'

function pawnIsBlockaded(x : number, y: number, boardState : Piece []): boolean {
    const piece = boardState.find(p => p.x === x && p.y === y) 
    const occupied =  piece ? true : false
    return occupied
}

function checkEnPassant (x : number, y : number, boardState : Piece []) : boolean {
    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece && piece.enPassantable){
        return piece.enPassantable  
    } return false
}




export function setEnPassant(px : number, py : number, boardState : Piece []){
        boardState.forEach(p => {
            if (p.x === px && p.y === py){
                p.enPassantable = true
            } else{
                p.enPassantable = false
            }
        })
    }

export function unsetEnPassant( boardState : Piece []){
    boardState.forEach(p => {
            p.enPassantable = false
    })
}

export function isFriendlyPiece(x : number, y: number, team : TeamType, boardState : Piece []): boolean {
    const piece = boardState.find(p => p.x === x && p.y === y)
    const occupied =  piece && piece.team === team ? true : false
    return occupied
}

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