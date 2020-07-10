package com.codeoftheweb.salvo;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private ScoreRepository scoreRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private PlayerRepository playerRepository;
    private ShipRepository shipRepository;
    @Autowired
    private SalvoRepository salvoRepository;


    public List<Game> getAll() {
        return gameRepository.findAll();
    }
    // function takes a game returning an object
    private Map<String,Object> makeGameObject(Game game) {
        Map<String,Object> gameObject= new LinkedHashMap<String, Object>();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();
        gameObject.put("ID", game.getId());
        gameObject.put("created", game.getDate());
        gameObject.put("gamePlayers", gamePlayers.stream().map(this::makeGamePlayerObject).collect(Collectors.toList()));
        gameObject.put("ships", gamePlayers.stream().map(this::shipList));
        gameObject.put("salvoes",gamePlayers.stream().map(this::salvoList));




        return gameObject;
    }
    // function takes a player returning an object
    private Map<String,Object> makePlayerObject(Player player){
        Map<String,Object> playerObject=new LinkedHashMap<String, Object>();
        playerObject.put("player-id", player.getId());
        playerObject.put("email",player.getUserName());
        return playerObject;
    }

    // function takes a gamePlayer returning an object
    private Map<String,Object> makeGamePlayerObject(GamePlayer gamePlayer){
        Map<String,Object> GamePlayerObject=new LinkedHashMap<String, Object>();
        GamePlayerObject.put("gamePlayer-id", gamePlayer.getId());
        GamePlayerObject.put("player",makePlayerObject(gamePlayer.getPlayer()));
        GamePlayerObject.put("score", makeScoreObject(gamePlayer));

        return GamePlayerObject;
    }
    // function takes score returning an object
    public Map<String, Object> makeScoreObject(GamePlayer gamePlayer){

        Map<String, Object> score = new LinkedHashMap<>();
        if (gamePlayer.getScore() != null) {
            score.put("score", gamePlayer.getScore().getScore());
            score.put("finishDate", gamePlayer.getScore().getFinishDate());
        }
        return score;
    }
    //function takes a ship returning an object
    private Map<String,Object> makeShipObject(Ship ship){
        Map<String,Object> shipObject = new LinkedHashMap<>();
        shipObject.put("Type", ship.getShipType());
        shipObject.put("Locations", ship.getLocations());
        return shipObject;
    }
    //function return a list of ships objects
    private List shipList(GamePlayer gamePlayer){
        return   gamePlayer.getShips().stream().map(this::makeShipObject).collect(Collectors.toList());
    }

    //function takes a salvo returning an object
    private Map<String,Object> makeSalvoObject(Salvo salvo){
        Map<String,Object> salvoObject = new LinkedHashMap<>();
        salvoObject.put("Turn", salvo.getTurn());
        salvoObject.put("player-id", salvo.getGamePlayer().getPlayer().getId());
        salvoObject.put("Locations", salvo.getLocations());
        return salvoObject;
    }


    //function return a list of salvoes objects for respective turn

    private  List<Object> salvoList(GamePlayer gamePlayer) {
        List<Object> list = new ArrayList<>();
        Set<Salvo> salvoes = gamePlayer.getSalvoes();
        for(Salvo salvo: salvoes){
            list.add(makeSalvoObject(salvo));
        }
        return list;
    }
    //function finding opponent
    public GamePlayer getOpponent(GamePlayer gamePlayer){
        return gamePlayer.getGame().getGamePlayers().stream()
                .filter(gp -> gp != gamePlayer)
                .findFirst()
                .orElse(null);
    }




    @RequestMapping("/games")


    private Map<String, Object> getUser(Authentication authentication){
        Map<String, Object> authUser = new LinkedHashMap<>();
        if (authentication != null) {
            Player player = playerRepository.findByUserName(authentication.getName());
            authUser.put("player", makePlayerObject(player));
            authUser.put("game", displayAllGames());
        } else {
            authUser.put("game", displayAllGames());
        }

        return authUser;

    }
    public List<Object> displayAllGames(){
        List<Game> games = gameRepository.findAll();
        return   games.stream().map(this::makeGameObject).collect(Collectors.toList());


    }

    // create player
    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>>createPlayer(  @RequestParam  String email, @RequestParam String password){
        if ( email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(makeMap("Error","Missing data"), HttpStatus.FORBIDDEN);
        }

        Player player = playerRepository.findByUserName(email);

        if (player != null) {
            return new ResponseEntity<>(makeMap("Error","Email already exists"), HttpStatus.FORBIDDEN);
        } else {

            Player newPlayer = playerRepository.save(new Player(email,  passwordEncoder.encode(password)));
            return new ResponseEntity<>(makeMap("Success", "User created"),HttpStatus.CREATED);
        }
    }

    public Map<String, Object> makeMap(String key, Object value){
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }



    // function for game_view

    @RequestMapping("/game_view/{gamePlayerId}")      //Game pages (game.html)

    public ResponseEntity <Map<String,Object>> getGameView(@PathVariable Long gamePlayerId,Authentication authentication){
        GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).orElse(null);
        Player player = gamePlayer.getPlayer(); //is the one with the id

            Player currentPlayer = playerRepository.findByUserName(authentication.getName()); //is the one authenticated

            if (currentPlayer.getId() == player.getId()) {
                Set<GamePlayer> gamePlayers = gamePlayer.getGame().getGamePlayers();
                Map<String, Object> gameView = new LinkedHashMap<>();
                gameView.put("ID",  gamePlayer.getGame().getId());
                gameView.put("created",  gamePlayer.getGame().getDate());
                gameView.put("gamePlayers", gamePlayers.stream().map(this::makeGamePlayerObject).collect(Collectors.toList()));
                gameView.put("ships", gamePlayers.stream().map(this::shipList));
                gameView.put("userSalvoes", salvoList(gamePlayer));
                if (gamePlayer.getGame().getGamePlayers().size() == 2) {
                    gameView.put("opponentSalvoes", salvoList(getOpponent(gamePlayer)));
                }
                return new ResponseEntity<>(gameView, HttpStatus.OK);
            } else {

                return new ResponseEntity<>(makeMap("error", "no access for this info"), HttpStatus.UNAUTHORIZED);
            }

    }


    @RequestMapping("/leaderboard")
    public List<Object> getLeaderBoard(){
        List<Object> list = new ArrayList<>();
        List<Player> players = playerRepository.findAll();
        for (Player player : players) {
            Map<String,Object> map = new LinkedHashMap<>();
            Double total = 0.0;
            Integer win = 0;
            Integer lose = 0;
            Integer tie = 0;
            Set<Score> scores = player.getScores();
            for (Score score : scores) {
                total += score.getScore();
                if (score.getScore() == 1) {
                    win++;
                }
                if(score.getScore() > 0 && score.getScore()< 1){
                    tie++;
                }
                if(score.getScore() == 0){
                    lose++;
                }
            }
            map.put("player",player.getUserName());
            map.put("total",total);
            map.put("win",win);
            map.put("tie",tie);
            map.put("lose",lose);

            list.add(map);

        }

        return list;
    }



    @RequestMapping(method = RequestMethod.POST, value = "/games")

    public ResponseEntity<Map<String,Object>> createGame (Authentication authentication){
        Game game = new Game();
        if (authentication != null) {
            Player player = playerRepository.findByUserName(authentication.getName());
            if (player != null) {
                Map<String, Object> newGame = new LinkedHashMap<>();
                game.setDate(new Date());
                gameRepository.save(game);
                GamePlayer gamePlayer = new GamePlayer(game, player);
                gamePlayerRepository.save(gamePlayer);
                newGame.put("date", game.getDate());
                newGame.put("gameId", game.getId());
                newGame.put("gamePlayerId", gamePlayer.getId());

                return new ResponseEntity<>(makeMap("newGame", newGame), HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(makeMap("error", "Please log in to create a game"), HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Please log in to create a game"), HttpStatus.UNAUTHORIZED);
        }
    }




    @RequestMapping(method = RequestMethod.POST, path = "/game/{gameId}/players")

    public ResponseEntity<Map<String, Object>> joinGame(Authentication authentication, @PathVariable Long gameId){
        if (authentication != null) {
            Player player = playerRepository.findByUserName(authentication.getName());

            Game game = gameRepository.findById(gameId).orElse(null);
            if (player != null) {
                //join the game--------
                if (player.getId() != game.getGamePlayer().getPlayer().getId()) {
                    GamePlayer gamePlayer = new GamePlayer(game, player);
                    gamePlayerRepository.save(gamePlayer);
                    return new ResponseEntity<>(makeMap("Success", gamePlayer.getId()), HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(makeMap("error", "You can not play against your self idiot"), HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ResponseEntity<>(makeMap("error", "Unauthorised request"), HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Please log in "), HttpStatus.UNAUTHORIZED);
        }
    }




    @RequestMapping (value="/games/players/{gamePlayerId}/ships" ,method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> placeShip(@PathVariable long gamePlayerId, Authentication authentication, @RequestBody List<Ship> ships) {
        GamePlayer gamePlayerPlacingShips = gamePlayerRepository.getOne(gamePlayerId);
        if (authentication != null) {
                        Player currentPlayer = playerRepository.findByUserName(authentication.getName());
                      if( gamePlayerPlacingShips == null){
                          return new ResponseEntity<>(makeMap("Error", "GamePlayer doesn't exist"), HttpStatus.UNAUTHORIZED);
                      }else{
                                    Player player = gamePlayerPlacingShips.getPlayer();
                                    if (currentPlayer.getId() != player.getId()) {

                                        return new ResponseEntity<>(makeMap("Error", "You are not authorized to see this GamePlayer"), HttpStatus.UNAUTHORIZED);
                                    }
                                   else if(gamePlayerPlacingShips.getShips().size() >0){
                                        return new ResponseEntity<>(makeMap("Error", "You have already placed ships"), HttpStatus.FORBIDDEN);
                                   }else{
                                        gamePlayerRepository.save(gamePlayerPlacingShips);
                                        ships.stream().forEach(e -> {

                                            Ship ship = new Ship(e.getShipType(), e.getLocations(),gamePlayerPlacingShips);
                                            shipRepository.save(ship);

                                        });

                                        return new ResponseEntity<>(makeMap("OK", "Ship positions saved successfully"), HttpStatus.CREATED);
                                    }
                    }
        }
        else {
            return new ResponseEntity<>(makeMap("Error", "Log In required to add Ships"), HttpStatus.UNAUTHORIZED);
        }
    }
}



