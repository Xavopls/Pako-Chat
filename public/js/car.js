function Car() {
	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshLambertMaterial({
		color: "red"
	});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.castShadow = true;
	this.mesh.position.y = 2;
	this.heading = Math.PI; //angle, centre de la figura
	this.rotation = 0;
	this.isBoosting = false;
	this.vel = [0, 0]; //vector de velocitat
	this.audio = 0
}

Car.prototype.boosting = function (b) {
	this.isBoosting = b;
	this.audio = 1;
}

Car.prototype.boost = function () {

	var force1 = Math.cos(this.heading);
	var force2 = Math.sin(this.heading);

	this.vel[0] = (force2 * 0.1);
	this.vel[1] = (force1 * 0.1);
}

Car.prototype.update = function () {
	if (this.isBoosting) {
		this.boost();
		
	}


	this.mesh.position.x += this.vel[0];
	this.mesh.position.z += this.vel[1];

	this.vel[0] *= 0.99;
	this.vel[1] *= 0.99;

}

Car.prototype.setRotation = function (a) {
	this.rotation = a;
}

Car.prototype.turn = function () {
	this.heading += this.rotation;
}

Car.prototype.render = function () {

	this.mesh.rotation.y = this.heading;
	scene.add(this.mesh);
}

Car.prototype.audioo = function () {
	if (this.isBoosting) {

		if (motor_powerON.duration > 0 && !motor_powerON.paused) {

		} else {
			motor_powerON.play();
		}
	} else {
		motor_powerON.pause();

		if (this.audio == 1) {
			motor_powerOFF.play();
			this.audio = 0;
		}

	}

}

Car.prototype.margin = function () {

	if (this.mesh.position.x > size_plane_x / 2) {
		this.mesh.position.x = -size_plane_x / 2;
	}

	if (this.mesh.position.x < -size_plane_x / 2) {
		this.mesh.position.x = size_plane_x / 2;
	}

	if (this.mesh.position.z > size_plane_z / 2) {
		this.mesh.position.z = -size_plane_z / 2;
	}

	if (this.mesh.position.z < -size_plane_z / 2) {
		this.mesh.position.z = size_plane_z / 2;
	}
}