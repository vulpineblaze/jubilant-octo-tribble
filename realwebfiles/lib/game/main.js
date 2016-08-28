ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.timer',
	'game.levels.map1' 
	// 'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	levelTimer: new ig.Timer(),
	turnTimer: -1,
	turnDuration:6,
	outputMsg: 0,
	

	stats: { bruh: 0,
              food: 0,
              wood: 0,
              ore: 0,
              time: 0, 
              // kills: 0, 
              // deaths: 0,
              // deathText:0
              },

    map: [],
    mapSize: 64,
    mapAccel:2.1,

	gravity:0,

	highlighted:0,
	lastHL:0,
	lines: [],

	clack: {has: false, deflt: 2},

	clackSFX: new ig.Sound( 'media/sounds/clack.*' ),
	turnSFX: new ig.Sound( 'media/sounds/turn.*' ),
	// deathSFX: new ig.Sound( 'media/sounds/death.*' ),

	init: function() {
		// Initialize your game here; bind keys etc.
		this.randomizeMap(LevelMap1.layer[0].data);
		this.loadLevel( LevelMap1 );
		this.levelTimer.set(0);

		this.stats.bruh = 10;
		this.stats.food = 10;
		this.stats.wood = 10;
		this.stats.ore = 10;



		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.W, 'up' );
		// ig.input.bind( ig.KEY.X, 'jump' );
		// ig.input.bind( ig.KEY.C, 'shoot' );
		
		
		ig.input.initMouse();
		ig.input.bind( ig.KEY.MOUSE1, 'lbtn' );

		// spawn planet entities
		ig.game.spawnEntity( EntityPoi, 100, 100 );

      	this.spawnAllThePoi();


	},
	
	update: function() {
		// Update all entities and backgroundMaps

		if( this.levelTimer.delta() - this.turnTimer > this.turnDuration){
			this.startNewTurn();
		}
		var player = 0;
      if(ig.game.highlighted == 0 && ig.game.lastHL == 0){
        //this is the very first momnet
        var homePoi = ig.game.getEntitiesByType( EntityPoi );
        ig.game.highlighted = homePoi[0];
        var home = ig.game.highlighted;
        home.home = true;
        home.generateStats();
        home.gotClicked();
        home.update();
        home.highlight = ig.game.spawnEntity( EntityHighlight, 
                                                    ig.game.highlighted.pos.x, 
                                                    ig.game.highlighted.pos.y, 
                                                    {flip:this.flip, angle:0.0, par:this} 
                                                    );
        home.doExplore();
        home.doExpand();
        home.doExploit();


        // this.setHomeProfile(ig.game.highlighted);
      }
			// if(ig.game.highlighted != 0){
			// 	player = ig.game.highlighted;
			// }

		if(this.highlighted != 0 && this.lastHL != 0){
			if(ig.game.highlighted != ig.game.lastHL){
				if(ig.game.highlighted){

				}
			}

		}
			if(ig.game.highlighted != ig.game.lastHL){
				// this.outputMsg = 0;

				if (this.highlighted != 0 && this.lastHL != 0){
					// this.lines.push(this.spawnLine(this.highlighted, this.lastHL));
          // this.loadProfile();
          // this.deductFuelViaDistance();
				}

				ig.game.lastHL = ig.game.highlighted ;
				player = ig.game.highlighted;
        

			}else{
				player = 0;
			}

			if( player != 0) { //pretty much can only be 0 if game is new
				this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - (.50)*ig.system.height;
        // this.checkForNegativeResources();
			}

		if( ig.input.state('left') ) {
			this.screen.x += -this.mapAccel;
		}else if( ig.input.state('right') ) {
			this.screen.x += this.mapAccel;
		}else if( ig.input.state('up') ) {
			this.screen.y += -this.mapAccel;
		}else if( ig.input.state('down') ) {
			this.screen.y += this.mapAccel;
		}

		this.checkForScreenOutsideMap();


		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		// this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
		if(this.outputMsg == 0){
	    	this.outputMsg='Click a Point Of Interest (POI) to move cursor\n'
	    		+'Click button to Explore the POI\n'
	    		+'Click button again to Expand your territory\n'
	    		+'Click button again to Exploit the resources heavily\n'
	    		+'';
	        // this.font.draw(this.outputMsg,x,y,ig.Font.ALIGN.CENTER );
	    }
	},





	randomizeMap: function(mapArray){

      for(var y=0;y<mapArray.length;y++){
        for(var x=0;x<mapArray[0].length;x++){
          mapArray[y][x] = this.randomNumGen(0,23); //should be 23, pad w black?
        }
      }

    },

    randomNumGen: function(smallest,largest){
      return (smallest + Math.floor(Math.random()*largest-smallest+1));
    },

    loadLevel: function( data ) {
		this.stats = {time: 0};
		this.parent(data);
		this.levelTimer.reset();
	},

	spawnAllThePoi: function(){
      var totalPoi = 100;
      for (i = 0; i < totalPoi; i++) { 
        var allPoi = ig.game.getEntitiesByType( EntityPoi );
        var mapX = ig.game.collisionMap.width * 24;
        var mapY = ig.game.collisionMap.height * 24;
        // console.log(mapX, mapY);
        var maybePoi = ig.game.spawnEntity( EntityPoi,
                                       40 + Math.floor(Math.random()*mapX),
                                       40 + Math.floor(Math.random()*mapY)
                                         );
        // console.log(maybePoi.pos.x , maybePoi.pos.y); //

        for(j=0;j<allPoi.length;j++){
          if(Math.abs(allPoi[j].pos.x - maybePoi.pos.x) < 40
            & Math.abs(allPoi[j].pos.y - maybePoi.pos.y) < 40 ){ //
            // console.log(allPoi[j].pos.x ,
            //  maybePoi.pos.x,
            //  allPoi[j].pos.y ,
            //   maybePoi.pos.y);
            maybePoi.toDie();
            totalPoi++;
            break;
          }
        }//end looking for
      }//end outer rand for
      // console.log(totalPoi);
    },//end spawn func

	startNewTurn: function(){
		this.turnSFX.play();
      this.turnTimer = this.levelTimer.delta();

        var allPoi = ig.game.getEntitiesByType( EntityPoi );
        
        	// ig.log(allPoi);

        for(j=0;j<allPoi.length;j++){
        	var disOne = allPoi[j];

        if(disOne.expand){
        	// ig.log(disOne);
          	
          	this.stats.bruh += disOne.stats.bruh-1;
          	this.stats.food += disOne.stats.food-1;
          	this.stats.wood += disOne.stats.wood-1;
          	this.stats.ore += disOne.stats.ore-1;
          }
          if(disOne.exploit){
        	// ig.log(disOne);

          	this.stats.bruh += 2*disOne.stats.bruh-3;
          	this.stats.food += 2*disOne.stats.food-3;
          	this.stats.wood += 2*disOne.stats.wood-3;
          	this.stats.ore += 2*disOne.stats.ore-3;
          }
        }//end looking for

        this.stats.bruh--;
      	this.stats.food--;
      	this.stats.wood--;
      	this.stats.ore--;

    },//end  func

    spawnLine: function(highlighted, target, type){
    	ig.game.spawnEntity( EntityLine ,
	                                highlighted.pos.x,
	                                highlighted.pos.y,
	                                	{type:type,
	                                	target:target}
	                                  
	                                  )
    },

	checkForScreenOutsideMap: function(){
      //ig.system.width , height
      //ig.game.collisionMap.width, height
      //this.screen.x,y
      var mapX = ig.game.collisionMap.width * 24;
      var mapY = ig.game.collisionMap.height * 24;

      // console.log(this.screen.x,
      //             this.screen.y,
      //             mapX,
      //             mapY,
      //             ig.system.width,
      //             ig.system.height);

      if(this.screen.x + ig.system.width > mapX){
        this.screen.x = mapX - ig.system.width;
      }else if(this.screen.x < 0){
        this.screen.x = 0;
      }

      if(this.screen.y + ig.system.height > mapY){
        this.screen.y = mapY - ig.system.height;
      }else if(this.screen.y < 0){
        this.screen.y = 0;
      }

    } //end cehck for screen bounds func
	// end entity
});



	StartScreen = ig.Game.extend({
		instructText: new ig.Font( 'media/04b03.font.png' ),
		background: new ig.Image('media/jot_screen.png'),
		// mainCharacter: new ig.Image('media/screen-main-character.png'),
		// title: new ig.Image('media/game-title.png'),
		
		init: function() {
			ig.input.initMouse();
			ig.input.bind( ig.KEY.MOUSE1, 'lbtn' );
		},
		
		update: function() {
			if(ig.input.pressed ('lbtn')){
				ig.system.setGame(MyGame)
			}
			this.parent();
		},
		
		draw: function() {
			this.parent();
			this.background.draw(0,0);
			// this.mainCharacter.draw(0,0);
			// this.title.draw(ig.system.width - this.title.width, 0);
			var x = ig.system.width/2,
			y = ig.system.height - 50;
			this.instructText.draw( 'Click/Tap To Start', x+30, y, 
			ig.Font.ALIGN.CENTER );
		}
	});
	
	// GameOverScreen = ig.Game.extend({
	// 	instructText: new ig.Font( 'media/04b03.font.png' ),
	// 	background: new ig.Image('media/telecaster_screen.png'),
	// 	gameOver: new ig.Image('media/game_over.png'),
	// 	stats: {},
 //    outputMsg: "",
		
	// 	init: function() {
	// 		ig.input.initMouse();
	// 		ig.input.bind( ig.KEY.MOUSE1, 'lbtn' );
	// 		this.stats = ig.finalStats;
	// 	},
		
	// 	update: function() {
	// 		if(ig.input.pressed('lbtn')){
	// 	    ig.system.setGame(StartScreen)
	// 		}
	// 		this.parent();
	// 	},
		
	// 	draw: function() {
 //      var crystalScore = 55;
 //      var crewScore = 91;
	// 		this.parent();
	// 		this.background.draw(0,0);
	// 		var x = ig.system.width/2;
	// 		var y = ig.system.height/2 - 20;
	// 		this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
	// 		var score = (this.stats.crystal * crystalScore) - (this.stats.deaths * crewScore);
	// 		this.instructText.draw('Total Crystals Acquired: '+this.stats.crystal, x, y+30, 
	// 			ig.Font.ALIGN.CENTER);
	// 		this.instructText.draw('Total Crew Lost: '+this.stats.deaths, x, y+40, 
	// 			ig.Font.ALIGN.CENTER);
	// 		this.instructText.draw('Score: '+score, x, y+50, ig.Font.ALIGN.CENTER);
	// 		this.instructText.draw('Click/Tap To Continue.', x, ig.system.height - 
	// 			100, ig.Font.ALIGN.CENTER);

 //      this.instructText.draw(this.stats.deathText,
 //          ig.system.width/2,
 //          ig.system.height*(0.1),
 //          ig.Font.ALIGN.CENTER );
	// 	}
	// });
	
	
	
	
	
	
	
	var game_x, game_y, game_z;
	
	if( ig.ua.mobile ) {
		// Disable sound for all mobile devices
		ig.Sound.enabled = false;
		game_x =322;
		game_y =368; // 
		game_z =3;
	}else{
		game_x =400; 
		game_y =320;
		game_z =2;
	}
	
	/*
	game_x =312;
	game_y =468;
	game_z =2;
	*/
	ig.main('#canvas',StartScreen,60,game_x,game_y,game_z);
	//ig.main('#canvas',MyGame,60,312,468,2);
	//ig.main('#canvas',MyGame,60,624,936,2);
	//ig.main('#canvas',MyGame,60,1248,1872,0.5);

});
