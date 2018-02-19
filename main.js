
const scoreTable      = document.getElementById('score');
const canvas          = document.getElementById('canvas');
const canvasWidth     = canvas.width;
const canvasHeight    = canvas.height;
const ctx             = canvas.getContext('2d');

const startCoordinate = 0;
const rectangleWidth  = 20;
const rectangleHeight = 20;

let userScore                  = 0;
let startRectangleTime         = 0;
let createRectangleTimePeriod  = 100;
let stopRectangleProducing     = false;

let rectangles = new Array();

//Rectangle constructor
function Rectangle() {
	this.coordinateX = getRandomCoordianteX();
	this.coordinateY = startCoordinate;
	this.speed       = getRandomSpeed();
	this.color       = getRandomColor();
	this.isRemoved   = false;

	this.draw = () => {
  	ctx.fillRect(this.coordinateX, 
  							 this.coordinateY,
  							 rectangleWidth,
  							 rectangleHeight);
  	ctx.fillStyle = this.color;
	}

	this.move = () => {
		this.coordinateY += this.speed;
		if(this.coordinateY >= canvasHeight) this.coordinateY = startCoordinate;
	}

	this.hitTest = (x, y) => {
		let xAxisDifference = x - this.coordinateX;
		let yAxisDifference = y - this.coordinateY;

		if (rectangleWidth > xAxisDifference > 0 && rectangleHeight > yAxisDifference > 0) return true;

		return false;
	}
}

function newRectangle() {
	rectangles.push( new Rectangle());
}

function startProduceRectangles() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
	if (stopRectangleProducing) return false;
	if (startRectangleTime % createRectangleTimePeriod === 0) newRectangle();

	for (let i = 0, l = rectangles.length; i < l; i++) {
		rectangles[i].draw();
		rectangles[i].move();
		if(rectangles[i].isRemoved) {
			rectangles.splice(i, 1);
			i--;
			l--;
		}
	}
	startRectangleTime++;
	requestAnimationFrame(startProduceRectangles);	
}


function calcClickCoordinate(e, canvas) {
	let element = canvas,
		  offsetX = 0,
		  offsetY = 0,
		  mx, my;

  if (element.offsetParent !== undefined) {
  	do {
  		offsetX += element.offsetLeft;
  		offsetY += element.offsetTop;
  	} while ((element = element.offsetParent));
  }

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  return {
  	x: mx,
  	y: my
  };
}

canvas.addEventListener('click', function(e){
	let clickPoint = calcClickCoordinate(e, canvas);

	for (let i = 0, l = rectangles.length; i < l; i++) {
		if (rectangles[i].hitTest(clickPoint.x, clickPoint.y)) {
			userScore++;
			updateUserScore();
			rectangles[i].isRemoved = true;
		}
	}
});

function startGameSession() {
	stopRectangleProducing = false;
	startProduceRectangles();
}
function endGameSession() {
	stopRectangleProducing = true;
	resetUserScore();
	rectangles.splice(0);
}



// User score functions
function updateUserScore() {
	scoreTable.innerHTML = userScore;
}
function resetUserScore() {
	userScore = 0;
	scoreTable.innerHTML = userScore;
}


// Rectangle's constructor additional functions
function getRandomCoordianteX() {
	return Math.round( Math.random() * Math.floor(canvasWidth) );
}
function getRandomSpeed() {
	return Math.round( Math.random() * Math.floor(10) );	
}
function getRandomColor() {
	return "#"+((1<<24)*Math.random()|0).toString(16);
}

