// 오래된 Phaser 2의 AUTO 렌더러가 최신 브라우저에서 WebGL을 선택하면
// 검은 화면만 표시되는 경우가 있어 이 픽셀 게임은 Canvas 렌더러로 고정한다.
var game = new Phaser.Game(800,800,Phaser.CANVAS,"tamagotchi-screen");
var height = 800;
var width = 800;
var buttonDispX = 50;

date = new Date();



var tickCounter = 0 ;

var time;


//---------------------------STATES---------------------------------------
var main = {
	preload: function(){
		
		
	},
	create: function(){
		//round pixels, so that pixel sprites remain sharp
		//this fixed a problem with the button sprite sheet
		game.renderer.renderSession.roundPixels = true;
		//Allows game to run in background
		game.stage.disableVisibilityChange = true;
		
		drawGameBody();
		
		var selectedPartnerId = DigimonPartners.selectedId(pet);
		DigimonPartners.applyToPet(pet, selectedPartnerId);
		partnerBitmap = DigimonPartners.createBitmap(game, selectedPartnerId);
		petSprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,partnerBitmap);
		petSprite.anchor.setTo(0.5);
		partnerChangeHandler = function(event){
			var nextId = event && event.detail ? event.detail.id : DigimonPartners.selectedId(pet);
			DigimonPartners.applyToPet(pet,nextId);
			partnerBitmap = DigimonPartners.createBitmap(game,nextId);
			petSprite.loadTexture(partnerBitmap);
		};
		window.addEventListener("digimon-partner-change",partnerChangeHandler);
		counter = game.add.bitmapText(75, game.world.centerY-200,"pixel","tickCounter",32);
		clockText = game.add.bitmapText(game.world.centerX, 112,"pixel","00:00",24);
		clockText.anchor.set(0.5);
		stageText = game.add.bitmapText(game.world.centerX, game.world.centerY+150,"pixel","EGG",24);
		stageText.anchor.set(0.5);
		sleepText = game.add.bitmapText(game.world.centerX, game.world.centerY+190,"pixel","",20);
		sleepText.anchor.set(0.5);
		attentionText = game.add.bitmapText(game.world.centerX, 160,"pixel","",20);
		attentionText.anchor.set(0.5);
		deathText = game.add.bitmapText(game.world.centerX, game.world.centerY+220,"pixel","",18);
		deathText.anchor.set(0.5);
		eggGraphic = game.add.graphics(game.world.centerX, game.world.centerY);
		eggGraphic.beginFill(0xf5f5dc);
		eggGraphic.lineStyle(6,0x222222,1);
		eggGraphic.drawEllipse(-46,-58,92,116);
		eggGraphic.endFill();
		petSprite.baseY = this.game.world.centerY;
		//add Sprites for ailments - conditions that can afflict the pet.
		sickSprite = game.add.sprite(petSprite.x+50,petSprite.y-50,"ailmentSheet");
		sickSprite.animations.add("sick",[2,3],2,true);
		sickSprite.anchor.setTo(0.5);
		sickSprite.scale.setTo(0.45);
		sickSprite.play("sick");
		
		//"poop" sprite. Can potentially create a "poop" object so that code is a bit more tidy, but since only 3 sprites are needed, code can be left as is.
			
		poopSprite0 = game.add.sprite(width*(3/4),height*((2+2)/7),"ailmentSheet");
		poopSprite0.scale.setTo(0.5);
		poopSprite0.anchor.setTo(0.5);
		poopSprite0.animations.add("poop",[0,1],2,true);
		poopSprite0.play("poop");
		
		poopSprite1 = game.add.sprite(width*(3/4),height*((2+1)/7),"ailmentSheet");
		poopSprite1.scale.setTo(0.5);
		poopSprite1.anchor.setTo(0.5);
		poopSprite1.animations.add("poop",[0,1],2,true);
		poopSprite1.play("poop");
		
		poopSprite2 = game.add.sprite(width*(3/4),height*((2+0)/7),"ailmentSheet");
		poopSprite2.scale.setTo(0.5);
		poopSprite2.anchor.setTo(0.5);
		poopSprite2.animations.add("poop",[0,1],2,true);
		poopSprite2.play("poop");
		
		poopArray=[poopSprite0,poopSprite1,poopSprite2];
	},
	shutdown: function(){
		if(typeof partnerChangeHandler === "function") window.removeEventListener("digimon-partner-change",partnerChangeHandler);
	},
	
	update: function(){
		tickCheck();
		ailmentCheck();
		var now = new Date();
		clockText.text = padClock(now.getHours()) + ":" + padClock(now.getMinutes());
		var partner = DigimonPartners.get(pet.partnerId);
		stageText.text = (pet.name || partner.name).toUpperCase() + "  " + pet.lifeStage.toUpperCase() + "  " + pet.weight + "oz";
		sleepText.text = pet.sleeping ? (pet.lightsOn ? "SLEEPING - LIGHT ON" : "Z Z Z") : "";
		attentionText.text = pet.attention && pet.attention.active ? "! ATTENTION: " + pet.attention.reason.toUpperCase() : "";
		deathText.text = pet.dead ? "DEAD: " + pet.deathReason + "  A+C NEW EGG" : "";

		if(pet.lifeStage === "egg"){
			petSprite.alpha = 0;
			eggGraphic.alpha = 1;
		}else{
			petSprite.alpha = pet.sleeping && !pet.lightsOn ? 0.25 : 1;
			eggGraphic.alpha = 0;
			if(pet.lifeStage === "baby") petSprite.scale.setTo(0.72);
			else if(pet.lifeStage === "child") petSprite.scale.setTo(0.84);
			else if(pet.lifeStage === "teen") petSprite.scale.setTo(0.94);
			else petSprite.scale.setTo(1);
		}
		var speed = Math.max(1, Number(globalVal.speedMultiplier) || 1);
		petSprite.y = petSprite.baseY + (Math.floor(Date.now()/(500/speed))%2 === 0 ? -3 : 3);
		petSprite.tint = pet.dead ? 0x555555 : pet.sick ? 0x91b871 : 0xffffff;
        
        if(globalVal.counterEnabled){
            counter.text = tickCounter;
        }
        else{
            counter.text = "";
        }
		
		
		//now calculate pet mood
		if (pet.dead){
			pet.mood = "dead";
			return;
		}
		if((pet.hunger>50)&&(pet.happiness>=60)){
			pet.mood = "happy";
		}
		else if((pet.hunger>=30)&&(pet.happiness<30)){
			pet.mood = "angry";
		}
		else if((pet.hunger<30)||(pet.sick)){
			pet.mood = "sad";
		}
		else{
			pet.mood = "neutral";
		}
		
		
	}
}

