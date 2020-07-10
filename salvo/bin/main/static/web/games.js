//VUE JS
var app = new Vue({
    el: '#app',
    data: {
        leaderBoard: [],
        games: [], //this contains an array with player1, player2 IDs and the games they are playing;
        createGame: [], //this contains the New Game data - gameId, GpId and date
        newGamePlayerId: '',
        players: [],
        gameId: '',
        win: 0,
        lose: 0,
        total: 0,
        userName: '',
        password: '',
        message: '',
        isLoggedIn: false,
        status: [],
        loggedPlayer: '',
        joinButton: false,
        playButton: false,
        islogin: false,
        newData: '',
        gameIdToJoin: "",
        opponentTable: true, // show
        //        scrollPosition: window.pageYOffset,
    },

    created() {
        this.getData();
        this.fetchLeaderBoard();
    },
    methods: {
        getData: function () {
            let url = "/api/games";
            fetch(url, {
                    method: "GET",
                    credentials: "include",
                })
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data);
                    app.status = data;

                    if (data.player) {
                        app.isLoggedIn = true;
                        app.message = 'Welcome ' + data.player.email;
                        app.loggedPlayer = app.status.player.id;
                    } else {
                        app.isLoggedIn = false;
                    }

                    app.getGames();

                })
        },
        newGame: function () {
            fetch("/api/games", {
                    credentials: "include",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data);
                    app.newData = data.newGame;
                    app.opponentTable = false;
                    //                    app.createGame = newData;
                    console.log(app.newData)
                    app.newGamePlayerId = app.newData.gpId;
                    console.log(app.newGamePlayerId);
                    location.replace("/web/game.html?gp=" + app.newGamePlayerId)

                })
            //
            //    } //END api/games fetch

        },



        fetchLeaderBoard: function () {
            let url = "/api/leaderBoard";
            fetch(url, {
                    method: "GET",
                    credentials: "include",
                })
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data)
                    app.players = data.sort((a, b) => b.total - a.total);
                })
        },

        login(wayToLogIn) {


              $.post("/api/login", {
                  email: document.getElementById('username').value,
                  password: document.getElementById('password').value

                })
                .done(function (data) {
              //  console.log(email,password);
                  console.log("logged in!");

                 if (data.status == 200) {
                        if (wayToLogIn != "popup") {
                            if (data.player = !null) {
                                app.getData();
                                app.message = "Welcome " + email;
                                app.islogin = false;
                                app.getGames();
                            }
                        } else {
                            app.joinGame(app.gameIdToJoin)
                        }
                    } else if (data.status == 401) {
                        app.message = 'Incorrect username or password';
                    }


                })
                .fail(function () {
                 console.log(email,password);
                  console.log("failed to log in!");
                });
            },



        getPlayerUrl: function () {
            var stateObject = {
                id: app.loggedPlayer
            };
            var title = "Game View" + app.loggedPlayer;
            var newUrl = "/web/game.html?gp=" + app.loggedPlayer;
            history.pushState(stateObject, title, newUrl);
        },
 logout() {

      $.post("/api/logout")
        .done(function(data){ app.status = data;
                                                  app.isLoggedIn = false;
                                                  app.getData();
                                                  app.islogin = false;
                                                  app.message = "See you later, Captain!";})
        .fail();
    }
    ,

        signUp() {
                     $.post("/api/players", {
                         email: document.getElementById('username').value,
                         password: document.getElementById('password').value

                })
                .then(function (data) {
                    console.log(data);
                    if (data.status == 200) {
                        app.isLoggedIn = true;
                        app.getGames();
                        app.login();
                        app.message = 'Welcome ' + email;
                        app.islogin = false;

                    } else if (data.status == 409) {
                        app.message = "User already exists";
                    } else if (data.status == 401) {
                        app.message = "Incorrect username or password";
                    } else {
                        app.message = 'Information incomplete. Please try again';
                    }
                })
        },



        closePopUpLogIn: function () {
            this.islogin = false;

        },
        openPopUpLogIn: function (id) {
            this.islogin = true;
            app.gameIdToJoin = id;
        },

        loginFromPopUp: function () {

            let thisGame = app.games;
            console.log(app.games)

            app.login("popup");



        },


        getGames: function () {
            let array = [];
            let games = this.status.game;
            let playerTwo = "";
            let playerOne = "";
            let playerOneId = "";
            let playerTwoId = "";
            let status = "";
            //            let player2 = "";
            for (var i = 0; i < games.length; i++) {
                let date = new Date(games[i].created);
                let gp = games[i].gamePlayers;
                let gameId = app.status.game[i].id;
                console.log(gameId);
                let dates = date.toLocaleString();
                if ((gp.length == 2 && gp[0].player.id == this.loggedPlayer)) {
                    status = "Play";
                    playerOneId = gp[0].gpId;
                    playerOne = gp[0].player.email + ' vs';
                    playerTwo = gp[1].player.email;
                    playerTwoId = gp[1].gpId;

                } else if (gp.length == 2 && gp[1].player.id == this.loggedPlayer) {
                    status = "Play"
                    playerOneId = gp[1].gpId;
                    playerOne = gp[1].player.email + ' vs';
                    playerTwo = gp[0].player.email;
                    playerTwoId = gp[0].gpId;
                } else if (gp.length == 1 && gp[0].player.id == this.loggedPlayer) {
                    status = "Play"
                    playerOne = gp[0].player.email;
                    playerTwo = "";
                    playerOneId = gp[0].gpId;
                    playerTwoId = "";

                } else if (gp.length == 1 && gp[0].player.id != this.loggedPlayer) {
                    status = "Join";
                    playerOne = gp[0].player.email;
                    playerTwo = "";
                    playerOneId = gp[0].gpId;
                    playerTwoId = "";

                } else {
                    status = "IN GAME";
                    playerOneId = gp[0].gpId;
                    playerOne = gp[0].player.email + ' vs';
                    playerTwo = gp[1].player.email;
                    playerTwoId = gp[1].gpId;
                }
                console.log(status);
                let object = {
                    created: dates,
                    playerOne: playerOne,
                    playerTwo: playerTwo,
                    playerOneId: playerOneId,
                    playerTwoId: playerTwoId,
                    status: status,
                    gameId: gameId,

                };
                array.push(object);

            }
            this.games = array;

        },

        getGameUrl: function () {
            var stateObject = {
                id: app.gameId
            };
            var title = "Joined Game" + app.gameId;
            var newUrl = "/web/game.html?gp=" + app.gameId;
            history.pushState(stateObject, title, newUrl);
        },

        joinGame: function (id) {
            fetch("/api/game/" + id + "/players", {
                    credentials: "include",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                })
                .then(function (data) {
                    data.json()
                        .then(function (data) {
                            console.log(data)

                        })

                })
        },

        scrollToTop: function () {
            window.scrollTo(0, 0);
        }


    } //end methods
}); //end Vue
/*let loading = true;
let games =[];


let leaderBoard =[];
  fetch("/api/games",
   {method:"GET",
    dataType: 'json'})
    .then(response => {
      console.log(response);
      let json = response.json();
      return json;
    })
    .then(result => {
      loading = false;
     games=result;
     console.log("games are ",games);
     done(games);

    })
    .catch(error => console.log(error));

    function done(games){
    const ol = document.getElementById("allGames");
    return games.game.map(function(game){
                     let li = document.createElement("li");
                     if(game.gamePlayers[0]){
                      li.innerHTML = game.created + " , " + JSON.stringify(game.gamePlayers[0]["player"]["email"]);
                      }
                      else{ li.innerHTML = game.created}

                    ol.appendChild(li);})

}

fetch("/leaderBoard",
   {method:"GET",
    dataType: 'json'})
    .then(response => {
      console.log(response);
      let json = response.json();
      return json;
    })
    .then(result => {
      loading = false;
      leaderBoard=result;
     console.log(leaderBoard);
     console.log(Object.values(leaderBoard[0]));
    leaderBoardTable(leaderBoard);

    })
    .catch(error => console.log(error));


  function leaderBoardTable(leaderBoard){
     for(let j=0;j<leaderBoard.length;j++){
              let tr = document.createElement("tr");
              for(let k=0;k<5;k++){
                      let td= document.createElement("td");
                      td.innerHTML=Object.values(leaderBoard[j])[k];
                      td.style.textAlign="center";
                        tr.appendChild(td);

               }
     document.getElementById("leaders").appendChild(tr);
     }
  }*/






    // $.post("/api/login", { email: "John@hotmail.com", password: "34" }).done(function() { console.log("logged in!"); })


    //  $.post("/api/login", { username: "j.bauer@ctu.gov", password: "123" }).done(function() { console.log("logged in!"); })
  // $.post("/api/logout").done(function() { console.log("logged out"); })
  //$.post("/api/players", { email: "John@hotmail.com", password: "1234" })