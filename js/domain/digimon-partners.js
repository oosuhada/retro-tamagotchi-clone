var DigimonPartners = (function(){
	var partners = {
		agumon: {
			id:"agumon", name:"Agumon", accent:"#e98a2f", dark:"#743411",
			pixels:[
				".....XX.........",
				"....XXXX........",
				"...XXXXXX.......",
				"...XXOOXX.......",
				"...XXXXXXX......",
				"..XXXXXXXXX.....",
				".XXXXXXXXXX.....",
				".XXXXXXXXXXX....",
				"..XXXXXXXXXX....",
				"...XXXXXXXX.....",
				"...XXX.XXXX.....",
				"..XXX...XXX.....",
				".XXX....XXX.....",
				"XXX.....XXXX....",
				"XX......XX......",
				"................"
			]
		},
		gabumon: {
			id:"gabumon", name:"Gabumon", accent:"#d8c08c", dark:"#44578e",
			pixels:[
				"..X........X....",
				".XXX......XXX...",
				".XXXX....XXXX...",
				"..XXXXXXXXXX....",
				"..XXOOXXOOXX....",
				"..XXXXXXXXXX....",
				".XXXXXXXXXXXX...",
				".XXDXXXXXXDXX...",
				".XXXXXXXXXXXX...",
				"..XXXXXXXXXX....",
				"...XXXXXXXX.....",
				"...XXX..XXX.....",
				"..XXX....XXX....",
				".XXX......XXX...",
				".XX........XX...",
				"................"
			]
		},
		patamon: {
			id:"patamon", name:"Patamon", accent:"#d99b57", dark:"#7c4a27",
			pixels:[
				"................",
				"XX..........XX..",
				"XXXX......XXXX..",
				".XXXXX..XXXXX...",
				"..XXXXXXXXXX....",
				"..XXOOXXOOXX....",
				"..XXXXXXXXXX....",
				"...XXXXXXXX.....",
				"....XXXXXX......",
				"....XXXXXX......",
				"...XXXXXXXX.....",
				"..XXX....XXX....",
				".XXX......XXX...",
				".XX........XX...",
				"................",
				"................"
			]
		},
		tentomon: {
			id:"tentomon", name:"Tentomon", accent:"#b83b35", dark:"#28304e",
			pixels:[
				"X..............X",
				".X............X.",
				"..X....XX....X..",
				"...XXXXXXXXXX...",
				"..XXXOOXXOOXXX..",
				"..XXXXXXXXXXXX..",
				".DDDXXXXXXXXDDD.",
				"DDDDXXXXXXXXDDDD",
				".DDDXXXXXXXXDDD.",
				"..XXXXXXXXXXXX..",
				"...XXXXXXXXXX...",
				"....XXX..XXX....",
				"...XXX....XXX...",
				"..XXX......XXX..",
				"................",
				"................"
			]
		}
	};

	function get(id){ return partners[id] || partners.agumon; }

	function selectedId(pet){
		if(pet && partners[pet.partnerId]) return pet.partnerId;
		try {
			var stored = localStorage.getItem("retro-digimon-partner");
			if(partners[stored]) return stored;
		} catch (_) {}
		return "agumon";
	}

	function applyToPet(pet,id){
		var partner = get(id);
		pet.partnerId = partner.id;
		pet.partnerName = partner.name;
		try { localStorage.setItem("retro-digimon-partner", partner.id); } catch (_) {}
		return partner;
	}

	function createBitmap(game,id){
		var partner = get(id);
		var bitmap = game.add.bitmapData(128,128);
		var ctx = bitmap.ctx;
		var pixel = 8;
		ctx.clearRect(0,0,128,128);
		partner.pixels.forEach(function(row,y){
			for(var x=0;x<row.length;x++){
				var code = row.charAt(x);
				if(code === ".") continue;
				ctx.fillStyle = code === "O" ? "#f4e8b6" : code === "D" ? partner.dark : partner.accent;
				ctx.fillRect(x*pixel,y*pixel,pixel,pixel);
			}
		});
		bitmap.dirty = true;
		return bitmap;
	}

	return { all:partners, get:get, selectedId:selectedId, applyToPet:applyToPet, createBitmap:createBitmap };
})();
