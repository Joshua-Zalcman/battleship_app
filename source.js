//new game reset

//global variables (setup, gameplay)
var shipArray = [
	{ name: 'Carrier', size: 5 },
	{ name: 'Battleship', size: 4 },
	{ name: 'Destroyer', size: 4 },
	{ name: 'Submarine', size: 3 },
	{ name: 'Patrol Boat', size: 2 },
];
var shipClass = document.getElementById('ship-class');
var shipDirection = document.getElementById('ship-direction');
var shipPl = document.getElementById('ship-placement-letter');
var shipPn = document.getElementById('ship-placement-number');
var playerBoard = document.getElementById('player-board');
var computerBoard = document.getElementById('computer-board');
var shipList = document.getElementById('ship-list');
var turnCounter = 0;
var focusPosition;
var shipHuntCount = 0;
var huntDirection = true; //true = vertical/ false = horizontal

//random setup for player & computer - will come back to simplify this
function randomSetup() {
	//get random numbers (1-2) for direction
	//clear board and allow for new random board
	for (let k = 1; k < 11; k++) {
		for (let i = 0; i < 10; i++) {
			//remove ships from board
			playerBoard.children[k].children[i].setAttribute('name', 'blank');
			playerBoard.children[k].children[i].removeAttribute('id');
			computerBoard.children[k].children[i].setAttribute('name', 'blank');
			computerBoard.children[k].children[i].removeAttribute('id');
		}
	}

	//send to function with parameters
	setup(false);
	setup(true);
	//activate start button and disable submit button

	document.getElementById('start').removeAttribute('disabled');
	document.getElementById('start').addEventListener('click', startGame);
	//document.getElementById('submit').disabled = true;
}

function setup(player) {
	//determine player or computer
	let x;
	if (player === true) {
		x = document.getElementById('player-board');
	} else {
		x = document.getElementById('computer-board');
	}
	//loop through array of ship sizes
	for (var b = 0; b < shipArray.length; b++) {
		let go = 1;
		while (go > 0) {
			let direction = Math.floor(Math.random() * 2) + 1;
			let letter = Math.floor(Math.random() * 10) + 1;
			let number = Math.floor(Math.random() * 10) + 1;
			if (direction == 1) {
				//horizontal
				//make sure ship length allows valid ship placement
				if (number <= 11 - shipArray[b].size) {
					let y = x.children[letter];
					//check if row is clear for ship placement
					let clear = -1;
					//loop through tiles to make sure space is unoccupied
					for (let j = 0; j < shipArray[b].size; j++) {
						let w = y.children[number - 1 + j];

						if (w.attributes.id == undefined) {
							clear = 1;
						} else {
							j = shipArray[b].size; //break loop
							clear = -1;
						}
					}
					//set valid ship position and end loop
					if (clear != -1) {
						for (let i = 0; i < shipArray[b].size; i++) {
							let w = y.children[number - 1 + i];
							w.setAttribute('name', shipArray[b].name);
							w.setAttribute('id', 'occupied');
						}
						go = 0;
					}
				}
			} else if (direction == 2) {
				//vertical
				//make sure ship length allows valid ship placement
				if (letter <= 11 - shipArray[b].size) {
					//check if row is clear for ship placement
					let y = x.children[letter].children[number - 1];
					let clear = -1;
					//loop through tiles to make sure space is unoccupied
					for (let j = 0; j < shipArray[b].size; j++) {
						let y = x.children[letter + j].children[number - 1];
						if (y.attributes.id == undefined) {
							clear = 1;
						} else {
							j = shipArray[b].size; //break loop
							clear = -1;
						}
					}
					//set valid ship position and end loop
					if (clear != -1) {
						for (let i = 0; i < shipArray[b].size; i++) {
							let y = x.children[letter + i].children[number - 1];
							y.setAttribute('name', shipArray[b].name);
							y.setAttribute('id', 'occupied');
							go = 0;
						}
					}
				}
			}
		}
	}
}
//this function allows manual setup
function manualSetup() {
	//alert player instructions

	//create click event for each available tile
	for (let k = 1; k < 11; k++) {
		for (let i = 0; i < 10; i++) {
			//if tile is not occupied add event listener
			if (playerBoard.children[k].children[i].attributes.id == undefined) {
				playerBoard.children[k].children[i].addEventListener('click', addShip);
				playerBoard.children[k].children[i].setAttribute('id', 'available');
			}
		}
	}

	//after first click remove non viable options
	//alert player which ship is about to be placed along with number of tiles to be placed
	//after each click function must assess what tiles are still viable
	//send error message if not all tiles are setup
	//ensure random setup and start button are disabled until all ships are setup properly
}
//this function adds ship manually
function addShip() {
	//get tile position
	let thisLetter = getChildNumber(this.parentNode);
	let thisNumber = getChildNumber(this);
	for (let k = 1; k < 11; k++) {
		for (let i = 0; i < 10; i++) {
			//remove click event

			//if (k != thisLetter && i != thisNumber ) {
			//remove click if not one tile over
			playerBoard.children[k].children[i].removeEventListener('click', addShip);
			playerBoard.children[k].children[i].removeAttribute('id', 'available');
			//}
		}
		this.setAttribute('id', 'occupied');
		//loop and add click event
		for (let k = 1; k < 11; k++) {
			for (let i = 0; i < 10; i++) {
				//remove click event
				if (playerBoard.children[k].children[i].attributes.id == undefined) {
					if (
						(k == thisLetter && i == thisNumber + 1) ||
						(k == thisLetter && i == thisNumber - 1)
					) {
						//remove click if not one tile over
						playerBoard.children[k].children[i].addEventListener(
							'click',
							addShip
						);
						playerBoard.children[k].children[i].setAttribute('id', 'available');
					}
					if (
						(k == thisLetter + 1 && i == thisNumber) ||
						(k == thisLetter - 1 && i == thisNumber)
					) {
						//remove click if not one tile over
						playerBoard.children[k].children[i].addEventListener(
							'click',
							addShip
						);
						playerBoard.children[k].children[i].setAttribute('id', 'available');
					}
				}
			}
		}
	}
}

