var app = new Vue({
      el:'#app',
      data:{
      game:[],
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      cols: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      created(){
      this.fetchData();
      drawGrid(1);
      drawGrid(2);
      },
      methods:{
                    fetchData: function(){
                               let idGame = window.location.search.split("=")[1];
                               let url = '/api/game_view/' + idGame;
                                fetch(url, {
                                       method: "GET",
                                       credentials: "include",
                                   })
                               .then((response) => response.json())
                              .then(function (data){
                           app.game=data.game;
                           console.log(game);
                           playersEmails(game);
                                colorGridShip(game);
                                colorGridSalvo(game);} )},
                    drawGrid:function(tableId){
                     let tr = document.createElement("tr");
                           let th= document.createElement("th");
                            tr.appendChild(th);
                             document.getElementById("table-headers-"+tableId).appendChild(tr);


                           for(let i=0;i<cols.length;i++){
                           let th= document.createElement("th");
                           th.innerHTML=cols[i];
                            tr.appendChild(th);
                           }
                            document.getElementById("table-headers-"+tableId).appendChild(tr);

                            for(let j=0;j<rows.length;j++){

                             let tr = document.createElement("tr");
                              let td= document.createElement("td");
                              td.innerHTML=rows[j];
                              tr.appendChild(td);
                              document.getElementById("table-rows-"+tableId).appendChild(tr);

                              for(i=0;i<cols.length;i++){
                                  let td= document.createElement("td");

                                  td.id=rows[j]+cols[i]+"-"+tableId;
                                   tr.appendChild(td);
                                   document.getElementById("table-rows-"+tableId).appendChild(tr);

                                    }
                            }

                    },
                     playersEmails:function(game){
                     for(let i=0;i<game.gamePlayers.length;i++){
                     if(game["gamePlayers"][i]["gamePlayer-id"]==idGame){
                           document.getElementById("player-active").innerHTML=game["gamePlayers"][i]["player"]["email"];
                           }else{
                           document.getElementById("player-viewer").innerHTML=game["gamePlayers"][i]["player"]["email"];
                           }
                     }
                    },
                     colorGridShip:function(game){
                      let spots=[];
                        for(let i=0;i<game.gamePlayers.length;i++){
                         if(game["gamePlayers"][i]["gamePlayer-id"]==idGame){
                             spots=game.ships[i];
                             console.log("spots",spots);

                         }
                        }
                       for(let k=0;k<spots.length;k++){
                       for (let c=0;c<spots[k]["Locations"].length;c++ ){
                       console.log(spots[k]["Locations"][c]);
                         let shipPlace=document.getElementById(spots[k]["Locations"][c]+"-1");
                          shipPlace.style.backgroundColor= "#00E5EE";
                        }
                      }
                       let shots=[];
                        let turns=[];
                      for(let j=0;j<game.opponentSalvoes.length;j++){
                           shots=game.opponentSalvoes[j]["Locations"];
                           turns.push(game.opponentSalvoes[j]["Turn"]);
                            console.log(shots);
                            console.log(turns);
                            for(let c=0;c<shots.length;c++){
                                          let salvoPlace=document.getElementById(shots[c]+"-1");
                                          for(let d=0;d<spots.length;d++){
                                              if(spots[d]["Locations"].includes(shots[c])){
                                                  salvoPlace.style.backgroundColor="red";}
                                              else{salvoPlace.style.backgroundColor="orange";}
                                          }
                                          document.getElementById(shots[c]+"-1").innerHTML="turn : "+turns[j];


                            }
                          }

                      },
                      colorGridSalvo: function(game){
                                    let shots=[];
                                    let turns=[];
                                    for(let j=0;j<game.userSalvoes.length;j++){
                                              shots=game.userSalvoes[j]["Locations"];
                                              turns.push(game.userSalvoes[j]["Turn"]);
                                              console.log(shots);
                                              console.log(turns);
                                              for(let c=0;c<shots.length;c++){
                                                            let salvoPlace=document.getElementById(shots[c]+"-2");
                                                            salvoPlace.style.backgroundColor="red";
                                                            document.getElementById(shots[c]+"-2").innerHTML="turn : "+turns[j];


                                              }

                                    }

                         }




              }
                    });
/*var app = new Vue({
    el: '#app',
    data: {
        gameView: [],
        gameObject: [],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        cols: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        players: {},
        hits: [],
        opponentTable: false,
        opponentTable: false,
        vertical: false,
        battleships: [],
        shipsA: [],
    }, //end data

    created() {
        this.fetchData();
        //        this.getShipLocation();

    },
    methods:{
    fetchData: function () {

            let id = window.location.search.split("=")[1];
            let url = '/api/game_view/' + id;
            fetch(url, {
                    method: "GET",
                    credentials: "include",
                })
                .then((response) => response.json())
                .then(function (data) {

                    app.gameView = data.gameView;
                    console.log(app.gameView);

                    app.gameObject = app.gameView.game.gamePlayers;
                    app.displayShips();
                    app.getUsername();
                    app.displaySalvoes(app.gameView['userSalvoes'], 'E')
                    if (app.gameObject.length == 2) {
                        app.opponentTable = true;
                        app.displaySalvoes(app.gameView['opponentSalvoes'], 'U')
                    } else {
                        app.opponentTable = false;
                    }

                })
        }
}});*/
 /*let idGame = window.location.search.split("=")[1];
 let cols=["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
 let rows=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
 let game =[];
 fetch("/api/game_view/"+ idGame,
   {method:"GET",
    dataType: 'json'})
    .then(response => {
      console.log(response);
      let json = response.json();
      return json;
    })
    .then(result => {
      loading = false;
      game=result;
      console.log(game);



     playersEmails(game);
     colorGridShip(game);
     colorGridSalvo(game);
    })
    .catch(error => console.log(error));


 function drawGrid(tableId){
       let tr = document.createElement("tr");
       let th= document.createElement("th");
        tr.appendChild(th);
         document.getElementById("table-headers-"+tableId).appendChild(tr);


       for(let i=0;i<cols.length;i++){
       let th= document.createElement("th");
       th.innerHTML=cols[i];
        tr.appendChild(th);
       }
        document.getElementById("table-headers-"+tableId).appendChild(tr);

        for(let j=0;j<rows.length;j++){

         let tr = document.createElement("tr");
          let td= document.createElement("td");
          td.innerHTML=rows[j];
          tr.appendChild(td);
          document.getElementById("table-rows-"+tableId).appendChild(tr);

          for(i=0;i<cols.length;i++){
              let td= document.createElement("td");

              td.id=rows[j]+cols[i]+"-"+tableId;
               tr.appendChild(td);
               document.getElementById("table-rows-"+tableId).appendChild(tr);

                }
        }
    }
drawGrid(1);
drawGrid(2);




function playersEmails(game){
 for(let i=0;i<game.gamePlayers.length;i++){
 if(game["gamePlayers"][i]["gamePlayer-id"]==idGame){
       document.getElementById("player-active").innerHTML=game["gamePlayers"][i]["player"]["email"];
       }else{
       document.getElementById("player-viewer").innerHTML=game["gamePlayers"][i]["player"]["email"];
       }
 }
}
function colorGridShip(game){
let spots=[];
  for(let i=0;i<game.gamePlayers.length;i++){
   if(game["gamePlayers"][i]["gamePlayer-id"]==idGame){
       spots=game.ships[i];
       console.log("spots",spots);

   }
  }
 for(let k=0;k<spots.length;k++){
 for (let c=0;c<spots[k]["Locations"].length;c++ ){
 console.log(spots[k]["Locations"][c]);
   let shipPlace=document.getElementById(spots[k]["Locations"][c]+"-1");
    shipPlace.style.backgroundColor= "#00E5EE";
  }
}
 let shots=[];
  let turns=[];
for(let j=0;j<game.opponentSalvoes.length;j++){
     shots=game.opponentSalvoes[j]["Locations"];
     turns.push(game.opponentSalvoes[j]["Turn"]);
      console.log(shots);
      console.log(turns);
      for(let c=0;c<shots.length;c++){
                    let salvoPlace=document.getElementById(shots[c]+"-1");
                    for(let d=0;d<spots.length;d++){
                        if(spots[d]["Locations"].includes(shots[c])){
                            salvoPlace.style.backgroundColor="red";}
                        else{salvoPlace.style.backgroundColor="orange";}
                    }
                    document.getElementById(shots[c]+"-1").innerHTML="turn : "+turns[j];


      }
    }

}


function colorGridSalvo(game){
            let shots=[];
            let turns=[];
            for(let j=0;j<game.userSalvoes.length;j++){
                      shots=game.userSalvoes[j]["Locations"];
                      turns.push(game.userSalvoes[j]["Turn"]);
                      console.log(shots);
                      console.log(turns);
                      for(let c=0;c<shots.length;c++){
                                    let salvoPlace=document.getElementById(shots[c]+"-2");
                                    salvoPlace.style.backgroundColor="red";
                                    document.getElementById(shots[c]+"-2").innerHTML="turn : "+turns[j];


                      }

            }

 }*/

