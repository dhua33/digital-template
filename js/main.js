window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // load sprites and backgrounds
        game.load.image('sky', 'assets/sky.bmp');
        game.load.spritesheet( 'ninja', 'assets/ninja.png', 489, 489);
        game.load.image('dog', 'assets/Dog.png');
        game.load.image('menu', 'assets/menu.png');
        game.load.image('back', 'assets/background.png');
        game.load.image('spike', 'assets/spike.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('platform', 'assets/platform.png');
    }
    // create variables
    var bg;
    var player;
    var keys;
    var jump;
    var jumpTimer = 0;
    var facingLeft = false;
    var dog;
    var menu;
    var back;
    var platforms;
    var plat;
    var spikes;
    var spike;
    var balls;
    var ball;
    var collidePlat;
    var collideBall = false;
    var collideSpike;
    var dead = false;
    var text;
    var style;
    var style2;
    var i = 2000;
    var win;
    
    function create() {
        // add sprites and turn on the arcade physics engine for this sprite.
        bg = game.add.tileSprite(0, 0, 30000, 1600, 'sky');
        back = game.add.tileSprite(0, 0, 30000, 1600, 'back');
        player = game.add.sprite(15, 450, 'ninja');
        player.scale.setTo(0.2, 0.2);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        game.world.sendToBack(bg);
        dog = game.add.sprite(29800, 1330, 'dog');
        dog.scale.setTo(0.4, 0.4);
        game.physics.arcade.enable(dog);
        
        // add platforms and obstacles
        platforms = game.add.group();
        spikes = game.add.group();
        balls = game.add.group();
        platforms.enableBody = true;
        spikes.enableBody = true;
        balls.enableBody = true;
        // dog's platform
        plat = platforms.create(29700, 1370, 'platform');
        plat.scale.setTo(2, 1);
        plat.body.immovable = true;
        
        // base platforms, balls, spikes
        var j = 300;
        var k = 800;
        var n;
        while (i < 29000) { // platform set 2
        		plat = platforms.create(i, 1200, 'platform');
        		plat.scale.setTo(10, .5);
        		plat.body.immovable = true;
        		ball = balls.create(i + j, 1050, 'ball');
        		ball.scale.setTo(.7, .7);
        		ball.body.immovable = true;
        		ball = balls.create(i + k, 1070, 'ball');
        		ball.scale.setTo(.5, .5);
        		ball.body.immovable = true;
        		ball = balls.create(i + k + 70, 1070, 'ball');
        		ball.scale.setTo(.5, .5);
        		ball.body.immovable = true;
        		n = j;
        		j = k;
        		k = n;
        		i += 3000;	
        } i = 0, j = 600, k = 1200;
        while (i < 30000) { // platform set 1
        		plat = platforms.create(i, 1400, 'platform');
        		plat.scale.setTo(16, .5);
        		plat.body.immovable = true;
        		spike = spikes.create(i + k, 1336, 'spike');
        		spike.scale.setTo(.5, .5);
        		spike.body.immovable = true;
        		spike = spikes.create(i + j, 1336, 'spike');
        		spike.scale.setTo(.5, .5);
        		spike.body.immovable = true;
        		spike = spikes.create(i + j + 80, 1336, 'spike');
        		spike.scale.setTo(.5, .5);
        		spike.body.immovable = true;
        		n = j;
        		j = k;
        		k = n;
        		i += 4500;
        } i = 3900, j = 600, k = 1100;
        while (i < 27600) { // platform set 3
        		plat = platforms.create(i, 1000, 'platform');
        		plat.scale.setTo(16, .5);
        		plat.body.immovable = true;
        		ball = balls.create(i + j, 850, 'ball');
        		ball.scale.setTo(.7, .7);
        		ball.body.immovable = true;
        		i += 3100;
        } i = 3250;
        // staircase up
        j = 0;
        while (i > 0) {
        		plat = platforms.create(i, 800 - j, 'platform');
        		plat.scale.setTo(2, .7);
        		plat.body.immovable = true;
        		i -= 600;
        		j += 50;
        } i = 700, j = 0, k = 0;
        // large plats, balls, and spikes
        while (i < 28950) {
        		plat = platforms.create(i, 350, 'platform');
        		plat.scale.setTo(32, .5);
        		plat.body.immovable = true;
        		i += 5650
        }
        
        // add animations
        j = 10;
        var arrayJump = [], arrayRun = [], arraySlide = [], arrayIdle = [], arrayDie = [];
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
        player.animations.add('idle', arrayIdle, 20, true);
        player.animations.add('jump', arrayJump, 15, true);
        player.animations.add('run', arrayRun, 20, true);
        player.animations.add('slide', arraySlide, 20, true);
        player.animations.add('die', arrayDie);
        player.anchor.setTo(.5, .5);
        // create player gravity and camera
        player.body.gravity.y = 3200;
        game.camera.follow(player);
        // set world bounds and key inputs
        game.world.setBounds(0, 0, 30000, 1600);
        player.body.collideWorldBounds = true;
        keys = game.input.keyboard.createCursorKeys();
        jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        // death state text
    		style = { font: "25px Verdana", fill: "#ff0000", align: "center" };
    		style2 = { font: "25px Verdana", fill: "#ffff00", align: "center" };
    		text = game.add.text(200, 200, "", style);
    		text.fixedToCamera = true;
        
        // pause the game in the beginning to display controls
        jump.onDown.add(exitMenu, this);
        menu = game.add.sprite(100, 0, 'menu');
        game.paused = true;
        i = 0;
    }
    function exitMenu() {
    		if(!win) {
    				menu.destroy();
    				game.paused = false;
    		}
    }
    
    function update() {
    // collision
    		collidePlat = game.physics.arcade.collide(player, platforms);
    		collideSpike = game.physics.arcade.overlap(player, spikes);
    		win = game.physics.arcade.collide(player, dog);
    		if(collidePlat && keys.down.isDown && !(keys.left.isDown || keys.right.isDown) && player.body.velocity.x != 0)
    				collideBall = false;
    		else
    				collideBall = game.physics.arcade.overlap(player, balls);
    // win
    if(win){
    		text.setStyle(style2);
    		text.setText("YOU WIN\nYou've caught Memory.");
    		game.paused = true;
    }
    // death state
    if(player.body.onFloor() || collideSpike || collideBall || dead) {
    		dead = true;
        player.body.velocity.x = 0;
        back.stopScroll();
        bg.stopScroll();
        text.setText("YOU DIED\nPress the up arrow key to restart.");
    		player.animations.play('die', 20, false, true);
    }
    // controls
    else if (!player.body.onFloor() && !collidePlat) { // if the player is not on the ground
    		player.animations.play('jump');
    }
    else if (keys.left.isDown)
    {
    		if(!facingLeft) { // if the player is not facing left 
    				player.scale.x *= -1; // flip the sprite
    				facingLeft = true;
    		}
    		if (player.body.velocity.x > -700)
    				player.body.velocity.x += -50;
        player.animations.play('run');
        back.autoScroll(5, 0);
        bg.autoScroll(150, 0);
    }
    else if (keys.right.isDown)
    {
    		if(facingLeft) {
    				player.scale.x *= -1;
    				facingLeft = false;
    		}
    		if (player.body.velocity.x < 700)
    				player.body.velocity.x += 50;
        player.animations.play('run');
        back.autoScroll(-5, 0); 
        bg.autoScroll(-150, 0);
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
        back.stopScroll();
        bg.stopScroll();
        player.animations.play('idle');
    }
    // jumping
    if (jump.isDown && collidePlat && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -1200;
        jumpTimer = game.time.now + 500;
    }
    // reset
    if(!player.alive && keys.up.isDown) {
    		dead = false;
    		player.reset(15, 700);
    		text.setText("");
    }
    }
};
