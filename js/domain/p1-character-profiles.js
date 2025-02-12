var P1CharacterProfiles = (function(){
	var profiles = {
		Egg: {wake:0,sleep:24,hungerMinutes:Infinity,happyMinutes:Infinity,sicknessMinutes:Infinity,medicineShots:0,minWeight:5,maxWeight:5,evolutionMinutes:5,disciplineCountdown:null,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:0},
		Babytchi: {wake:0,sleep:24,hungerMinutes:3,happyMinutes:4,sicknessMinutes:45,medicineShots:2,minWeight:5,maxWeight:5,evolutionMinutes:60,disciplineCountdown:null,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:4},
		Marutchi: {wake:9,sleep:20,hungerMinutes:50,happyMinutes:60,sicknessMinutes:990,medicineShots:2,minWeight:10,maxWeight:99,evolutionMinutes:1380,disciplineCountdown:6,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:4},
		Tamatchi: {wake:9,sleep:21,hungerMinutes:75,happyMinutes:85,sicknessMinutes:1656,medicineShots:2,minWeight:20,maxWeight:99,evolutionMinutes:2220,disciplineCountdown:6,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:2},
		Kuchitamatchi: {wake:9,sleep:21,hungerMinutes:75,happyMinutes:85,sicknessMinutes:660,medicineShots:2,minWeight:20,maxWeight:99,evolutionMinutes:1380,disciplineCountdown:6,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:4},
		Mametchi: {wake:9,sleep:22,hungerMinutes:81,happyMinutes:91,sicknessMinutes:3900,medicineShots:1,minWeight:30,maxWeight:99,evolutionMinutes:4095,disciplineCountdown:null,initialDiscipline:100,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:2},
		Bill: {wake:9,sleep:22,hungerMinutes:81,happyMinutes:91,sicknessMinutes:3900,medicineShots:1,minWeight:30,maxWeight:99,evolutionMinutes:4095,disciplineCountdown:null,initialDiscipline:100,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:2},
		Ginjirotchi: {wake:9,sleep:22,hungerMinutes:81,happyMinutes:91,sicknessMinutes:2808,medicineShots:1,minWeight:30,maxWeight:99,evolutionMinutes:3120,disciplineCountdown:7,initialDiscipline:50,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:2},
		Maskutchi: {wake:11,sleep:23,hungerMinutes:55,happyMinutes:65,sicknessMinutes:2592,medicineShots:1,minWeight:30,maxWeight:99,evolutionMinutes:2880,disciplineCountdown:7,initialDiscipline:0,gameWinProbability:0.3125,gameWinDelay:3,gameLossDelay:2,bites:2},
		Kuchipatchi: {wake:9,sleep:22,hungerMinutes:60,happyMinutes:70,sicknessMinutes:1170,medicineShots:2,minWeight:20,maxWeight:99,evolutionMinutes:1560,disciplineCountdown:null,initialDiscipline:100,gameWinProbability:0.6875,gameWinDelay:3,gameLossDelay:4,bites:2},
		Nyorotchi: {wake:9,sleep:22,hungerMinutes:60,happyMinutes:70,sicknessMinutes:360,medicineShots:3,minWeight:10,maxWeight:99,evolutionMinutes:780,disciplineCountdown:7,initialDiscipline:50,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:4},
		Tarakotchi: {wake:10,sleep:22,hungerMinutes:45,happyMinutes:50,sicknessMinutes:660,medicineShots:2,minWeight:20,maxWeight:99,evolutionMinutes:1440,disciplineCountdown:7,initialDiscipline:0,gameWinProbability:0.5,gameWinDelay:1,gameLossDelay:1,bites:2}
	};

	function get(character){
		return profiles[character] || profiles.Marutchi;
	}

	return { get:get, all:profiles };
})();
