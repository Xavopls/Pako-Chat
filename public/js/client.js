function Client() {

    this.ws = new WebSocket('ws://localhost:9048');
    //this.ws = new WebSocket('ws://ecv-etic.upf.edu:9048');
    this.ws.z = () => {
        console.log('Websocket connected!');

        // sending a send event to websocket server
        this.ws.send('connected')
    };

    this.room = '';
    this.nickname = '';
    this.color = '';
    this.status = '';
    this.nickname = '';
    this.car = new Car();
    this.lista_coche= [];
    this.onResponse = (resp) => {
        console.log('resp ', resp);
    };
    this.connect = () => {
        this.ws.send("You are connected!")
    };


    var car_client_1 = new Car();
    car_client_1.mesh.position.x = 6
    car_client_1.mesh.position.z = 8
    car_client_1.mesh.rotation.y = 4
    this.lista_coche.push(["car_client_1", car_client_1])

    var car_client_2 = new Car();
    car_client_2.mesh.position.x = 2
    car_client_2.mesh.position.z = 5
    car_client_2.mesh.rotation.y = 10
    this.lista_coche.push(["car_client_2", car_client_2])

    var car_client_3 = new Car();
    car_client_3.mesh.position.x = 8
    car_client_3.mesh.position.z = 2
    car_client_3.mesh.rotation.y = 3
    this.lista_coche.push(["car_client_3", car_client_3])




    this.ws.onmessage = (msg) => {
        var data = JSON.parse(msg.data);
        console.log('data.status: ', data.status);

        if (data.status === 'OK' || data.status === 'ERROR') {
            this.onResponse(msg);
            
            if(data.msg_type === 'create_room' || data.msg_type === 'join_room'){
                this.color=data.color;
            } 


        } else if (data.msg_type === 'update_chat') {
            receiveMessage(msg);
        } else if (data.msg_type === 'update_mesh') {
            updateCar(data);
        }
        
    };




    function updateCar(data){
        for(car of this.car_list){
            if(car.nickname == data.nickname){
                car.mesh.position.x=data.x
                car.mesh.position.z=data.z
                car.mesh.rotation=data.rotation
                scene.add(car.mesh);
            }
        }
    }

    this.join_room = (room_name, client_name, callback_fn) => {
        var message = {
            'msg_type': 'join_room',
            'room_name': room_name,
            'nickname': client_name
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    this.create_room = (room_name, client_name, callback_fn) => {
        var message = {
            'msg_type': 'create_room',
            'room_name': room_name,
            'nickname': client_name
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    this.list_rooms = (callback_fn) => {
        var message = {
            'msg_type': 'list_rooms'
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    }

    this.show_user_list = (callback_fn) => {
        var message = {
            'msg_type': 'show_user_list'
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    }
    this.send_message = (msg_content, callback_fn) => {
        var message = {
            'msg_type': 'send_message',
            'content': msg_content
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    }

    this.send_position = (msg_content, callback_fn) => {
        var message = {
            'msg_type': 'position',
            'x': msg_content.x,
            'y': msg_content.y
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    }
}