var Game = function() {
    
    this.KEYS = {
        ENTER: 13,
        LEFT: 37,
        RIGHT: 39,
    };
    
    this.chance = 0.1;
    this.gravity = 5;
    this.level = 1;
    this.flashing = 2;
    this.music_speed = 1;
    this.level_gravity = 2;
    this.level_flashing = 0.2;
    this.level_music = 0.2;
    this.level_score = 500;
    this.bonus_score = 100;
    this.timer;
    this.width = $(window).width();
    this.height = $(window).height();
    this.game_status = "init";
    this.ressources = 3;
    this.ressources_loaded = 0;
    this.timerCreate;
    this.timerFall;
    this.timerKey;
    this.song = $('#song')[0];
    this.music_playing;
    this.falling_objects = [];
    this.score;
    this.stage;
    this.keyPressed;
    this.player_orientation;
    
    this.sprites = {
        falling_1: new Image(),
        falling_2: new Image(),
        player: new Image()
    };
    this.animations = {
        falling: {
            idle: [
                {x:0,y:0,width:50,height:50}
            ], 
            crash: [
                {x:50,y:0,width:50,height:50}
            ]
        },
        player: {
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
        }
    };
    this.layers = {
        falling: null,
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
        //Create the Kinetic stage
        this.stage = new Kinetic.Stage({container: 'container', width: this.width, height: this.height });
        //Create the layers and load the images
        this.layers.player = new Kinetic.Layer();
        this.layers.falling = new Kinetic.Layer();
        this.sprites.player.src = 'media/character.png';
        this.sprites.falling_1.src = 'media/falling_1.png';
        this.sprites.falling_1.onload = this.new_ressource_loaded.bind(this);
        this.sprites.falling_2.src = 'media/falling_2.png';
        this.sprites.falling_2.onload = this.new_ressource_loaded.bind(this);
        this.sprites.player.onload = this.new_ressource_loaded.bind(this);
        this.player = new Kinetic.Sprite({ x: this.width/2, y: this.height-130, image: this.sprites.player, animation: 'idle_right', animations: this.animations.player, frameRate: 8, index: 0});
        
        this.player_orientation = 'right';
        this.layers.player.add(this.player);
        this.stage.add(this.layers.player);
        this.stage.add(this.layers.falling);
    };
    
    this.press_enter_key = function(event){
        if(event.keyCode == this.KEYS.ENTER) {
            this.restart_game();
        }
    };
    
    this.detect_screen_collision = function(){
        return this.player_orientation == 'left' && this.player.getX()<0 || 
               this.player_orientation == 'right' && this.player.getX()>this.width-100 ;
    };
    
    this.player_run = function(direction){
        this.player_orientation = direction;
        if(this.timerKey==null) {
            this.timerKey = setInterval(function() {
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
        if(event.keyCode == this.KEYS.LEFT) {
            this.player_run('left');
        } else if(event.keyCode == this.KEYS.RIGHT) {
            this.player_run('right');
        }
    };
    
    this.release_arrow_keys = function(event){
        if(event.keyCode==37||event.keyCode==39) {
            clearTimeout(this.timerKey);
            this.timerKey=null;
            if(this.player_orientation=='left')
            { this.player.setAnimation('idle_left');}
            else {this.player.setAnimation('idle_right');}
        }
    };
    
     this.update = function(){
    };
    
    this.restart_game = function() {
        this.end_game();
        this.load_game();
    };
    
    this.end_game = function() //Called when the player is dead
    {
        //Delete all game components
        $('#container').hide();
        clearTimeout(this.timerCreate);
        clearTimeout(this.timerFall);
        //Show the menu
        $('#menu').show();
        this.falling_objects.forEach(function(o){
            o.destroy();
        });
    };
    
    this.load_game = function() {
        this.status = "loading";
        this.start_game();
    };
    
    this.new_ressource_loaded = function() {
        this.ressources_loaded++;
        this.start_game();
    };
    
    this.start_game = function() {
        if(this.status=='loading' && this.ressources_loaded == this.ressources) {
            this.run();
        }
    };
    
    this.run = function() {
        //Add the container of the Kinetic Stage
        $('#container').show();
        //Remove the menu
        $('#menu').hide();
        
        //Reset variables for the game
        this.gravity = 5;
        this.level = 1;
        this.flashing = 2;
        this.music_speed = 1;
        this.song.playbackRate = this.music_speed;
        this.falling_objects = [];
        this.score = 0;
        this.timerKey = null;
        this.player.start();
        //Start the game timer
        this.timerCreate = window.setInterval(this.generate_falling_objects.bind(this), 100 / (this.width * ( 1 / 1366)));
        this.timerFall = window.setInterval(this.update_falling_objects.bind(this), 25);
        
        //Binding the keys
        document.addEventListener('keydown', this.press_arrow_keys.bind(this));
        document.addEventListener('keyup',this.release_arrow_keys.bind(this));
    };
    
    this.increase_score = function(v) {
        this.score += v;
        $('#score').text('Score: '+this.score);
        if(this.score > this.level * this.level_score){
            this.level_up();
        }
    };
    
    this.level_up = function(){
        this.level++;
        this.gravity += this.level_gravity;
        this.music_speed += this.level_music
        this.song.playbackRate = this.music_speed;
        this.flashing += this.level_flashing;
        $('#container').css('animation-duration', this.flashing+'s'); 
    };
    this.generate_falling_objects = function() //Create a raindrop when called (timerCreate)
    {
        var r = Math.random();
        var o;
        if(r<=this.chance){
            o = new Kinetic.Sprite({x:Math.random()* $( window ).width(),y:-10,image: this.sprites.falling_2, animation: 'idle', animations: this.animations.falling, framerate:1, index:0});
            o.hurting = false;
        } else {
            o = new Kinetic.Sprite({x:Math.random()* $( window ).width(),y:-10,image: this.sprites.falling_1, animation: 'idle', animations: this.animations.falling, framerate:1, index:0});
            o.hurting = true;
        }
        this.layers.falling.add(o);
        o.start();
        this.falling_objects.push(o);
        this.increase_score(1);
        this.update_falling_objects();
    };
    
    this.detect_object_collision = function(o){
        return o.getX()+25 >= this.player.getX() && o.getX()+25 <= this.player.getX()+75 && o.getAnimation() != 'crash';
    };
    
    this.update_falling_objects = function() {
        this.falling_objects.forEach(function(o, index, array){
            if(o.getY() < this.height-60) { //If the raindrop is above the floor
                //Makes it fall
                o.move(0,this.gravity);
                //If it's at the height of the player
                if(o.getY()>this.height-125) {
                    //and there is collision between the player and a raindrop
                    if(this.detect_object_collision(o)){
                        if(o.hurting == true) {
                            this.end_game();
                        } else {
                            this.increase_score(this.bonus_score);
                            o.destroy();
                            array.splice(index,1);
                        }
                    }
                }
            }
            else { //If the raindrop is on the floor
                o.setAnimation('crash');
                //Makes the raindrop disapear one by one
                if(index>10) {
                    array[1].destroy();
                    array.splice(1,1);
                }
            }
        }.bind(this));
    };
    
};

