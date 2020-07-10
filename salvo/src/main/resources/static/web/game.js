var app = new Vue({
    el: '#app',
    data: {
        gameView: [],
        gameObject: [],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        cols: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        players: {},
        hits: [],

        opponentTable: false,
        vertical: false,
        battleships: [],
        shipUserLocations: [],
    }, //end data

    created() {
        this.fetchData();

    },
    methods: {
        fetchData: function () {

            let id = window.location.search.split("=")[1];
            let url = '/api/game_view/' + id;
            fetch(url, {
                    method: "GET",
                    credentials: "include",
                })
                .then((response) => response.json())
                .then(function (data) {
                        console.log(data);

                    app.game = data;


                    app.gameObject = app.game.gamePlayers;

                    app.displayShips(id);
                    app.getUsername(id);


                    if (app.gameObject.length == 2) {
                        app.opponentTable = true;

                        app.displaySalvoes(app.game['opponentSalvoes'], 'U');
                        app.displaySalvoes(app.game['userSalvoes'], 'E');
                     }else {
                        app.opponentTable = false;
                    }

                })
        },
        addships: function(arr){
         let id = window.location.search.split("=")[1];
          for (let element in arr) {
                         $.post({
                                 url: "/api/games/players/" + id + "/ships",
                                 data: JSON.stringify(
                                     [{
                                         "Type": arr[element].Type,
                                         "Locations": arr[element].Locations

                                     }]
                                 ),
                                 dataType: "text",
                                 contentType: "application/json"
                             })
                             .done(function (data) {
                                console.log(data);

                             })
                             .fail(function () {
                                 console.log("error")
                             })
                     }
       /*  let url = "/api/games/players/"+id+"/ships";
             fetch(url , {
                       credentials: 'include',
                       headers: {
                            'Accept': 'application/json',
                           'Content-Type': 'application/x-www-form-urlencoded'
                       },
                       method: 'POST',
                       body: 'ships=' + arr,

                           })

                            .then(function (data) {
                            console.log(data);

                            })
                            .catch(function (fail) {
                                console.log("fail to save ships")
                            })*/


        },


        //to know the direction of the ship
        detectShipDirection: function (array) {
                  let direction;
                  if (array[0].charAt(0) == array[1].charAt(0)) {
                      direction = "horizontal"
                  } else {
                      direction = "vertical"
                  }
                  return direction;
              },
              //to print the ships from backend into the grid (frontend)
          printShips: function (array, letter) {
                  let ships = array;
                  let shipsToPrint = [];
                  for (let i = 0; i < ships.length; i++) {
                      let location = ships[i].Locations;
                      let type = ships[i].Type.toLocaleLowerCase();
                      let direction = this.detectShipDirection(location);
                      for (let j = 0; j < location.length; j++) {
                         let shipLocation = location[j];
                          let shipCell = document.getElementById(letter + shipLocation);
                          shipCell.classList.add("ship-location");
                           if(shipCell.classList.contains('horizontal')){shipCell.classList.remove('horizontal')}
                           if (shipCell.classList.contains('vertical')){shipCell.classList.remove('vertical')}

                          shipCell.setAttribute("data-type", type);


                         if(j==0){
                          let placedShip = document.getElementById(type);
                          if(placedShip.classList.contains('horizontal')){placedShip.classList.remove('horizontal')}
                          if (placedShip.classList.contains('vertical')){placedShip.classList.remove('vertical')}
                          placedShip.classList.add(direction);
                          placedShip.style.position ="absolute";
                          placedShip.style.top ="0";
                          placedShip.setAttribute("draggable","false");
                          placedShip.setAttribute("onclick","null");
                           shipCell.appendChild(placedShip);}
                      }
                  }
              },
              // finding locations of the ships for both players
        displayShips: function (id) {
                    let array = [];
                    let ships = [];
                    let arrayOpponent=[];
                    let shipsOpponent=[];
                         for(let i=0;i<app.game.gamePlayers.length;i++){
                           if(app.game["gamePlayers"][i]["gamePlayer-id"]==id){
                               ships=app.game.ships[i];
                               console.log("ships are",ships);

                           }
                           else{shipsOpponent=app.game.ships[i];
                           console.log("shipsOpponent are",shipsOpponent);}
                          }

                    if(ships.length != 0){

                     app.printShips(ships,"U");
                    this.shipUserLocations = array;
               }
               if(shipsOpponent.length != 0 ){
                                   for (let i = 0; i < shipsOpponent.length; i++) {



                                       for (let j = 0; j < shipsOpponent[i]["Locations"].length; j++) {
                                           let shipLocation = shipsOpponent[i]["Locations"][j];
                                           console.log(shipLocation);
                                           let checkExist = setInterval(function() {
                                           if(document.getElementById('E' + shipLocation)!= null){

                                           //shiplocation id - dinamically calculates the id as you move on the grid with every cell - it's a special :id="r+c
                                           let cell = document.getElementById('E' + shipLocation).classList.add("ship-location");
                                            document.getElementById('E' + shipLocation).style.backgroundColor="transparent";
                                           arrayOpponent.push(shipLocation);
                                          clearInterval(checkExist);
                                     } } , 100); // check every 100ms
                                     }}

                                   this.shipUserLocations = arrayOpponent;

                              }
          },

        getShipLocation: function (locCell) {
            let shipLoc = document.getElementById(locCell);
            if (shipLoc.classList.contains("shipTypeLabel")) {
                shipLoc.classList.remove("shipTypeLabel")
                shipLoc.classList.add("cellShip");
            }


        },


//to place the pictures of the ships of backend data into the grid
        placeShips: function (locCell) {

             console.log("locCell",locCell);
            let locationCell = document.getElementById(locCell); //contains the whole <td> with drag/drop id and class</td>
            console.log(locationCell);
            let ship ;
            //if the parent is a td
            if(locationCell.classList.contains("userCells")){
                        ship = locationCell.childNodes[0];
                          console.log(ship);}//contains the ship image
            //if the parent is a div in the list
            else{  ship = locationCell.childNodes[1];
                    console.log(ship);}

            let loop; //the largest ship has 5 cells - 4 loops
            let type;
            let locationArray = [];
            var shipInfo = ship.getAttribute('class');
            console.log(shipInfo);
            var shipDirection = shipInfo.slice(9); //contains horizontal if horizontal

            if (ship.id == 'carrier') {
                loop = 4;
                type = 'carrier'
            }
            if (ship.id == 'battleship') {
                loop = 3;
                type = "battleship"
            }
            if (ship.id == 'cruiser') {
                loop = 2;
                type = "cruiser"
            }
            if (ship.id == 'submarine') {
                loop = 2;
                type = "submarine"
            } else if (ship.id == 'destroyer') {
                loop = 1
                type = "destroyer"
            }

            //------> GET LOCATION OF THIS SHIP--->
            //get the letter corresponding to the id of the cell with the ship
            let letter = locationCell.id.charAt(1);
            //get the number corresponding to the id of the cell location of the ship and transform into a number with parseFloat - it parses the string until it reaches the end of that number
            let numberId = locationCell.id;
            console.log(numberId);
            //checks to see if the number location has one or two digits (10) and returns the only one with an integer value;
            let number;
            if(numberId.length==4){
              number = numberId.substr(2);

            }else{
                    let checkNumber = numberId.substr(numberId.length - 2);
                     number = checkNumber.charAt(1);

            }

            console.log("location letter is " + letter + " and " + "location number is " + number);
            //add the location into the array
            locationArray.push(letter + number);
            document.getElementById("U"+letter + number).classList.add("ship-location");



            if(shipDirection == "horizontal"){
            for (let i=0; i<loop;i++){
                     number++;
                     if(number>10){
                     console.log("choose another location");
                     break;
                     }else{
                      locationArray.push(letter + number);
                      console.log(locationArray);
                      document.getElementById("U"+letter + number).classList.add("ship-location");
                      console.log(letter+number);
                      }

                     }
            }else{
           let rows=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
           let k =0;
               for(let i=0;i<loop;i++){
                 for(let j=0;j<rows.length;j++){
                    if (rows[j]==letter)
                    {
                                   if(j==10)
                                   {
                                   console.log("choose another location");
                                   break;
                                   }
                                   else{

                                            if(k<loop){

                                                     k++;
                                                    letter=rows[j+1];
                                                    console.log(letter+number);
                                                    document.getElementById("U"+letter + number).classList.add("ship-location");
                                                    locationArray.push(letter + number);
                                                    console.log(locationArray);
                                                     }


                                   }
                      }
                  }
                }
            }
           let newShip = {
                           Type: type,
                           Locations: locationArray,
                       }
            console.log("new ship is",newShip);
              return newShip;


        },
//to show salvoes on the player grid
        displaySalvoes: function (array, table) {
            let salvoes = array;
            for (var i = 0; i < salvoes.length; i++) {
                let turn = salvoes[i].Turn;
                let locations = salvoes[i].Locations;
                for (let j = 0; j < locations.length; j++) {
                    let salvoLocation = locations[j];
                    // wait for the opponent table to build
                    let checkExist = setInterval(function() {
                       if (document.getElementById(table + salvoLocation) != null) {
                          console.log("Exists!");
                           let cell =  document.getElementById(table + salvoLocation);
                           let text = document.createElement("span");
                           text.innerHTML="turn: " + turn;
                           text.style.textAlign ="center";
                           cell.style.verticalAlign="top";
                            cell.appendChild(text);

                            cell.classList.add("salvo-location");
                             if (cell.classList.contains("ship-location")) {
                                                    cell.classList.add("hit");
                                                }
                          clearInterval(checkExist);
                       }
                    }, 100); // check every 100ms



                   }

            }

        },
        // to know who is the player and who is the Opponent
        getUsername: function (id) {
            let gamePlayers = app.game.gamePlayers;
            console.log(gamePlayers);
            let player1;
            let player2;
           for(let i=0;i<gamePlayers.length;i++){
                if(gamePlayers[i]["gamePlayer-id"]==id){
                    player1=gamePlayers[i].player.email;

                            if (gamePlayers.length>1 && gamePlayers[i-1]) {
                                            player2 = gamePlayers[i-1].player.email;
                                            break;
                            } else if(gamePlayers.length>1 && gamePlayers[i+1]){
                                             player2 = gamePlayers[i+1].player.email;
                                            break;
                            }else {
                                            player2 ="";
                                            break;
                            }
                }
            }




            app.players = {
                player1: player1,
                player2: player2
            }
        }
    }
})
//drag and drop
let ships = document.querySelectorAll('.shipTypeLabel');
let cells = document.querySelectorAll('.userCells');
let existingShips = document.querySelectorAll('.ship-location');
let shipArray=[];
let turnaction=false;
var id;

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
}

