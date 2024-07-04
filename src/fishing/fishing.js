import { BiomeTables, FishingDropTables, HeightTables, InfectionTables } from "./drop_tables.js";

// #region Document elements
var FishingFactors =
{
	get lake_size() { return Number(document.getElementById("lake_size").value); },
	get liquid() { return document.getElementById("liquid").value; },
	get rod_power() { return Number(document.getElementById("rod_power").value); },
	get bait_power() { return Number(document.getElementById("bait_power").value); },
	get chum_bucket() { return Number(document.getElementById("chum_bucket").value); },
	get fishing_potion() { return document.getElementById("fishing_potion").checked; },
	get tipsy() { return document.getElementById("tipsy").checked; },
	get gummy_worm() { return document.getElementById("gummy_worm").checked; },
	get toilet() { return document.getElementById("toilet").checked; },
	get angler_hat() { return document.getElementById("angler_hat").checked; },
	get angler_vest() { return document.getElementById("angler_vest").checked; },
	get angler_pants() { return document.getElementById("angler_pants").checked; },
	get angler_earring() { return document.getElementById("angler_earring").checked; },
	get angler_tackle_bag() { return document.getElementById("angler_tackle_bag").checked; },
	get fishing_bobber() { return document.getElementById("fishing_bobber").checked; },
	get inner_tube() { return document.getElementById("inner_tube").checked; },
	get cloudy() { return document.getElementById("cloudy").checked; },
	get rainy() { return document.getElementById("rainy").checked; },
	get lavaproof_tackle_bag() { return document.getElementById("lavaproof_tackle_bag").checked; },
	get moon_phase() { return document.getElementById("moon_phase").value; },
	get daytime() { return document.getElementById("daytime").value; },
	get lava_bait() { return document.getElementById("lava_bait").checked; },
	get lava_rod() { return document.getElementById("lava_rod").checked; },
	get lava_hook() { return document.getElementById("lava_hook").checked; },
	get biome() { return document.getElementById("biome").value; },
	get infection() { return document.getElementById("infection").value; },
	get height() { return document.getElementById("height").value; }
}

var fishing_power = document.getElementById("fishing_power");
var catch_rate = document.getElementById("catch_rate");

var common = document.getElementById("rate_common");
var uncommon = document.getElementById("rate_uncommon");
var rare = document.getElementById("rate_rare");
var epic = document.getElementById("rate_epic");
var legendary = document.getElementById("rate_legendary");
// #endregion Document elements

var fishing_power_cache = 0;

// #region Functions
/**
 * Truncates a number down to n decimal places.
 * @param {number} number The number.
 * @param {number} n The number of decimal places.
 * @returns {number} The truncated number.
 */
function truncateToNthDecimal(number, n)
{
	const factor = Math.pow(10, n);

	return Math.trunc(number * factor) / factor;
}

function calcBiteChance()
{
	return (75 + Math.min(125, fishing_power_cache)) / 200;
}

function canFish()
{
	return FishingFactors.lake_size >= 50 || (FishingFactors.liquid === "honey" && FishingFactors.lake_size >= 50);
}

/**
 * Calculates the catch rate down to 2 decimal points.
 * @returns {number} Catch rate in seconds per bite.
 * @see {@link https://terraria.wiki.gg/wiki/Fishing#Catch_frequency}
 */
function calcAverageCatchRate()
{
	var catch_rate;

	if (FishingFactors.liquid === "lava" && hasFastLavaFishing())
	{
		// The Wiki did not have this formula, so I made it myself.
		// It depends on the length of the timer, which is not consistent in Lava
		// (as it is shorter if there was no bite), so we instead take the average timer length.
		// This results in < 125 Fishing Power having a faster Bite Rate than out of Lava,
		// but the lack of Common and Uncommon catches means it is slower in practice.
		const bite_chance = calcBiteChance();
		const average_timer_length = 660 * bite_chance + 420 * (1 - bite_chance);

		catch_rate = (average_timer_length / 60) / (23 * Math.min(125, fishing_power_cache) / 600 + 2.5);
	}
	else
	{
		catch_rate = 11/(23 * Math.min(125, fishing_power_cache) / 600 + 2.5);
	}

	return truncateToNthDecimal(catch_rate, 2);
}

/**
 * @returns {boolean} Whether fast Lava fishing is active.
 * @see {@link https://terraria.wiki.gg/wiki/Fishing#Lava_fishing}
 */
function hasFastLavaFishing()
{
	var enabled_factors = 0;

	enabled_factors += FishingFactors.lava_bait ? 1 : 0;
	enabled_factors += FishingFactors.lava_rod ? 1 : 0;
	enabled_factors += FishingFactors.lava_hook ? 1 : 0;

	return enabled_factors >= 2;
}

/**
 * @returns {0.8|1|1.3} The fishing power multiplier resulting from the current time of day.
 */
