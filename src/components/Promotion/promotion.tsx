/* This is a function that is used to manage the promotion of pawns to other pieces
 and displays a grid of 4 buttons that will promote to either a QUEEN ROOK NIGHT or BISHOP
*/

import './promotion.css'
import {useState} from 'react';
import {PieceType, TeamType } from '../../constants'


export let IMAGE : string = `assets/images/queen_w.png`
export let PROMOTED_PIECE = PieceType.QUEEN
export let CLICKED = true

interface Props {
    team : TeamType
}

export default function PopUp({team} : Props){
    const [chosen, setChosen] = useState<string | null>(null)
    const wb = team === TeamType.WHITE ? 'w' : 'b';
    const qURL = `assets/images/queen_${wb}.png`
    const bURL = `assets/images/bishop_${wb}.png`
    const nURL = `assets/images/night_${wb}.png`
    const rURL = `assets/images/rook_${wb}.png`

    
    function giveQueen(){
        IMAGE = qURL
        PROMOTED_PIECE = PieceType.QUEEN 
        CLICKED = true
        setChosen(qURL)

    }
    function giveNight(){
        IMAGE = nURL
        PROMOTED_PIECE = PieceType.NIGHT 
        CLICKED = true
        setChosen(nURL)
    }
    function giveBishop(){
        IMAGE = bURL
        PROMOTED_PIECE = PieceType.BISHOP
        CLICKED = true
        setChosen(bURL)
    }
    function giveRook(){
        IMAGE = rURL
        PROMOTED_PIECE = PieceType.ROOK 
        CLICKED = true
        setChosen(rURL)
    }
    if (!chosen){
        CLICKED = false
        return <div className = 'popUp' > 
        <button className = 'promote-button' style = {{backgroundImage : `url(${qURL})`}} onClick = {giveQueen}></button>
        <button className = 'promote-button' style = {{backgroundImage : `url(${nURL})`}} onClick = {giveNight}></button>
        <button className = 'promote-button' style = {{backgroundImage : `url(${bURL})`}} onClick = {giveBishop}></button>
        <button className = 'promote-button' style = {{backgroundImage : `url(${rURL})`}} onClick = {giveRook}></button>
        </div>
    } else {
        return <div className = 'popUp' > 
        <div style = {{backgroundImage : `url(${chosen})`}} className = 'promoted'></div>
        </div>
    }
 }

