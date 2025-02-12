var leftRightGameScreen = {
	preload: function(){},
	create: function(){
		retroControlsSuspended = true;
		this.background = game.add.sprite(0,0,"background");
		this.round = 0;
		this.wins = 0;
		this.locked = false;
		this.finished = false;

		this.title = game.add.bitmapText(game.world.centerX,150,"pixel","LEFT / RIGHT",34);
		this.title.anchor.set(0.5);
		this.score = game.add.bitmapText(game.world.centerX,220,"pixel","ROUND 1/5   WIN 0",24);
		this.score.anchor.set(0.5);
		this.face = game.add.bitmapText(game.world.centerX,game.world.centerY-30,"pixel","?",82);
		this.face.anchor.set(0.5);
		this.prompt = game.add.bitmapText(game.world.centerX,game.world.centerY+100,"pixel","A LEFT    B RIGHT",24);
		this.prompt.anchor.set(0.5);
		this.result = game.add.bitmapText(game.world.centerX,game.world.centerY+165,"pixel","",24);
		this.result.anchor.set(0.5);

		this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
		this.keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
		this.onLeft = function(){ this.choose("LEFT"); };
		this.onRight = function(){ this.choose("RIGHT"); };
		this.onCancel = function(){ game.state.start("main"); };
		this.keyA.onDown.add(this.onLeft,this);
		this.keyB.onDown.add(this.onRight,this);
		this.keyC.onDown.add(this.onCancel,this);
	},

	choose: function(direction){
		if(this.locked || this.finished || pet.dead || pet.lifeStage === "egg") return;
		this.locked = true;
		var wonRound = P1DeviceEngine.gameRound(pet);
		var tamaDirection = wonRound ? direction : (direction === "LEFT" ? "RIGHT" : "LEFT");
		this.face.text = tamaDirection === "LEFT" ? "<" : ">";
		this.result.text = wonRound ? "MATCH!" : "MISS!";
		if(wonRound) this.wins++;
		this.round++;
		this.score.text = "ROUND "+Math.min(5,this.round+1)+"/5   WIN "+this.wins;

		var delay = Math.max(1,P1DeviceEngine.gameDelay(pet,wonRound)) * 300;
		game.time.events.add(delay,function(){
			if(this.round >= 5){
				this.finished = true;
				var gameWon = P1DeviceEngine.finishGame(pet,this.wins);
				this.face.text = gameWon ? "^_^" : "T_T";
				this.result.text = this.wins+" / 5  "+(gameWon ? "HAPPY +1" : "TRY AGAIN")+"  WT -1";
				this.prompt.text = "C RETURN";
				return;
			}
			this.face.text = "?";
			this.result.text = "";
			this.locked = false;
		},this);
	},

	update: function(){
		tickCheck();
	},

	shutdown: function(){
		retroControlsSuspended = false;
		if(this.keyA) this.keyA.onDown.remove(this.onLeft,this);
		if(this.keyB) this.keyB.onDown.remove(this.onRight,this);
		if(this.keyC) this.keyC.onDown.remove(this.onCancel,this);
	}
};
