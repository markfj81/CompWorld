var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
	//yindex = Math.floor(frame / 3);
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight, this.frameWidth, this.frameHeight,
                 x, y, this.frameWidth, this.frameHeight);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
};

function Volt(game, spritesheet) {
	this.animation = new Animation(spritesheet, 180, 250, 4, 0.14, 4, true, true, .8);
    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 450);
}

Volt.prototype = new Entity();
Volt.prototype.constructor = Volt;

Volt.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1200) this.x = -230;
    Entity.prototype.update.call(this);
}

Volt.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Bird(game, spritesheet, spritesheet2) {
	
	this.forwardAnimation = new Animation(spritesheet, 110, 100, 2, .15, 3, true, .8);
	this.flipAnimation = new Animation(spritesheet2, 110, 100, 2, .18, 3, true, .8);
	this.animation = this.forwardAnimation;
	this.speed = 300;
	this.direction = 1;
	this.ctx = game.ctx;
	Entity.call(this,game, 0, 200);
}

Bird.prototype = new Entity();
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
	this.x += this.game.clockTick * this.speed;
	if (this.x > 1150) {
		this.direction += -1;
		this.animation = this.flipAnimation;
	} else if (this.x < -50) {
		this.direction += 1;
		this.animation = this.forwardAnimation;
	} 
	//console.log("current location is : " + this.x);
	this.x += 1 * this.direction;
    Entity.prototype.update.call(this);
	
}

Bird.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	Entity.prototype.draw.call(this);
}

AM.queueDownload("Volt.png");
AM.queueDownload("theBirdxx.png");
AM.queueDownload("theBird.png");
AM.queueDownload("background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("background.jpg")));
    gameEngine.addEntity(new Volt(gameEngine, AM.getAsset("Volt.png")));
	gameEngine.addEntity(new Bird(gameEngine, AM.getAsset("theBirdxx.png"),AM.getAsset("theBird.png")));
});
