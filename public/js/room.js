// LIST USERS IN THE SAME ROOM

function show_user_list(){
    console.log('show_user_list)')
    client.show_user_list(on_user_list_shown);
}

function on_user_list_shown(msg){
    console.log('on_show_user_list)')

    var data = JSON.parse(msg.data);
    if (data.msg_type === 'list_users'){
        switch(data.status){
            case 'OK':
                console.log('asdasdasdasdd coche, ',data.car_list)
                if(data.car_list != null){
                    client.lista_coche = data.car_list;
                }
                var player_list = document.querySelector("#player_list");
                while (player_list.lastChild){
                    player_list.removeChild(player_list.lastChild);
                }
                var p = document.createElement('p');
                for (user of data.user_list){
                    var h1 = document.createElement('h1');
                    h1.className = 'client_from_list';
                    h1.innerHTML = '<span style="color:green;">● </span>' + user;
                    p.appendChild(h1);
                    player_list.appendChild(p);
                }
                console.log('WE ARE ALIVE CARLITOS', JSON.stringify(data.car_list));
                console.log('WE ARE ALIVE CARLITOS data cruda', JSON.stringify(data));



                console.log('USER LIST:', data.user_list);
                break;

            case 'ERROR':
                console.log('ERROR');
                break;
        }
    }

}

/*
function updateCar(data){
    console.log('client.lista_coche ', client.lista_coche);
    for(var i = 0; i<client.lista_coche.length; i++){
        if(client.lista_coche[i].nickname === data.nickname){
            client.lista_coche[i].x=data.x;
            client.lista_coche[i].z=data.z;
            client.lista_coche[i].rotation=data.rotation;
        }
    }
}
*/