import { Piece , PieceType, TeamType} from '../constants'
import Checker from './boardChecks'

export function isLegalRookMove(px : number, py : number, dx : number, dy : number, boardState : Piece[]) : boolean {
    if (dx === 0 || dy === 0){
        if (dx === 0){
            const y_dir = Math.sign(dy)
            for (let i = 1; i < Math.abs(dy); i ++){
                const obstructingPiece = boardState.find(p => p.x === px && p.y === py + i*y_dir) 
                if (obstructingPiece){
                    return false
                }
            } 
            return true
        }
        if (dy === 0){
            const x_dir = Math.sign(dx)
            for (let i = 1; i < Math.abs(dx); i ++){
                const obstructingPiece = boardState.find(p => p.x === px + i*x_dir && p.y === py) 
                if (obstructingPiece){
                    return false
                }
            } 
            return true
        }
    } 
    return false;
}

export function isLegalBishopMove(px : number, py : number, dx : number, dy : number, boardState : Piece[]) : boolean{
    if (Math.abs(dx) === Math.abs(dy)){
        const x_dir = Math.sign(dx)
        const y_dir = Math.sign(dy)
        for (let i = 1; i < Math.abs(dx); i ++){
            const obstructingPiece = boardState.find(p => p.x === px + i*x_dir && p.y === py + i*y_dir) 
            if (obstructingPiece){
                return false
            }
        } 
        return true
    } 
    return false
}
export function isLegalNightMove(px : number, py : number, dx : number, dy : number, boardState : Piece[]) : boolean{
    if ((Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1)){
        return true
    }
    return false
}
export function isLegalQueenMove(px : number, py : number, dx : number, dy : number, boardState : Piece[]) : boolean{
    const legality = isLegalRookMove(px, py, dx, dy, boardState) || isLegalBishopMove(px, py, dx, dy, boardState)
    return legality
}


export function isLegalKingMove(px : number, py : number, dx : number, dy : number, boardState : Piece[]) : boolean{
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2){
        return true
    } 
    return false
}

export function isCastleMove(px : number, py : number, dx : number, dy : number, team : TeamType,
                            boardState : Piece[]) : boolean{
    const checker = new Checker(null);
    const king = boardState.find(p => p.type === PieceType.KING && p.team === team)
    if (team === TeamType.WHITE){
        if (king?.canCastle === true && dx === - 2){
            const rook = boardState.find(p => p.x === 0 && p.y === 0)
            if (rook?.canCastle){
                if (!checker.isMyKingInCheck(team, boardState, 0) && 
                    !checker.isMyKingInCheck(team, boardState, -1) &&
                    !checker.isMyKingInCheck(team, boardState, -2)){
                        if (isLegalRookMove(king.x, king.y, -4, 0, boardState)){
                            return true
                        }
                }
            }
        } 
        if (king?.canCastle === true && dx === 2){
            const rook = boardState.find(p => p.x === 7 && p.y === 0)
            if (rook?.canCastle){
                if (!checker.isMyKingInCheck(team, boardState, 0) && 
                    !checker.isMyKingInCheck(team, boardState, 1) &&
                    !checker.isMyKingInCheck(team, boardState, 2)){
                        if (isLegalRookMove(king.x, king.y, 3, 0, boardState)){
                            return true
                        }
                }
            }
        } 
    }
    if (team === TeamType.BLACK){
        if (king?.canCastle === true && dx === - 2){
            const rook = boardState.find(p => p.x === 0 && p.y === 7)
            if (rook?.canCastle){
                if (!checker.isMyKingInCheck(team, boardState, 0) && 
                    !checker.isMyKingInCheck(team, boardState, -1) &&
                    !checker.isMyKingInCheck(team, boardState, -2)){
                        if (isLegalRookMove(king.x, king.y, -4, 0, boardState)){
                            return true
                        }
                }
            }
        } 
        if (king?.canCastle === true && dx === 2){
            const rook = boardState.find(p => p.x === 7 && p.y === 7)
            if (rook?.canCastle){
                if (!checker.isMyKingInCheck(team, boardState, 0) && 
                    !checker.isMyKingInCheck(team, boardState, 1) &&
                    !checker.isMyKingInCheck(team, boardState, 2)){
                        if (isLegalRookMove(king.x, king.y, 3, 0, boardState)){
                            return true
                        }
                    return true
                }
            }
        } 
    }
    return false
}