function getDaytimeMultiplier()
{
	switch (FishingFactors.daytime)
	{
		case "positive":
			return 1.3;
		case "negative":
			return 0.8;
		default:
			return 1;
	}
}

/**
 * @returns {0.9|0.95|1|1.05|1.1} The fishing power multiplier resulting from the current Moon Phase.
 * @see {@link https://terraria.wiki.gg/wiki/Fishing#Factors}
 */
function getMoonPhaseMultiplier()
{
	switch (FishingFactors.moon_phase)
	{
		case "full":
			return 1.1;
		case "gibbous":
			return 1.05;
		case "crescent":
			return 0.95;
		case "new":
			return 0.9;
		default:
			return 1;
	}
}

/**
 * @returns {number} The lake size multiplier. This is always a number between 0.25 and 1.
 */
function calcLakeSizeMultiplier()
{
	const threshold = FishingFactors.liquid === "honey" ? 200 : 300;
	// The "atmo" variable is time-consuming (on the user's end) to calculate
	// and is often 1 anyways, so it has been excluded from this calculation.
	var multiplier = FishingFactors.lake_size / threshold;

	return Math.max(0.25, Math.min(multiplier, 1));
}

/**
 * @returns {0|11|17|20} The added fishing power from using Chum Buckets.
 */
function getChumBucketFactor()
{
	switch (FishingFactors.chum_bucket)
	{
		case 0:
			return 0;
		case 1:
			return 11;
		case 2:
			return 17;
		default:
			return 20;
	}
}

/**
 * Calculates the amount of Fishing Power the player will have given most factors.
 * @returns {number}
 */
function calcFishingPower()
{
	if (!canFish())
	{
		return fishing_power_cache = 0;
	}

	let total = FishingFactors.rod_power;
	total += FishingFactors.bait_power;

	total += FishingFactors.fishing_potion ? 15 : 0;
	total += FishingFactors.tipsy ? 5 : 0;
	total += FishingFactors.toilet ? 5 : 0;
	total += FishingFactors.gummy_worm ? 3 : 0;
	total += FishingFactors.angler_hat ? 5 : 0;
	total += FishingFactors.angler_vest ? 5 : 0;
	total += FishingFactors.angler_pants ? 5 : 0;
	total += FishingFactors.angler_earring ? 10 : 0;
	total += FishingFactors.angler_tackle_bag ? 10 : 0;
	total += FishingFactors.lavaproof_tackle_bag ? 10 : 0;
	total += FishingFactors.fishing_bobber ? 10 : 0;
	total += FishingFactors.inner_tube ? 5 : 0;
	
	total *= getMoonPhaseMultiplier();
	total *= getDaytimeMultiplier();
	total *= FishingFactors.cloudy ? 1.1 : 1;
	total *= FishingFactors.rainy ? 1.2 : 1;
	total *= calcLakeSizeMultiplier();

	total += getChumBucketFactor();

	return fishing_power_cache = Math.round(total);
}

function updateFishingPowerText()
{
	fishing_power.innerHTML = "Fishing Power: " + calcFishingPower().toString();
}

function updateLavaFishingText()
{
	var fast_lava_text = document.getElementById("fast_lava_text");

	if (hasFastLavaFishing())
	{
		fast_lava_text.innerHTML = "Lava fishing: Fast";
		return;
	}
	
	fast_lava_text.innerHTML = "Lava fishing: Slow";
}

window.updateLavaAccessoryCheckbox = function updateLavaAccessoryCheckbox()
{
	var lava_hook_element = document.getElementById("lava_hook");

	if (FishingFactors.lavaproof_tackle_bag)
	{
		lava_hook_element.checked = true;
		lava_hook_element.disabled = true;
		return;
	}
	
	lava_hook_element.disabled = false;
}

function updateCatchRateText()
{
	const catch_rate_string = calcAverageCatchRate().toString();

	if (catch_rate_string === "1.5")
	{
		catch_rate.innerHTML = "Average: <b>" + catch_rate_string + "</b> seconds/bite";
	}
	else
	{
		catch_rate.innerHTML = "Average: " + catch_rate_string + " seconds/bite";
	}
}

