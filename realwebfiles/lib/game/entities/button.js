ig.module(
    'game.entities.button'
)
.requires(
    'impact.entity'
)
.defines(function(){
EntityButton = ig.Entity.extend({
    size: {x: 320, y: 20},
    square:12,
    zIndex:101, //
    animSheet: new ig.AnimationSheet( 'media/button_tileset.png', this.square, this.square ),

    type:0,
    poi:0,

    init: function( x, y, settings ) {
        //this.addAnim( 'idle', 1, [0] );



        this.parent( x, y, settings );
        this.type = settings.type;
        this.poi = settings.poi;
        this.animSheet = new ig.AnimationSheet( 'media/button_tileset.png', this.square, this.square );
        this.addAnim( 'idle', 1, [this.type] );
        this.addAnim( 'one', 1, [1] );
        this.addAnim( 'two', 1, [2] );
        this.addAnim( 'three', 1, [3] );
        this.addAnim( 'four', 1, [4] );

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
        
        // this.currentAnim = this.anims.idle;
        if (!ig.game.clack.has && ig.input.pressed('lbtn') && this.inFocus()) {
            this.gotClicked();
        }else{
            // if (!(this.highlight==0)){
            //  this.highlight.kill();
            // }
        }

        if(this.type == 1){
          this.currentAnim= this.anims.one;
        }else if(this.type == 2){
          this.currentAnim= this.anims.two;

        }else if(this.type == 3){
          this.currentAnim= this.anims.three;

        }else if(this.type == 4){
          this.currentAnim= this.anims.four;

        }

        this.parent();
    },

    draw: function(){
      // console.log(r);
      var color = "rgba(255,255,255,0.5)"; 
      var radius = this.square/2;
      var offset = this.square/3, textOffset = 2; //  

      var ctx = ig.system.context;

      var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x + offset);
      var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y + offset);

      ctx.beginPath();
      // ctx.strokeStyle = guideColor;  //some color
      ctx.fillStyle = color;
      ctx.arc( startX,
              startY ,
              radius * ig.system.scale,
              0, 
              Math.PI * 2 );
      
      // ctx.stroke();
      ctx.fill();

        

      ctx.closePath();



      this.parent();      
    },

    changeType: function(type){
      ig.log("button change type "+type);
      this.type = type;
      // this.currentAnim = null;
      // this.addAnim( 'idle', 1, [type] );
      this.anims.idle.update();
    },

    gotClicked: function() {
      ig.log('clicked button');
        // this.poi.gotClicked(this.type);
        var cost = (1 + 2*this.type);
        ig.game.stats.bruh -= cost;
        ig.game.stats.wood -= cost;
        ig.game.stats.food -= cost;
        ig.game.stats.ore -= cost;
        ig.game.lines.push(ig.game.spawnLine(ig.game.highlighted, this.poi, this.type));

            // this.timesVisited++;
            
            // this.highlight = 
         //    if (this.highlight==0 && ig.game.highlighted != this){
         //        ig.game.highlighted = this;
         //        this.highlight = ig.game.spawnEntity( EntityHighlight, 
         //                                            this.pos.x, 
         //                                            this.pos.y, 
         //                                            {flip:this.flip, angle:0.0, par:this} 
         //                                            ); //Nothing to special here, just make sure you pass the angle we calculated in
          
         //        this.highlight.zIndex=this.zIndex+2;
         //    }
         }
});


});