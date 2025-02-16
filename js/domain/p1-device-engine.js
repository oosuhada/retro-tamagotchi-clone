var P1DeviceEngine = (function(){
	var MINUTE = 60 * 1000;
	var ATTENTION_DEADLINE = 15 * MINUTE;
	var MAX_OFFLINE_MINUTES = 30 * 24 * 60;

	function profile(pet){
		return P1CharacterProfiles.get(pet.character);
	}

	function ensureState(pet){
		var now = Date.now();
		if(!pet.bornAt) pet.bornAt = now;
		if(!pet.lastSimulationAt) pet.lastSimulationAt = now;
		if(!pet.character) pet.character = "Egg";
		if(!pet.lifeStage) pet.lifeStage = "egg";
		if(typeof pet.disciplineMistakes !== "number") pet.disciplineMistakes = 0;
		if(typeof pet.careMistakes !== "number") pet.careMistakes = 0;
		if(typeof pet.stageDisciplineMistakes !== "number") pet.stageDisciplineMistakes = 0;
		if(typeof pet.stageCareMistakes !== "number") pet.stageCareMistakes = 0;
		if(typeof pet.discipline !== "number") pet.discipline = 0;
		if(typeof pet.stageSicknessCount !== "number") pet.stageSicknessCount = 0;
		if(typeof pet.medicineShotsGiven !== "number") pet.medicineShotsGiven = 0;
		if(typeof pet.hungerElapsedMinutes !== "number") pet.hungerElapsedMinutes = 0;
		if(typeof pet.happyElapsedMinutes !== "number") pet.happyElapsedMinutes = 0;
		if(typeof pet.sicknessElapsedMinutes !== "number") pet.sicknessElapsedMinutes = 0;
		if(typeof pet.stageAwakeMinutes !== "number") pet.stageAwakeMinutes = 0;
		if(typeof pet.heartDropsSinceDiscipline !== "number") pet.heartDropsSinceDiscipline = 0;
		if(typeof pet.totalAwakeMinutes !== "number") pet.totalAwakeMinutes = 0;
		if(typeof pet.attention !== "object" || pet.attention === null){
			pet.attention = { active:false, reason:null, startedAt:null };
		}
		if(typeof pet.dead !== "boolean") pet.dead = false;
		clampWeight(pet);
		return pet;
	}

	function clampWeight(pet){
		var data = profile(pet);
		pet.weight = Math.max(data.minWeight, Math.min(data.maxWeight, pet.weight || data.minWeight));
	}

	function isAwakeAt(pet, timestamp){
		if(pet.dead || pet.character === "Egg") return false;
		if(pet.character === "Babytchi") return true;
		var data = profile(pet);
		var hour = new Date(timestamp).getHours();
		return hour >= data.wake && hour < data.sleep;
	}

	function setCharacter(pet, character, stage, now){
		if(pet.character === character){
			pet.lifeStage = stage;
			return;
		}
		pet.character = character;
		pet.lifeStage = stage;
		pet.lastEvolutionAt = now;
		pet.stageAwakeMinutes = 0;
		pet.hungerElapsedMinutes = 0;
		pet.happyElapsedMinutes = 0;
		pet.sicknessElapsedMinutes = 0;
		pet.stageSicknessCount = 0;
		pet.stageCareMistakes = 0;
		pet.stageDisciplineMistakes = 0;
		pet.medicineShotsGiven = 0;
		pet.heartDropsSinceDiscipline = 0;
		pet.sick = false;
		pet.sickSince = null;
		pet.discipline = profile(pet).initialDiscipline;
		if(stage === "teen" && pet.teenType === 1) pet.discipline = 50;
		if(stage === "teen") pet.teenDisciplineAtEvolution = pet.discipline;
		clampWeight(pet);
	}

	function chooseTeen(pet){
		pet.teenType = pet.stageDisciplineMistakes < 3 ? 1 : 2;
		return pet.stageCareMistakes < 3 ? "Tamatchi" : "Kuchitamatchi";
	}

	function chooseAdult(pet){
		var care = pet.stageCareMistakes;
		var disciplineMistakes = pet.stageDisciplineMistakes;
		var type = pet.teenType || 1;

		if(pet.character === "Tamatchi" && type === 1){
			if(care < 3 && disciplineMistakes === 0) return "Mametchi";
			if(care < 3 && disciplineMistakes === 1) return "Ginjirotchi";
			if(care < 3) return "Maskutchi";
			if(disciplineMistakes < 2) return "Kuchipatchi";
			if(disciplineMistakes < 4) return "Nyorotchi";
			return "Tarakotchi";
		}

		if(pet.character === "Tamatchi" && type === 2){
			if(care < 4 && disciplineMistakes < 2) return "Ginjirotchi";
			if(care < 4){ pet.billEligible = true; return "Maskutchi"; }
			if(disciplineMistakes < 8) return "Nyorotchi";
			return "Tarakotchi";
		}

		if(pet.character === "Kuchitamatchi" && type === 1){
			if(disciplineMistakes < 2) return "Kuchipatchi";
			if(disciplineMistakes === 2) return "Nyorotchi";
			return "Tarakotchi";
		}

		return disciplineMistakes < 6 ? "Nyorotchi" : "Tarakotchi";
	}

	function evolveIfReady(pet, now){
		if(pet.dead) return;
		if(pet.character === "Maskutchi" && pet.billEligible && pet.age >= 10){
			setCharacter(pet, "Bill", "adult", now);
			return;
		}
		var data = profile(pet);
		if(pet.stageAwakeMinutes < data.evolutionMinutes) return;

		if(pet.character === "Egg") setCharacter(pet, "Babytchi", "baby", now);
		else if(pet.character === "Babytchi") setCharacter(pet, "Marutchi", "child", now);
		else if(pet.character === "Marutchi") setCharacter(pet, chooseTeen(pet), "teen", now);
		else if(pet.character === "Tamatchi" || pet.character === "Kuchitamatchi") {
			setCharacter(pet, chooseAdult(pet), "adult", now);
		}
		else if(pet.lifeStage === "adult") {
			die(pet, "OLD AGE", now);
		}
	}

	function setAttention(pet, reason, now){
		if(pet.attention.active) return;
		pet.attention = { active:true, reason:reason, startedAt:now };
	}

	function clearAttention(pet){
		pet.attention = { active:false, reason:null, startedAt:null };
	}

	function resolveAttentionIfSatisfied(pet){
		if(!pet.attention.active) return;
		if(pet.attention.reason === "hunger" && pet.hunger > 0) clearAttention(pet);
		if(pet.attention.reason === "happy" && pet.happiness > 0) clearAttention(pet);
		if(pet.attention.reason === "lights" && !pet.lightsOn) clearAttention(pet);
	}

	function updateAttention(pet, now){
		if(pet.dead || pet.lifeStage === "egg") return;
		resolveAttentionIfSatisfied(pet);
		if(pet.attention.active){
			if(now - pet.attention.startedAt >= ATTENTION_DEADLINE){
				if(pet.attention.reason === "discipline") {
					pet.disciplineMistakes++;
					pet.stageDisciplineMistakes++;
				} else {
					pet.careMistakes++;
					pet.stageCareMistakes++;
				}
				clearAttention(pet);
			}
			return;
		}

		if(pet.sleeping && pet.lightsOn) setAttention(pet, "lights", now);
		else if(pet.hunger <= 0) setAttention(pet, "hunger", now);
		else if(pet.happiness <= 0) setAttention(pet, "happy", now);
	}

	function triggerDisciplineCountdown(pet, now){
		var countdown = profile(pet).disciplineCountdown;
		if(!countdown || pet.discipline >= 100 || pet.attention.active) return;
		if(pet.heartDropsSinceDiscipline < countdown) return;
		pet.heartDropsSinceDiscipline = 0;
		setAttention(pet, "discipline", now);
	}

	function recordSickness(pet, now){
		if(pet.sick || pet.dead) return;
		pet.sick = true;
		pet.sickSince = now;
		pet.medicineShotsGiven = 0;
		pet.stageSicknessCount++;
		if(pet.stageSicknessCount >= 3) die(pet, "THIRD SICKNESS", now);
	}

	function die(pet, reason, now){
		pet.dead = true;
		pet.deathReason = reason;
		pet.diedAt = now;
		pet.mood = "dead";
		pet.sleeping = false;
		clearAttention(pet);
	}

	function processAwakeMinute(pet, globalVal, now){
		var data = profile(pet);
		pet.stageAwakeMinutes++;
		pet.totalAwakeMinutes++;
		pet.hungerElapsedMinutes++;
		pet.happyElapsedMinutes++;
		pet.sicknessElapsedMinutes++;

		while(pet.hungerElapsedMinutes >= data.hungerMinutes){
			pet.hungerElapsedMinutes -= data.hungerMinutes;
			pet.hunger = Math.max(0, pet.hunger - 25);
			pet.heartDropsSinceDiscipline++;
		}
		while(pet.happyElapsedMinutes >= data.happyMinutes){
			pet.happyElapsedMinutes -= data.happyMinutes;
			pet.happiness = Math.max(0, pet.happiness - 25);
			pet.heartDropsSinceDiscipline++;
		}

		if(!pet.sick && pet.sicknessElapsedMinutes >= data.sicknessMinutes){
			pet.sicknessElapsedMinutes = 0;
			recordSickness(pet, now);
		}

		triggerDisciplineCountdown(pet, now);
		if(globalVal.ezMoney && pet.totalAwakeMinutes % 5 === 0) globalVal.money += 10;
	}

	function updateSleep(pet, now){
		pet.sleeping = !pet.dead && pet.lifeStage !== "egg" && !isAwakeAt(pet, now);
	}

	function updateAge(pet, now){
		pet.age = Math.max(0, Math.floor((now - pet.bornAt) / (24 * 60 * MINUTE)));
	}

	function update(pet, globalVal, now){
		ensureState(pet);
		var elapsedMinutes = Math.floor((now - pet.lastSimulationAt) / MINUTE);
		elapsedMinutes = Math.max(0, Math.min(MAX_OFFLINE_MINUTES, elapsedMinutes));

		for(var i=0; i<elapsedMinutes && !pet.dead; i++){
			pet.lastSimulationAt += MINUTE;
			updateAge(pet, pet.lastSimulationAt);
			updateSleep(pet, pet.lastSimulationAt);
			if(pet.character === "Egg") pet.stageAwakeMinutes++;
			else if(isAwakeAt(pet, pet.lastSimulationAt)) processAwakeMinute(pet, globalVal, pet.lastSimulationAt);
			updateAttention(pet, pet.lastSimulationAt);
			evolveIfReady(pet, pet.lastSimulationAt);
		}

		updateAge(pet, now);
		updateSleep(pet, now);
		updateAttention(pet, now);
		clampWeight(pet);
		return elapsedMinutes;
	}

	function forceTick(pet, globalVal){
		ensureState(pet);
		var now = Date.now();
		for(var i=0;i<5 && !pet.dead;i++){
			now += MINUTE;
			if(pet.character === "Egg") pet.stageAwakeMinutes++;
			else if(isAwakeAt(pet, now)) processAwakeMinute(pet, globalVal, now);
		}
		pet.lastSimulationAt = now;
		updateSleep(pet, now);
		updateAttention(pet, now);
		evolveIfReady(pet, now);
	}

	function discipline(pet){
		if(pet.dead || !pet.attention.active || pet.attention.reason !== "discipline") return false;
		pet.discipline = Math.min(100, pet.discipline + 25);
		clearAttention(pet);
		return true;
	}

	function medicine(pet){
		if(!pet.sick || pet.dead) return { cured:false, shots:0, needed:profile(pet).medicineShots };
		pet.medicineShotsGiven++;
		var needed = profile(pet).medicineShots;
		if(pet.medicineShotsGiven >= needed){
			pet.sick = false;
			pet.sickSince = null;
			pet.medicineShotsGiven = 0;
			return { cured:true, shots:needed, needed:needed };
		}
		return { cured:false, shots:pet.medicineShotsGiven, needed:needed };
	}

	function feedMeal(pet){
		if(pet.dead || pet.lifeStage === "egg" || pet.hunger >= 100) return false;
		pet.hunger = Math.min(100, pet.hunger + 25);
		pet.weight += 1;
		clampWeight(pet);
		resolveAttentionIfSatisfied(pet);
		return true;
	}

	function feedSnack(pet){
		if(pet.dead || pet.lifeStage === "egg") return false;
		pet.happiness = Math.min(100, pet.happiness + 25);
		pet.weight += 2;
		clampWeight(pet);
		resolveAttentionIfSatisfied(pet);
		return true;
	}

	function gameRound(pet){
		return Math.random() < profile(pet).gameWinProbability;
	}

	function finishGame(pet, wins){
		if(pet.dead || pet.lifeStage === "egg") return false;
		pet.weight = Math.max(profile(pet).minWeight, pet.weight - 1);
		if(wins >= 3) pet.happiness = Math.min(100, pet.happiness + 25);
		resolveAttentionIfSatisfied(pet);
		return wins >= 3;
	}

	function gameDelay(pet, wonRound){
		return wonRound ? profile(pet).gameWinDelay : profile(pet).gameLossDelay;
	}

	function careAction(pet, action){
		if(action === "medicine") return medicine(pet);
		if(action === "toilet") pet.poop = 0;
		resolveAttentionIfSatisfied(pet);
		return true;
	}

	function restart(pet){
		var now = Date.now();
		var partnerId = typeof DigimonPartners !== "undefined" ? DigimonPartners.selectedId(pet) : pet.partnerId;
		var partnerName = typeof DigimonPartners !== "undefined" ? DigimonPartners.get(partnerId).name : pet.partnerName;
		var fresh = {
			name: pet.name || "BBQ MAN",
			sex: pet.sex || "M",
			age: 0,
			health: 50,
			happiness: 100,
			hunger: 100,
			mood: "neutral",
			size: 60,
			sick: false,
			poop: 0,
			weight: 5,
			discipline: 0,
			careMistakes: 0,
			disciplineMistakes: 0,
			stageSicknessCount: 0,
			stageCareMistakes: 0,
			stageDisciplineMistakes: 0,
			medicineShotsGiven: 0,
			lightsOn: true,
			sleeping: false,
			bornAt: now,
			lastSimulationAt: now,
			lifeStage: "egg",
			character: "Egg",
			partnerId: partnerId || null,
			partnerName: partnerName || null,
			attention: { active:false, reason:null, startedAt:null },
			stageAwakeMinutes: 0,
			totalAwakeMinutes: 0,
			hungerElapsedMinutes: 0,
			happyElapsedMinutes: 0,
			sicknessElapsedMinutes: 0,
			heartDropsSinceDiscipline: 0,
			dead: false
		};
		Object.keys(pet).forEach(function(key){ delete pet[key]; });
		Object.assign(pet, fresh);
	}

	function hearts(value){
		var filled = Math.max(0, Math.min(4, Math.ceil(value / 25)));
		return "♥".repeat(filled) + "·".repeat(4-filled);
	}

	return {
		update:update,
		forceTick:forceTick,
		discipline:discipline,
		medicine:medicine,
		feedMeal:feedMeal,
		feedSnack:feedSnack,
		gameRound:gameRound,
		finishGame:finishGame,
		gameDelay:gameDelay,
		careAction:careAction,
		restart:restart,
		hearts:hearts,
		profile:profile,
		recordSickness:recordSickness,
		resolveAttentionIfSatisfied:resolveAttentionIfSatisfied,
		ATTENTION_DEADLINE:ATTENTION_DEADLINE,
		profiles:P1CharacterProfiles.all
	};
})();
