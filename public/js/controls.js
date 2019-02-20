function checkKeyDown(e) {

	if (e.keyCode == '38' || e.keyCode == '87') {
		my_car.boosting(true);
		

	} else if (e.keyCode == '37' || e.keyCode == '65') {
		my_car.setRotation(0.17);
	} else if (e.keyCode == '39' || e.keyCode == '68') {
		my_car.setRotation(-0.17);
	}
}

function checkKeyUp(e) {

	if (e.keyCode == '38' || e.keyCode == '87') {
		my_car.boosting(false);

	} else if (e.keyCode == '37' || e.keyCode == '65') {
		my_car.setRotation(0);
	} else if (e.keyCode == '39' || e.keyCode == '68') {
		my_car.setRotation(0);
	}
}

document.onkeydown = checkKeyDown;
document.onkeyup = checkKeyUp;