let squares = localStorage.getItem("squares");
let pieces = localStorage.getItem("pieces");

squares = parseInt(squares);
pieces = parseInt(pieces);

// global variables

let playerTurns = []; //this will hold the players team color
let currentPlayerTurnIndex = 0; //will turn 1 when it is the players move
let previousPlayerTurnIndex;
let currentPlayerTurnStatus = true; //true when the user has not yet played and false means played
let teamHasBonus = false; //Bonus when killed or reaches Home

let diceResult; // stores the value of the dice throw

let pathArray = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13',
  'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13',
  'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13',
  'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13'
] //contains all the paths where all the pieces can move

let homePathEntries = {
  blue: ['bh1', 'bh2', 'bh3', 'bh4', 'bh5', 'home'],
  red: ['rh1', 'rh2', 'rh3', 'rh4', 'rh5', 'home'],
  green: ['gh1', 'gh2', 'gh3', 'gh4', 'gh5', 'home'],
  yellow: ['yh1', 'yh2', 'yh3', 'yh4', 'yh5', 'home'],
} //the home paths which are coloured

let safePaths = [
  'r1', 'r9', 'g1', 'g9', 'y1', 'y9', 'b1', 'b9',
  ...homePathEntries.blue,
  ...homePathEntries.red,
  ...homePathEntries.yellow,
  ...homePathEntries.green,
] //the home paths along with some specific squares

let homePathArray = [
  ...homePathEntries.blue,
  ...homePathEntries.red,
  ...homePathEntries.yellow,
  ...homePathEntries.green,
]

// selecting the coloured boards houses

let blueBoard = document.querySelector("#blueBoard");
let redBoard = document.querySelector("#redBoard");
let yellowBoard = document.querySelector("#yellowBoard");
let greenBoard = document.querySelector("#greenBoard");

let rollDiceButton = document.querySelector(".roll");

//creating a class to store player pieces info

class PlayerPieces {

  constructor(team, position, score, homePathEntry, playerId, gameEntry) {
    this.team = team;
    this.position = position;
    this.score = score;
    this.homePathEntry = homePathEntry;
    this.playerId = playerId;
    this.gameEntry = gameEntry;

    this.status = 0; //0 means locked and 1 means that the piece is unlocked

    this.initialPosition = position; //will store the starting position of the piece which will help to return the piece to its original position if it is killed
  }

  unlockPiece() {
    this.status = 1; //it will unlock the piece
    this.position = this.gameEntry; 
    let element = document.querySelector(`[piece_id="${this.playerId}"]`); 
    let toAppendDiv = document.getElementById(this.gameEntry); 
    console.log(element);
    console.log(toAppendDiv);
    toAppendDiv.appendChild(element); 
  }

  updatePosition(position) {
    this.position = position; //will update the position of the piece 
  }

  movePiece(array) {
    let filteredArray = array;

    if(array.includes (this.homePathEntry)) { 
      let indexOfPathEntry = array.findIndex(obj=>obj === this.homePathEntry); 
      let newSlicedArray = array.slice(0,indexOfPathEntry); 
      if (newSlicedArray.length < diceResult) { 
        let remainingLength = diceResult - newSlicedArray.length; 
        let secondPart = homePathEntries [this.team].slice(0, remainingLength); 
        newSlicedArray = newSlicedArray.concat(secondPart); 
      } 

      filteredArray = newSlicedArray; 
    } 

    if (filteredArray.includes('home')) {
      teamHasBonus = true;
    }

    moveElementSequentially(this.playerId, filteredArray);
    this.score += filteredArray.length;
  }

  sentMeToBoard() {
    this.score = 0; 
    this.position = this.initialPosition;
    this.status = 0; 
    let element = document.querySelector(`[piece_id="${this.playerId}"]`); 
    let toAppendDiv = document.getElementById(this.initialPosition) ;
    toAppendDiv.appendChild(element);
  }
}


let numPvP = 2; // number of players in my game will always be 2

let playerPieces = []; //this will hold all pieces from all teams

let boardDetails = [
  { boardColor: 'blue', board: blueBoard, homeEntry: 'y13', gameEntry: 'b1' },
  { boardColor: 'red', board: redBoard, homeEntry: 'b13', gameEntry: 'r1' },
  { boardColor: 'green', board: greenBoard, homeEntry: 'r13', gameEntry: 'g1' },
  { boardColor: 'yellow', board: yellowBoard, homeEntry: 'g13', gameEntry: 'y1' }
]

