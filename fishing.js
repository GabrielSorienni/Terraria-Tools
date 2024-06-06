function calcLakeSizePenalty(lake_size, liquid)
{
	var penalty;
	
	switch (liquid)
	{
		case "water":
			penalty = lake_size/300;
			break;
	
		case "honey":
			penalty = lake_size/200
			break;
	}

	if (penalty > 1)
	{
		penalty = 1;
	}

	return penalty;
}

function calcFishingPower()
{
	var pole_power;
	var bait_power;
	var moon_phase;
	var time_factor;
	var weather;
	var lake_penalty;
	var accessory_power;
	var potion_power;
	var armor_power;
	var chum_bucket;
	var gummy_worm;
	var environment_power;

	var total_power = pole_power + bait_power + accessory_power + potion_power + armor_power + (gummy_worm * 3) + environment_power;
	var total_power = total_power * time_factor *  moon_phase * weather * lake_penalty;
	var total_power = total_power + chum_bucket;
}