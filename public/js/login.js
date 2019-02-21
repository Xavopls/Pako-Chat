var client = new Client();

var new_server;
var canvasPos;



// CREATE ROOM
var set_createroom = document.querySelector("#set_createroom");
set_createroom.addEventListener("click", function () {
	var room_name = document.querySelector("#createroom").value;
	var user_name = document.querySelector("#nickname").value;
	if (room_name.length > 0 && user_name.length > 0){
		client.nickname = user_name;
		client.create_room(room_name, user_name, on_room_created);
	}
});

function on_room_created(msg) {
	var data = JSON.parse(msg.data);
	switch (data.status) {
		case 'repeated':
			alert('Room name already exists');
			break;

		case 'OK':
			console.log('CLIENT     ', client);

			document.querySelector("#login_page_container").style.display = "none"; //Ocultamos login y desplegamos el chat
			document.querySelector("#game_page_container").style.display = "inline";
			//client.lista_coche.push([client.nickname, client.car]);
			show_user_list();
			init();
			animate();
			break;

	}
}


// JOIN ROOM
var join_room = document.querySelector("#join_room");
join_room.addEventListener("click", function () {
	var select_room = document.getElementById("select_room");
	var joined_room = select_room.options[select_room.selectedIndex].value;
	var client_nick = document.querySelector("#nickname").value;
	if(client_nick.length > 0){
		client.nickname = client_nick;
		client.join_room(joined_room,client_nick, on_room_joined);
	}
});

function on_room_joined(msg){
	var data = JSON.parse(msg.data);
	switch (data.status) {
		case 'repeated':
			alert('Room does not exist, try refreshing the page');
			break;

		case 'OK':
			document.querySelector("#login_page_container").style.display = "none"; //Ocultamos login y desplegamos el chat
			document.querySelector("#game_page_container").style.display = "inline";

			init();
			animate();
			show_user_list();
			break;

	}
}




// LIST ROOMS
var dropdown_rooms = document.querySelector("#dropdown_rooms");
dropdown_rooms.addEventListener("click", function () {
	client.list_rooms(on_rooms_received);
});

function on_rooms_received(msg){
	var data = JSON.parse(msg.data);
	var rooms = data.rooms;
	console.log(rooms);

		rooms.forEach((sala) => {
			var name_room = decodeURI(sala); //decodeURI para que no nos de caracteres raros tipo espacios como %20
			if (name_room) {
					var element = document.createElement("option");
					element.innerHTML = name_room;
					element.value = name_room;
					document.querySelector("#select_room").appendChild(element);
			}
		});
}