for (let i = 0; i < 4; i++) {
  let boardColor = boardDetails[i].boardColor;
  let homeEntry = boardDetails[i].homeEntry;
  let gameEntry = boardDetails[i].gameEntry;
  const parentDiv = document.createElement('div');

  for (let j = 0; j < pieces; j++) { 
    const span = document.createElement('span');
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-location-pin', 'piece', `${boardColor}-piece`);

    icon.addEventListener('click', (e) => {
      turnForUser(e);
    });

    let pieceID = `${boardColor}${j}`;
    let position = `${j}_${boardColor}`;

    const player = new PlayerPieces(boardColor, position, 0, homeEntry, pieceID, gameEntry);
    span.setAttribute('id', position);
    icon.setAttribute('piece_id', pieceID);
    playerPieces.push(player);
    span.appendChild(icon);
    parentDiv.appendChild(span);
  }
  boardDetails[i].board.appendChild(parentDiv);
}

const redSpans = document.querySelectorAll('#redBoard span i');
const blueSpans = document.querySelectorAll('#blueBoard span i');
const greenSpans = document.querySelectorAll('#greenBoard span i');
const yellowSpans = document.querySelectorAll('#yellowBoard span i');

for (let i = pieces; i < 4; i++) {
  if (redSpans[i]) redSpans[i].remove();
  if (yellowSpans[i]) yellowSpans[i].remove();
  if (blueSpans[i]) blueSpans[i].remove();
  if (greenSpans[i]) greenSpans[i].remove();
}


if (numPvP === 2) {
  playerTurns = ['blue', 'green'];
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const setPlayerTurn = (playerTurnIndex) => {
  if (playerTurnIndex === undefined || playerTurnIndex === null) return;

 
  boardDetails.forEach(detail => {
    detail.board.classList.remove("active");
  });

  let currentTeamTurn = playerTurns[playerTurnIndex];
  let boardDetailObject = boardDetails.find(obj => obj.boardColor === currentTeamTurn);

  if (boardDetailObject?.board) {
    boardDetailObject.board.classList.add("active");
  }
};


setPlayerTurn(0);

const nextTeamTurn = async () => {
  previousPlayerTurnIndex = currentPlayerTurnIndex;

  if (currentPlayerTurnIndex === (playerTurns.length - 1)) {
    currentPlayerTurnIndex = 0;
  } else {
    currentPlayerTurnIndex += 1;
  }

  setPlayerTurn(previousPlayerTurnIndex);
  setPlayerTurn(currentPlayerTurnIndex);

  await delay(500);
  if (playerTurns[currentPlayerTurnIndex] !== 'blue') {
    rollDiceButtonForBot();
  }
}

const giveArrayForMovingPath = (piece) => {
  let indexOfPath;
  let movingArray = [];

  if (!pathArray.includes(piece.position)) {
    indexOfPath = homePathEntries[piece.team].findIndex(elem => elem === piece.position);
    let homePathArrayForPiece = homePathEntries[piece.team];
    for (let i = 0; i < diceResult; i++) {
      if (indexOfPath + 1 < homePathArrayForPiece.length) {
        indexOfPath += 1;
        movingArray.push(homePathArrayForPiece[indexOfPath]);
      } else {
        break; 
      }
    }
  } else {
    indexOfPath = pathArray.findIndex(elem => elem === piece.position);

    for (let i = 0; i < diceResult; i++) {
      indexOfPath = (indexOfPath + 1) % pathArray.length;
      movingArray.push(pathArray[indexOfPath]);
    }
  }
  return movingArray;
}

const moveElementSequentially = (elementId, array)=>{
  const elementToMove = document.querySelector(`[piece_id="${elementId}"]`); 
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex]; 
  let piece = playerPieces.find(obj=> obj.playerId === elementId); 
  let toBreak = false; 

  function moveToNextTarget(index) { 
    if (index >= array.length) return; 

    const currentTarget = document.getElementById(array[index]); 
    if (array[index] === 'home') { 
      let indexOfPiece = playerPieces.findIndex(obj => obj.playerId === piece.playerId); 
      playerPieces.splice(indexOfPiece, 1); 
      elementToMove.remove(); 
      toBreak = true; 

      let totalPiecesOfThisTeam = playerPieces.filter(obj => obj.team === currentTeamTurn);
      if(totalPiecesOfThisTeam.length === 0){
        declareWinner(currentTeamTurn);
        return;
      }

      if (currentTeamTurn === 'blue') { 
        currentPlayerTurnStatus = true; 
      } else{
        rollMyDice(true);
      }
      return;
    }

    piece.updatePosition(array[index]);

    currentTarget.appendChild(elementToMove);

    setTimeout(() => {
      moveToNextTarget(index+1);
    }, 170);
  }

  !toBreak && moveToNextTarget(0);
}

