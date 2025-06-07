//accessing the data entered in the login page

let squares = localStorage.getItem("squares");
let pieces = localStorage.getItem("pieces");

squares = parseInt(squares);
pieces = parseInt(pieces);

//creating the board

let board = document.querySelector("#board");
let blueHouse = document.querySelector("#blue");
let redHouse = document.querySelector("#red");
let yellowHouse = document.querySelector("#yellow");
let greenHouse = document.querySelector("#green");
let movement1 = document.querySelectorAll(".movement1");
let movement2 = document.querySelectorAll(".movement2");

let boxes = ((squares - 1) / 2) * 3;

for (let j = 0; j < 2; j++) {
  for (let i = 0; i < boxes; i++) {
    let sq = document.createElement("div");
    sq.classList.add("square");
    movement2[j].appendChild(sq);
    sq.style.height = 192 / 3 + "px";
    sq.style.width = 192 / ((squares - 1) / 2) + "px";
    sq.style.backgroundColor = "#fdf0d5";
    sq.style.border = "1px solid black";
    sq.style.borderRadius = "3px";
    sq.setAttribute("id", `square${i + 1}`);
  }
}

for (let j = 0; j < 2; j++) {
  for (let i = 0; i < boxes; i++) {
    let sq = document.createElement("div");
    sq.classList.add("square");
    movement1[j].appendChild(sq);
    sq.style.width = 192 / 3 + "px";
    sq.style.height = 192 / ((squares - 1) / 2) + "px";
    sq.style.backgroundColor = "#fdf0d5";
    sq.style.border = "1px solid black";
    sq.style.borderRadius = "3px";
    sq.setAttribute("id", `square${i + 1}`);
  }
}


//coloring the road to the home squares

let yellow = document.querySelector("#yellow");
let green = document.querySelector("#green");
let red = document.querySelector("#red");
let blue = document.querySelector("#blue");

let allsq = document.querySelectorAll(".square");

allsq.forEach(square => {
  let parentId = square.parentElement.id;
  for (let i = (squares - 1) / 2 + 1; i <= squares - 2; i++){
    if (square.id === `square${i}`) {
      if (parentId === "yellow") {
        square.style.backgroundColor = "rgb(196, 238, 9)";
      } else if (parentId === "green") {
        square.style.backgroundColor = "rgb(11, 224, 11)";
      } else if (parentId === "red") {
        square.style.backgroundColor = "rgb(238, 57, 25)";
      } else if (parentId === "blue") {
        square.style.backgroundColor = "rgb(39, 84, 230)";
      }
    }
  }
})

//creating pieces

let redpiecekeep = document.querySelectorAll(".redpiecekeep");
let yelpiecekeep = document.querySelectorAll(".yelpiecekeep");

for (let i = 0; i < pieces; i++) {
  let redtoken = document.createElement("div");
  redtoken.classList.add("redtoken");
  redtoken.setAttribute("id", `redtoken${i + 1}`);
  redtoken.style.width = "40px";
  redtoken.style.height = "40px";
  redtoken.style.borderRadius = "50%";
  redtoken.style.backgroundColor = "red";
  redpiecekeep[i].appendChild(redtoken);
  redtoken.addEventListener('click', (e) => {

  });

  let yellowtoken = document.createElement("div");
  yellowtoken.classList.add("yellowtoken");
  yellowtoken.setAttribute("id", `yellowtoken${i + 1}`);
  yellowtoken.style.width = "40px";
  yellowtoken.style.height = "40px";
  yellowtoken.style.borderRadius = "50%";
  yellowtoken.style.backgroundColor = "yellow";
  yelpiecekeep[i].appendChild(yellowtoken);
}


//numbering each square

allsq.forEach((square, index) => {
  let number = document.createElement("span");
  number.textContent = index + 1;
  number.style.fontSize = "10px";
  number.style.color = "black";
  square.appendChild(number);
});

//home roads


let redHomeRoad = document.querySelectorAll("#redHomeRoad");
let yellowHomeRoad = document.querySelectorAll("#yellowHomeRoad");
let greenHomeRoad = document.querySelectorAll("#greenHomeRoad");
let blueHomeRoad = document.querySelectorAll("#blueHomeRoad");

// safe squares 

let sfsq = [[((squares-1)/2) - 2, (((squares-1)/2) - 2) + squares], 
          [((((squares-1)/2)*4) - 2), ((((squares-1)/2)*4) - 2) + squares],
          [((((squares-1)/2)*9) - 2), ((((squares-1)/2)*9) - 2) - (squares-2)], 
          [((((squares-1)/2)*12) - 2), ((((squares-1)/2)*12) - 2) - (squares-2)]];


