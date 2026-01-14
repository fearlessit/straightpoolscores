var scores1, scores2, ballsLeft, turn, hold, mistake, states, redoStates, isFirstShot

$(document).ready(function () {
	newGame()
	$("#input1").on('keyup', function (e) {
		if (e.which == 13) $("#input1").blur()
	})

	$("#input2").on('keyup', function (e) {
		if (e.which == 13) $("#input2").blur()
	})
})

function newGame() {
	scores1 = scores2 = hold = 0
	ballsLeft = 15
	turn = true
	mistake = false
	states = []
	redoStates = []
	isFirstShot = true
	refresh()
}

function ballsLeftPressed(i) {
	if (i <= ballsLeft) {
		pushState()
		if (mistake && isFirstShot) hold--
		if (mistake) hold--
		if (turn) scores1 += ballsLeft - i + hold
		else scores2 += ballsLeft - i + hold
		ballsLeft = i
		turn = !turn
		hold = 0
		mistake = false
		isFirstShot = false
		refresh()
	}
}

function rerackPressed() {
	pushState()
	hold += ballsLeft - 1
	ballsLeft = 15
	refresh()
}

function mistakePressed() {
	mistake = !mistake
	refresh()
}

function undoPressed() {
	popState()
	refresh()
}

function redoPressed() {
	if (redoStates.length > 0) {
		states.push({ scores1: scores1, scores2: scores2, ballsLeft: ballsLeft, turn: turn, hold: hold, mistake: mistake })
		var state = redoStates.pop()
		scores1 = state['scores1']
		scores2 = state['scores2']
		ballsLeft = state['ballsLeft']
		turn = state['turn']
		hold = state['hold']
		mistake = state['mistake']
		refresh()
	}
}

function refresh() {
	$("#scores1").text(scores1 + ((turn && hold > 0) ? "+" + hold : ""))
	$("#scores2").text(scores2 + ((!turn && hold > 0) ? "+" + hold : ""))
	for (i = 2; i <= 15; i++) $("#ballsLeft" + i).css('color', i <= ballsLeft ? 'black' : 'transparent')
	$("#player1, #player1 input").css('font-weight', turn ? 'bold' : 'normal')
	$("#player2, #player2 input").css('font-weight', !turn ? 'bold' : 'normal')
	$("#player1, #player1 input").css('color', turn ? 'black' : 'gray')
	$("#player2, #player2 input").css('color', !turn ? 'black' : 'gray')
	$(".mistake").css('background-color', !mistake ? 'transparent' : 'green')

	if (states.length > 0) $("#undo-btn").removeClass("disabled");
	else $("#undo-btn").addClass("disabled");

	if (redoStates.length > 0) $("#redo-btn").removeClass("disabled");
	else $("#redo-btn").addClass("disabled");

}

function pushState() {
	states.push({ scores1: scores1, scores2: scores2, ballsLeft: ballsLeft, turn: turn, hold: hold, mistake: mistake })
	redoStates = []
}

function popState() {
	if (states.length > 0) {
		redoStates.push({ scores1: scores1, scores2: scores2, ballsLeft: ballsLeft, turn: turn, hold: hold, mistake: mistake })
		var state = states.pop()
		scores1 = state['scores1']
		scores2 = state['scores2']
		ballsLeft = state['ballsLeft']
		turn = state['turn']
		hold = state['hold']
		mistake = state['mistake']
		refresh()
	}
}
