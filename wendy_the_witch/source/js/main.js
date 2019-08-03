var DEBUG_MODE = true;


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player_old.png', 'assets/player.json');
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // coin image used as tileset
    var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);

    coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    this.physics.add.overlap(player, coinLayer);

    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);




}





// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

function update(time, delta) {
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-500);        
    }
}




























var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.audio('home_light', ['assets/music/Home_1.0.mp3'] ); // could put .ogg files here in this list for browser compatibility
    },

    create: function ()
    {
        this.add.sprite(400, 300, 'face').setAlpha(0.2);


        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene A - This is the main menu screen. (Music + press any key to continue)', { fill: 'white' });
        }
        
        this.add.text(100, 300, 'Wendy Pendlewick and the Gates Of Hell!!!', { fill: 'white' });
        
        
        music = this.sound.add('home_light');

        music.play({
            loop: true
        });




        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');
            music.stop();
            this.scene.start('sceneB');

        }, this);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/pics/titan-mech.png');
        this.load.audio('home_light', ['assets/music/Home_1.0.mp3'] ); // could put .ogg files here in this list for browser compatibility


    },

    create: function ()
    {
        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);

        
        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene B - Wendy is in her house. She says goodnight to her pets and goes to sleep.', { fill: 'white' });
        }

        
        music = this.sound.add('home_light');

        music.play({
            loop: true
        });



        this.input.once('pointerdown', function (event) {

            console.log('From SceneB to SceneC');
            music.stop()
            this.scene.start('sceneC');

        }, this);
    },

    update: function (time, delta)
    {
        this.arrow.rotation += 0.01;
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
        this.load.audio('home_dark', ['assets/music/Home_dark_1.0.mp3'] ); // could put .ogg files here in this list for browser compatibility
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene C - Wendy wakes up in the house and her cat is gone! She walks out the door', { fill: 'white' });
        }

        music = this.sound.add('home_dark');
        music.play({
            loop: true
        });
        this.input.once('pointerdown', function (event) {

            //console.log('From SceneC to SceneA');
            music.stop()
            console.log('got to here');
            this.scene.start('sceneD');

        }, this);
    }

});



var SceneD = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneD ()
    {
        Phaser.Scene.call(this, { key: 'sceneD' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
        this.load.audio('streets', ['assets/music/Streets1.1.mp3'] ); // could put .ogg files here in this list for browser compatibility
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene D - Wendy wanders through the forest and dodges enemies', { fill: 'white' });
        }

        music = this.sound.add('streets');
        music.play({
            loop: true
        });

        this.input.once('pointerdown', function (event) {

            music.stop()
            this.scene.start('sceneE');

        }, this);
    }

});







var SceneE = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneE ()
    {
        Phaser.Scene.call(this, { key: 'sceneE' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
        this.load.audio('gribblewood', ['assets/music/TheGribblewood1.0.mp3'] ); // could put .ogg files here in this list for browser compatibility
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene E - Wendy meets the Imp in the forest. He stole her cat!', { fill: 'white' });
        }
        
        music = this.sound.add('gribblewood');
        music.play({
            loop: true
        });


        this.input.once('pointerdown', function (event) {
            music.stop()

            this.scene.start('sceneF');

        }, this);
    }

});









var SceneF = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneF ()
    {
        Phaser.Scene.call(this, { key: 'sceneF' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene F - Wendy follows the imp through the forest. Talking to Teddy.', { fill: 'white' });
        }

        this.input.once('pointerdown', function (event) {


            this.scene.start('sceneG');

        }, this);
    }

});






var SceneG = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneH ()
    {
        Phaser.Scene.call(this, { key: 'sceneG' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene G - Wendy has a boss fight with the imp', { fill: 'white' });
        }

        this.input.once('pointerdown', function (event) {


            this.scene.start('sceneH');

        }, this);
    }

});






var SceneH = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneH ()
    {
        Phaser.Scene.call(this, { key: 'sceneH' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene H - Post boss dialogue', { fill: 'white' });
        }

        this.input.once('pointerdown', function (event) {


            this.scene.start('sceneI');

        }, this);
    }

});






var SceneI = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneH ()
    {
        Phaser.Scene.call(this, { key: 'sceneI' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');
        

        if (DEBUG_MODE ==true) {

            this.add.text(32, 32, 'Scene I - Epilogue in the house (almost repeat of the first scene)', { fill: 'white' });
        }

        this.input.once('pointerdown', function (event) {


            this.scene.start('sceneA');

        }, this);
    }

});




// Scene list.
// Each scene will have music and dialogue
// ========================================
//
// This is the main menu screen. (Music + press any key to continue)         - A
// Wendy is in her house. She says goodnight to her pets and goes to sleep.   - B
// Wendy wakes up in the house and her cat is gone! She walks out the door     -C
// Forest walk        - D
// Meets imp in the forest     -E
// She's follwing the imp through the forest. Talking to Teddy. Maybe talking to imp   - F
// Boss fight         G
// Post boss dialogue    H 
// Epilogue in the house (almost repeat of the first scene)    I


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC, SceneD, SceneE, SceneF, SceneG, SceneH, SceneI ]
};

var game = new Phaser.Game(config);


