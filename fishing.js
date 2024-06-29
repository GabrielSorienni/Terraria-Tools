import { BiomeTables, FishingDropTables, HeightTables, InfectionTables } from "./Fishing/Drop Tables/drop_tables.js";

// #region Document elements
var rod_power = document.getElementById("rod_power");
var bait_power = document.getElementById("bait_power");
var liquid = document.getElementById("liquid");
var lake_size = document.getElementById("lake_size");
var chum_bucket = document.getElementById("chum_bucket");

var fishing_potion = document.getElementById("fishing_potion");
var tipsy = document.getElementById("tipsy");
var gummy_worm = document.getElementById("gummy_worm");
var toilet = document.getElementById("toilet");

var angler_hat = document.getElementById("angler_hat");
var angler_vest = document.getElementById("angler_vest");
var angler_pants = document.getElementById("angler_pants");
var angler_earring = document.getElementById("angler_earring");
var angler_tackle_bag = document.getElementById("angler_tackle_bag");
var lavaproof_tackle_bag = document.getElementById("lavaproof_tackle_bag");
var fishing_bobber = document.getElementById("fishing_bobber");
var inner_tube = document.getElementById("inner_tube");

var cloudy = document.getElementById("cloudy");
var rainy = document.getElementById("rainy");
var moon_phase = document.getElementById("moon_phase");
var daytime = document.getElementById("daytime");

var lava_bait = document.getElementById("lava_bait");
var lava_rod = document.getElementById("lava_rod");
var lava_hook = document.getElementById("lava_hook");
var fast_lava_text = document.getElementById("fast_lava_text");

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

/**
 * Calculates the catch rate down to 2 decimal points.
 * @returns {number} Catch rate in seconds per bite.
 * @see {@link https://terraria.wiki.gg/wiki/Fishing#Catch_frequency}
 */
function calcAverageCatchRate()
{
	var catch_rate;

	if (liquid.value === "lava" && hasFastLavaFishing())
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

	enabled_factors += lava_bait.checked ? 1 : 0;
	enabled_factors += lava_rod.checked ? 1 : 0;
	enabled_factors += lava_hook.checked ? 1 : 0;

	return enabled_factors >= 2;
}

/**
 * @returns {0.8|1|1.3} The fishing power multiplier resulting from the current time of day.
 */
function getDaytimeMultiplier()
{
	switch (daytime.value)
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
	switch (moon_phase.value)
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
	const threshold = liquid.value === "honey" ? 200 : 300;
	// The "atmo" variable is time-consuming (on the user's end) to calculate
	// and is often 1 anyways, so it has been excluded from this calculation.
	var multiplier = Number(lake_size.value) / threshold;

	return Math.max(0.25, Math.min(multiplier, 1));
}

/**
 * @returns {0|11|17|20} The added fishing power from using Chum Buckets.
 */
function getChumBucketFactor()
{
	switch (chum_bucket.value)
	{
		case "0":
			return 0;
		case "1":
			return 11;
		case "2":
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
	let total = Number(rod_power.value);
	total += Number(bait_power.value);

	total += fishing_potion.checked ? 15 : 0;
	total += tipsy.checked ? 5 : 0;
	total += toilet.checked ? 5 : 0;
	total += gummy_worm.checked ? 3 : 0;
	total += angler_hat.checked ? 5 : 0;
	total += angler_vest.checked ? 5 : 0;
	total += angler_pants.checked ? 5 : 0;
	total += angler_earring.checked ? 10 : 0;
	total += angler_tackle_bag.checked ? 10 : 0;
	total += lavaproof_tackle_bag.checked ? 10 : 0;
	total += fishing_bobber.checked ? 10 : 0;
	total += inner_tube.checked ? 5 : 0;
	
	total *= getMoonPhaseMultiplier();
	total *= getDaytimeMultiplier();
	total *= cloudy.checked ? 1.1 : 1;
	total *= rainy.checked ? 1.2 : 1;
	total *= calcLakeSizeMultiplier();

	total += getChumBucketFactor();

	fishing_power_cache = Math.round(total);

	return fishing_power_cache;
}

function updateFishingPowerText()
{
	const numerical_lake_size = Number(lake_size.value);

	if (liquid.value === "honey")
	{
		if (numerical_lake_size < 50)
		{
			fishing_power.innerHTML = "Fishing impossible - not enough honey! The lake must be at least 50 tiles large.";
		
			return;
		}
	}
	else if (numerical_lake_size < 75)
	{
		fishing_power.innerHTML = "Fishing impossible - not enough " + liquid.value + "! The lake must be at least 75 tiles large.";

		return;
	}
	
	fishing_power.innerHTML = "Fishing Power: " + calcFishingPower().toString();
}

function updateLavaFishingText()
{
	if (hasFastLavaFishing())
	{
		fast_lava_text.innerHTML = "Lava fishing: Fast";
	}
	else
	{
		fast_lava_text.innerHTML = "Lava fishing: Slow";
	}
}

function updateLavaAccessoryCheckbox()
{
	var tooltip;

	if (lavaproof_tackle_bag.checked)
	{
		lava_hook.checked = true;
		lava_hook.disabled = true;
	}
	else
	{
		lava_hook.disabled = false;
	}
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

	if (liquid.value !== "water")
	{
		table.add(BiomeTables[liquid.value]);
		return table;
	}
	
	table.add(BiomeTables[biome.value]);

	// None is empty string
	if (infection.value)
	{
		if (biome.value === "desert" || biome.value === "ocean")
		{
			//table = BiomeTables["pure"];
			table = new FishingDropTables();
			table.add(BiomeTables["pure"]);
		}

		table.add(InfectionTables[infection.value]);
	}

	switch (height.value)
	{
		case "caverns":
			if (biome.value in HeightTables["caverns"])
			{
				table.add(HeightTables["caverns"][biome.value]);
			}
			if (canGetJellyfish())
			{
				table.add(HeightTables["caverns"]["jellyfish"]);
			}
			// Fall-through
		case "underground":
			if (biome.value in HeightTables["underground"])
			{
				table.add(HeightTables["underground"][biome.value]);
			}
			break;
		case "sky":
			if (biome.value === "pure" && !infection.value)
			{
				table.add(HeightTables["sky"]["pure"]);
				return table;
			}
			// Fall-through
		case "surface":
			if (biome.value in HeightTables["surface"] && (biome.value !== "ocean" || !infection.value))
			{
				table.add(HeightTables["surface"][biome.value]);
			}
			break;
		default:
			break;
	}

	// Scaly Truffle requires infected Snow Cavern
	if (biome.value === "snow" && height.value === "caverns" && infection.value)
	{
		table.addScalyTruffle();
	}

	return table;
}

function canGetJellyfish()
{
	if (infection.value !== "corruption" && infection.value !== "hallow" && biome.value !== "desert")
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

	if (blood_moon.checked)
	{
		moon_phase.value = "full";
		moon_phase.disabled = true;
		updateFishingPowerText();

		if (liquid.value == "water")
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
	if (calcLakeSizeMultiplier() === 1 || fishing_power_cache >= 84)
	{
		document.getElementById("junk_text").innerHTML = "Junk: Impossible";
	}
	else
	{
		if (fishing_power_cache <= 35)
		{
			document.getElementById("junk_text").innerHTML = "Junk: Guaranteed";
		}
		else
		{
			document.getElementById("junk_text").innerHTML = "Junk: Luck-dependent";
		}
	}
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