var Game = function() {
    
    this.timer;
    this.timerCreate;
    this.timerFall;
    this.timerKey;
    this.song = $('#song')[0];
    this.music_playing;
    this.drops;
    this.score;
    this.stage;
    this.keyPressed;
    this.player_orientation;
    
    this.sprites = {
        raindrop: null,
        player: null
    };
    this.animations = {
        raindrop: null,
        player: null
    };
    this.layers = {
        raindrops: null,
        player: null
    };
    
    this.toggle_music = function() {
        this.music_playing = !this.music_playing;
        if(this.music_playing) {
            $('#speaker').html('<img src="media/sound-on.svg" />');
        } else {
            $('#speaker').html('<img src="media/sound-off.svg" />');
        }
        this.song.volume = 0.2 * this.music_playing;
        localStorage.setItem("music_playing", this.music_playing);
    };
    
   
    this.initialize = function(){
        $('#container').hide();

        // Sound init
        this.music_playing = localStorage.music_playing == "false" ? false : true;
        if(this.music_playing == false) {
            $('#speaker').html('<img src="media/sound-off.svg" />');
        }
        this.song.volume = 0.2 *this.music_playing;
        this.song.play();
        
        // Keyboard init
        document.addEventListener('keydown', this.press_enter_key.bind(this));
    };
    
    this.press_enter_key = function(event){
        if(event.keyCode == 13) {
            this.restart_game();
        }
    };
    
    this.detect_screen_collision = function(){
        return (this.player_orientation == 'left' && this.player.getX()>0 ) && (this.player_orientation == 'right' && this.player.getX()<$( window ).width()-100 );
    };
    
    this.player_run = function(direction){
        this.player_orientation = direction;
        if(this.timerKey==null) {
            this.timerKey = setInterval(function() {
                console.log(this.detect_screen_collision())
                if( !this.detect_screen_collision() ) {
                    if(this.player.getAnimation()!= ('run_'+direction)) {
                        this.player.setAnimation('run_'+direction);
                        this.keyPressed = true;
                    }
                    var x = direction == 'left' ? -10 : 10;
                    this.player.move(x,0);
                }
            }.bind(this),10);
        }
    };
    
    this.press_arrow_keys = function(event) {
        if(event.keyCode == 37) {
            this.player_run('left');
        } else if(event.keyCode == 39) {
            this.player_run('right');
        }
    };
    
     this.update = function(){
    };
    
    this.restart_game = function() {
        this.end_game();
        this.start_game();
    };
    
    this.end_game = function() //Called when the player is dead
    {
        //Delete all game components
        $('#container').hide();
        clearTimeout(this.timerCreate);
        clearTimeout(this.timerFall);
        //Show the menu
        $('#menu').show();
    };
    
    this.rainFall = function() {
        for(i=0;i<this.drops.length;i++)
        {
            if(this.drops[i].getY()<$( window ).height()-60) //If the raindrop is above the floor
            {
                //Makes it fall
                this.drops[i].move(0,5);
                //If it's at the height of the player
                if(this.drops[i].getY()>$( window ).height()-125)
                {
                    //and there is collision between the player and a raindrop
                    if(this.drops[i].getX()+25>=this.player.getX()&&this.drops[i].getX()+25<=this.player.getX()+75&&this.drops[i].getAnimation()!='crash')
                    {
                        //Back to menu
                        this.end_game();
                    }
                }
            }
            else //If the raindrop is on the floor
            {
                //Makes it crash
                this.drops[i].setAnimation('crash');
                //Makes the raindrop disapear one by one
                if(i>10)
                {
                    this.drops[1].destroy();
                    this.drops.splice(1,1);	
                    console.log(this.drops.length);
                }
            }
        }
    };
    
    this.rainCreate = function() //Create a raindrop when called (timerCreate)
    {
        drop = new Kinetic.Sprite({x:Math.random()* $( window ).width(),y:-10,image: this.sprites.raindrop, animation: 'idle', animations: this.animations.raindrop, framerate:1, index:0});
        this.layers.raindrops.add(drop);
        drop.start();
        this.drops.push(drop);
        this.score++;
        $('#score').text('Score: '+this.score);
        this.rainFall();
    };

    
    this.start_game = function() {
        //Add the container of the Kinetic Stage
        $('#container').show();
        //Remove the menu
        $('#menu').hide();
        //Create the Kinetic stage
        this.stage = new Kinetic.Stage({container: 'container', width: $( window ).width(), height: $( window ).height() });
        //Create the layers and load the images
        this.layers.player = new Kinetic.Layer();
        this.layers.raindrops = new Kinetic.Layer();
        this.sprites.player = new Image();
        this.sprites.player.src = 'media/character.png';
        this.sprites.raindrop = new Image();
        this.sprites.raindrop.src = 'media/falling_1.png';
        //Create variables for the game
        this.drops = new Array();
        this.score = 0;
        //Create the animations for the player
        this.animations.player = 
        {
            "idle_right": [
                {x: 0, y: 0, width: 100, height: 125}
            ],
            "idle_left": [
                {x: 100, y: 0, width: 100, height: 125}
            ],
            "run_right": [
                {x: 0, y: 125, width: 100, height: 125},
                {x: 100, y: 130, width: 100, height: 125},
                {x: 200, y: 130, width: 100, height: 125},
                {x: 300, y: 130, width: 100, height: 125},
                {x: 400, y: 130, width: 100, height: 125},
                {x: 500, y: 130, width: 100, height: 125},
                {x: 600, y: 130, width: 100, height: 125},
                {x: 700, y: 130, width: 100, height: 125}
            ],
            "run_left": [
                {x: 0, y: 250, width: 100, height: 125},
                {x: 100, y: 250, width: 100, height: 125},
                {x: 200, y: 250, width: 100, height: 125},
                {x: 300, y: 250, width: 100, height: 125},
                {x: 400, y: 250, width: 100, height: 125},
                {x: 500, y: 250, width: 100, height: 125},
                {x: 600, y: 250, width: 100, height: 125},
                {x: 700, y: 250, width: 100, height: 125}
            ]
        };
        //Create the aniamtions for the raindrops
        this.animations.raindrop = {
            idle: [
                {x:0,y:0,width:50,height:50}
            ], 
            crash: [
                {x:50,y:0,width:50,height:50}
            ]
        };
        
        this.sprites.raindrop.onload = function()
        {
            this.stage.add(this.layers.raindrops);
            this.timerCreate = window.setInterval(this.rainCreate.bind(this), 50);
            this.timerFall = window.setInterval(this.rainFall.bind(this), 25);
        }.bind(this);

        this.sprites.player.onload = function() 
        {
            this.player = new Kinetic.Sprite({ x: 600, y: $( window ).height()-130, image: this.sprites.player, animation: 'idle_right', animations: this.animations.player, frameRate: 8, index: 0});
            this.player_orientation = 'right';
            this.layers.player.add(this.player);
            this.stage.add(this.layers.player);
            this.player.start();
            this.timerKey =null;
            document.addEventListener('keydown', this.press_arrow_keys.bind(this));
            document.addEventListener('keyup',function(event)
            {
                if(event.keyCode==37||event.keyCode==39)
                {
                    clearTimeout(this.timerKey);
                    this.timerKey=null;
                    if(this.player_orientation=='left')
                    { this.player.setAnimation('idle_left');}
                    else {this.player.setAnimation('idle_right');}
                }
            }.bind(this));
        }.bind(this);
    }
};

