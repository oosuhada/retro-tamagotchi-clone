

/*
This file is a core building block in the program, as it is used to "scroll" through object arrays using
buttons, creating a UI for many states. The only thing that needs to be in put into these functions
are arrays and their corresponding spriteSheets. 
Objects put into these functions should have a format like this:
function foodItem(name,spriteIndex,cost,desc,hungRestore){
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.cost = cost;
	this.hungRestore = hungRestore;
	this.select = function() {
		//PUT METHOD HERE
	}
}
Object must have mainText,descText,spriteIndex properties and should have a select() method.
*/

//have a menu that allows you to select and scroll from two arrays.
//Inputs 4 strings, and will switch to a given state and display a given string
//Intended to be used in conjunction with drawGameUI)()
function drawGameMenu(state1,desc1,state2,desc2){
	button13 = game.add.button(width*(4/6) ,height*(2/6),"buttonSheet",gameMenuSelect,this,10,10,10);
	button13.anchor.set(0.5);
	button13.desc = desc1;
	button13.state = state1;
	
	button14 = game.add.button(width*(4/6) ,height*(4/6),"buttonSheet",gameMenuSelect,this,10,10,10);
	button14.anchor.set(0.5);
	button14.desc = desc2;
	button14.state = state2;
	
	var text1 = game.add.bitmapText(width*(2/6), height*(2/6),"pixel",desc1,32);
	text1.anchor.set(0.5);
	var text2 = game.add.bitmapText(width*(2/6), height*(4/6),"pixel",desc2,32);
	text2.anchor.set(0.5);
}

function gameMenuSelect(button){
	game.state.start(button.state);
}

slideCounter = 0;
//this function creates the buttons and UI to be displayed to the user.
function drawGameUI(array,spriteSheet){
	slideCounter= 0;
	button10 = game.add.button(width*(1/6) ,this.game.world.centerY,"buttonSheet",changeSlide,this,11,11,11);
	button10.name = "backward";
	button10.anchor.set(0.5); 
	
	button11 = game.add.button(width*(5/6), this.game.world.centerY,"buttonSheet",changeSlide,this,10,10,10);
	button11.name = "forward";
	button11.anchor.set(0.5);
	
	button12 = game.add.button(this.game.world.centerX,height*(7/9),"buttonSheet",changeSlide,[this,array],12,12,12);
	button12.name = "select";
	button12.anchor.set(0.5);
	//notice how you can assign variables to buttons, very useful for parsing in parameters.
	button12.variable = array;
	
	sprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,spriteSheet);
	sprite.frame = 0;
	sprite.anchor.setTo(0.5);
	mainText = game.add.bitmapText(game.world.centerX, height*(1/4),"pixel","Empty!",32);
	mainText.anchor.setTo(0.5);
	descText = game.add.bitmapText(game.world.centerX, height*(4/6),"pixel","You're out of food!",22);
	descText.anchor.setTo(0.5);
	descText.align = "center";
	descText.align = "center";
	costText = game.add.bitmapText(game.world.centerX, height*(4/6)+44,"pixel","ERROR",22);
	costText.anchor.setTo(0.5);
}

//changeSlide() is used to pass through various arrays
//an array must be defined in each state in order to be parsed by this function.
function changeSlide(button){
	//console.log(button.variable);
	switch(button.name){
		case "backward":
			slideCounter--;
			break;
		case "forward":
			slideCounter++;
			break;
		case "select":
			button.variable[slideCounter].select(button.mode);
			break;
	}
}

//To be used in the update loop; displays "slides" of an object in a list.
//changes properties of created game objects in drawGameUI according to the
//objects properties.
function displaySlide(array){
	//keep slide "pointer" within bounds.
	slideCounter = Math.min(Math.max(slideCounter, 0), array.length-1);
	sprite.frame = array[slideCounter].spriteIndex;
	//console.log(array[slideCounter].mainText);
	//console.log(slideCounter);
	//console.log(array[slideCounter].descText);
	//
	if ((slideCounter == 0) && (array.length == 1)){
		button10.alpha = 0;
		button11.alpha = 0;
	}
	else if (slideCounter == 0){
		button10.alpha = 0;
		button11.alpha = 1;
	}
	else if (slideCounter == (array.length-1)){
		button10.alpha = 1;
		button11.alpha = 0;
	}
	else{
		button10.alpha = 1;
		button11.alpha = 1;
	}
	mainText.text = array[slideCounter].mainText;
	descText.text = array[slideCounter].descText;
	costText.text = "Costs: $"+array[slideCounter].cost;
}
//-----------------------------------------------------------------------------------------------
function printText(contents){
	var text = game.add.bitmapText(75, game.world.centerY-200,"pixel",contents,32);
	//text.anchor.set(0.5);
		//
}

