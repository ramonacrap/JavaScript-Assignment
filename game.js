var sky = document.querySelector('.sky');
var start;
var upPressed;
var downPressed;
var leftPressed;
var rightPressed;
var lastPressed;
var speed;
var bombs;
var invincible;
var hit;
var lives;

function keyup(event) {
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	player.className = 'character stand ' + lastPressed;
	if(hit && !player.classList.contains('hit'))
		player.className += ' hit';
	if(invincible && !player.classList.contains('invincible'))
		player.className += ' invincible';
}

function move() {
	var player = document.getElementById('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop+speed;
		if (newTop + 45 < window.innerHeight)
			player.style.top = newTop + 'px';
		if (!leftPressed && !rightPressed)
			player.className = 'character walk down';
	}
	if (upPressed) {
		var newTop = positionTop-speed;
		if(newTop > 602) 
			player.style.top = newTop + 'px';	
		if (!leftPressed && !rightPressed) 
			player.className = 'character walk up';
	}
	if (leftPressed) {
		var newLeft = positionLeft-speed;
		if(newLeft > 0)
			player.style.left = newLeft + 'px';	
		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft+speed;
		if (newLeft + 35 < window.innerWidth) 
			player.style.left = newLeft + 'px';
		player.className = 'character walk right';
	}
	if(hit && !player.classList.contains('hit'))
		player.className += ' hit';
	if(invincible  && !player.classList.contains('invincible'))
		player.className += ' invincible';
	for(var i = 0; i < bombs.length; i++) {
		var bomb = bombs[i][0];
		var target = bombs[i][1];
		var y = bomb.offsetTop;
		if(!bomb.classList.contains('explosion'))
			y += speed;
		else if(!invincible) {
			for(var j = 0; j < 2; j++) {
				var explosion = bomb.children[j];
				var r1 = {x: player.offsetLeft, y: player.offsetTop, width: 32, height: 46};
				var rect2 = explosion.getBoundingClientRect();
				var r2 = {x: rect2.left, y: rect2.top, width: explosion.offsetWidth, height: explosion.offsetHeight};
				if (r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y) {
					document.querySelector('li').remove();
					lives--;
					if(!lives) 
						stopGame();
					else {
						hit = true;
						invincible = true;
						setTimeout(function() {
							hit = false;
							invincible = false;
							player.classList.remove('hit');
							player.classList.remove('invincible');
						}, 3000);
						break;
					}
				 }
			}
		}
		speed = Math.min(speed + 0.0001, 5.5);
		bomb.style.top = y + 'px';

		if(y >= target && !bomb.classList.contains('explosion')) {
			var before = document.createElement('div');
			before.classList.add('explosion-before');
			var after = document.createElement('div');
			after.classList.add('explosion-after');
			bomb.classList.add('explosion');
			bomb.appendChild(before);
			bomb.appendChild(after);
			removeBomb(bomb);
		}
	}
}


function removeBomb(bomb) {
	setTimeout(function() {
		bomb.remove();
		for(var i = 0; i < bombs.length; i++) {
			if(bombs[i].id == bomb.id)
				bombs.splice(i, 1);
		}
	}, 500);

}


function keydown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
}

function randomInteger(min, max) {
    return Math.random() * (max - min) + min;
}

function spawnBombs() {
	var x = randomInteger(10, 850);
	var y = randomInteger(10, 120);
	var bomb = document.createElement('div');
	bomb.classList.add('bomb');
	bomb.id = randomInteger(1, 99999);
	bomb.style.left = x + 'px';
	bomb.style.top = y + 'px';
	sky.appendChild(bomb);
	bombs.push([bomb, randomInteger(610, 675)]);
}


function myLoadFunction(first) {
	start = document.querySelector('.start');
	upPressed = false;
	downPressed = false;
	leftPressed = false;
	rightPressed = false;
	lastPressed = false;
	speed = 2;
	bombs = [];
	invincible = false;
	hit = false;
	lives = 3;
	player.classList.remove('dead');
	var remaining_bombs = document.querySelectorAll('.bomb');
	for(var i = 0; i < remaining_bombs.length; i++)
		remaining_bombs[i].remove();
	var health = document.querySelector('.health');
	while(health.children.length != 3)
		health.appendChild(document.createElement('li'));
	timeout = setInterval(move, 10);
	if(first)
		start.addEventListener('click', startGame);
	else {
		startGame();
		document.querySelector('.game-over').remove();
	}
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}

function startGame() {
	start.remove();
	bombInterval = setInterval(spawnBombs, 400);
}

function stopGame() {
	player.className = 'character stand down dead';
	clearInterval(timeout);
	clearInterval(bombInterval);
	document.removeEventListener('keydown', keydown);
	document.removeEventListener('keyup', keyup);
	gameOver();
}

function gameOver() {
	var message = document.createElement('div');
	message.classList.add('game-over');
	message.textContent = 'GAME OVER';
	document.documentElement.appendChild(message);
	var replay = document.createElement('div');
	replay.classList.add('start', 'play-again');
	replay.textContent = 'Play again?';
	document.documentElement.appendChild(replay);
	replay.addEventListener('click', function(){ return myLoadFunction(false)});
}

myLoadFunction(true);