/*
This function updates the Piece [] so that the piece moves to its new location. It
also handles the case where a piece is taken and when a ROOK is teleported via 
the castling move.
*/



import { Piece } from '../constants'

export function executeMove (px : number, py : number, x : number, y: number, boardState : Piece []){
    const takenPiece = boardState.find(p => p.taken === true)
    if (takenPiece){
        takePiece(takenPiece, boardState)
    }
    const teleportedPiece = boardState.find(p => p.teleported === true)
    if (teleportedPiece){
        teleportPiece(teleportedPiece)
    }
    const currentPiece = boardState.find(p => p.x === px && p.y === py) 
    if (currentPiece){
        currentPiece.x = x
        currentPiece.y = y
    }
}


function takePiece(p : Piece, boardState : Piece []){
    const id2 = boardState.indexOf(p)
    boardState.splice(id2, 1)
}

function teleportPiece(p : Piece){
    let tele = 0;
    if (p.x === 7){  
        tele = -2
    } else {
        tele = 3
    }
    p.x = p.x + tele
    p.teleported = false
}