allsq.forEach(sqr => {
    for(let i = 0; i < sfsq.length; i++){
      if(sfsq[i][0] === Number(sqr.innerText)){
        let icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-star"); 
        icon.style.fontSize = "26px";
        sqr.appendChild(icon);
      }
      if(sfsq[i][1] === Number(sqr.innerText)){
        let parentId = sqr.parentElement.id;
        if (parentId === "yellow") {
          sqr.style.backgroundColor = "rgb(196, 238, 9)";
        } else if (parentId === "green") {
          sqr.style.backgroundColor = "rgb(11, 224, 11)";
        } else if (parentId === "red") {
          sqr.style.backgroundColor = "rgb(238, 57, 25)";
        } else if (parentId === "blue") {
          sqr.style.backgroundColor = "rgb(39, 84, 230)";
        }
      }
    }
})

//adding tabindex to squares

// let homeroute = [];
// for (let i = (squares - 1) / 2 + 1; i <= squares - 2; i++) {
//   homeroute.push(i);
// }

// let lastSquare = Math.round(3.5 * squares - 1.5);
// let tabindex = lastSquare;
// let redCount = 0;

// allsq.forEach(square => {
//   let parentId = square.parentElement.id;
//   if (parentId === "red") {
//     let idNum = parseInt(square.id.replace("square", ""));
//     if (!homeroute.includes(idNum)) {
//       if (redCount < (squares - 1) / 2) {
//         square.setAttribute("tabindex", tabindex);
//         tabindex++;
//         redCount++;
//       }
//     }
//   }
// });

//hiding the numbers on the squares

num = document.querySelectorAll("span");
num.forEach(n => {
    n.style.visibility = "hidden";
})

//GAME LOGIC

let E1 = document.querySelectorAll("#square5");
let E2 = document.querySelectorAll("#square17");

bEntry = E1[0]; //blue entry point
rEntry = E2[0]; //red entry point
gEntry = E1[1]; //green entry point
yEntry = E2[1]; //yellow entry point

let H = document.querySelectorAll("#square6");

let RH = H[0]; //red home entry point
let GH = H[1]; //green home entry point
let BH = H[2]; //blue home entry point
let YH = H[3]; //yellow home entry point

let playerTurn = []; //this will hold theplayers team color
let currentPlayerTurnIndex = 0;
let previousPlayerTurnIndex;
let currentPlayerTurnStatus = true; //true when the user has not yet played
let teamHasBonus = false; //Bonus when killed or reaches Home

let diceResult;

let pathArray = [];
allsq.forEach(square => {
  if(!homePathEntries.includes(square)){
    pathArray.push(square);
  }
});

let home = document.querySelector("#Home");

let homePathEntries = {};
let yl = [home];
let bl = [home];
let rd = [home];
let gr = [home];

allsq.forEach(square => {
  let parentId = square.parentElement.id;
  for (let i = (squares - 1) / 2 + 1; i <= squares - 2; i++){
    if (square.id === `square${i}`) {
      
      if (parentId === "yellow") {
        yl.push(square);
      } else if (parentId === "green") {
        gr.push(square);
      } else if (parentId === "red") {
        rd.push(square);
      } else if (parentId === "blue") {
        bl.push(square);
      }
    }
  }
})

homePathEntries['yellow'] = yl;
homePathEntries['blue'] = bl;
homePathEntries['green'] = gr;
homePathEntries['red'] = rd;

let safepaths = [
  sfsq,
  ...homePathEntries.blue,
  ...homePathEntries.red,
  ...homePathEntries.yellow,
  ...homePathEntries.green,
]

let homePathArray = [
  ...homePathEntries.blue,
  ...homePathEntries.red,
  ...homePathEntries.yellow,
  ...homePathEntries.green,
]



class Player_Piece{

  constructor(team, position, score, homePathEntry, playerId, gameEntry){
    this.team = team; //team color
    this.position = position; //current position on the board
    this.score = score; //score of the player
    this.homePathEntry = homePathEntry; //entry point to the home path
    this.playerId = playerId; //unique identifier for the player
    this.gameEntry = gameEntry; //entry point for the game

    this.status = 0; //initially it is 0 means it is locked and 1 means it is unlocked
  }

   unlockPiece() {
    this.status = 1; //unlock the piece
   }

