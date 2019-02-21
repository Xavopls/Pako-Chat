var camera, scene, renderer;
var planeGeometry;
var audio;

var size_plane_x = 20;
var size_plane_z = 20;

function createCamera() {
	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1, 1000);
	camera.position.x = 15;
	camera.position.y = 16;
	camera.position.z = 13;
	camera.lookAt(scene.position);
}

function createPlane() {
	planeGeometry = new THREE.PlaneGeometry(size_plane_x, size_plane_z);
	var planeMaterial = new THREE.MeshLambertMaterial({
		color: 0xcccccc
	});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.receiveShadow = true;
	plane.rotation.x = -Math.PI / 2;

	scene.add(plane);
}

function createLight() {
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(10, 20, 20);
	spotLight.shadowCameraNear = 20;
	spotLight.shadowCameraFar = 50;
	spotLight.castShadow = true;
	scene.add(spotLight);
}

function createRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	console.log('HEIGHT ', document.getElementById('mid_column_game').offsetHeight, 'Width ', document.getElementById('mid_column_game').offsetWidth)
	renderer.setSize(750, 422);
	renderer.shadowMap.enabled = true;
	document.getElementById("mid_column_game").appendChild(renderer.domElement);
}

function init() {
	createCamera();
	createPlane();
	createLight();
	createRenderer();
}

function animate() {
	client.lambo.render();
	client.lambo.turn();
	client.lambo.update();
	client.lambo.margin();
	client.lambo.audioo();
	//console.log('qeeeeeeeeeeeeeeeeeeeee ');

	if (client.lista_coche.length !== 0) {
		//console.log('LISTA COGA ', client.lista_coche);
		for(var i = 0; i<client.lista_coche.length; i++) {
			console.log('client.nickname', client.nickname);
			console.log('client.lista_coche[i].nickname', client.lista_coche[i].nickname);
			console.log('client', client);

			if (client.nickname !==  client.lista_coche[i].nickname){
				this.geometry = new THREE.BoxGeometry(1, 1, 1);
				this.material = new THREE.MeshLambertMaterial({
					color: client.lista_coche[i].color
				});
				//console.log('aaasdasdasdasdasdasdasd');

				this.mesh = new THREE.Mesh(this.geometry, this.material);
				this.mesh.position.y = 2;
				this.mesh.position.x = client.lista_coche[i].x;
				this.mesh.position.z = client.lista_coche[i].y;
				this.mesh.rotation.y = client.lista_coche[i].rotation;

				scene.add(this.mesh)
			}
		}
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}



motor_powerON = new Audio('/assets/sound/motor.mp3');
motor_powerOFF = new Audio('/assets/sound/motor2.mp3');
scene = new THREE.Scene();

