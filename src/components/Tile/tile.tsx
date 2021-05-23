import { TeamType } from '../../constants'
import PopUp from '../Promotion/promotion'
import './tile.css'

interface Props {
    number : number;
    isPromotion : boolean;
    team : TeamType
    image? : string;
}


export default function Tile({number, isPromotion, team, image}: Props){
    if (number % 2 === 0){
        if (!isPromotion){
            return <div className = 'tile black-tile'>
            {image && <div style = {{backgroundImage : `url(${image})`}} className = 'chess-piece'></div>}
            </div>
        } else {
            return <div className = 'tile black-tile'><PopUp team = {team}/></div>
        }
    } else{
        if (!isPromotion){
            return <div className = 'tile white-tile'> 
            {image && <div style = {{backgroundImage : `url(${image})`}} className = 'chess-piece'></div>}
            </div>
        } else {
            return <div className = 'tile white-tile'><PopUp team = {team}/></div>
        }
    }
    
}