//this function starts the gameplay and removes setup
function startGame() {
	//clears game setup
	document.getElementById('setup-space').style.display = 'none';

	// for (let i = 0; i <= 4; i++) {
	// 	//check if ship has button
	// 	if (shipList.children[i].lastChild.attributes.id != undefined) {
	// 		//remove reset buttons
	// 		shipList.children[i].removeChild(shipList.children[i].lastChild);
	// 	}
	// }
	//add event listener to computer boards
	for (let k = 1; k < 11; k++) {
		for (let i = 0; i < 10; i++) {
			computerBoard.children[k].children[i].addEventListener(
				'click',
				playerTurn
			);
		}
	}
	//display turn counter and hit counters
	document.getElementById('turn-count').style.display = 'block';
	document.getElementById('new').style.display = 'block';
	let hitCounters = document.getElementsByClassName('hit-counter');
	for (let i = 0; i < hitCounters.length; i++) {
		hitCounters[i].style.display = 'inline-block';
	}

	//disable options from being changed
	document.getElementById('again').setAttribute('disabled', true);
	document.getElementById('easy').setAttribute('disabled', true);
	document.getElementById('hard').setAttribute('disabled', true);
	//remove start button
	this.remove();
}
//this function finds the index number of a child node.
function getChildNumber(node) {
	return Array.prototype.indexOf.call(node.parentNode.children, node);
}

//this function sets backgroud color
function setColor() {
	if (document.getElementById('light-color').checked == true) {
		document.querySelector('.body').setAttribute('id', 'light');
	} else {
		document.querySelector('.body').setAttribute('id', 'dark');
	}
}

//gameplay

