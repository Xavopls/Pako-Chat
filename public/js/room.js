
// LIST USERS IN THE SAME ROOM

function show_user_list(){
    client.show_user_list(on_user_list_shown);    
}

function on_user_list_shown(msg){
    var data = JSON.parse(msg.data);
    if (data.msg_type === 'list_users'){
        switch(data.status){
            case 'OK':
                var player_list = document.querySelector("#player_list");
                while (player_list.lastChild){
                    player_list.removeChild(player_list.lastChild);
                }
                var p = document.createElement('p');
                for (var i = 0; i<data.user_list.length; i++){
                    var h1 = document.createElement('h1');
                    h1.className = 'client_from_list';
                    h1.innerHTML = '<span>● </span>' + data.user_list[i];
                    p.appendChild(h1);
                    player_list.appendChild(p);
                }
                client.car_list = data.car_list;
                init();
                animate();
                
                console.log('USER LIST:', data.user_list);
                break;

            case 'ERROR':
                console.log('ERROR');
                break;
        }
    }

}
