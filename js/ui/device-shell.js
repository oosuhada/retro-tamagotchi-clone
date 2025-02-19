

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
	// Modern LCD surface with a single spacing system for both control rows.
	game.stage.backgroundColor = "#aebeb6";
	var lcd = game.add.graphics(0,0);
	lcd.beginFill(0xaebeb6,1);
	lcd.drawRect(0,0,width,height);
	lcd.endFill();
	lcd.beginFill(0xb9c8c0,0.55);
	lcd.drawRoundedRect(72,142,width-144,height-284,24);
	lcd.endFill();
	
	// Both rows use the same generous edge inset and 20px gap. The seven-button
	// bottom row defines the compact button width; the remaining top-row space
	// is deliberately given to NAME and PARTNER so those labels never squeeze.
	var controlMargin = 112;
	var controlGap = 20;
	var compactWidth = (width - controlMargin*2 - controlGap*6) / 7;
	var wideWidth = (width - controlMargin*2 - controlGap*4 - compactWidth*3) / 2;
	var topWidths = [wideWidth,compactWidth,compactWidth,compactWidth,wideWidth];
	var bottomWidths = [compactWidth,compactWidth,compactWidth,compactWidth,compactWidth,compactWidth,compactWidth];
	var topXs = controlRowCenters(topWidths, controlMargin, controlGap);
	var bottomXs = controlRowCenters(bottomWidths, controlMargin, controlGap);
	var topY = 52;
	var bottomY = height-topY;

	var nameControl = createLcdTextButton(topXs[0], topY, "NAME", "name", topWidths[0]);
	button0 = createLcdTextButton(topXs[1], topY, "INFO", "stats", topWidths[1]);
	button1 = createLcdTextButton(topXs[2], topY, "FOOD", "food", topWidths[2]);
	button4 = createLcdTextButton(topXs[3], topY, "SPEED", "speed", topWidths[3]);
	var speedLabel = game.add.bitmapText(topXs[3],90,"pixel",getSpeedLabel(),14);
	speedLabel.anchor.set(0.5);
	speedLabel.tint = 0x4d5d55;
	var partnerControl = createLcdTextButton(topXs[4], topY, "PARTNER", "partner", topWidths[4]);

	button2 = createLcdTextButton(bottomXs[0], bottomY, "CLEAN", "toilet", bottomWidths[0]);
	button3 = createLcdTextButton(bottomXs[1], bottomY, "GAME", "play", bottomWidths[1]);
	button6 = createLcdTextButton(bottomXs[2], bottomY, "MED", "medicine", bottomWidths[2]);
	button7 = createLcdTextButton(bottomXs[3], bottomY, "LIGHT", "lights", bottomWidths[3]);
	button8 = createLcdTextButton(bottomXs[4], bottomY, "DISC", "discipline", bottomWidths[4]);
	button5 = createLcdTextButton(bottomXs[5], bottomY, "SAVE", "save", bottomWidths[5]);
	button9 = createLcdTextButton(bottomXs[6], bottomY, "CLOCK", "clock", bottomWidths[6]);

	retroButtons = [nameControl,button0,button1,button4,partnerControl,button2,button3,button6,button7,button8,button5,button9];
	retroSelection = Math.min(retroSelection || 0, retroButtons.length-1);
	updateRetroButtonSelection();
	installRetroThreeButtonControls();

}

function controlRowCenters(widths, margin, gap){
	var result = [];
	var cursor = margin;
	for(var i=0;i<widths.length;i++){
		result.push(cursor + widths[i]/2);
		cursor += widths[i] + gap;
	}
	return result;
}

function createLcdTextButton(x,y,label,name,buttonWidth){
	buttonWidth = buttonWidth || 72;
	var buttonHeight = 48;
	var control = game.add.graphics(x,y);
	control.name = name;
	control.buttonWidth = buttonWidth;
	control.buttonHeight = buttonHeight;
	control.isLcdControl = true;
	control.redraw = function(selected){
		control.clear();
		// Keep every control on the same neutral LCD surface. Selection is shown
		// only by the border so NAME never turns yellow while PARTNER stays gray.
		control.beginFill(0xd8e2dd,0.94);
		control.lineStyle(selected ? 2 : 1, selected ? 0x43554c : 0x65766e, 0.95);
		control.drawRoundedRect(-buttonWidth/2,-buttonHeight/2,buttonWidth,buttonHeight,11);
		control.endFill();
		control.lineStyle(1,0xffffff,0.42);
		control.moveTo(-buttonWidth/2+10,-buttonHeight/2+7);
		control.lineTo(buttonWidth/2-10,-buttonHeight/2+7);
	};
	control.redraw(false);
	control.inputEnabled = true;
	control.events.onInputDown.add(function(){ changeState(control); });
	var text = game.add.bitmapText(x,y,"pixel",label,14);
	text.anchor.set(0.5);
	var maxTextWidth = buttonWidth - 18;
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
		var selected = i === retroSelection;
		if(retroButtons[i].isLcdControl && retroButtons[i].redraw) retroButtons[i].redraw(selected);
		else retroButtons[i].tint = selected ? 0xffff66 : 0xffffff;
		if(retroButtons[i].labelText){
			retroButtons[i].labelText.tint = 0x3d4b45;
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


