//VUE JS
var app = new Vue({
    el: '#app',
    data: {
        leaderboard: [],
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
        this.fetchLeaderboard();
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
                        app.loggedPlayer = data.player["player-id"];
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
                    app.newGamePlayerId = app.newData.gamePlayerId;
                    console.log(app.newGamePlayerId);
                    location.replace("/web/game.html?gp=" + app.newGamePlayerId)

                })
            //
            //    } //END api/games fetch

        },



        fetchLeaderboard: function () {
            let url = "/api/leaderboard";
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

        login: function (wayToLogIn) {
               fetch("/api/login", {
                               credentials: 'include',
                               headers: {
                                   'Content-Type': 'application/x-www-form-urlencoded'
                               },
                               method: 'POST',
                               body: 'email=' + this.userName + '&password=' + this.password,

                                   })

                .then(function (data) {
                console.log(data);
                console.log(data.status);
                    if (data.status == 200) {
                        if (wayToLogIn != "popup") {

                                app.getData();
                                app.message = "Welcome " +  this.userName  ;
                                app.islogin = false;
                                app.getGames();

                        } else {
                            app.joinGame(app.gameIdToJoin)
                        }
                    } else if (data.status == 401) {
                        app.message = 'Incorrect username or password';
                    }
                })
                .catch(function (fail) {
                    console.log("error")
                })
        },





        logout: function () {
            fetch("/api/logout", {
                    credentials: "include",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'email=' + this.userName + '&password=' + this.password,
                })
                .then(function (data) {
                    app.status = data;
                    app.isLoggedIn = false;
                    app.getData();
                    app.islogin = false;
                    app.message = "See you later, Captain!";
                    this.userName='';
                    this.password='';

                })
                .catch(function (fail) {
                    console.log("error")
                })
        },

        signUp: function () {
            fetch("/api/players", {
                    credentials: "include",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'email=' + this.userName + '&password=' + this.password,
                })
                .then(function (data) {
                    console.log(data)
                    if (data.status == 201) {
                        app.isLoggedIn = true;
                        app.getGames();
                        app.login();
                        app.message = 'Welcome ' + this.userName;
                        app.islogin = false;

                    } else if (data.status == 403) {
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
            //            app.scrollToTop();
        },
        openPopUpLogIn: function (id) {
            this.islogin = true;
            app.gameIdToJoin = id;
        },

        loginFromPopUp: function () {
         app.userName = document.getElementById("inputEmail").value;
         app.password = document.getElementById("inputPassword").value;

            app.login("popup");




        },


        getGames: function () {
            let array = [];
            let games = this.status.game;
            let gpTarget ="";
            console.log(games);
            let playerTwo = "";
            let playerOne = "";
            let playerOneId = "";
            let playerTwoId = "";
            let status = "";
            //            let player2 = "";
            for (var i = 0; i < games.length; i++) {
                let date = new Date(games[i].created);
                let gp = games[i].gamePlayers;
                let gameId = games[i].ID;

                let dates = date.toLocaleString();
                if ((gp.length == 2 && gp[0].player["player-id"] == this.loggedPlayer)) {
                    status = "Play";
                    playerOneId = gp[0]["gamePlayer-id"];
                    playerOne = gp[0].player.email + ' vs';
                    console.log(gpTarget);
                    playerTwo = gp[1].player.email;
                    playerTwoId = gp[1]["gamePlayer-id"];

                } else if (gp.length == 2 && gp[1].player["player-id"]== this.loggedPlayer) {
                    status = "Play"
                    playerOneId = gp[1]["gamePlayer-id"];
                    playerOne = gp[1].player.email + ' vs';
                     gpTarget=gp[1]["gamePlayer-id"];
                     console.log(gpTarget);
                    playerTwo = gp[0].player.email;
                    playerTwoId = gp[0]["gamePlayer-id"];
                } else if (gp.length == 1 && gp[0].player["player-id"]== this.loggedPlayer) {
                    status = "Play"
                    playerOne = gp[0].player.email;
                     gpTarget=gp[0]["gamePlayer-id"];
                     console.log(gpTarget);
                    playerTwo = "";
                    playerOneId = gp[0]["gamePlayer-id"];
                    playerTwoId = "";

                } else if (gp.length == 1 && gp[0].player["player-id"] != this.loggedPlayer) {
                    status = "Join";
                    console.log("gameId =",gameId);
                    playerOne = gp[0].player.email;
                    playerTwo = "";
                    playerOneId = gp[0]["gamePlayer-id"];
                    playerTwoId = "";

                } else {
                    status = "IN GAME";
                    playerOneId = gp[0]["gamePlayer-id"];
                    playerOne = gp[0].player.email + ' vs';
                    playerTwo = gp[1].player.email;
                    playerTwoId = gp[1]["gamePlayer-id"];
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
                            console.log('Request success: ', data);
                                                if (data.Success) {
                               location.replace("/web/game.html?gp=" +  data.Success);
                                } else {
                                                       alert(data.Error);
                                                   }
                                               }).catch(function (error) {
                                                   console.log('Request failure: ', error);


                        });

                    //    } //END api/games fetch
                })
        },

        scrollToTop: function () {
            window.scrollTo(0, 0);
        },



    } //end methods
}); //end Vue

