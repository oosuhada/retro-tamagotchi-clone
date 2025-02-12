function CareFoodChoice(name,spriteIndex,desc,feedAction){
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.cost = 0;
	this.select = function(){
		var ate = feedAction(pet);
		if(!ate){
			addTempText(pet.lifeStage === "egg" ? "WAIT FOR HATCH" : "REFUSED",1);
			return;
		}
		addTempText(name === "MEAL" ? "HUNGRY +1  WT +1" : "HAPPY +1  WT +2",1);
		game.time.events.add(Phaser.Timer.SECOND,function(){ game.state.start("main"); },this);
	};
}

invFoodArray = [
	new CareFoodChoice("MEAL",0,"Fill 1 Hungry heart\nWeight +1",P1DeviceEngine.feedMeal),
	new CareFoodChoice("SNACK",2,"Fill 1 Happy heart\nWeight +2",P1DeviceEngine.feedSnack)
];

var feedingScreen = {
	preload: function(){},
	create: function(){
		retroControlsSuspended = true;
		drawGameBody();
		drawGameUI(invFoodArray,"foodSheet");
		costText.alpha = 0;
		button12.mode = "use";

		this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
		this.keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
		this.onNext = function(){ slideCounter = (slideCounter + 1) % invFoodArray.length; };
		this.onSelect = function(){ invFoodArray[slideCounter].select(); };
		this.onCancel = function(){ game.state.start("main"); };
		this.keyA.onDown.add(this.onNext,this);
		this.keyB.onDown.add(this.onSelect,this);
		this.keyC.onDown.add(this.onCancel,this);
	},
	update: function(){
		displaySlide(invFoodArray);
		tickCheck();
	},
	shutdown: function(){
		retroControlsSuspended = false;
		if(this.keyA) this.keyA.onDown.remove(this.onNext,this);
		if(this.keyB) this.keyB.onDown.remove(this.onSelect,this);
		if(this.keyC) this.keyC.onDown.remove(this.onCancel,this);
	}
};