const rollMyDice = async (hasBonus)=>{
  currentPlayerTurnStatus = true;
  await delay(700);  
  if (diceResult === 6 || hasBonus || teamHasBonus) { 
    rollDiceButtonForBot(); 
  }else{  
    nextTeamTurn(); 
      if(playerTurns[currentPlayerTurnIndex] !== 'blue') rollDiceButtonForBot(); 
  }
} 

const moveMyPiece = async(piece)=>{ 
  let array = giveArrayForMovingPath(piece); 

  if ((array.length < diceResult)) { 
    await delay(500);
    currentPlayerTurnStatus = true;
    nextTeamTurn();
    return false;  
  } 
  piece.movePiece(array); 
  await delay(array.length* 175);  
  rollMyDice(); 
  return true;
}

const giveEnemiesBehindMe = (piece)=>{ 
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex]; 
  let indexOfPath = pathArray.findIndex(elem => elem === piece.position);  
  if (indexOfPath === -1) { 
    return 0; 
  }  
  let lastSixPath = [];  
  for (let i= 6; i > 0; i--) { 
    let index = (indexOfPath - i + pathArray.length) % pathArray.length; 
    lastSixPath.push(pathArray[index]); 
  } 
  let opponentsOnPath = playerPieces.filter(obj=> lastSixPath.includes (obj.position) && obj.team !== currentTeamTurn); 
  return opponentsOnPath.length;
} 

const attemptMove = async(piece)=>{ 
  if (!await moveMyPiece(piece)) { 
    return false;  
  } 
  return true; 
}