//this function determines a tiles response to players or computer turn
function turnCycle(positionA, positionB, player) {
	var x;
	var goAgain;
	var startHunt;
	//determine player or computer

	if (player === true) {
		x = computerBoard;
	} else {
		x = playerBoard;
	}

	var tile = x.children[positionA].children[positionB];
	//display 'hit'
	if (tile.attributes.id == undefined) {
		//display 'miss'
		tile.style.backgroundColor = 'white';
		if (player === true) {
			tile.removeEventListener('click', turnCycle);
			//add miss message
			document.getElementById('computer-board-comment').innerHTML =
				tile.innerHTML + ' was a miss, Captain!';

			goAgain = -1;
		} else {
			document.getElementById('player-board-comment').innerHTML =
				'Captain, the enemy fired and missed at ' + tile.innerHTML + '!';
		}
	} else if (tile.attributes.id.value == 'occupied') {
		tile.style.backgroundColor = 'red';

		//maybe can loop through image divs instead...
		let countRemaining = 0;
		let shipsLeft = 0;
		for (let k = 1; k < 11; k++) {
			for (let i = 0; i < 10; i++) {
				// console.log(this.attributes.name);
				// console.log(this.attributes.name.value);
				if (
					x.children[k].children[i] != tile &&
					x.children[k].children[i].attributes.name.value ==
						tile.attributes.name.value
				) {
					countRemaining++;
				}
				if (
					x.children[k].children[i] != tile &&
					x.children[k].children[i].attributes.name.value != 'blank' &&
					x.children[k].children[i].attributes.name.value != 'hit'
				) {
					//count remaining occupied tiles
					shipsLeft++;
				}
			}
		}
		//determine what message to display
		if (countRemaining > 0) {
			if (player === true) {
				document.getElementById('computer-board-comment').innerHTML =
					tile.innerHTML + ' was a hit, Captain!';
				//add hit to boat image
			} else {
				document.getElementById('player-board-comment').innerHTML =
					'Captain, the enemy fired and hit our ship at ' +
					tile.innerHTML +
					'!';
				//set hit counter to color red add new id for effect
				//console.log(tile.attributes.name.value)
				let findCounter = document.getElementById(
					tile.attributes.name.value
				).childElementCount;
				document
					.getElementById(tile.attributes.name.value)
					.children[findCounter - countRemaining - 1].setAttribute(
						'id',
						'mark-hit'
					);
				if (document.getElementById('hard').checked == true) {
					startHunt = true;
					shipHuntCount++;
					if (focusPosition == undefined) {
						focusPosition = tile;
					}
				}
			}
		} else {
			if (player === true) {
				document.getElementById('computer-board-comment').innerHTML =
					tile.innerHTML +
					" was a hit! We've sunk their " +
					tile.attributes.name.value +
					', Captain!';

				//add hit to boat image
			} else {
				document.getElementById('player-board-comment').innerHTML =
					'The enemy hit at ' +
					tile.innerHTML +
					' has sunk our ' +
					tile.attributes.name.value +
					', Captain!';
				//add sunk to boat image
				document
					.getElementById(tile.attributes.name.value)
					.lastElementChild.setAttribute('id', 'mark-hit');
				focusPosition = undefined;
				shipHuntCount = 0;
			}
		}
		//determine if game is over
		if (shipsLeft == 0) {
			//game over message
			document.getElementById('game-over').style.display = 'block';
			//game over messages
			if (player == true) {
				document.getElementById('game-over').innerHTML = 'Game over! You won!';
			} else {
				document.getElementById('game-over').innerHTML = 'Game over! You lost';
			}
		} else {
			//check if go again feature is set
			if (document.getElementById('again').checked == true && player == true) {
				//let player go again
				goAgain = 1;
			} else if (
				document.getElementById('again').checked == true &&
				player == false
			) {
				if (
					document.getElementById('hard').checked == true &&
					startHunt == true
				) {
					//hard mode on, ship still unsunk
					setTimeout(computerTurn, 1000, focusPosition, shipHuntCount); //computer go again and hunt for ship
				} else {
					setTimeout(throwRandomPick, 1000); //computer go again with random pick
				}
			} else {
				goAgain = -1;
			}
		}
		tile.setAttribute('name', 'hit');
	}
	if (player == true) {
		tile.removeEventListener('click', playerTurn);
		//turn counter goes up
		turnCounter++;
		document.getElementById('turn-count').innerHTML =
			'Turn count: ' + turnCounter;
	}
	tile.setAttribute('id', 'picked');
	return [goAgain, focusPosition, shipHuntCount];
}
//this function carries out computers turn on hard difficulty
function computerTurn(position, huntcount) {
	console.log('hunt count is ' + huntcount);
	//hard mode on. computer "on the hunt"

	let huntLetter = getChildNumber(position.parentNode);
	let huntNumber = getChildNumber(position);
	console.log('focus position is ' + huntLetter + ',' + (huntNumber + 1));
	//first hit
	if (huntcount == 1) {
		//console.log(position);
		// check viable option. number must be smaller than 10 larger than 0, letter must be smaller than 11 larger than 1
		// computer will hunt in clockwise motion until second hit, then determine horizontal or vertical
		if (
			huntLetter - 1 >= 1 &&
			playerBoard.children[huntLetter - 1].children[huntNumber].id != 'picked'
		) {
			turnCycle(huntLetter - 1, huntNumber, false);
			console.log(turnCounter + 'searched up');
		} else if (
			huntNumber - 1 >= 0 &&
			playerBoard.children[huntLetter].children[huntNumber - 1].id != 'picked'
		) {
			turnCycle(huntLetter, huntNumber - 1, false);
			console.log(turnCounter + 'searched left');
		} else if (
			huntLetter + 1 < 11 &&
			playerBoard.children[huntLetter + 1].children[huntNumber].id != 'picked'
		) {
			turnCycle(huntLetter + 1, huntNumber, false);
			console.log(turnCounter + 'searched down');
		} else if (
			huntNumber + 1 < 10 &&
			playerBoard.children[huntLetter].children[huntNumber + 1].id != 'picked'
		) {
			turnCycle(huntLetter, huntNumber + 1, false);
			console.log(turnCounter + 'searched right');
		} else {
			//throw random
			throwRandomPick();
		}
	}
	//second hit determines orientation

	if (huntcount == 2) {
		//is it vertical?
		//up
		if (
			huntLetter - 2 >= 1 &&
			playerBoard.children[huntLetter - 1].children[huntNumber].attributes.name
				.value == 'hit'
		) {
			console.log('its vertical down');
			//if position is valid go hunt in that direction
			if (
				playerBoard.children[huntLetter - 2].children[huntNumber].id != 'picked'
			) {
				turnCycle(huntLetter - 2, huntNumber, false);
				huntDirection = true;
			} //if position is already picked go the other way (if that is picked the ship should already be sunked/hit)
			else {
				turnCycle(huntLetter + 1, huntNumber, false);
				huntDirection = true;
			}
			//down
		} else if (
			huntLetter + 2 < 11 &&
			playerBoard.children[huntLetter + 1].children[huntNumber].attributes.name
				.value == 'hit'
		) {
			console.log('its vertical up');
			if (
				playerBoard.children[huntLetter + 2].children[huntNumber].id != 'picked'
			) {
				turnCycle(huntLetter + 2, huntNumber, false);
				huntDirection = true;
			} //if position is already picked go the other way (if that is picked the ship should already be sunked/hit)
			else {
				turnCycle(huntLetter - 1, huntNumber, false);
				huntDirection = true;
			}
		}
		//is it horizontal?
		//left
		else if (
			huntNumber - 2 >= 0 &&
			playerBoard.children[huntLetter].children[huntNumber - 1].attributes.name
				.value == 'hit'
		) {
			console.log('its horizontal left');
			if (
				playerBoard.children[huntLetter].children[huntNumber - 2].id != 'picked'
			) {
				turnCycle(huntLetter, huntNumber - 2, false);
				huntDirection = false;
			} else {
				turnCycle(huntLetter, huntNumber + 1, false);
				huntDirection = false;
			}
		}
		//right
		else if (
			huntNumber + 2 < 10 &&
			playerBoard.children[huntLetter].children[huntNumber + 1].attributes.name
				.value == 'hit'
		) {
			console.log('its horizontal right');
			if (
				playerBoard.children[huntLetter].children[huntNumber + 2].id != 'picked'
			) {
				turnCycle(huntLetter, huntNumber + 2, false);
				huntDirection = false;
			} else {
				turnCycle(huntLetter, huntNumber - 1, false);
				huntDirection = false;
			}
		}
	}
	if (huntcount > 2) {
		console.log('i am the 3rd+ hit');
		if (huntDirection == true) {
			//vertical
			if (
				huntLetter - huntcount > 1 &&
				playerBoard.children[huntLetter - (huntcount - 1)].children[huntNumber]
					.id == 'picked'
			) {
				if (
					playerBoard.children[huntLetter - huntcount].children[huntNumber]
						.id != 'picked'
				) {
					turnCycle(huntLetter - huntcount, huntNumber, false);
				} else {
					//go the other way
					turnCycle(
						huntLetter - huntcount + (huntcount + 1),
						huntNumber,
						false
					);
				}
			} else if (
				huntLetter + huntcount < 11 &&
				playerBoard.children[huntLetter + (huntcount - 1)].children[huntNumber]
					.id == 'picked'
			) {
				if (
					playerBoard.children[huntLetter + huntcount].children[huntNumber]
						.id != 'picked'
				) {
					turnCycle(huntLetter + huntcount, huntNumber, false);
				} else {
					//go the other way
					turnCycle(
						huntLetter + huntcount - (huntcount + 1),
						huntNumber,
						false
					);
				}
			}
		} else {
			//horizontal
			if (
				huntNumber - huntcount > 0 &&
				playerBoard.children[huntLetter].children[huntNumber - (huntcount - 1)]
					.id == 'picked'
			) {
				if (
					playerBoard.children[huntLetter].children[huntNumber - huntcount]
						.id != 'picked'
				) {
					turnCycle(huntLetter, huntNumber - huntcount, false);
				} else {
					//go the other way//add escape for adjacent ships...
					turnCycle(
						huntLetter,
						huntNumber - huntcount + (huntcount + 1),
						false
					);
				}
			} else if (
				huntNumber + huntcount < 10 &&
				playerBoard.children[huntLetter].children[huntNumber + (huntcount - 1)]
					.id == 'picked'
			) {
				if (
					playerBoard.children[huntLetter].children[huntNumber + huntcount]
						.id != 'picked'
				) {
					turnCycle(huntLetter, huntNumber + huntcount, false);
				} else {
					//go the other way
					turnCycle(
						huntLetter,
						huntNumber + huntcount - (huntcount + 1),
						false
					);
				}
			}
		}
	}

	//easy mode on (random pick)
	if (huntcount == 0) {
		throwRandomPick();
	}
}
//throws random pick for computer to turn cycle
function throwRandomPick() {
	let sendPosition = 0;
	while (sendPosition == 0) {
		//choose random value
		let turnLetter = Math.floor(Math.random() * 10) + 1;
		let turnNumber = Math.floor(Math.random() * 10);
		//make sure value has not been used before!
		if (
			playerBoard.children[turnLetter].children[turnNumber].attributes.id ==
			undefined
		) {
			//send to turn cycle function
			turnCycle(turnLetter, turnNumber, false);
			sendPosition = 1; //break loop
		} else if (
			playerBoard.children[turnLetter].children[turnNumber].attributes.id
				.value == 'occupied'
		) {
			//send to turn cycle function
			turnCycle(turnLetter, turnNumber, false);
			sendPosition = 1; //break loop
		}
	}
}
function playerTurn() {
	//get position on click and send to turn cycle function
	let turnLetter = getChildNumber(this.parentNode);
	let turnNumber = getChildNumber(this);
	let hit = turnCycle(turnLetter, turnNumber, true);

	//settimeout and execute computer turn (random tile pick)
	if (
		document.getElementById('hard').checked == true &&
		hit[0] == -1 &&
		hit[1] != undefined
	) {
		//hard mode and no go again
		setTimeout(computerTurn, 1000, hit[1], hit[2]); //computer continues with hunt
		console.log('went hunting');
	} else if (hit[0] == -1) {
		//easy mode with no go again
		setTimeout(throwRandomPick, 1000);
		console.log('went random');
	}

	//setTimeout(computerTurn,1000);
}
//add 'smart' computer mode...
//add game score tally
//this function resets the game
function newGame() {
	document.location.reload();
}
