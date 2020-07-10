package com.codeoftheweb.salvo;
import org.aspectj.apache.bcel.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.SQLOutput;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository repository,GameRepository gameRepository,
									  GamePlayerRepository gamePlayerRepository,ShipRepository shipRepository,
									  SalvoRepository salvoRepository,ScoreRepository scoreRepository) {
		return (args) -> {
			// save a couple of players
			Player player1 = new Player("John@hotmail.com", passwordEncoder().encode("34"));
			Player player2 = new Player("Chloe@gmail.com",  passwordEncoder().encode("68"));
			Player player3 = new Player("Kim@yahoo.com",  passwordEncoder().encode("bk"));
			Player player4 = new Player("David@gmail.com",  passwordEncoder().encode("mole"));
			Player player5 = new Player("Michelle@hotmail.com",  passwordEncoder().encode("56"));
			repository.save(player1);
			repository.save(player2);
			repository.save(player3);
			repository.save(player4);
			repository.save(player5);
			Game game1 = new Game();
			Game game2 = new Game();
			Game game3 = new Game();
			Game game4 = new Game();
			Date date1 = game1.getDate();
			Date finishDate1 = Date.from(date1.toInstant().plusSeconds(1800));
			Date date2 = Date.from(date1.toInstant().plusSeconds(3600));
			Date finishDate2 = Date.from(date2.toInstant().plusSeconds(1800));
			game2.setDate(date2);
			Date date3 = Date.from(date2.toInstant().plusSeconds(3600));
			Date finishDate3 = Date.from(date3.toInstant().plusSeconds(1800));
			game3.setDate(date3);
			Date date4 = Date.from(date3.toInstant().plusSeconds(1800));
			game4.setDate(date4);

			gameRepository.save(game1);
			gameRepository.save(game2);
			gameRepository.save(game3);
			gameRepository.save(game4);
			GamePlayer gamePlayer1 = new GamePlayer(game1, player2);
			GamePlayer gamePlayer2 = new GamePlayer(game2, player3);
			GamePlayer gamePlayer3 = new GamePlayer(game3, player4);
			GamePlayer gamePlayer4 = new GamePlayer(game2, player1);
			GamePlayer gamePlayer5 = new GamePlayer(game1, player5);
			GamePlayer gamePlayer6 = new GamePlayer(game3, player1);
			GamePlayer gamePlayer7 = new GamePlayer(game4,player5);

			gamePlayerRepository.save(gamePlayer1);
			gamePlayerRepository.save(gamePlayer2);
			gamePlayerRepository.save(gamePlayer3);
			gamePlayerRepository.save(gamePlayer4);
			gamePlayerRepository.save(gamePlayer5);
			gamePlayerRepository.save(gamePlayer6);
			gamePlayerRepository.save(gamePlayer7);


			List<String> ship1Location = Arrays.asList("H2", "H3", "H4");
			List<String> ship2Location = Arrays.asList("E1", "F1", "G1");
			List<String> ship3Location = Arrays.asList("B4", "B5");
			List<String> ship5Location = Arrays.asList("G3", "H3", "I3","J3");
			List<String> ship4Location = Arrays.asList("F1", "F2");
			List<String> ship6Location = Arrays.asList("B5", "C5", "D5");
			List<String> ship7Location = Arrays.asList("C6", "C7");
			List<String> ship8Location = Arrays.asList("A2", "A3", "A4");
			List<String> ship9Location = Arrays.asList("G6", "H6");
			List<String> ship10Location = Arrays.asList("H10", "I10", "J10");
			List<String> ship11Location = Arrays.asList("D1", "D2");
			List<String> ship12Location = Arrays.asList("B5", "C5", "D5");
			List<String> ship13Location = Arrays.asList("E2", "E3", "E4","E5","E6");
			Ship ship1 = new Ship("Cruiser", ship1Location, gamePlayer1);
			Ship ship2 = new Ship("Submarine", ship2Location, gamePlayer1);
			Ship ship3 = new Ship("Destroyer", ship3Location, gamePlayer3);
			Ship ship4 = new Ship("battleship", ship4Location, gamePlayer3);
			Ship ship5 = new Ship("Destroyer", ship5Location, gamePlayer2);
			Ship ship6 = new Ship("Cruiser", ship6Location, gamePlayer2);
			Ship ship7 = new Ship("Destroyer", ship7Location, gamePlayer4);
			Ship ship8 = new Ship("Cruiser", ship8Location, gamePlayer4);
			Ship ship9 = new Ship("Destroyer", ship9Location, gamePlayer5);
			Ship ship10 = new Ship("Submarine", ship10Location, gamePlayer5);
			Ship ship11 = new Ship("Destroyer", ship11Location, gamePlayer6);
			Ship ship12 = new Ship("Cruiser", ship12Location, gamePlayer6);
			Ship ship13 = new Ship("Carrier", ship13Location, gamePlayer7);
			shipRepository.save(ship1);
			shipRepository.save(ship2);
			shipRepository.save(ship3);
			shipRepository.save(ship4);
			shipRepository.save(ship5);
			shipRepository.save(ship6);
			shipRepository.save(ship7);
			shipRepository.save(ship8);
			shipRepository.save(ship9);
			shipRepository.save(ship10);
			shipRepository.save(ship11);
			shipRepository.save(ship12);
			shipRepository.save(ship13);



			List<String> salvoLocation1 = Arrays.asList("B5", "C5", "F1");
			List<String> salvoLocation2 = Arrays.asList("F2", "D5", "F4");
			List<String> salvoLocation3 = Arrays.asList("A2", "A4", "G6");
			List<String> salvoLocation4 = Arrays.asList("A3", "H6");
			List<String> salvoLocation5 = Arrays.asList("G6", "H6", "A4");
			List<String> salvoLocation6 = Arrays.asList("G2", "A3", "D8");
			List<String> salvoLocation7 = Arrays.asList("A3", "A4", "F7");
			List<String> salvoLocation8 = Arrays.asList("D6", "A4", "J7");
			List<String> salvoLocation9 = Arrays.asList("C3", "A1", "H5");
			List<String> salvoLocation10 = Arrays.asList("B4", "F1");
			List<String> salvoLocation11 = Arrays.asList("D6", "A4");
			List<String> salvoLocation12 = Arrays.asList("E3", "G4");
			Salvo salvo1 = new Salvo(1, salvoLocation1, gamePlayer1);
			Salvo salvo2 = new Salvo(2, salvoLocation2, gamePlayer1);
			Salvo salvo3 = new Salvo(1, salvoLocation3, gamePlayer2);
			Salvo salvo4 = new Salvo(2, salvoLocation4, gamePlayer2);
			Salvo salvo5 = new Salvo(1, salvoLocation5, gamePlayer3);
			Salvo salvo6 = new Salvo(2, salvoLocation6, gamePlayer3);
			Salvo salvo7 = new Salvo(1, salvoLocation7, gamePlayer4);
			Salvo salvo8 = new Salvo(2, salvoLocation8, gamePlayer4);
			Salvo salvo9 = new Salvo(1, salvoLocation9, gamePlayer5);
			Salvo salvo10 = new Salvo(2, salvoLocation10, gamePlayer5);
			Salvo salvo11 = new Salvo(1, salvoLocation11, gamePlayer6);
			Salvo salvo12 = new Salvo(2, salvoLocation12, gamePlayer6);
			salvoRepository.save(salvo1);
			salvoRepository.save(salvo2);
			salvoRepository.save(salvo3);
			salvoRepository.save(salvo4);
			salvoRepository.save(salvo5);
			salvoRepository.save(salvo6);
			salvoRepository.save(salvo7);
			salvoRepository.save(salvo8);
			salvoRepository.save(salvo9);
			salvoRepository.save(salvo10);
			salvoRepository.save(salvo11);
			salvoRepository.save(salvo12);


			Score score1 = new Score(game1, player2, 1.0, finishDate1);
			Score score2 = new Score(game2, player3, 0.0, finishDate2);
			Score score3 = new Score(game2, player1, 0.5, finishDate2);
			Score score4 = new Score(game3, player4, 0.5, finishDate3);
			Score score5 = new Score(game1, player5, 0.0, finishDate1);

			scoreRepository.save(score1);
			scoreRepository.save(score2);
			scoreRepository.save(score3);
			scoreRepository.save(score4);
			scoreRepository.save(score5);


		};

	}
	}
	@Configuration
	class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

		@Autowired
		PlayerRepository playerRepository;


		@Override
		public void init(AuthenticationManagerBuilder auth) throws Exception {
			auth.userDetailsService(email-> {
				Player player = playerRepository.findByUserName(email);
				if (player != null) {
					return new User(player.getUserName(), player.getPassword(),
							AuthorityUtils.createAuthorityList("USER"));
				} else {
					throw new UsernameNotFoundException("Unknown user: " + email);
				}
			});
		}
	}
	@EnableWebSecurity
	@Configuration

	class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception{
			http.authorizeRequests()
					.antMatchers("/api/games").permitAll()
					.antMatchers("/api/leaderboard").permitAll()
			    	.antMatchers("/web/games.html").permitAll()
					.antMatchers("/web/index.html").permitAll()
					.antMatchers("/web/index.html").permitAll()
					.antMatchers("/web/game.css").permitAll()
				    .antMatchers("/web/games.js").permitAll()
			    	.antMatchers("/api/players").permitAll()
					.antMatchers("/api/login").permitAll()
					.antMatchers("/api/game_view/*").hasAnyAuthority("USER")
					.antMatchers("/rest/*").permitAll()
					.anyRequest().fullyAuthenticated()
					.and()
					.formLogin();
			//this tells what instances to use for the username and pass and which path to use for this.
			http.formLogin()
					.usernameParameter("email")
					.passwordParameter("password")
					.loginPage("/api/login");
			http.logout().logoutUrl("/api/logout");

			http.csrf().disable();
			http.exceptionHandling().authenticationEntryPoint((request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED));
			http.formLogin().successHandler((request, response, authentication) -> clearAuthenticationAttribute(request));
			http.formLogin().failureHandler((request, response, exception) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED));
			http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
		}

		private void clearAuthenticationAttribute(HttpServletRequest request){
			HttpSession session = request.getSession(false);
			if(session != null){
				session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
			}
		}
	}

