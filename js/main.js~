window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // load sprites and backgrounds
        game.load.image('sky', 'assets/sky.bmp');
        game.load.spritesheet( 'ninja', 'assets/ninja.png', 386, 467);
        game.load.image('map', 'assets/map.bmp');
    }
    // create variables
    var bg;
    var player;
    var keys;
    var jump;
    var jumpTimer = 0;
    var facingLeft = false;
    
    function create() {
        // add sprites and turn on the arcade physics engine for this sprite.
        bg = game.add.tileSprite(0, 0, 30000, 400, 'sky');
        game.world.setBounds(0, 0, 30000, 400);
        player = game.add.sprite(15, 15, 'ninja');
        player.scale.setTo(0.2, 0.2);
        game.physics.enable(player, Phaser.Physics.ARCADE );
        game.world.sendToBack(bg);
        // add animations
        player.animations.add('idle', [1, 1, 2, 2, 3, 3], 7, true);
        player.animations.add('jump', [9, 10, 11, 12, 13, 14, 15, 16, 17], 15, true);
        player.animations.add('run', [18, 19, 20, 21, 22, 23, 24, 25, 26], 18, true);
        player.animations.add('slide', [27, 28, 29, 30, 31, 32, 33, 34, 35], 18, true);
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