//State loads all most game assests. While this technically isnt needed as all states can preload
//the files are small enough that this preload will be very quick, and will prevent the game from
//flickering when states change.
var preload = {
	preload: function(){
		//loads an image can can be refenced as background
		this.load.image("background","assets/art/background.png");
		//loads a sprite sheet and breaks the sheet up into 10, 128 x 128 sprites.
		this.load.spritesheet("petSheet","assets/art/pet/petSheet.png",128,128,10);
		this.load.spritesheet("foodSheet","assets/art/items/foodSheet.png",128,128,9);
		this.load.spritesheet("playSheet","assets/art/items/playSheet.png",128,128,12);
		this.load.spritesheet("saveSheet","assets/art/items/saveSheet.png",128,128,3);
		this.load.spritesheet("ailmentSheet","assets/art/pet/ailmentSheet.png",128,128,9);
		//loads button sprite sheet.
		this.load.spritesheet("buttonSheet","assets/art/buttonSheet.png",64,64,15);

		//loads a bitmapFont, which requires both a png as well as an XML file.
		this.load.bitmapFont("pixel","assets/font/pixelFont.png","assets/font/pixelFont.xml");
		
	},
	create: function(){
		// Phaser의 scale manager는 boot가 끝난 뒤에만 준비되므로 state create에서 설정한다.
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();
		loadStorage();
		if(typeof DigimonPartners !== "undefined") DigimonPartners.applyToPet(pet, DigimonPartners.selectedId(pet));
        //resetStorage();
		game.state.start("main");
	}
}
//-200+(32*4)
//var healthBarEmpty;

var stats = {
	preload: function(){	
	},
	create: function(){
		drawGameBody();
		pet.happiness = Math.min(Math.max(pet.happiness,0),100);
		pet.hunger = Math.min(Math.max(pet.hunger,0),100);
		var statsPanel = game.add.graphics(0,0);
		statsPanel.beginFill(0xd8e1dc,0.96);
		statsPanel.lineStyle(3,0x53635b,0.85);
		statsPanel.drawRoundedRect(88,150,624,500,22);
		statsPanel.endFill();
		text = game.add.bitmapText(118, 180,"pixel","ERROR",22);

		
		
	},
	update: function(){
		tickCheck();
		var profile = P1DeviceEngine.profile(pet);
		var partner = typeof DigimonPartners !== "undefined" ? DigimonPartners.get(DigimonPartners.selectedId(pet)) : null;
		text.text = "NAME  " + pet.name +
			"\nPARTNER  " + (partner ? partner.name : "-") +
			"\nSTAGE  " + pet.lifeStage.toUpperCase() +
			"\nAGE  " + pet.age + " DAY" +
			"\nWEIGHT  " + pet.weight + " oz" +
			"\nHUNGRY  " + P1DeviceEngine.hearts(pet.hunger) +
			"\nHAPPY  " + P1DeviceEngine.hearts(pet.happiness) +
			"\nDISCIPLINE  " + pet.discipline + "%" +
			"\nCARE MISTAKES  " + pet.careMistakes +
			"\nSPEED  " + (globalVal.speedMultiplier || 1) + "x";
	}
}