function updateCatchQuality()
{
	const common_rate = (Math.trunc(Math.min(0.5, fishing_power_cache / 150) * 10000)) / 100;
	const uncommon_rate = (Math.trunc(Math.min(0.33, fishing_power_cache / 300) * 10000)) / 100;
	const rare_rate = (Math.trunc(Math.min(0.25, fishing_power_cache / 1050) * 10000)) / 100;
	const epic_rate = (Math.trunc(Math.min(0.2, fishing_power_cache / 2250) * 10000)) / 100;
	const legendary_rate = (Math.trunc(Math.min(0.16, fishing_power_cache / 4500) * 10000)) / 100;

	if (common_rate === 50)
	{
		common.innerHTML = "Common: <b>" + common_rate.toString() + "%</b>";
	}
	else
	{
		common.innerHTML = "Common: " + common_rate.toString() + "%";
	}

	if (uncommon_rate === 33)
	{
		uncommon.innerHTML = "Uncommon: <b>" + uncommon_rate.toString() + "</b>%";
	}
	else
	{
		uncommon.innerHTML = "Uncommon: " + uncommon_rate.toString() + "%";
	}

	if (rare_rate === 25)
	{
		rare.innerHTML = "Rare: <b>" + rare_rate.toString() + "</b>%";
	}
	else
	{
		rare.innerHTML = "Rare: " +  rare_rate.toString() + "%";
	}
	
	if (epic_rate === 20)
	{
		epic.innerHTML = "Epic: <b>" + epic_rate.toString() + "</b>%";
	}
	else
	{
		epic.innerHTML = "Epic: " + epic_rate.toString() + "%";
	}

	if (legendary_rate === 16)
	{
		legendary.innerHTML = "Legendary: <b>" + legendary_rate.toString() + "</b>%";
	}
	else
	{
		legendary.innerHTML = "Legendary: " + legendary_rate.toString() + "%";
	}

	document.getElementById("blood_moon_legendary").innerHTML = legendary_rate.toString() + "%";
}

/**
 * 
 * @returns {FishingDropTables}
 */
function generateDropTable()
{
	var table = new FishingDropTables();

	if (FishingFactors.liquid !== "water")
	{
		table.add(BiomeTables[FishingFactors.liquid]);
		return table;
	}
	
	table.add(BiomeTables[FishingFactors.biome]);

	// None is empty string
	if (FishingFactors.infection)
	{
		if (FishingFactors.biome === "desert" || FishingFactors.biome === "ocean")
		{
			table = new FishingDropTables();
			table.add(BiomeTables["pure"]);
		}

		table.add(InfectionTables[FishingFactors.infection]);
	}

	switch (FishingFactors.height)
	{
		case "caverns":
			if (FishingFactors.biome in HeightTables["caverns"])
			{
				table.add(HeightTables["caverns"][FishingFactors.biome]);
			}
			if (canGetJellyfish())
			{
				table.add(HeightTables["caverns"]["jellyfish"]);
			}
			// Fall-through
		case "underground":
			if (FishingFactors.biome === "ocean" && !FishingFactors.infection)
			{
				table.add(BiomeTables["pure"]);
			}
			if (FishingFactors.biome in HeightTables["underground"])
			{
				table.add(HeightTables["underground"][FishingFactors.biome]);
			}
			else
			{
				table.add(HeightTables["underground"]["pure"]);
			}
			break;
		case "sky":
			if (FishingFactors.biome === "pure" && !FishingFactors.infection)
			{
				table.add(HeightTables["sky"]["pure"]);
				return table;
			}
			// Fall-through
		case "surface":
			if (FishingFactors.biome in HeightTables["surface"] && (FishingFactors.biome !== "ocean" || !FishingFactors.infection))
			{
				table.add(HeightTables["surface"][FishingFactors.biome]);
			}
			break;
		default:
			break;
	}

	// Scaly Truffle requires infected Snow Cavern
	if (FishingFactors.biome === "snow" && FishingFactors.height === "caverns" && FishingFactors.infection)
	{
		table.addScalyTruffle();
	}

	return table;
}

function canGetJellyfish()
{
	if (FishingFactors.infection !== "corruption" && FishingFactors.infection !== "hallow" && FishingFactors.biome !== "desert")
	{
		return true;
	}

	return false;
}