   updatePosition(position) {
    this.position = position; //update the position of the piece
   }

   movePiece(array){
    //function to move the piece
   }

   sentmeToBoard(){

   }
}

numPvP = 2;

let playerPieces = []; //this will hold all pieces from all teams
let boardDetails = [
  {boardColor: 'blue', board: blue, homeEntry: BH, gameEntry: bEntry,},
  {boardColor: 'red', board: red, homeEntry: RH, gameEntry: rEntry,},
  {boardColor: 'green', board: green, homeEntry: RH, gameEntry: rEntry,},
  {boardColor: 'yellow', board: yellow, homeEntry: YH, gameEntry: yEntry,}
]

if (numPvP === 2){
  playerTurn = ['yellow', 'red'];
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const setPlayerTurn = (playerTurnIndex) => {
  if (!playerTurnIndex){
    return;
  }

  let currentTeamTurn = playerTurn[playerTurnIndex];
  //filtering the board details array and finding the currentTeamTurn object
  let boardDetailObject = boardDetails.filter(obj => obj.boardColor === currentTeamTurn);
  boardDetailObject[0].board.classList.toggle("active");
}

setPlayerTurn(0);

const nextTeamTurn = async() => {
  prevPlayerTurnIndex = currentPlayerTurnIndex;

  if(currentPlayerTurnIndex === (playerTurns.length - 1)){
    currentPlayerTurnIndex = 0;;
  }else{
    currentPlayerTurnIndex+=1;
  }

  setPlayerTurn(prevPlayerTurnIndex);
  setPlayerTurn(currentPlayerTurnIndex);
  await delay(500);
  if(playerTurns[currentPlayerTurnIndex]!=='yellow'){
    rollDiceButtonForBot();
  }
}

// const giveArrayForMovingPath = (piece) => {
//   let indexOfPath;
//   let movingArray = [];

//   if(!pathArray.includes(piece.position)){
//     indexOfPath = homePathEntries[piece.team].findIndex(elem => elem===piece.position);
//     let homePathArrayForTeam = homePathEntries[piece.team]; 

//     for (let i = 0; i < diceResult; i++) {
//       if (indexOfPath + 1 < homePathArrayForPiece[indexOfPath]){
//         indexOfPath+=1;
//         movingArray.push(homePathArrayForPiece[indexOfPath]);
//       }else{
//         break; //exit the loop if the end of the home path array is reached
//       }
//     }
//   }else{
//     indexOfPath = pathArray.findIndex(elem ==> )
//   }
// }

const turnForUser = async(e) => {

  let isUserTurn = playerTurns[currentPlayerTurnIndex] === 'yellow';
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

  //return user if user has used its chance or the current turn is not for user
  if(!isUserTurn|| currentPlayerTurnStatus){
    return
  }
  //if user has any unlocked pieces
  let totalUnlockedPieces = playerPieces.filter(obj=>obj.team ===currentTeamTurn && obj.status === 1).length;

  let piece = playerPieces.find((obj=> obj.id === e.target.getAttributes('piece_id') && obj.team === currentTeamTurn));

  let array = giveArrayForMovingPath();
}


RollDiceButton = document.querySelector("#RollBtn");
RollDiceButton.addEventListener('click', async() => {
  let currentTeamTurn = playerTurn[currentPlayerTurnIndex];

  if(!currentPlayerTurnStatus) return; //return if the user has used chance

  RollDiceButton.disabled = true; //disable the button
  diceResult = Math.floor(Math.random() * 6) + 1; //generate a random number between 1 and 6
  currentPlayerTurnStatus = false; //user used its chance
  teamHasBonus = false;

  setTimeout(async() => {
    RollDiceButton.disabled = false; //enable the button after 600ms
    let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1);

    if((totalUnlockedPieces.length === 0 && diceResult !==6 && !teamHasBonus)){
      await delay(500);
      currentPlayerTurnStatus = true;
      nextTeamTurn();
    }
  }, 600);
});

const rollDiceButtonForBot = () => {
  let currentTeamTurn = playerTurn[currentPlayerTurnIndex];

  if(!currentPlayerTurnStatus) return; //return if the user has used chance

  RollDiceButton.disabled = true; //disable the button
  diceResult = Math.floor(Math.random() * 6) + 1; //generate a random number between 1 and 6
  currentPlayerTurnStatus = false; //user used its chance
  teamHasBonus = false;

  setTimeout(async() => {
    RollDiceButton.disabled = false; //enable the button after 600ms
    //turnforbot()
  }, 600);
}