var tempText;
function addTempText(contents,duration){
	tempText = game.add.bitmapText(game.world.centerX, game.world.centerY*(3/4),"pixel",contents,32);
	tempText.anchor.set(0.5); 
	tempText.scale.set(0.5);
	tempText.alpha = 1;
	game.time.events.add(Phaser.Timer.SECOND*duration,removeTempText,this);
}
function removeTempText(){
	tempText.alpha = 0;
}


function drawGameBody(){
	// Modern LCD surface: keep the original button sprites/functionality, but
	// remove the legacy bright-green frame artwork that made content feel cramped.
	game.stage.backgroundColor = "#aebeb6";
	var lcd = game.add.graphics(0,0);
	lcd.beginFill(0xaebeb6,1);
	lcd.drawRect(0,0,width,height);
	lcd.endFill();
	lcd.beginFill(0xb9c8c0,0.55);
	lcd.drawRoundedRect(72,142,width-144,height-284,24);
	lcd.endFill();
	
	// Both rows share exactly the same left/right safe margin. The only
	// difference is the number of equally-spaced slots in each row.
	var controlMargin = 72;
	var topXs = evenlySpacedControlXs(5, controlMargin);
	var bottomXs = evenlySpacedControlXs(7, controlMargin);
	var nameControl = createLcdTextButton(topXs[0], buttonDispX, "NAME", "name", 102);

	button0 = game.add.button(topXs[1],buttonDispX,"buttonSheet",changeState,this,0,0,0);
	button0.name = "stats";
	button0.anchor.set(0.5);
	
	button1 = game.add.button(topXs[2],buttonDispX,"buttonSheet",changeState,this,2,2,2);
	button1.name = "food";
	button1.anchor.set(0.5);

	button4 = game.add.button(topXs[3],buttonDispX,"buttonSheet",changeState,this,4,4,4);
	button4.name = "speed";
	button4.anchor.set(0.5);
	var speedLabel = game.add.bitmapText(topXs[3],92,"pixel",getSpeedLabel(),18);
	speedLabel.anchor.set(0.5);

	var partnerControl = createLcdTextButton(topXs[4], buttonDispX, "PARTNER", "partner", 102);

	var bottomY = height-buttonDispX;

	button2 = game.add.button(bottomXs[0],bottomY,"buttonSheet",changeState,this,1,1,1);
	button2.name = "toilet";
	button2.anchor.set(0.5);

	button3 = game.add.button(bottomXs[1],bottomY,"buttonSheet",changeState,this,3,3,3);
	button3.name = "play";
	button3.anchor.set(0.5);

	button6 = game.add.button(bottomXs[2],bottomY,"buttonSheet",changeState,this,6,6,6);
	button6.name = "medicine";
	button6.anchor.set(0.5);

	button7 = game.add.button(bottomXs[3],bottomY,"buttonSheet",changeState,this,7,7,7);
	button7.name = "lights";
	button7.anchor.set(0.5);	
	
	button8 = game.add.button(bottomXs[4],bottomY,"buttonSheet",changeState,this,8,8,8);
	button8.name = "discipline";
	button8.anchor.set(0.5);	

	button5 = game.add.button(bottomXs[5],bottomY,"buttonSheet",changeState,this,5,5,5);
	button5.name = "save";
	button5.anchor.set(0.5);

	button9 = game.add.button(bottomXs[6],bottomY,"buttonSheet",changeState,this,9,9,9);
	button9.name = "clock";
	button9.anchor.set(0.5);	

	var iconButtons = [button0,button1,button4,button2,button3,button6,button7,button8,button5,button9];
	for(var i=0;i<iconButtons.length;i++){
		iconButtons[i].scale.setTo(0.78);
		iconButtons[i].alpha = 0.9;
	}
	retroButtons = [nameControl,button0,button1,button4,partnerControl,button2,button3,button6,button7,button8,button5,button9];
	retroSelection = Math.min(retroSelection || 0, retroButtons.length-1);
	updateRetroButtonSelection();
	installRetroThreeButtonControls();

}

