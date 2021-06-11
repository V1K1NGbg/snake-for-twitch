canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.lineWidth = .00001;

// interval = setInterval(move, 20)


l = 6 					//length of the snake
gridSize = 20 			//the ground of 40*40 grid is created
snake = []				//array of positions in grid occupied by the snake
foodPos = {}			//uses JSON notation, like many other variable later
path = "Right"			//keeps on moving to the set path
going = "Right"
grid = [];
nodeLength = 20;
spacing = 1;
padding = 1;
setGround();
document.onkeydown = checkKey;
gameOver = false;


//set the ground
function setGround() {
	grid = new Array(gridSize);
	x = 0;
	while (x < gridSize) {
		grid[x] = new Array(gridSize);
		y = 0
		while ((y < gridSize)) {
			grid[x][y] = 0					//specifying empty space
			
			ctx.strokeRect(x * (nodeLength + spacing), y * (nodeLength + spacing), nodeLength, nodeLength);
			y = y + 1
		}
		x = x + 1
	}
}
//set snake
setSnake();
function setSnake() {
	i = l - 1;
	while (i >= 0) {
		snake[i] = { "pos": { "x": i, "y": 0 } }
		grid[i][0] = 1						//specifying snake occupied space
		fillSquare(i, 0, ctx.fillStyle = "grey");
		i = i - 1
	}
	snake.reverse();
}

spawnFood();
function spawnFood() {
	repeat = true
	while (repeat == true) {
		randomX = Math.floor(Math.random() * gridSize)
		randomY = Math.floor(Math.random() * gridSize)
		if (grid[randomX][randomY] == 0) {				//to get food where if there is empty space
			repeat = false
		}
	}

	foodPos = { "x": randomX, "y": randomY };
	grid[randomX][randomY] = 1;						//specifying food occupied space
	ctx.fillStyle = "lightgrey";
	fillSquare(randomX, randomY, ctx.fillStyle);
}

function move() {
	clearAt = { "x": snake[l - 1].pos.x, "y": snake[l - 1].pos.y }
	grid[snake[l - 1].pos.x][snake[l - 1].pos.y] = 0;
	snake[l - 1] = { "pos": { "x": snake[0].pos.x, "y": snake[0].pos.y } };

	snake.splice(1, 0, snake.pop());


	if (path == "Up") {
		moveUp()
	}
	else if (path == "Down") {
		moveDown()
	}
	else if (path == "Left") {
		moveLeft()
	}
	else if (path == "Right") {
		moveRight()
	}
	detection();
	if (gameOver) {
		fillSquare(snake[1].pos.x, snake[1].pos.y, 'white');
		return;
	}
	clearSquare(clearAt.x, clearAt.y)
	fillSquare(snake[0].pos.x, snake[0].pos.y, 'grey');
	grid[snake[0].pos.x][snake[0].pos.y] = 1;
}

function moveUp() {
	path = "Up"
	going = "Up"

	snake[0] = { "pos": { "x": snake[0].pos.x, "y": snake[0].pos.y - 1 } }
}

function moveDown() {
	path = "Down"
	going = "Down"

	snake[0].pos = { "x": snake[0].pos.x, "y": snake[0].pos.y + 1 }

}

function moveLeft() {
	path = "Left"
	going = "Left"

	snake[0].pos = { "x": snake[0].pos.x - 1, "y": snake[0].pos.y }

}

function moveRight() {
	path = "Right"
	going = "Right"

	snake[0].pos = { "x": snake[0].pos.x + 1, "y": snake[0].pos.y }

}

function detection() {
	snake = snake
	x = snake[0].pos.x
	y = snake[0].pos.y

	//check if it ate food
	if (foodPos.x == x && foodPos.y == y) {
		spawnFood();
	}

	//if the snake has gone outside of bounds of grid, endGame

	if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
		endGame();
		alert("out of gri")
		gameOver = true;
	}

	// if head of snake has same pos as other body part of snake return true

	i = 1	//skip the node at 0 because it is the head 
	while (i < snake.length) {
		if (snake[i].pos.x == x && snake[i].pos.y == y) {
			endGame();
			alert("bitten")
			gameOver = true;
		}
		i = i + 1
	}

	function endGame() {
		clearInterval(interval);
	}

}

function fillSquare(x, y, fillStyle) {
	ctx.fillStyle = fillStyle;
	ctx.fillRect(x * (nodeLength + spacing) + padding, y * (nodeLength + spacing) + padding, nodeLength - 2 * padding, nodeLength - 2 * padding);
}
function clearSquare(x, y) {
	ctx.clearRect(x * (nodeLength + spacing) + padding, y * (nodeLength + spacing) + padding, nodeLength - 2 * padding, nodeLength - 2 * padding);
}



function checkKey(e) {
	if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == " " || e.key.toLowerCase == "p")
		e.returnValue = false;
	if (!gameOver) {
		switch (e.key) {
			case "ArrowUp":
				if (going != 'Down' && path != 'paused') {
					path = 'Up'
				}
				break;
			case "ArrowDown":
				if (going != 'Up' && path != 'paused') {
					path = 'Down'
				}
				break;
			case "ArrowLeft":
				if (going != 'Right' && path != 'paused') {
					path = 'Left'
				}
				break;
			case "ArrowRight":
				if (going != 'Left' && path != 'paused') {
					path = "Right"
				}
		}
	}
}

