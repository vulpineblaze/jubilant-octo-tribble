ig.module(
    'game.entities.poi'
)
.requires(
    'impact.entity'
)
.defines(function(){
EntityPoi = ig.Entity.extend({
    size: {x: 320, y: 20},
    zIndex:100, //
    animSheet: new ig.AnimationSheet( 'media/poi_tileset.png', 48, 48 ),
    gravityFactor: 0,

    size: {x: 34, y:38},
    offset: {x: 6, y: 6},

    highlight:0,
    profile: 0,
    poiColor: [0,0,0],
    home: false,

    timesVisited: 0,
    hasStats: false,
    stats: { bruh: 0,
              food: 0,
              wood: 0,
              ore: 0
              },
    explored: false,
    expand: false,
    exploit: false,
    exterminate: false,

    button:0,

    init: function( x, y, settings ) {
        //this.addAnim( 'idle', 1, [0] );



        this.parent( x, y, settings );

        this.addAnim( 'idle', 1, [Math.floor(1+Math.random()*10)-1 ] );

        this.button = ig.game.spawnEntity( EntityButton, 
                              this.pos.x, 
                              this.pos.y+40, 
                              {type:0, poi:this} 
                              ); //Nothing to special here, just make sure you pass the angle we calculated in

        // var maxRGB = 220, minRGB=20;
        // this.poiColor = [Math.floor(minRGB+Math.random()*maxRGB),
        //     Math.floor(minRGB+Math.random()*maxRGB),
        //     Math.floor(minRGB+Math.random()*maxRGB)
        //       ];
    },

    inFocus: function() {
            return (
               (this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
               ((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
               (this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
               ((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
            );
         },

    update: function(){
        
        this.currentAnim = this.anims.idle;
        if (ig.input.pressed('lbtn') && this.inFocus()) {
            this.gotClicked();
        }else{
            // if (!(this.highlight==0)){
            //  this.highlight.kill();
            // }
        }

        if(ig.game.highlighted != this && this.highlight != 0){
            this.highlight.kill();
            this.highlight = 0;
        }

        if(this.hasStats == false && (this.timesVisited>0 || this.home) ){
            this.generateStats();
        }

        this.parent();
    },


    draw: function(){
        var r=this.poiColor[0],g=this.poiColor[1],b=this.poiColor[2];
      // console.log(r);
            var poiColor = "rgba("+r+","+g+","+b+",0.2)"; 
      var poiRadius = 24;
      var offset = 18, textOffset = 3; //  

      var ctx = ig.system.context;

      var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x + offset);
      var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y + offset);

      ctx.beginPath();
      // ctx.strokeStyle = guideColor;  //some color
      ctx.fillStyle = poiColor;
      ctx.arc( startX,
              startY ,
              poiRadius * ig.system.scale,
              0, 
              Math.PI * 2 );
      
      // ctx.stroke();
      ctx.fill();

        

      ctx.closePath();


        if(this.hasStats){
            ctx.beginPath();
            var bruhX = this.pos.x - ig.game.screen.x + poiRadius/4;
            var bruhY = this.pos.y - ig.game.screen.y + poiRadius/4;
            ctx.fillStyle = "rgba(22,22,22,0.9)";
            ctx.arc( ig.system.getDrawPos(bruhX),
                    ig.system.getDrawPos(bruhY) ,
                    poiRadius * ig.system.scale / 4,
                    0, 
            Math.PI * 2 );
            ctx.fill();
            ctx.closePath();
            ig.game.font.draw('b'+this.stats.bruh,bruhX-textOffset, bruhY-textOffset);

            ctx.beginPath();
            var foodX = this.pos.x - ig.game.screen.x +poiRadius*(1/4);
            var foodY = this.pos.y - ig.game.screen.y +poiRadius*(5/4);
            ctx.fillStyle = "rgba(22,22,22,0.9)";
            ctx.arc( ig.system.getDrawPos(foodX),
                    ig.system.getDrawPos(foodY) ,
                    poiRadius * ig.system.scale / 4,
                    0, 
            Math.PI * 2 );
            ctx.fill();
            ctx.closePath();
            ig.game.font.draw('f'+this.stats.food,foodX-textOffset, foodY-textOffset);

            ctx.beginPath();
            var woodX = this.pos.x - ig.game.screen.x +poiRadius*(5/4);
            var woodY = this.pos.y - ig.game.screen.y +poiRadius*(1/4);
            ctx.fillStyle = "rgba(22,22,22,0.9)";
            ctx.arc( ig.system.getDrawPos(woodX),
                    ig.system.getDrawPos(woodY) ,
                    poiRadius * ig.system.scale / 4,
                    0, 
            Math.PI * 2 );
            ctx.fill();
            ctx.closePath();
            ig.game.font.draw('w'+this.stats.wood,woodX-textOffset, woodY-textOffset);

            ctx.beginPath();
            var oreX = this.pos.x - ig.game.screen.x +poiRadius*(5/4);
            var oreY = this.pos.y - ig.game.screen.y +poiRadius*(5/4);
            ctx.fillStyle = "rgba(22,22,22,0.9)";
            ctx.arc( ig.system.getDrawPos(oreX),
                    ig.system.getDrawPos(oreY) ,
                    poiRadius * ig.system.scale / 4,
                    0, 
            Math.PI * 2 );
            ctx.fill();
            ctx.closePath();
            ig.game.font.draw('o'+this.stats.ore,oreX-textOffset, oreY-textOffset);
        }


        this.parent();      
    },

    gotClicked: function(type) {
            ig.log('clicked '+type);
            // this.timesVisited++;
            
            if (this.highlight==0 && ig.game.highlighted != this){
                ig.game.highlighted = this;
                this.highlight = ig.game.spawnEntity( EntityHighlight, 
                                                    this.pos.x, 
                                                    this.pos.y, 
                                                    {flip:this.flip, angle:0.0, par:this} 
                                                    ); //Nothing to special here, just make sure you pass the angle we calculated in
          
                this.highlight.zIndex=this.zIndex+2;
            }
         },
    triggerType: function(type) {
      ig.log("triggerType "+type);

      if(type==0){
        this.doExplore();
      }else if(type==1){
        this.doExpand();
      }else if(type==2){
        this.doExploit();
      }else if(type==3){
        this.doExterminate();
      }
    },  
    doExplore: function() {
      this.explored=true;

      // this.button.kill();
      // ig.log("button type "+this.button.type);

      this.button.type = 1;// = this.button.anims.one;
      // ig.log("do explore");
      this.generateStats();

    },
    doExpand: function() {
      this.expand=true;
      this.button.type = 2;
    },
    doExploit: function() {
      this.exploit=true;
      this.button.type = 3;
      
    },
    doExterminate: function() {
      this.exterminate=true;
      this.button.kill();
    },

    generateStats: function() {
        this.hasStats = true;
        var maxRGB = 220, minRGB=20;
        this.poiColor = [Math.floor(minRGB+Math.random()*maxRGB),
            Math.floor(minRGB+Math.random()*maxRGB),
            Math.floor(minRGB+Math.random()*maxRGB)
              ];      
        var maxStat = 7, minStat = -5; 
        this.stats.bruh = Math.floor(maxStat+Math.random()*minStat);
        this.stats.food = Math.floor(maxStat+Math.random()*minStat);
        this.stats.wood = Math.floor(maxStat+Math.random()*minStat);
        this.stats.ore = Math.floor(maxStat+Math.random()*minStat);
    },

    toDie: function(){
      this.button.kill();
      this.kill();
    }
});


});