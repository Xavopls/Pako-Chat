function checkKeyDown(e) {

	if (e.keyCode == '38' || e.keyCode == '87') {
		client.lambo.boosting(true);
		

	} else if (e.keyCode == '37' || e.keyCode == '65') {
		client.lambo.setRotation(0.17);
	} else if (e.keyCode == '39' || e.keyCode == '68') {
		client.lambo.setRotation(-0.17);
	}
}

function checkKeyUp(e) {

	if (e.keyCode == '38' || e.keyCode == '87') {
		client.lambo.boosting(false);

	} else if (e.keyCode == '37' || e.keyCode == '65') {
		client.lambo.setRotation(0);
	} else if (e.keyCode == '39' || e.keyCode == '68') {
		client.lambo.setRotation(0);
	}
}

document.onkeydown = checkKeyDown;
document.onkeyup = checkKeyUp;