function startDrag(ev) {
console.log(ev);
console.log(ev.target);
    id = ev.target.id;
    console.log(id);
}

function drop(ev) {
let available =  false;
turnaction=false;
let droppedship=[];
 console.log(ev);

    if (ev.toElement.classList.contains("userCells") && !ev.toElement.classList.contains("ship-located")) {

        let locShip = ev.target.id;

        console.log(locShip); //location where the ship was dropped


     available= checkavailability(locShip);
      console.log(available);
      if(available){

      ev.target.appendChild(document.getElementById(id));

     document.getElementById(id).style.top ="0";
    document.getElementById(id).style.position ="absolute";

        console.log(locShip);
       droppedship =app.placeShips(locShip);
        for(let i=0;i<shipArray.length;i++){
           if(shipArray[i].Type === droppedship.Type){
                shipArray.splice(i,1);
           }
        }


    shipArray.push(droppedship);
    console.log(shipArray);}


    }
}


function turnTheShip(imgId) {
             console.log("shipArray before flipping", shipArray);
        let imgTarget = document.querySelector('#'+imgId);
        console.log(imgTarget);
        let parent=imgTarget.parentNode;
        let available= false;
        console.log(parent.id);
   if(parent.id.indexOf('div') > -1){
         if (imgTarget.classList.contains('horizontal')) {
                    imgTarget.classList.remove('horizontal');
                    imgTarget.classList.add("vertical");}
          else{
                     imgTarget.classList.add('horizontal');
                     imgTarget.classList.remove('vertical');}


   }


   else{
        turnaction=true;
        console.log(imgTarget.classList);

        if (imgTarget.classList.contains("horizontal")) {
            imgTarget.classList.remove("horizontal");
            imgTarget.classList.add("vertical");
            console.log(imgTarget);
            console.log(imgTarget.classList);
             available=checkavailability(parent.id);
             console.log(available);

        }
        else{
            imgTarget.classList.add("horizontal");
            imgTarget.classList.remove("vertical");
                console.log(imgTarget.classList);
              if(parent.classList.contains("userCells")){

                  available=checkavailability(parent.id);
                  console.log(available);}

        }

        if(available){

                                            console.log(imgTarget.parentNode.id);
                                           // document.getElementById(imgTarget.parentNode.id).classList.remove("ship-location");
                                           let flipped =app.placeShips(imgTarget.parentNode.id);
                                           if(shipArray ==[]){shipArray.push(app.placeShips(imgTarget.parentNode.id));
                                                                             console.log(shipArray);
                                                              }
                                           else{
                                                       for(let i=0;i<shipArray.length;i++){
                                                                   if(shipArray[i].Type==flipped.Type){
                                                                        shipArray[i].Locations=flipped.Locations;
                                                                        console.log("shipArray after flipping an old ship",shipArray);}
                                                            }
                                                }

                 }
        else{

                 if (imgTarget.classList.contains('horizontal')) {
                                   imgTarget.classList.remove('horizontal');
                                   imgTarget.classList.add("vertical");

                                   }
                   else{
                                               imgTarget.classList.add('horizontal');
                                               imgTarget.classList.remove('vertical');
                                              }
                                              console.log(imgTarget.classList);
                     parent.appendChild(imgTarget);
            }
            }
    }