const turnForBot = async()=>{ 
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex]; 
  let totalUnlockedPieces = playerPieces.filter(obj=>obj.team === currentTeamTurn && obj.status === 1); 
  let totalPiecesOfThisTeam = playerPieces.filter(obj=>obj.team === currentTeamTurn).length; 
  let isMoving = false; 
  
  if (totalUnlockedPieces.length === 0 && diceResult !== 6) { 
    rollMyDice(); 
    return; 
  } 
  
  currentPlayerTurnStatus = true; 
  let piece_team = playerPieces.filter(obj => obj.team === currentTeamTurn);

  //zero unlocked pieces
  if (totalUnlockedPieces.length === 0 && diceResult === 6) { 
    piece_team[0].unlockPiece();
    rollMyDice();
    return; 
  } 

  //logic for kill detection
  let opponentPieces= playerPieces.filter(obj=> obj.team !== currentTeamTurn && obj.status === 1); 
  let bonusReached = false; 
  for (let i = 0; i < totalUnlockedPieces.length; i++) { 
    if (bonusReached) { 
      break;
    }
    let array = giveArrayForMovingPath(totalUnlockedPieces[i]); 
    let cut = opponentPieces.find(obj => obj.position === array[array.length - 1] && !safePaths.includes(obj.position)); 
    let homeBonusReached = array[array.length-1] === 'home'; //If the last path is home 
    if (cut){ 
      totalUnlockedPieces[i].movePiece(array); 
      await delay(array.length*175); 
      cut.sentMeToBoard(); 
      bonusReached = true; 
      rollMyDice(true);  
      return;
    }
    if (homeBonusReached) {
      totalUnlockedPieces[i].movePiece(array); 
      await delay(array.length*175);
      bonusReached = true;
      rollMyDice(true);
      return;
    }    
  }

  if(bonusReached){
    return;
  }
  
  let lockedPieces = playerPieces.filter(obj=> obj.team === currentTeamTurn && obj.status === 0); 

  //1 unlocked piece
  if (totalUnlockedPieces.length === 1) { 
    if (totalUnlockedPieces.length <= (pieces - 1) && diceResult === 6) { 
      lockedPieces[0].unlockPiece(); 
      rollMyDice();
      return;
    }
    let piece = totalUnlockedPieces.find(obj => obj.status === 1);
    if(!await attemptMove(piece)) {
      rollMyDice();
    }
    return;
  }

  //two pieces unlocked
  if (totalUnlockedPieces.length === 2){
    if(totalUnlockedPieces.length <= (pieces - 1) && diceResult === 6 && totalPiecesOfThisTeam >= (pieces - 1)){
      lockedPieces[0].unlockPiece();
      rollDiceButtonForBot();
      return;
    }

    let pieceSafe =  totalUnlockedPieces.filter(obj => safePaths.includes(obj.position));
    let pieceUnSafe =  totalUnlockedPieces.filter(obj => !safePaths.includes(obj.position));

    if(pieceSafe.length === 0){
      let scoreOfFirstPiece = pieceUnSafe[0].score;
      let scoreOfSecondPiece = pieceUnSafe[1].score;

      if(scoreOfSecondPiece > scoreOfFirstPiece){
        if(!await attemptMove(pieceUnSafe[1])) {
          rollMyDice();
        }
        return;
      }else{
        if(!await attemptMove(pieceUnSafe[0])) {
          rollMyDice();
        }
        return;
      }
    }

    if(pieceSafe.length === 1){
      if(!await attemptMove(pieceUnSafe[0])) {
        rollMyDice();
      }
      return;
    }

    if(pieceSafe.length === 2 && (pieceSafe[0].position === pieceSafe[1].position)){
      if(!await attemptMove(pieceSafe[0])) {
        rollMyDice();
      }
      return;
    }

    if(pieceSafe.length === 2){
      let scoreOfFirstPiece = pieceSafe[0].score;
      let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);

      let scoreOfSecondPiece = pieceSafe[1].score;
      let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]);

      if(opponentsBeforeFirstPiece > opponentsBeforeSecondPiece){
        if(!await attemptMove(pieceSafe[1])) {
          rollMyDice();
        }
        return;
      } else if(opponentsBeforeSecondPiece > opponentsBeforeFirstPiece){
        if(!await attemptMove(pieceSafe[0])) {
          rollMyDice();
        }
        return;
      } else if(opponentsBeforeSecondPiece === opponentsBeforeFirstPiece){
        if(scoreOfFirstPiece > scoreOfSecondPiece){
          if(!await attemptMove(pieceSafe[0])) {
            rollMyDice();
          }
          return;
        }else{
          if(!await attemptMove(pieceSafe[1])) {
            rollMyDice();
          }
          return;
        }
      }
    }
  }

  //3 pieces unlocked
  if (totalUnlockedPieces.length === 3) { 

    let pieceSafe = totalUnlockedPieces.filter(obj => safePaths.includes (obj.position)); 
    let pieceUnSafe = totalUnlockedPieces.filter(obj => !safePaths.includes (obj.position));  

    if (pieceSafe.length === 0) { 

      let scoreOfFirstPiece = pieceUnSafe[0].score; 
      let scoreOfSecondPiece = pieceUnSafe [1].score;  
      let scoreOfThirdPiece = pieceUnSafe[2].score;  

      let greatestScore = Math.max(scoreOfFirstPiece, scoreOfSecondPiece, scoreOfThirdPiece); 
      let movingPiece = pieceUnSafe.find(obj => obj.score === greatestScore); 
      if(!await attemptMove(movingPiece)) {
        rollMyDice();
      }
      return;
    }
    
    if (pieceSafe.length === 1) { //1 piece is safe and other 2 are unsafe 
      let scoreOfFirstPiece = pieceUnSafe[0].score; 
      let scoreOfSecondPiece = pieceUnSafe [1].score; 
      if (scoreOfSecondPiece > scoreOfFirstPiece) { 
        if(!await attemptMove(pieceUnSafe[1])) {
          rollMyDice();
        }
        return;
      }else{ 
        if(!await attemptMove (pieceUnSafe[0])) {
          rollMyDice();
        }
        return;
      }  
    }  

    if (pieceSafe.length === 3 && pieceSafe [0].position === pieceSafe [1].position && pieceSafe[1].position === pieceSafe[2].position) { 
      if(!await attemptMove (pieceSafe[0])) {
        rollMyDice();
      }
      return;
    }

    if (pieceSafe.length === 2) { 
      if(!await attemptMove (pieceUnSafe[0])) {
        rollMyDice();
      }
      return;
    } 

    if (pieceSafe.length === 3) {  
      let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);   
      let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]); 
      let opponentsBeforeThirdPiece = giveEnemiesBehindMe(pieceSafe[2]); 

      if ((opponentsBeforeFirstPiece > opponentsBeforeSecondPiece) && (opponentsBeforeFirstPiece > opponentsBeforeThirdPiece)) { 
        if(!await attemptMove (pieceSafe [0])) {
          rollMyDice();
        }
        return;
      }else if(opponentsBeforeSecondPiece > opponentsBeforeFirstPiece && opponentsBeforeSecondPiece > opponentsBeforeThirdPiece) { 
        if(!await attemptMove (pieceSafe[1])) {
          rollMyDice();
        }
        return;
      }else if (opponentsBeforeThirdPiece > opponentsBeforeFirstPiece && opponentsBeforeThirdPiece > opponentsBeforeSecondPiece) { 
        if(!await attemptMove (pieceSafe[2])) {
          rollMyDice();
        }
        return;
      }else{
        let piecesAtHomePath = piece_team.filter((obj)=> obj.status === 1 && homePathArray.includes(obj.position)); 
        let piecesNotAtHomePath = piece_team.filter((obj)=> obj.status === 1 && !homePathArray.includes(obj.position)); 
        
        piecesNotAtHomePath.sort((a,b)=> a.score - b.score); 

        if (piecesNotAtHomePath.length > 0) {  
          if(!await attemptMove(piecesNotAtHomePath[0])) {
            rollMyDice();
          }
          return;
        }else{ 
          for (let i = 0; i < piecesAtHomePath.length; i++) { 
            let movingPathArray = giveArrayForMovingPath(piecesAtHomePath[i]); 
            if (movingPathArray.length === diceResult){
              isMoving = true;
              moveMyPiece(piecesAtHomePath[i]); 
              break;
            } 
          } 
        } 
      } 
    }
    
    if(!isMoving){
      rollMyDice();
    }
  } 

  //4 pieces unlocked
  if (totalUnlockedPieces.length === 4) {
    if(!await attemptMove(totalUnlockedPieces[0])) {
      rollMyDice();
    }
  }
}


