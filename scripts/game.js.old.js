var timerCreate;

function speakerOff()
{
	$('#song')[0].pause();
	$('#speaker').remove();
	$('body').append('<a id="speaker" onclick="speakerOn()" href="javascript:void(0);"><img  src="media/speakerOff.png" /></a>');
}

function speakerOn()
{
	$('#song')[0].play();
	$('#speaker').remove();
	$('body').append('<a id="speaker" onclick="speakerOff()" href="javascript:void(0);"><img  src="media/speakerOn.png" /></a>');
}

function endGame()
{
	$('#container').remove();
	clearTimeout(timerCreate);
	$('body').append('<div id="menu"><table><t<tr><td><h1>Raindrop</h1></td></tr><tr><td><button onClick="launchGame()">Retry!</button></td></tr><tr><td><a id="link" href="http://www.thecreator.fr">Visit my website!</a></td></tr></table></div>');
}
function launchGame()
{
	if(!$('#container').length)
	{
		$('body').append('<div id="container"></div>');
	}
	$('#menu').remove();
	$('#score').text('Score: 0');
	var stage = new Kinetic.Stage({container: 'container', width: $( window ).width(), height: $( window ).height() });
	var playerLayer = new Kinetic.Layer();
	var dropsLayer = new Kinetic.Layer();
	var playerSprite = new Image();
	playerSprite.src = 'media/character.png';
	var raindropSprite = new Image();
	raindropSprite.src = 'media/raindrop.png';
	var drops = new Array();
	var player;

	var score = 0;
	
	var animations = 
	{
	idleRight: [{x: 0, y: 0, width: 100, height: 125}],

	idleLeft: [{x: 100, y: 0, width: 100, height: 125}],

	runRight: [{x: 0, y: 125, width: 100, height: 125},{x: 100, y: 130, width: 100, height: 125},{x: 200, y: 130, width: 100, height: 125},{x: 300, y: 130, width: 100, height: 125},
	{x: 400, y: 130, width: 100, height: 125},{x: 500, y: 130, width: 100, height: 125},{x: 600, y: 130, width: 100, height: 125},{x: 700, y: 130, width: 100, height: 125}],

	runLeft: [{x: 0, y: 250, width: 100, height: 125},{x: 100, y: 250, width: 100, height: 125},{x: 200, y: 250, width: 100, height: 125},{x: 300, y: 250, width: 100, height: 125},
	{x: 400, y: 250, width: 100, height: 125},{x: 500, y: 250, width: 100, height: 125},{x: 600, y: 250, width: 100, height: 125},{x: 700, y: 250, width: 100, height: 125}]
	};

	var rainAnimations = 
	{
		idle: [{x:0,y:0,width:50,height:50}], crash: [{x:50,y:0,width:50,height:50}]
	};

	function rainCreate()
	{
		drop = new Kinetic.Sprite({x:Math.random()* $( window ).width(),y:-10,image: raindropSprite, animation: 'idle', animations: rainAnimations, framerate:1, index:0});
		dropsLayer.add(drop);
		drop.start();
		drops.push(drop);
		score++;
				$('#score').text('Score: '+score);
				rainFall();
	}

	function rainFall()
	{
		for(i=0;i<drops.length;i++)
		{
			if(drops[i].getY()<$( window ).height()-60)
			{
				drops[i].move(0,10);
				if(drops[i].getY()>$( window ).height()-125)
				{
					if(drops[i].getX()+25>=player.getX()&&drops[i].getX()+25<=player.getX()+75&&drops[i].getAnimation()!='crash')
					{
						endGame();
					}
				}
			}
			else
			{
				drops[i].setAnimation('crash');
				if(i>20)
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
		timerCreate = window.setInterval(rainCreate, 10);
	}

	playerSprite.onload = function() 
	{
		player = new Kinetic.Sprite({ x: 600, y: $( window ).height()-130, image: playerSprite, animation: 'idleRight', animations: animations, frameRate: 16, index: 0});
		var sens = 'droite';
		playerLayer.add(player);
		stage.add(playerLayer);
		player.start();
		var timerKey =null;
		document.addEventListener('keydown', function(event) 
		{
		    if(event.keyCode == 37&&player.getX()>0) 
		    {
		    	sens = 'gauche';
		    	if(timerKey==null)
		    	{
		    	timerKey = setInterval(function(){if(player.getAnimation()!='runLeft')
	    		{
	    			keyPressed = true;
	    			player.setAnimation('runLeft');
	    		}
	    		player.setX(player.getX()-20);},10);
		    }
		    }
		    else if(event.keyCode == 39&&player.getX()<$( window ).width()-100) 
		    {
		    	sens = 'droite';
		    	if(timerKey==null)
		    	{
		    	timerKey = setInterval(function(){if(player.getAnimation()!='runRight')
		    	{
		    		keyPressed = true;
			    	player.setAnimation('runRight');
		    	}
		    	player.setX(player.getX()+20);},10);
		    	}

		    }
		});
	    document.addEventListener('keyup',function(event)
	    {
	    	if(event.keyCode==37||event.keyCode==39)
	    	{
	    		clearTimeout(timerKey);
	    		timerKey=null;
	    		if(sens=='gauche')
	    		{ player.setAnimation('idleLeft');}
	    		else {player.setAnimation('idleRight');}
	    	}
	    });
	}
}
