if(!localStorage.getItem("hScore")) localStorage.setItem("hScore","0"); 
//html --------------------------------------------------------------------------------------
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("results");

const fieldScreen = document.getElementById("field");
const scoreDisplay = document.getElementById("score");
const hScoreDisplay = document.getElementById("hScore");

const lineDisplay = document.getElementById("lines");
const finalScore = document.getElementById("scoreResult");
const finalHscore = document.getElementById("hScoreResult");
const replayBtn = document.getElementById("replay");


scoreDisplay.innerHTML = "0";
// lineDisplay.innerHTML = "Lines: 0"
hScoreDisplay.innerHTML = localStorage.getItem("hScore");

document.addEventListener("keydown",movePieceInput); //listen to key input

replayBtn.addEventListener("click", () =>{      //reset parameters and restart game
    fieldScreen.innerHTML = "";

    for (let x = 0; x < fieldWidth; x++) {  
        for (let y = 0; y < fieldHeight; y++) {
            field[x + y * fieldWidth] = x == 0 || x == fieldWidth - 1 || y == fieldHeight - 1? 9: 0;
        }
    }
    
    rotation = 0;
    currentPiece = 0;
    currentX = 4;
    currentY = 0;
    speed = 20
    lock = false;
    lineCount = 0;
    score = 0;
    gameOver = false;

    for (let i = 0; i < fieldHeight * fieldWidth; i++) {  
        let div = document.createElement('div');
        div.classList.add("square");
        if(i % 12 == 0 || i % 12 == 11 || i > 203){
            div.classList.add("wall")
        }
        else{
            div.classList.add("empty");
        }
        div.setAttribute("id",`${i}`)
        fieldScreen.appendChild(div); 
    }

    gameScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");
    finalHscore.classList.add("false");

    hScoreDisplay.innerHTML = localStorage.getItem("hScore");
    scoreDisplay.innerHTML= 0;

    setTimeout(gameLoopCallback, 50 * speed)
})           

//assets ------------------------------------------------------------------------------------
const fieldHeight = 18;
const fieldWidth = 12;
const field = []
for (let x = 0; x < fieldWidth; x++) {  //initialize field array
    for (let y = 0; y < fieldHeight; y++) {
        field[x + y * fieldWidth] = x == 0 || x == fieldWidth - 1 || y == fieldHeight - 1? 9: 0;
    }
}


const tetrominos = [
    [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0],
    [0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
    [0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0]
]
const colors = ["red","blue","green","orange","yellow","violet","seaGreen"]


//game logic --------------------------------------------------------------------------------------
let rotation = 0;
let currentPiece = 0;
let currentX = 4;
let currentY = 0;
let speed = 20
let lock = false;
let lineCount = 0;
let score = 0;
let gameOver = false;



for (let i = 0; i < fieldHeight * fieldWidth; i++) {   //init html field
            let div = document.createElement('div');
            div.classList.add("square");
            if(i % 12 == 0 || i % 12 == 11 || i > 203){
                div.classList.add("wall")
            }
            else{
                div.classList.add("empty");
            }
            div.setAttribute("id",`${i}`)
            fieldScreen.appendChild(div); 
}


function updateField(newX,newY,newRotation){
    let pos = newX + newY * 12;
    if(isValid(newX,newY,newRotation)){    

        //clear previous pos
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if(x + currentX >= 0 && y + currentY < 18){ //check if in bounds
                    if(!document.getElementById(`${currentX + x + (currentY + y) * 12}`).classList.contains("wall") && !document.getElementById(`${currentX + x + (currentY + y) * 12}`).classList.contains("fixed")){
                        document.getElementById(`${currentX + x + (currentY + y) * 12}`).className = ("square empty")
                    }
                }        
            }    
        }

        //add to new pos
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if(tetrominos[currentPiece][rotate(x,y,newRotation)] == 1){ 
                    if(!document.getElementById(`${pos + x + (y * fieldWidth)}`).classList.contains("wall"))
                        document.getElementById(`${pos + x + (y * fieldWidth)}`).classList.remove("empty") 
                        document.getElementById(`${pos + x + (y * fieldWidth)}`).classList.add(colors[currentPiece])              
                }     
            }    
        }

        currentX = newX;
        currentY = newY;
        rotation = newRotation
    }
}

