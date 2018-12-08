// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var lives= 3;
var winningScore = 100;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 400, 'coin');
  createItem(575, 500, 'coin');
  createItem(225, 500, 'coin');
  createItem(100, 350, 'mushroom');
  createItem(575, 150, 'greenmushroom');
  createItem(525, 300, 'coin');
  createItem(650, 250, 'coin');
  createItem(225, 200, 'coin');
  createItem(375, 100, 'poison');
  createItem(570, 300, 'poison');
  createItem(50, 375, 'poison');
  createItem(125, 50, 'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 550, 'platform2');
  platforms.create(100, 550, 'platform2');
  platforms.create(300, 450, 'platform');
  platforms.create(350, 150, 'platform');
  platforms.create(25, 400, 'platform');
  platforms.create(150, 250, 'platform');
  platforms.create(650, 450, 'platform');
  platforms.create(550, 200, 'platform');
  platforms.create(400, 350, 'platform');
  platforms.create(50, 100, 'platform2');
  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if (item.key === 'coin') {
    currentScore = currentScore + 10;
  }  else if (item.key === 'star') {
      currentScore = currentScore + 50;
  } else if (item.key === 'poison') {
      lives = lives - 1;
  } else if (item.key === 'greenmushroom') {
      lives = lives + 1;
  } else if (item.key === 'mushroom') {
    currentScore = currentScore + 10;
  }

  if (currentScore === winningScore) {
      createBadge();
  }
}

//when the player collects poison they lose a life

function poisonCollect(player, poison) {
    poison.kill();
    lives = lives + 1;
    if (lives === 0) {
        player.kill();
        gameOver = true;
    }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  // before the game begins
  function preload() {
//    game.stage.backgroundImage = background
    game.load.image('background', 'background.png');

    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');


    //Load spritesheets
//    game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
    game.load.spritesheet('player', 'mario_right.png', 70.8, 65);
    game.load.spritesheet('mushroom', 'mushroom2.png', 46, 46);
    game.load.spritesheet('greenmushroom', 'greenmushroom.png', 46, 46);
  }

  // initial game set up
  function create() {
    game.add.image(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "yellow" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "yellow" });  livesText = game.add.text(685, 16, "LIVES: " + lives, { font: "bold 24px Arial", fill: "yellow" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    livesText.text = "LIVES: " + lives;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = -1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {

  }

};
