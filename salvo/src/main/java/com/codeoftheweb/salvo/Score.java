package com.codeoftheweb.salvo;



import javax.persistence.*;
import java.util.Date;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    private Double score;
    private Date finishDate;

    public Score(){}

    public Score(Game game,Player player, Double score, Date finishDate ){
        this.game = game;
        this.player=player;
        this.score=score;
        this.finishDate= finishDate;
    }

    public Game getGame(){
        return game;
    }

    public Player getPlayer(){
        return player;
    }


    public Date getFinishDate(){
        return finishDate;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }


    public void setFinishDate(Date finishDate) {
        this.finishDate = finishDate;
    }
}