window.updateDropTable = function updateDropTable()
{
	var drop_table = generateDropTable();

	var item_plentiful = document.getElementById("catch_plentiful");
	var item_common = document.getElementById("catch_common");
	var item_uncommon = document.getElementById("catch_uncommon");
	var item_rare = document.getElementById("catch_rare");
	var item_epic = document.getElementById("catch_epic");
	var item_legendary = document.getElementById("catch_legendary");

	item_plentiful.innerHTML = drop_table.items.pre_hardmode.plentiful.join(",<br>");
	item_common.innerHTML = drop_table.items.pre_hardmode.common.join(",<br>");
	item_uncommon.innerHTML = drop_table.items.pre_hardmode.uncommon.join(",<br>");
	item_rare.innerHTML = drop_table.items.pre_hardmode.rare.join(",<br>");
	item_epic.innerHTML = drop_table.items.pre_hardmode.epic.join(",<br>");
	item_legendary.innerHTML = drop_table.items.pre_hardmode.legendary.join(",<br>");
	
	if (document.getElementById("hardmode").checked)
	{
		if (drop_table.items.hardmode.plentiful.length)
		{
			item_plentiful.innerHTML += ",<br>" + drop_table.items.hardmode.plentiful.join(",<br>");
		}
		if (drop_table.items.hardmode.common.length)
		{
			item_common.innerHTML += ",<br>" + drop_table.items.hardmode.common.join(",<br>");
		}
		if (drop_table.items.hardmode.uncommon.length)
		{
			item_uncommon.innerHTML += ",<br>" + drop_table.items.hardmode.uncommon.join(",<br>");
		}
		if (drop_table.items.hardmode.rare.length)
		{
			// Hallow is an edge case that needs these
			if (item_rare.innerHTML === "")
			{
				item_rare.innerHTML = drop_table.items.hardmode.rare.join(",<br>");
			}
			else
			{
				item_rare.innerHTML += ",<br>" + drop_table.items.hardmode.rare.join(",<br>");
			}
		}
		if (drop_table.items.hardmode.epic.length)
		{	
			if (item_epic.innerHTML === "")
			{
				item_epic.innerHTML = drop_table.items.hardmode.epic.join(",<br>");
			}
			else
			{
				item_epic.innerHTML += ",<br>" + drop_table.items.hardmode.epic.join(",<br>");
			}
		}
		if (drop_table.items.hardmode.legendary.length)
		{
			item_legendary.innerHTML += ",<br>" + drop_table.items.hardmode.legendary.join(",<br>");
		}
		
		document.getElementById("crate_plentiful").innerHTML = drop_table.crates.hardmode.plentiful.join(",<br>");
		document.getElementById("crate_common").innerHTML = drop_table.crates.hardmode.common.join(",<br>");
		document.getElementById("crate_uncommon").innerHTML = drop_table.crates.hardmode.uncommon.join(",<br>");
		document.getElementById("crate_rare").innerHTML = drop_table.crates.hardmode.rare.join(",<br>");
		document.getElementById("crate_epic").innerHTML = drop_table.crates.hardmode.epic.join(",<br>");
		document.getElementById("crate_legendary").innerHTML = drop_table.crates.hardmode.legendary.join(",<br>");
	}
	else
	{
		document.getElementById("crate_plentiful").innerHTML = drop_table.crates.pre_hardmode.plentiful.join(",<br>");
		document.getElementById("crate_common").innerHTML = drop_table.crates.pre_hardmode.common.join(",<br>");
		document.getElementById("crate_uncommon").innerHTML = drop_table.crates.pre_hardmode.uncommon.join(",<br>");
		document.getElementById("crate_rare").innerHTML = drop_table.crates.pre_hardmode.rare.join(",<br>");
		document.getElementById("crate_epic").innerHTML = drop_table.crates.pre_hardmode.epic.join(",<br>");
		document.getElementById("crate_legendary").innerHTML = drop_table.crates.pre_hardmode.legendary.join(",<br>");
	}
}

window.updateBloodMoonTable = function updateBloodMoonTable()
{
	const blood_moon = document.getElementById("blood_moon");
	var table_blood_moon = document.getElementById("table_blood_moon");
	var dreadnautilus = document.getElementById("dreadnautilus");
	var hardmode = document.getElementById("hardmode");
	var moon_phase = document.getElementById("moon_phase");

	if (blood_moon.checked)
	{
		moon_phase.value = "full";
		moon_phase.disabled = true;
		updateFishingPowerText();

		if (FishingFactors.liquid == "water")
		{
			table_blood_moon.style.display = "table";
		}
		else
		{
			table_blood_moon.style.display = "none";
		}
	}
	else
	{
		table_blood_moon.style.display = "none";
		moon_phase.disabled = false;
	}

	if (hardmode.checked)
	{
		dreadnautilus.style.display = "table-row";
	}
	else
	{
		dreadnautilus.style.display = "none";
	}
}

function updateJunkText()
{
	// 84 * 0.60 > 50
	if (calcLakeSizeMultiplier() === 1 || fishing_power_cache >= 84)
	{
		document.getElementById("junk_text").innerHTML = "Junk: Impossible";
		return;
	}
	
	// 35 * 1.40 < 50
	if (fishing_power_cache <= 35)
	{
		document.getElementById("junk_text").innerHTML = "Junk: Guaranteed";
		return;
	}
	
	document.getElementById("junk_text").innerHTML = "Junk: Luck-dependent";
}

function updateCrateText()
{
	var div = document.getElementById("crate_chance");
	var chance = 10;

	chance += document.getElementById("crate_potion").checked ? 15 : 0;

	div.innerHTML = "Crate chance: " + chance + "%";
}

window.updateAllText = function updateAllText()
{
	updateFishingPowerText();
	updateCatchRateText();
	updateLavaFishingText();
	updateCatchQuality();
	updateJunkText();
	updateCrateText();
}

// #endregion Functions
updateAllText();
updateDropTable();