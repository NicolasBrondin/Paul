var timerCreate;
var timerFall;

$(document).ready(function()
{
	$('#container').hide();
});

function speakerOff() //Pause the music
{
	$('#song')[0].pause();
	//Remove the old button 'pause' and add the new one 'play'
	$('#speaker').remove();
	$('body').append('<a id="speaker" onclick="speakerOn()" href="javascript:void(0);"><img  src="media/speakerOff.png" /></a>');
}

function speakerOn() //Play the music
{
	$('#song')[0].play();
	//Remove the old button 'play' and add the new one 'pause'
	$('#speaker').remove();
	$('body').append('<a id="speaker" onclick="speakerOff()" href="javascript:void(0);"><img  src="media/speakerOn.png" /></a>');
}

function endGame() //Called when the player is dead
{
	//Delete all game components
	$('#container').hide();
	clearTimeout(timerCreate);
	clearTimeout(timerFall);
	//Show the menu
	$('#menu').show();
}

function launchGame() //Called when the button 'Play the game' is pressed
{
	//Add the container of the Kinetic Stage
	$('#container').show();
	//Remove the menu
	$('#menu').hide();
	//Create the Kinetic stage
	var stage = new Kinetic.Stage({container: 'container', width: $( window ).width(), height: $( window ).height() });
	//Create the layers and load the images
	var playerLayer = new Kinetic.Layer();
	var dropsLayer = new Kinetic.Layer();
	var playerSprite = new Image();
	playerSprite.src = 'media/character.png';
	var raindropSprite = new Image();
	raindropSprite.src = 'media/raindrop.png';
	//Create variables for the game
	var drops = new Array();
	var player;
	var score = 0;
	//Create the animations for the player
	var animations = 
	{
	idleRight: [{x: 0, y: 0, width: 100, height: 125}],

	idleLeft: [{x: 100, y: 0, width: 100, height: 125}],

	runRight: [{x: 0, y: 125, width: 100, height: 125},{x: 100, y: 130, width: 100, height: 125},{x: 200, y: 130, width: 100, height: 125},{x: 300, y: 130, width: 100, height: 125},
	{x: 400, y: 130, width: 100, height: 125},{x: 500, y: 130, width: 100, height: 125},{x: 600, y: 130, width: 100, height: 125},{x: 700, y: 130, width: 100, height: 125}],

	runLeft: [{x: 0, y: 250, width: 100, height: 125},{x: 100, y: 250, width: 100, height: 125},{x: 200, y: 250, width: 100, height: 125},{x: 300, y: 250, width: 100, height: 125},
	{x: 400, y: 250, width: 100, height: 125},{x: 500, y: 250, width: 100, height: 125},{x: 600, y: 250, width: 100, height: 125},{x: 700, y: 250, width: 100, height: 125}]
	};
	//Create the aniamtions for the raindrops
	var rainAnimations = 
	{
		idle: [{x:0,y:0,width:50,height:50}], crash: [{x:50,y:0,width:50,height:50}]
	};

	function rainCreate() //Create a raindrop when called (timerCreate)
	{
		drop = new Kinetic.Sprite({x:Math.random()* $( window ).width(),y:-10,image: raindropSprite, animation: 'idle', animations: rainAnimations, framerate:1, index:0});
		dropsLayer.add(drop);
		drop.start();
		drops.push(drop);
		score++;
		$('#score').text('Score: '+score);
		rainFall();
	}

	function rainFall() //Make each raindrop fall
	{
		for(i=0;i<drops.length;i++)
		{
			if(drops[i].getY()<$( window ).height()-60) //If the raindrop is above the floor
			{
				//Makes it fall
				drops[i].move(0,5);
				//If it's at the height of the player
				if(drops[i].getY()>$( window ).height()-125)
				{
					//and there is collision between the player and a raindrop
					if(drops[i].getX()+25>=player.getX()&&drops[i].getX()+25<=player.getX()+75&&drops[i].getAnimation()!='crash')
					{
						//Back to menu
						endGame();
					}
				}
			}
			else //If the raindrop is on the floor
			{
				//Makes it crash
				drops[i].setAnimation('crash');
				//Makes the raindrop disapear one by one
				if(i>10)
				{
					drops[1].destroy();
					drops.splice(1,1);	
				}
			}
		}
	}
	raindropSprite.onload = function()
	{
		stage.add(dropsLayer);
		timerCreate = window.setInterval(rainCreate, 50);
		timerFall = window.setInterval(rainFall, 25);
	}

	playerSprite.onload = function() 
	{
		player = new Kinetic.Sprite({ x: 600, y: $( window ).height()-130, image: playerSprite, animation: 'idleRight', animations: animations, frameRate: 8, index: 0});
		var orientation = 'right';
		playerLayer.add(player);
		stage.add(playerLayer);
		player.start();
		var timerKey =null;
		document.addEventListener('keydown', function(event) 
		{
		    if(event.keyCode == 37) 
		    {
		    	orientation = 'left';
		    	if(timerKey==null)
		    	{
			    	timerKey = setInterval(function()
			    	{
			    		if(player.getX()>0)
			    		{
				    		if(player.getAnimation()!='runLeft')
				    		{
				    			keyPressed = true;
				    			player.setAnimation('runLeft');
				    		}
				    		player.move(-10,0);
			    		}
		    		},10);
		    	}
		    }
		    else if(event.keyCode == 39) 
		    {
		    	orientation = 'right';
		    	if(timerKey==null)
		    	{
			    	timerKey = setInterval(function()
		    		{
		    			if(player.getX()<$( window ).width()-100)
		    			{
			    			if(player.getAnimation()!='runRight')
					    	{
					    		keyPressed = true;
						    	player.setAnimation('runRight');
					    	}
					    	player.move(10,0);
				    	}
		    		},10);
		    	}
		    }
		});
	    document.addEventListener('keyup',function(event)
	    {
	    	if(event.keyCode==37||event.keyCode==39)
	    	{
	    		clearTimeout(timerKey);
	    		timerKey=null;
	    		if(orientation=='left')
	    		{ player.setAnimation('idleLeft');}
	    		else {player.setAnimation('idleRight');}
	    	}
	    });
	}
}
