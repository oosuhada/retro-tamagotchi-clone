var pet = {
	name : "",
	nameCustomized : false,
	sex : "M",
	age : 0,
	health : 50,
	happiness : 100,
	hunger : 100,
	mood : "Neutral",
	size : 60,
	sick : false,
	poop : 0,
	weight : 5,
	discipline : 0,
	careMistakes : 0,
	disciplineMistakes : 0,
	stageCareMistakes : 0,
	stageDisciplineMistakes : 0,
	stageSicknessCount : 0,
	medicineShotsGiven : 0,
	lightsOn : true,
	sleeping : false,
	bornAt : (new Date()).getTime(),
	lastSimulationAt : (new Date()).getTime(),
	lifeStage : "egg",
	character : "Egg",
	partnerId : null,
	partnerName : null,
	attention : {active:false,reason:null,startedAt:null},
	stageAwakeMinutes : 0,
	totalAwakeMinutes : 0,
	hungerElapsedMinutes : 0,
	happyElapsedMinutes : 0,
	sicknessElapsedMinutes : 0,
	heartDropsSinceDiscipline : 0,
	dead : false
	//poop refers to legitimate fecal matter the pet makes. It is not immaturity on my side.
};

globalVal ={
	money : 500,
    counterEnabled: false,
	speedMultiplier: 1,
	godMode: false,
	ezMoney: false,
	noToilet: false,
	camoNinjas: false,
};

var defaultPetJSON = JSON.stringify(pet);
var defaultGlobalValJSON = JSON.stringify(globalVal);
//var defaultInvFoodArrayJSON = JSON.stringify(invFoodArray);
//var defaultInvPlayArrayJSON = JSON.stringify(invPlayArray);
//var defaultPlayArrayJSON = JSON.stringify(playArray);


//Attempt to load JSON with key string, and assign that to assignToVar, if cannot load JSON load abort and return false.
function loadJSON(key){
    var loadedJSON = localStorage.getItem(key);
    var testJSON = JSON.parse(loadedJSON);
    console.log(JSON.parse(loadedJSON));
    if (testJSON == null){
        addTempText("Cannot Load File!");
        console.log("ERROR! Cannot load save!");
        return false;
    }
    else{
        console.log("hit");
        return testJSON;
    }
}

function loadStorage(){
	//loaded object is string (only strings can be stored), so we take the string
	//and "parse" it back into an object.
	var loadedHadNameCustomized = false;
    if(loadJSON("petSave")){
        var loadedPet = loadJSON("petSave");
        var loadedGlobal = loadJSON("globalValSave");
		loadedHadNameCustomized = !!loadedPet && Object.prototype.hasOwnProperty.call(loadedPet,"nameCustomized");
        pet = Object.assign(JSON.parse(defaultPetJSON), loadedPet || {});
        globalVal = Object.assign(JSON.parse(defaultGlobalValJSON), loadedGlobal || {});
		
		
    }
	if(typeof DigimonPartners !== "undefined"){
		DigimonPartners.applyToPet(pet, DigimonPartners.selectedId(pet));
		// Older saves automatically copied the partner species into `name`.
		// Treat that generated value as unnamed so NAME stays visible until the
		// player explicitly saves a name in the editor.
		if(!loadedHadNameCustomized){
			pet.nameCustomized = !!pet.name && pet.name !== "BBQ MAN" && pet.name !== pet.partnerName;
		}
		if(!pet.nameCustomized || pet.name === "BBQ MAN"){
			pet.name = "";
			pet.nameCustomized = false;
		}
	}
}

function saveStorage(){
	//convert our object into a sting and store it to the browser.
	localStorage.setItem("petSave", JSON.stringify(pet));
    localStorage.setItem("globalValSave",JSON.stringify(globalVal));
	/*
	localStorage.setItem("invFoodArraySave",JSON.stringify(invFoodArray));
	localStorage.setItem("playArraySave",JSON.stringify(playArray));
	localStorage.setItem("invPlayArraySave",JSON.stringify(invPlayArray));
	*/
}

function resetStorage(){
    pet = JSON.parse(defaultPetJSON);
    P1DeviceEngine.restart(pet);
    globalVal = JSON.parse(defaultGlobalValJSON);
	localStorage.removeItem("petSave");
	localStorage.removeItem("globalValSave");
}

function saveItem(name,spriteIndex,desc){
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.select = function(){
		switch(this.mainText){
			case "Save":
				saveStorage();
				break;
			case "Load":
				loadStorage();
				break;
			case "Reset":
				resetStorage();
				break;
		}
		game.state.start("main");
	}
}
//
saveArray = [
	new saveItem("Save",0,"Save your game"),
	new saveItem("Load",1,"Load your game"),
	new saveItem("Reset",2,"Reset your game,\nand lose all your progress")
];
//
var storageScreen = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		drawGameUI(saveArray,"saveSheet");
		costText.alpha = 0;
		button12.mode="use";
		
		if(!saveArray.length){
		button12.alpha = 0;
		button11.alpha = 0;
		button10.alpha = 0;
		sprite.alpha = 0;
		}
	},
	update: function(){
		displaySlide(saveArray);
		tickCheck();	
	}
}
