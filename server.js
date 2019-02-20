// INIT VARIABLES
colores = ['FF6633', 'FFB399', 'FF33FF', 'FFFF99', '00B3E6',
    'E6B333', '3366E6', '999966', '99FF99', 'B34D4D',
    '80B300', '809900', 'E6B3B3', '6680B3', '66991A',
    'FF99E6', 'CCFF1A', 'FF1A66', 'E6331A', '33FFCC',
    '66994D', 'B366CC', '4D8000', 'B33300', 'CC80CC',
    '66664D', '991AFF', 'E666FF', '4DB3FF', '1AB399',
    'E666B3', '33991A', 'CC9999', 'B3B31A', '00E680',
    '4D8066', '809980', 'E6FF80', '1AFF33', '999933',
    'FF3380', 'CCCC00', '66E64D', '4D80CC', '9900B3',
    'E64D66', '4DB380', 'FF4D4D', '99E6E6', '6666FF'
];
var room_list = [];
var room_list_by_id = {};
var id_client_counter = 1;
var id_room_counter = 1;


// LISTENER SERVER
var express = require('express');
var app = express();
var port = 9047;

app.use(express.static('public'));

app.listen(port, function () {
    console.log("Server running at port: ", port);
});


function Room(){
    this.name = '';
    this.clients = [];
    this.id = '';
    this.client_list_by_nickname = [];
    this.painted_areas = [];
    this.chat_messages = [];
}




// WEB SOCKET SERVICE
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 9048});

wss.on('connection', function (client) {
    // AQUI SE CREA EL NUEVO CLIENTE
    client.id = id_client_counter;
    id_client_counter++;
    client.color = colores[Math.floor(Math.random() * colores.length)];

    client.on('message', function (message) {
        console.log('%s --- Received: %s', new Date().toLocaleString(), message);
        var client_msg = '';
        try {
            client_msg = JSON.parse(message);
        } catch(e) {
            return
        }
            switch (client_msg.msg_type) {
            //** LOGIN PAGE **/
                case 'create_room':
                    createRoom(client, client_msg);
                    break;

                case 'join_room':
                    joinRoom(client, client_msg);
                    break;

                case 'list_rooms':
                    listRooms(client);
                    break;

                case 'show_user_list':
                    showUserList(client);
                    break;

                case 'send_message':
                    sendMessage(client, client_msg.content);
                    updateChat(client);
                    break;

            }

    });
});

function createRoom(client, client_msg){
    // Miramos si existe
    var room_name = client_msg.room_name;
    var room = room_list_by_id[ room_name ];

    // SI LA SALA NO EXISTE
    if (!room){
        console.log('create_room');
        room = new Room();
        room.name = client_msg.room_name;
        room.id = id_room_counter;
        client.room = room;
        id_client_counter++;
        client.nickname = client_msg.nickname;
        room.clients.push(client);
        room.client_list_by_nickname.push(client_msg.nickname);
        room_list.push(room);
        room_list_by_id[ room.name ] = room;
        id_room_counter++;
        var msg = {
            'msg_type': 'create_room',
            'status': 'OK'
        };
        client.send(JSON.stringify(msg));
    }

    // SI LA SALA YA EXISTE
    else {
        repeatedRoom();
    }
}

function repeatedRoom(){
    var msg = {
        'msg_type': 'create_room',
        'status': 'ERROR'
    }
    client.send(JSON.stringify(msg));
}

function joinRoom(client, client_msg){
    client.nickname = client_msg.nickname;
    for (var i = 0; i<room_list.length;i++){
        if (client_msg.room_name === room_list[i].name){
            client.room = room_list[i];
            room_list[i].clients.push(client);
            room_list[i].client_list_by_nickname.push(client.nickname);
            updateClients(room_list[i])
        }
    }
    var msg = {
        'msg_type': 'join_room',
        'status': 'OK'
    };
    client.send(JSON.stringify(msg));
}

function listRooms(client){
    console.log(room_list);
    var room_ids = [];
    for (var i = 0; i<room_list.length; i++){
        room_ids.push(room_list[i].name);
    }
    var msg = {
        'msg_type': 'room_list',
        'status': 'OK',
        'rooms': room_ids
    };
    JSON.stringify(msg);
    client.send(JSON.stringify(msg));
}

function showUserList(client){
    var found = false;
    console.log("CLIENT ROOM ID: " ,client.room.id);
    for(var i=0; i<room_list.length;i++){
        if (room_list[i].id === client.room.id){
            found = true;
            var msg = {
                'msg_type': 'list_users',
                'status': 'OK',
                'user_list': room_list[i].client_list_by_nickname
            };
            JSON.stringify(msg);
            client.send(JSON.stringify(msg));
        }
    }

    if(!found){
        var msg = {
            'msg_type': 'list_users',
            'status': 'ERROR'
        };
        JSON.stringify(msg);
        client.send(JSON.stringify(msg));
    }
}

function updateClients(room) {
    var msg = {
        'msg_type': 'list_users',
        'status': 'OK',
        'user_list': room.client_list_by_nickname
    };
    JSON.stringify(msg);

    for (var i = 0; i< room.clients.length; i++){
        room.clients[i].send(JSON.stringify(msg));
    }
}

function sendMessage(client, cl_message) {
    for(var i=0; i<room_list.length;i++) {
        if (room_list[i].id === client.room.id) {
            room_list[i].chat_messages.push([client.nickname, cl_message]);
        }
    }
        var msg = {
        'msg_type': 'send_message',
        'status': 'OK',
        'content': cl_message
    };
    JSON.stringify(msg);
    client.send(JSON.stringify(msg));
}

function updateChat(client) {
    for(var i=0; i<room_list.length;i++) {
        if (room_list[i].id === client.room.id) {
            var msg = {
                'msg_type': 'update_chat',
                'content': room_list[i].chat_messages
            };
            for(var j = 0; j<room_list[i].clients.length; j++){
                if (room_list[i].clients[j].nickname !== client.nickname){
                    room_list[i].clients[j].send(JSON.stringify(msg));
                }
            }
        }
    }
}