function evenlySpacedControlXs(count, margin){
	var result = [];
	var usableWidth = width - (margin * 2);
	var gap = count > 1 ? usableWidth / (count - 1) : 0;
	for(var i=0;i<count;i++) result.push(margin + gap*i);
	return result;
}

function createLcdTextButton(x,y,label,name,buttonWidth){
	buttonWidth = buttonWidth || 102;
	var control = game.add.graphics(x,y);
	control.beginFill(0xd8e2dd,0.96);
	control.lineStyle(2,0x68766f,0.9);
	control.drawRoundedRect(-buttonWidth/2,-23,buttonWidth,46,12);
	control.endFill();
	control.name = name;
	control.inputEnabled = true;
	control.events.onInputDown.add(function(){ changeState(control); });
	var text = game.add.bitmapText(x,y,"pixel",label,16);
	text.anchor.set(0.5);
	var maxTextWidth = buttonWidth - 16;
	if(text.width > maxTextWidth){
		var fitScale = maxTextWidth / text.width;
		text.scale.setTo(fitScale);
	}
	text.inputEnabled = true;
	text.events.onInputDown.add(function(){ changeState(control); });
	control.labelText = text;
	return control;
}

function changeState(button){
		console.log(button.name);
		if(button.name === "name"){
			if(typeof window.showDigimonNameEditor === "function") window.showDigimonNameEditor();
			return;
		}
		if(button.name === "partner"){
			if(typeof window.showDigimonPartnerSelector === "function") window.showDigimonPartnerSelector();
			return;
		}
		if(button.name === "speed"){
			cycleGameSpeed();
			game.state.start("main");
			return;
		}
		game.state.start(button.name);
}

function getGameSpeed(){
	var speed = globalVal ? Number(globalVal.speedMultiplier) : 1;
	return speed === 2 || speed === 4 ? speed : 1;
}

function getSpeedLabel(){
	return getGameSpeed() + "x";
}

function cycleGameSpeed(){
	var speed = getGameSpeed();
	globalVal.speedMultiplier = speed === 1 ? 2 : (speed === 2 ? 4 : 1);
	if(typeof saveStorage === "function") saveStorage();
}

var retroButtons = [];
var retroSelection = 0;
var retroControlsInstalled = false;
var retroRestartChordInstalled = false;
var retroControlsSuspended = false;

function updateRetroButtonSelection(){
	for(var i=0;i<retroButtons.length;i++){
		retroButtons[i].tint = (i === retroSelection) ? 0xffff66 : 0xffffff;
		if(retroButtons[i].labelText){
			retroButtons[i].labelText.tint = (i === retroSelection) ? 0x4b4b10 : 0xffffff;
		}
	}
}

function installRetroThreeButtonControls(){
	if(retroControlsInstalled) return;
	retroControlsInstalled = true;

	game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(function(){
		if(retroControlsSuspended) return;
		if(!retroButtons.length) return;
		retroSelection = (retroSelection + 1) % retroButtons.length;
		updateRetroButtonSelection();
	});

	game.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function(){
		if(retroControlsSuspended) return;
		if(!retroButtons.length) return;
		changeState(retroButtons[retroSelection]);
	});

	game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){
		if(retroControlsSuspended) return;
		game.state.start("main");
	});

	if(!retroRestartChordInstalled){
		retroRestartChordInstalled = true;
		var keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
		var keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
		function restartIfDead(){
			if(!pet.dead || !keyA.isDown || !keyC.isDown) return;
			P1DeviceEngine.restart(pet);
			saveStorage();
			retroSelection = 0;
			game.state.start("main");
		}
		keyA.onDown.add(restartIfDead);
		keyC.onDown.add(restartIfDead);
	}
}