const turnForUser = async (e) => {

  let isUserTurn = playerTurns[currentPlayerTurnIndex] === 'blue';
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

  //return user if user has used its chance or the current turn is not for user
  if (!isUserTurn || currentPlayerTurnStatus) {
    return
  }
  let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1).length;

  let pieceId = e.target.getAttribute('piece_id');
  let piece = playerPieces.find(obj => obj.playerId === pieceId && obj.team === currentTeamTurn);
  let array = giveArrayForMovingPath(piece); 
    
  let opponentPieces = playerPieces.filter(obj => obj.team !== currentTeamTurn && obj.status === 1);
  let cut = opponentPieces.find(obj => obj.position === array[array.length-1] && !safePaths.includes(obj.position)); 
  

  if (cut) { 
    piece.movePiece(array); 

    await delay(array.length*175); 

    cut.sentMeToBoard(); 
    currentPlayerTurnStatus = ture; 
    return;
  }


  if (!piece) {
    console.log('Piece not found for ID:', pieceId, 'and team:', currentTeamTurn); //will be commented out later
    return;
  }

  if ((array.length < diceResult)) { 
    await delay(500);
    currentPlayerTurnStatus = true;
    nextTeamTurn();
    return false;  
  } 

  if(diceResult === 6){
    currentPlayerTurnStatus = true;
    if(piece.status === 0){
      piece.unlockPiece();
      return;
    }
    piece.movePiece(array);
  }else{
    if(piece.status === 0) {
      return;
    }
    currentPlayerTurnStatus = true;
    piece.movePiece(array);
    if(!teamHasBonus){
      nextTeamTurn();
    }
  }
}

//for user

rollDiceButton.addEventListener('click', async () => {
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

  if (!currentPlayerTurnStatus) return; //return if the user has used chance

  rollDiceButton.disabled = true; //disable the button
  diceResult = Math.floor(Math.random() * 6) + 1; //generate a random number between 1 and 6
  
  currentPlayerTurnStatus = false; //user used its chance
  teamHasBonus = false;

  setTimeout(async () => {
    await delay(700);
    rollDiceButton.disabled = false; 
    let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1);

    if ((totalUnlockedPieces.length === 0 && diceResult !== 6 && !teamHasBonus)) {
      await delay(500);
      currentPlayerTurnStatus = true;
      nextTeamTurn();
    }
  }, 600);
});

//for bot

const rollDiceButtonForBot = () => {

  if (!currentPlayerTurnStatus) return; //return if the user has used chance

  rollDiceButton.disabled = true; //disable the button
  diceResult = Math.floor(Math.random() * 6) + 1; //generate a random number between 1 and 6
  currentPlayerTurnStatus = false; 
  teamHasBonus = false;

  setTimeout(async () => {
    rollDiceButton.disabled = false; 
    turnForBot();
  }, 600);
}


const declareWinner = (team)=>{ 
  let parentDiv = document.createElement('div'); 
  let childDiv = document.createElement('div'); 
  let h1 = document.createElement('h1'); 
  let button = document.createElement('button'); 

  parentDiv.setAttribute('id', 'declaredWinner'); 
  h1.textContent = `${team} Won The Game!`; 
  button.textContent = 'Play Again'; 

  button.addEventListener('click', ()=>{ 
    location.reload(); 
  })  

  childDiv.append(h1); 
  childDiv.append(button); 
  parentDiv.append(childDiv);
  document.body.append(parentDiv);
}
