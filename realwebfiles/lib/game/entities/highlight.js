ig.module(
    'game.entities.highlight'
)
.requires(
    'impact.entity'
)
.defines(function(){


EntityHighlight = ig.Entity.extend({
    zIndex:500,
        animSheet: new ig.AnimationSheet( 'media/highlight.png', 60, 60 ),
        //offset:{x:9,y:5},
        shift:{x:0,y:0},
        
        //maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        angle:0,
    color:"rgba(99,99,99,1)",
        //checkAgainst: ig.Entity.TYPE.B,
        //collides: ig.Entity.COLLIDES.PASSIVE,
        
        
        
        init: function( x, y, settings ) {
        
            var offset = -12, xOffset = 0; 
            // var flipsetting, velsetting;
            // if(settings.flip){
            //  flipsetting = -4;
            //  velsetting = -this.maxVel.x;
            // }else{
            //  flipsetting = 8;
            //  velsetting = this.maxVel.x;
            // }
            this.parent( x + offset +xOffset , y + offset, settings );
            //this.vel.x = this.accel.x = velsetting;
            this.addAnim( 'idle', 0.2, [0] );

      // console.log(this.color);
      // if(this.color != "white"){
      //   var sheet1 = new ig.AnimationSheet( 'media/highlight.png'+this.color, 60, 60 );
      //   this.anims.idle = new ig.Animation( sheet1, 0.2, [0] );
    
      // }
      this.currentAnim = this.anims.idle;

        },
        
        handleMovementTrace: function( res ) {
            this.parent( res );
            
        },
        
        update: function(){
            

            this.parent();
        },

    draw: function(){
      // var img = new ig.Image( 'media/planet_highlight.png#ff00ff' );
      // img.draw( 100, 100 );

      this.parent();
    }


        
    });   //end of bullet

});