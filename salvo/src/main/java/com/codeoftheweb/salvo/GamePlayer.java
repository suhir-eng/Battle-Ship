package com.codeoftheweb.salvo;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;
    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Ship> ships = new HashSet<>();
    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Salvo> salvoes = new HashSet<>();
    public GamePlayer() { }

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Set<Ship> getShips() {
        return ships;
    }
    public Set<Salvo> getSalvoes() {
        return salvoes;
    }



    public void addShip(Ship ship){
        ship.setGamePlayer(this);
        ships.add(ship);
    }
    public Score getScore () {
        return  player.getScores().stream().filter(score -> score.getGame() == game).findFirst().orElse(null);}
}
