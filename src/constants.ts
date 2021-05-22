export const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f',   'g', 'h'];
export const VERTICAL_AXIS = [1,2,3,4,5,6,7,8];
export const AXIS = [0,1,2,3,4,5,6,7];
export const GRID_SIZE = 100

export interface Piece {
    image: string;
    x : number; 
    y : number; 
    type : PieceType;
    team : TeamType;
    enPassantable? : boolean;
    taken? : boolean;
    teleported? : boolean;
    canCastle? : boolean;
    promoted? : boolean;
}

export enum TeamType{
    WHITE,
    BLACK
}

export enum PieceType {
    PAWN,
    BISHOP, 
    NIGHT, 
    ROOK,
    QUEEN,
    KING,
}

export function initializeBoardState() : Piece []{
    const state : Piece[] = []
    for (let p = 0; p < 2; p ++){
        const type = p === 0 ? 'b': 'w';
        const team = p === 0 ? TeamType.BLACK : TeamType.WHITE;
        const y = p === 0 ?  7 : 0;
        // Rooks
        state.push({image : `assets/images/rook_${type}.png`, x : 0,  y, team, type : PieceType.ROOK, enPassantable : false, canCastle : true})
        state.push({image : `assets/images/rook_${type}.png`, x : 7,  y, team, type : PieceType.ROOK, enPassantable : false, canCastle : true})

        // Nights
        state.push({image : `assets/images/night_${type}.png`, x : 1,  y, team, type : PieceType.NIGHT, enPassantable : false})
        state.push({image : `assets/images/night_${type}.png`, x : 6,  y, team, type : PieceType.NIGHT, enPassantable : false})

        // Bishops
        state.push({image : `assets/images/bishop_${type}.png`, x : 2,  y, team, type : PieceType.BISHOP, enPassantable : false})
        state.push({image : `assets/images/bishop_${type}.png`, x : 5,  y, team, type : PieceType.BISHOP, enPassantable : false})

        // Queens
        state.push({image : `assets/images/queen_${type}.png`, x : 3,  y, team, type : PieceType.QUEEN, enPassantable : false})
        // Kings
        state.push({image : `assets/images/king_${type}.png`, x : 4,  y, team, type : PieceType.KING, enPassantable : false, canCastle : true})

    }

    // Pawns
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++){
        state.push({image : 'assets/images/pawn_b.png', x : i, y : 6, team : TeamType.BLACK, type : PieceType.PAWN, enPassantable : false})
    }
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++){
        state.push({image : 'assets/images/pawn_w.png', x : i, y : 1, team : TeamType.WHITE, type : PieceType.PAWN, enPassantable : false})
    }
    return state
}