moves = []
findPath();
function findPath() {
	openList = [];
	openList[0] = { "parent": null, "pos": { "x": snake[0].pos.x, "y": snake[0].pos.y }, "g": 0, "h": 0, "f": 0 }
	closedList = [];
	// count = 0;
	while (openList.length > 0) {
		// if(count>0) return;
		// count++;
		openList = sortByF(JSON.parse(JSON.stringify(openList)));
		currentNode = openList[0]
		// fillSquare(currentNode.pos.x, currentNode.pos.y, "yellow");
		openList.shift();
		if (currentNode.pos.x == foodPos.x && currentNode.pos.y == foodPos.y) {
			while (currentNode.parent != null) {
				moves.unshift(JSON.parse(JSON.stringify(currentNode)));
				currentNode = currentNode.parent
			}
			moveToFood()
			break;

		}
		successors = []
		//the heuristics are calculated later
		successors[0] = { "parent": JSON.parse(JSON.stringify(currentNode)), "pos": { "x": currentNode.pos.x, "y": currentNode.pos.y - 1 }, "g": 0, "h": 0, "f": 0 }
		successors[1] = { "parent": JSON.parse(JSON.stringify(currentNode)), "pos": { "x": currentNode.pos.x + 1, "y": currentNode.pos.y }, "g": 0, "h": 0, "f": 0 }
		successors[2] = { "parent": JSON.parse(JSON.stringify(currentNode)), "pos": { "x": currentNode.pos.x, "y": currentNode.pos.y + 1 }, "g": 0, "h": 0, "f": 0 }
		successors[3] = { "parent": JSON.parse(JSON.stringify(currentNode)), "pos": { "x": currentNode.pos.x - 1, "y": currentNode.pos.y }, "g": 0, "h": 0, "f": 0 }
		sucCount = 0;
		while (sucCount < successors.length) {
			successor = successors[sucCount];
			sucCount++
			successor.g = currentNode.g + 1
			successor.h = Math.sqrt(Math.pow((successor.pos.x - foodPos.x), 2) + Math.pow((successor.pos.y - foodPos.y), 2))
			successor.f = successor.g + successor.h
			if (snake.length > 4)		//if it covers upto four grid, it cannot bite itself {
			{
				futureSnake = JSON.parse(JSON.stringify(snake)); 								//to store positions of snake if it travels to current node
				for (var i = 0; i < successor.g - 1; i++) {
					futureSnake.pop();
				}
				if (successor.g > 4 && snake.length > 10) {
					// openList = [];
					// break;
				}
				if (isInSnakeBody(futureSnake, successor)) {
					continue;
				}

			}
			else {

				if (isInSnakeBody(snake, successor)) {
					console.log("check body");
					continue;
				}
			}
			if (successor.pos.x >= gridSize || successor.pos.x < 0 || successor.pos.y >= gridSize || successor.pos.y < 0) {
				continue;
			}
			if (!isInList(openList, successor) && !isInList(closedList, successor)) {
				openList.push(successor);
			}
		}
		closedList.push(currentNode);
	}
	if (moves.length == 0)
		setTimeout(function () { location.reload(true) }, 2000)
}

function sortByF(list) {
	for (i = 0; i < list.length; i++) {

		for (j = i + 1; j < list.length; j++) {
			if (list[i].f > list[j].f) {
				tempNode = JSON.parse(JSON.stringify(list[i]));
				list[i] = JSON.parse(JSON.stringify(list[j]));
				list[j] = JSON.parse(JSON.stringify(tempNode));
			}
			j = j + 1
		}
		i = i + 1
	}
	return list;
}

function isInList(list, node) {
	i = 0
	while (i < list.length) {
		if (list[i].pos.x == node.pos.x && list[i].pos.y == node.pos.y && list[i].f <= node.f) {
			return true;
		}
		i++;
	}
	return false;
}

function isInSnakeBody(snakeArray, node) {
	console.log(snakeArray)
	i = 0
	while (i < snakeArray.length) {
		if (snakeArray[i].pos.x == node.pos.x && snakeArray[i].pos.y == node.pos.y) {
			return true;
		}
		i++;
	}
	return false;
}

var interval;

function moveToFood() {

	interval = setInterval(function () { makeMove() }, 30);

}

function makeMove() {
	
	if (moves.length > 0) {
		node = moves.shift();
		if (snake[0].pos.x > node.pos.x) {
			path = "Left";
		}
		else if (snake[0].pos.x < node.pos.x) {
			path = "Right";
		}
		else if (snake[0].pos.y < node.pos.y) {
			path = "Down";
		}
		else if (snake[0].pos.y > node.pos.y) {
			path = "Up";
		}
		move();
	}
	else {
		clearInterval(interval);
		findPath();
	}
}