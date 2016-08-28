ig.module(
    'game.entities.line'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityLine = ig.Entity.extend({
        start: {},
        finish: {},
        zIndex: 99,
        percent: 0,
 
        timer: 0,
        type:0,
        finished:false,

        init: function(x, y, settings) {
          this.parent(x,y,settings);

          this.target = settings.target;
          this.targetPos = settings.target.pos;
          this.type = settings.type ;
          this.timer = new ig.Timer();
          this.timer.set(ig.game.clack.deflt);
          ig.game.clack.has = true;
          ig.game.clackSFX.play();
          // ig.log("MADE LINE");
        },
 
        update: function() {
            if(this.timer){
                var clackDiv = 1-(-this.timer.delta() / ig.game.clack.deflt);
                if(clackDiv > 1 && this.percent != 1){
                    this.percent = 1;
                    ig.game.clack.has = false;
                    this.timer = false;
                }else{
                    this.percent = clackDiv;
                    if(!this.finished){
                        ig.log("line finished, type "+this.type);
                        this.finished=true;
                        this.target.triggerType(this.type);
                    }
                }
            }
            
             

          this.parent();
        },

        draw: function() {
            switch(this.type) {
                case 0:
                    var guideColor = "rgba(185,129,10,0.9)";
                    var guideRadius = 6;
                    var lineWidth = 6;
                    break;
                case 1:
                    var guideColor = "rgba(27,10,185,0.9)";
                    var guideRadius = 10;
                    var lineWidth = 7.5;
                    break;
                case 2:
                    var guideColor = "rgba(10,185,16,0.9)";
                    var guideRadius = 16;
                    var lineWidth = 9;
                    break;
                default:
            }
          

          var offset = 18;
          if(this.timer){
            var diff = {
                x : this.pos.x - (this.pos.x - this.targetPos.x) * this.percent ,
                y : this.pos.y - (this.pos.y - this.targetPos.y) * this.percent
            };
          }else{
            var diff = {
                x : this.targetPos.x ,
                y : this.targetPos.y
            };
          }
            

            

            
            var begin = {
                x : ig.system.getDrawPos(this.pos.x - ig.game.screen.x + offset) ,
                y : ig.system.getDrawPos(this.pos.y - ig.game.screen.y + offset)
            };
            var end = {
                x : ig.system.getDrawPos(diff.x-ig.game.screen.x + offset) ,
                y : ig.system.getDrawPos(diff.y-ig.game.screen.y + offset)
            };

            // ig.log(diff);

          var ctx = ig.system.context;
                
          ctx.strokeStyle = guideColor; //
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(begin.x,begin.y);
          ctx.lineTo(end.x,end.y);
          ctx.stroke();
          ctx.closePath();
          

          
          ctx.beginPath();
          // ctx.strokeStyle = guideColor;  //some color
          ctx.fillStyle = guideColor;
          ctx.arc( begin.x,
                  begin.y,
                  guideRadius * ig.system.scale,
                  0, 
                  Math.PI * 2 );
          ctx.arc( end.x,
                  end.y,
                  guideRadius * ig.system.scale,
                  0, 
                  Math.PI * 2 );
          // ctx.stroke();
          ctx.fill();


          ctx.closePath();

          
        }
    });





});