function rotate(px,py,r){
    let pi = 0;
    switch (r % 4)
    {
    case 0:			
        pi = py * 4 + px;			
        break;						
       
    case 1: 			
        pi = 12 + py - (px * 4);	
        break;						
      
    case 2: 
        pi = 15 - (py * 4) - px;	
        break;						
       
    case 3: 			
        pi = 3 - py + (px * 4);		
        break;						
    }								

    return pi;
}
    
function isValid(newX,newY,newRotation){
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            
            let pieceValue = tetrominos[currentPiece][rotate(x,y,newRotation)]
            let fieldValue = field[(newX + x) + fieldWidth * (newY + y)] 
            if(x + newX >= 0 && x + newX < fieldWidth){
                if(y + newY >= 0 && y + newY < fieldHeight){
                    if(pieceValue == 1 && fieldValue != 0) return false
                }
            }
        }
    }
    return true;
}

function movePieceInput(e){
    switch(e.key){
        case "ArrowLeft":
            updateField(currentX - 1,currentY,rotation)
            break;
        case "ArrowDown":
            updateField(currentX,currentY + 1,rotation)
            break;
        case "ArrowRight":
            updateField(currentX + 1,currentY,rotation)
            break;
        case "x":
            updateField(currentX,currentY,rotation + 1)
            break; 
    }
}

function forcePieceDown(){
    if(isValid(currentX,currentY + 1,rotation)){
        updateField(currentX,currentY + 1,rotation)
        return;
    }
    lock = true;
}

function lockPiece(){
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let pieceValue = tetrominos[currentPiece][rotate(x,y,rotation)]
            if(pieceValue == 1){
                field[(currentX + x) + fieldWidth * (currentY + y)] = 1;
                document.getElementById(`${(currentX + x) + fieldWidth * (currentY + y)}`).classList.add("fixed");
            }
        }
    }
    
    checkLines();

    currentPiece = Math.floor(Math.random() * 7);
    currentX = 4;
    currentY = 0;
    rotation = 0;
    lock = false;
}

function checkLines(){

    let lines = []
    
    for (let y = 4; y >= 0; y--) {   
        let pieceCount = 0;
        for (let x = 1; x < 11; x++) {      
            if(y + currentY >= 0 && y + currentY < fieldHeight - 1){
                if(field[((y + currentY) * fieldWidth) + x ] == 1){
                    pieceCount ++;
                } 
            }
        }
        if(pieceCount == 10) lines.unshift(y + currentY)
    }
  
    lines.forEach(line => {  //pull other pieces down
        for (let y = line; y > 0; y --) {
            for (let x = 1; x < fieldWidth - 1; x++) {
            
                let temp = field[(y - 1) * fieldWidth + x]  // square above the current row              
                let tempClassName = document.getElementById(`${(y - 1) * fieldWidth + x}`).className
                field[(y - 1) * fieldWidth + x] = 0;
                document.getElementById(`${(y - 1) * fieldWidth + x}`).className = "square empty"
                
                field[y * fieldWidth + x] = temp;
                document.getElementById(`${y * fieldWidth + x}`).className = tempClassName
                
            } 
        }
    })

    
    lineCount += lines.length;
    score += lines.length * 100;
    scoreDisplay.innerHTML = `Score: ${score}`
    // lineDisplay.innerHTML = `Lines: ${lineCount}`
}

function gameLoop(){
    if(!isValid(4,0,rotation)){
        gameOver = true;
        return;
    }
    forcePieceDown()
    if(lock){
        lockPiece()
    }
    score += 10;
    scoreDisplay.innerHTML = score
    if(score % 1000 == 0) speed > 10 ? speed -- : 10;
    
}

let gameLoopCallback = function(){  
    if(gameOver){
        gameScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        
        lineDisplay.innerHTML = lineCount;
        finalScore.innerHTML = score;
        finalHscore.innerHTML = localStorage.getItem("hScore");
        
        if(score > localStorage.getItem("hScore")) {
            finalHscore.classList.remove("false")
            finalHscore.innerHTML = score;
            localStorage.setItem("hScore",`${score}`)
        }
        
        return;
    }
    gameLoop()  
    setTimeout(gameLoopCallback, 50 * speed)
}

setTimeout(gameLoopCallback, 50 * speed)


