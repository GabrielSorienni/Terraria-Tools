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
// #endregion Document elements
// #region Functions
/**
 * Calculates the catch rate down to 2 decimal points.
 * @param {number} fishing_power The player's total fishing power after all factors have been accounted for.
 * @returns {number} Catch rate in seconds per bite.
 * @see {@link https://terraria.wiki.gg/wiki/Fishing#Catch_frequency}
 */
function calcCatchRate(fishing_power)
{
	var catch_rate = 11/(23 * fishing_power / 600 + 2.5);
	return (Math.trunc(catch_rate * 100) / 100);
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

	return (enabled_factors >= 2);
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
	var multiplier = (Number(lake_size.value) / threshold);

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

	return Math.trunc(total);
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
	
	fishing_power.innerHTML = calcFishingPower().toString();
}

function updateLavaFishingText()
{
	if (hasFastLavaFishing())
	{
		fast_lava_text.innerHTML = "Fast Lava fishing";
	}
	else
	{
		fast_lava_text.innerHTML = "Slow Lava fishing";
	}
}

function updateLavaAccessoryCheckbox()
{
	var tooltip;

	if (lavaproof_tackle_bag.checked)
	{
		lava_hook.checked = true;
		lava_hook.disabled = true;
		tooltip = "Whether you have an accessory that allows fishing in lava without lava bait.\nThis is automatically checked due to the Lavaproof Tackle Bag being checked."
	}
	else
	{
		lava_hook.disabled = false;
		tooltip = "Whether you have an accessory that allows fishing in lava without lava bait."
	}
	
	lava_hook.setAttribute("title", tooltip);
}
// #endregion Functions
