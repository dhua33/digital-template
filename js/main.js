window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // load sprites and backgrounds
        game.load.image('sky', 'assets/sky.bmp');
        game.load.spritesheet( 'ninja', 'assets/ninja.png', 536, 522);
        game.load.image('map', 'assets/map.bmp');
        game.load.image('dog', 'assets/dog.png');
    }
    // create variables
    var bg;
    var player;
    var keys;
    var jump;
    var jumpTimer = 0;
    var facingLeft = false;
    var dog;
    
    function create() {
        // add sprites and turn on the arcade physics engine for this sprite.
        bg = game.add.tileSprite(0, 0, 30000, 400, 'sky');
        player = game.add.sprite(15, 15, 'ninja');
        player.scale.setTo(0.2, 0.2);
        game.physics.enable(player, Phaser.Physics.ARCADE );
        game.world.sendToBack(bg);
        dog = game.add.sprite(29800, 330, 'dog');
        dog.scale.setTo(0.4, 0.4);
        // add animations
        var j = 10;
        var arrayJump = [], arrayRun = [], arraySlide = [];
        var arrayIdle = [], arrayDie = [];
        while(j < 40) {
        		if(j < 20)
        				arrayDie.push(j);
        		else if(j < 30)
        				arrayIdle.push(j);
        		else
        				arrayJump.push(j);
        		j++;
        }
        j = 60;
        while(j < 80) {
        		if(j < 70)
        				arrayRun.push(j);
        		else
        				arraySlide.push(j);
        		j++;
        }  
        player.animations.add('idle', [0], 20, true);
        player.animations.add('jump', [1], 20, true);
        player.animations.add('run', [2], 20, true);
        player.animations.add('slide', [3], 20, true);
        // create world gravity and camera
        game.physics.arcade.gravity.y = 3200;
        game.camera.follow(player);
        // set world bounds and key inputs
        player.body.collideWorldBounds = true;
        keys = game.input.keyboard.createCursorKeys();
        jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
    		player.anchor.setTo(.5, .5);
    }
    
    function update() {
    if (!player.body.onFloor()) { // if the player is not on the ground
    		player.animations.play('jump');
    }
    else if (keys.left.isDown)
    {
    		if(!facingLeft) { // if the player is not facing left 
    				player.scale.x *= -1; // flip the sprite
    				facingLeft = true;
    		}
    		if (player.body.velocity.x > -1000)
    				player.body.velocity.x += -20;
        player.animations.play('run');
    }
    else if (keys.right.isDown)
    {
    		if(facingLeft) {
    				player.scale.x *= -1;
    				facingLeft = false;
    		}
    		if (player.body.velocity.x < 1000)
    				player.body.velocity.x += 20;
        player.animations.play('run');
    }
    else if (keys.down.isDown && player.body.velocity.x != 0) { // sliding physics
    		if(player.body.velocity.x > 0)
    				player.body.velocity.x -= 10;
    		else
    				player.body.velocity.x += 10
    		player.animations.play('slide');
    }
    else
    {
        player.body.velocity.x = 0;
        player.animations.play('idle');
    }
    
    if (jump.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -1000;
        jumpTimer = game.time.now + 500;
    }
    }
};