function  checkavailability(locCell){
let available = false;
console.log("locCell",locCell);
                let locationCell = document.getElementById(locCell); //contains the whole <td> with drag/drop id and class</td>
                console.log(locationCell)
              //  let ship = locationCell.childNodes[0]; //contains the ship image
              console.log(id);
              console.log(document.getElementById(id));

              let ship =document.getElementById(id);
                let loop; //the largest ship has 5 cells - 4 loops
                let type;
                let locationArray = [];
                var shipInfo = ship.getAttribute('class');
                console.log(shipInfo);
                var shipDirection = shipInfo.slice(9); //contains horizontal if horizontal
                 console.log(shipDirection);
                if (ship.id == 'carrier') {
                    loop = 4;
                    type = 'carrier'
                }
                if (ship.id == 'battleship') {
                    loop = 3;
                    type = "battleship"
                }
                if (ship.id == 'cruiser') {
                    loop = 2;
                    type = "cruiser"
                }
                if (ship.id == 'submarine') {
                    loop = 2;
                    type = "submarine"
                } else if (ship.id == 'destroyer') {
                    loop = 1
                    type = "destroyer"
                }

                //------> GET LOCATION OF THIS SHIP--->
                //get the letter corresponding to the id of the cell with the ship
                let letter = locationCell.id.charAt(1);
                //get the number corresponding to the id of the cell location of the ship and transform into a number with parseFloat - it parses the string until it reaches the end of that number
                let numberId = locationCell.id;
                //checks to see if the number location has one or two digits (10) and returns the only one with an integer value;
                 let number;
                           if(numberId.length==4){
                             number = numberId.substr(2);

                           }else{
                                   let checkNumber = numberId.substr(numberId.length - 2);
                                    number = checkNumber.charAt(1);

                           }


                           console.log("location letter is " + letter + " and " + "location number is " + number);

                           if(shipDirection=="horizontal"){
                                let newlocations=[];
                                let k=0;
                                let newcell;
                                 console.log(loop);

                                 for(let i=0;i<loop;i++){
                                 k=i+1+Number(number);

                                   newlocations[i]=letter+(k).toString();
                                  console.log("newlocations",newlocations[i]);
                                 }
                                   console.log(newlocations);
                                   console.log(shipArray);
                                   console.log(turnaction);
                              if(turnaction==false){
                                 if(newlocations != []){
                                             for(let n=0;n<newlocations.length;n++){
                                                for(let m=0;m<shipArray.length;m++){
                                                    for(let l=0;l<shipArray[m].Locations.length;l++){
                                                         if(shipArray[m].Locations[l] == newlocations[n]){
                                                             available = false;
                                                            return available;
                                                          }
                                                     }
                                                }
                                             }
                                    }
                                }
                                else{
                                   if(newlocations != []){
                                                for(let n=1;n<newlocations.length;n++){
                                                   for(let m=0;m<shipArray.length;m++){
                                                       for(let l=0;l<shipArray[m].Locations.length;l++){
                                                            if(shipArray[m].Locations[l] == newlocations[n]){
                                                                available = false;
                                                               return available;
                                                             }
                                                        }
                                                   }
                                                }
                                       }
                                }

                                   if(Number(number)+Number(loop)>10){
                                         console.log(Number(number)+Number(loop)+1);
                                        console.log("this is not allowed");
                                        let div = document.getElementById("div"+type);
                                        div.appendChild(ship);
                                        available=false;
                                        return available;

                                   }else{
                                   available=true;
                                   console.log(available);
                                   return available;

                                                }
                           }else if(shipDirection=="vertical"){
                           let newlocations=[];
                           let k="";
                            let newcell;
                           let rows=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
                                 for(let f=0;f<rows.length;f++){
                                      if(rows[f]==letter){
                                          for(let s=0;s<loop;s++){
                                                k=rows[f+1+s];
                                                newlocations[s]=k+number;
                                                console.log(newlocations);
                                             }
                                          }

                                      }
                                      console.log(newlocations);
                                      console.log(shipArray);
                                      console.log(turnaction);
                               if(turnaction==false){
                                      if(newlocations != []){
                                                               for(let n=0;n<newlocations.length;n++){
                                                                  for(let m=0;m<shipArray.length;m++){
                                                                      for(let l=0;l<shipArray[m].Locations.length;l++){
                                                                           if(shipArray[m].Locations[l] == newlocations[n]){
                                                                               available = false;
                                                                              return available;
                                                                            }
                                                                       }
                                                                  }
                                                               }
                                                            }
                                 }
                                 else{
                                      if(newlocations != []){
                                                 for(let n=0;n<newlocations.length;n++){
                                                    for(let m=0;m<shipArray.length;m++){
                                                        for(let l=1;l<shipArray[m].Locations.length;l++){
                                                             if(shipArray[m].Locations[l] == newlocations[n]){
                                                                 available = false;
                                                                return available;
                                                              }
                                                         }
                                                    }
                                                 }
                                              }

                                 }
                                               for(let j=0;j<rows.length;j++){
                                                                   if (rows[j]==letter){
                                                                      if(j+Number(loop)>9){
                                                                         console.log("not allowed");
                                                                          let div = document.getElementById("div"+type);

                                                                           div.appendChild(ship);
                                                                           available=false;
                                                                           return available;
                                                                      }else{
                                                                    available=true;
                                                                     return available;
                                                                                    }
                                                                   }
                                                }

                           }

}
function saveships(){
   if(shipArray.length != 5){
     window.alert("please locate all your ships first then you can save");
   }else
   {
   app.addships(shipArray);

   }
}
