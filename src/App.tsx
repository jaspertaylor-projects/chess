// TODO
/*
Would be nice to implement a backend and make the game multiplayer across devices
*/

// NOTES
/*
Throughout the code variables with the names px, py are meant to be read as 
previous x, and previous y respectively.
*/


import './App.css';
import Chessboard from './components/Chessboard/chessboard';


function App() {
  return (
      <div id = 'App'>
        <Chessboard></Chessboard>
      </div>
  );
}

export default App;