var fastForward = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		P1DeviceEngine.forceTick(pet,globalVal);
		game.state.start("main");
	},
	update: function(){
	}
}

var toilet = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		pet.poop = 0;
		P1DeviceEngine.careAction(pet,"toilet");
		game.state.start("main");
	},
	update: function(){
	}
}

var medicine = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		var treatment = P1DeviceEngine.medicine(pet);
		var message = pet.sick
			? "MEDICINE "+treatment.shots+"/"+treatment.needed
			: (treatment.cured ? "ALL BETTER!" : "NOT SICK");
		if(treatment.cured) message = "ALL BETTER!";
		addTempText(message,1.2);
		game.time.events.add(Phaser.Timer.SECOND*1.2,function(){ game.state.start("main"); },this);
	},
	update: function(){	
	}
}

var discipline = {
	preload: function(){},
	create: function(){
		drawGameBody();
		var disciplined = P1DeviceEngine.discipline(pet);
		addTempText(disciplined ? "DISCIPLINE +25%" : "NO EFFECT",1.2);
		game.time.events.add(Phaser.Timer.SECOND*1.2,function(){ game.state.start("main"); },this);
	},
	update: function(){ tickCheck(); }
}

var lights = {
	preload: function(){},
	create: function(){
		drawGameBody();
		pet.lightsOn = !pet.lightsOn;
		P1DeviceEngine.resolveAttentionIfSatisfied(pet);
		addTempText(pet.lightsOn ? "LIGHT ON" : "LIGHT OFF",1.2);
		game.time.events.add(Phaser.Timer.SECOND*1.2,function(){ game.state.start("main"); },this);
	},
	update: function(){ tickCheck(); }
}

var clock = {
	preload: function(){},
	create: function(){
		drawGameBody();
		clockScreenText = game.add.bitmapText(game.world.centerX,game.world.centerY-55,"pixel","",52);
		clockScreenText.anchor.set(0.5);
		clockScreenDate = game.add.bitmapText(game.world.centerX,game.world.centerY+35,"pixel","",24);
		clockScreenDate.anchor.set(0.5);
	},
	update: function(){
		tickCheck();
		var now = new Date();
		clockScreenText.text = padClock(now.getHours()) + ":" + padClock(now.getMinutes());
		clockScreenDate.text = (now.getMonth()+1) + "/" + now.getDate() + "  " + (pet.sleeping ? "SLEEP" : "AWAKE");
	}
}

//---------------------------SUBSTATE FUNCTIONS---------------------------------------

//time per tick, in minutes
var TIME_PER_TICK = 5;
var speedCarryMs = 0;
var lastSpeedCheckAt = Date.now();

//This function checks if the "real world clock" has advanced enough to increment the game a tick.
//The tick will alter the properties of the pet. 
function tickCheck(){
	var now = Date.now();
	var processed = P1DeviceEngine.update(pet,globalVal,now);
	tickCounter += processed;
	var speed = Math.max(1, Math.min(4, Number(globalVal.speedMultiplier) || 1));
	var elapsed = Math.max(0, Math.min(5000, now - lastSpeedCheckAt));
	lastSpeedCheckAt = now;
	speedCarryMs += elapsed * (speed - 1);
	while(speedCarryMs >= 60000){
		P1DeviceEngine.advanceMinutes(pet,globalVal,1);
		tickCounter++;
		speedCarryMs -= 60000;
	}
}

function tick(){
	P1DeviceEngine.forceTick(pet,globalVal);
	tickCounter++;
}

function padClock(value){
	return value < 10 ? "0"+value : ""+value;
}

function updateRetroLifeCycle(){
	P1DeviceEngine.update(pet,globalVal,(new Date()).getTime());
}

//turn ailment sprites "on" or "off" depending on the pets properties
function ailmentCheck(){
	for (var i=0; i<3; i++){
		//console.log(poopArray[i]);
		if (i<pet.poop){
			poopArray[i].alpha=1;
		}
		else{
			poopArray[i].alpha=0;
		}
	}
	if (pet.sick){
		sickSprite.alpha = 1;
	}
	else{
		sickSprite.alpha = 0;
	}
}

game.state.add("preload",preload);
game.state.add("main",main);
game.state.add("stats",stats);
game.state.add("fastForward",fastForward);
game.state.add("food",feedingScreen);
game.state.add("toilet",toilet);
game.state.add("medicine",medicine);
game.state.add("discipline",discipline);
game.state.add("lights",lights);
game.state.add("clock",clock);
game.state.add("play",leftRightGameScreen);
game.state.add("shop",shop);
game.state.add("shopItem",shopItem);
game.state.add("shopFood",shopFood);
game.state.add("save",storageScreen);
game.state.add("settings",settings);
game.state.start("preload");
