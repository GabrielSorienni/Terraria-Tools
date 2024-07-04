export class FishingDropTables
{
	/** @type {boolean} */
	has_quests;
	strength;

	/** Lists of non-crate itms that can be caught. */
	items =
	{
		/**
		 * List of items that can be caught in pre-hardmode.
		 */
		pre_hardmode:
		{
			// "epic" and "legendary" substitute the Wiki's terminology to avoid repeating "rare".
			plentiful: [],
			common: [],
			uncommon: [],
			rare: [],
			epic: [],
			legendary: []
		},
		/**
		 * List of items that can be caught in hardmode.
		 */
		hardmode:
		{
			plentiful: [],
			common: [],
			uncommon: [],
			rare: [],
			epic: [],
			legendary: []
		}
	}

	crates =
	{
		priority: 11,
		/**
		 * List of crates that can be caught in pre-hardmode.
		 */
		pre_hardmode:
		{
			plentiful: [],
			common: [],
			uncommon: [],
			rare: [],
			epic: [],
			legendary: []
		},
		/**
		 * List of crates that can be caught in hardmode.
		 */
		hardmode:
		{
			plentiful: [],
			common: [],
			uncommon: [],
			rare: [],
			epic: [],
			legendary: []
		}
	};

	FishingDropTables()
	{
	}

	/**
	 * Adds a drop table to this one.
	 * @param {FishingDropTables} drop_table 
	 */
	add(drop_table)
	{
		if ("items" in drop_table)
		{
			if ("pre_hardmode" in drop_table.items)
			{
				this.items.pre_hardmode.plentiful.push(...drop_table.items.pre_hardmode.plentiful);
				this.items.pre_hardmode.common.push(...drop_table.items.pre_hardmode.common);
				this.items.pre_hardmode.uncommon.push(...drop_table.items.pre_hardmode.uncommon);
				this.items.pre_hardmode.rare.push(...drop_table.items.pre_hardmode.rare);
				this.items.pre_hardmode.epic.push(...drop_table.items.pre_hardmode.epic);
				this.items.pre_hardmode.legendary.push(...drop_table.items.pre_hardmode.legendary);
			}

			if ("hardmode" in drop_table.items)
			{
				this.items.hardmode.plentiful.push(...drop_table.items.hardmode.plentiful);
				this.items.hardmode.common.push(...drop_table.items.hardmode.common);
				this.items.hardmode.uncommon.push(...drop_table.items.hardmode.uncommon);
				this.items.hardmode.rare.push(...drop_table.items.hardmode.rare);
				this.items.hardmode.epic.push(...drop_table.items.hardmode.epic);
				this.items.hardmode.legendary.push(...drop_table.items.hardmode.legendary);
			}
		}

		if ("crates" in drop_table && drop_table.crates.priority < this.crates.priority)
		{
			if ("pre_hardmode" in drop_table.crates)
			{
				this.crates.pre_hardmode.plentiful = drop_table.crates.pre_hardmode.plentiful;
				this.crates.pre_hardmode.common = drop_table.crates.pre_hardmode.common;
				this.crates.pre_hardmode.uncommon = drop_table.crates.pre_hardmode.uncommon;
				this.crates.pre_hardmode.rare = drop_table.crates.pre_hardmode.rare;
				this.crates.pre_hardmode.epic = drop_table.crates.pre_hardmode.epic;
				this.crates.pre_hardmode.legendary = drop_table.crates.pre_hardmode.legendary;
			}

			if ("hardmode" in drop_table.crates)
			{
				this.crates.hardmode.plentiful = drop_table.crates.hardmode.plentiful;
				this.crates.hardmode.common = drop_table.crates.hardmode.common;
				this.crates.hardmode.uncommon = drop_table.crates.hardmode.uncommon;
				this.crates.hardmode.rare = drop_table.crates.hardmode.rare;
				this.crates.hardmode.epic = drop_table.crates.hardmode.epic;
				this.crates.hardmode.legendary = drop_table.crates.hardmode.legendary;
			}
		}
	}

	addScalyTruffle()
	{
		this.items.hardmode.legendary.push("Scaly Truffle");
	}
}

/**
 * @type {Object.<string, FishingDropTables>}
 */
export const BiomeTables =
{
	"pure":
	{
		has_quests: true,

		items:
		{
			pre_hardmode:
			{
				plentiful:
				[
					"Bass"
				],
				common: [],
				uncommon:
				[
					"Bomb Fish"
				],
				rare: [],
				epic: [],
				legendary:
				[
					"Frog Leg",
					"Balloon Pufferfish",
					"Zephyr Fish",
				]
			}
		},

		crates:
		{
			priority: 10,
			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: [],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: [],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"desert":
	{
		has_quests: true,

		items:
		{
			pre_hardmode:
			{
				plentiful:
				[
					"Flounder",
					"Rock Lobster"
				],
				common: [],
				uncommon:
				[
					"Bomb Fish",
					"Oyster"
				],
				rare: [],
				epic: [],
				legendary:
				[
					"Frog Leg",
					"Balloon Pufferfish",
					"Zephyr Fish",
				]
			}
		},

		crates:
		{
			priority: 8,

			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Oasis Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Mirage Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"jungle":
	{
		has_quests: true,

		items:
		{
			pre_hardmode:
			{
				plentiful:
				[
					"Bass"
				],
				common:
				[
					"Neon Tetra"
				],
				uncommon:
				[
					"Bomb Fish"
				],
				rare:
				[

				],
				epic:
				[

				],
				legendary:
				[
					"Frog Leg",
					"Balloon Pufferfish",
					"Zephyr Fish"
				]
			}
		},

		crates:
		{
			priority: 6,

			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Jungle Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Bramble Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"snow":
	{
		has_quests: true,

		items:
		{
			pre_hardmode:
			{
				plentiful:
				[
					"Bass"
				],
				common:
				[
					"Atlantic Cod"
				],
				uncommon:
				[
					"Frost Minnow",
					"Bomb Fish",
					"Frost Daggerfish"
				],
				rare: [],
				epic: [],
				legendary:
				[
					"Frog Leg",
					"Balloon Pufferfish",
					"Zephyr Fish"
				]
			}
		},

		crates:
		{
			priority: 7,

			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Snow Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Boreal Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"ocean":
	{
		has_quests: true
	},

	"dungeon":
	{
		has_quests: false,

		items:
		{
			pre_hardmode:
			{
				plentiful: ["Bass"],
				common: [],
				uncommon: ["Bomb Fish"],
				rare: [],
				epic: ["Alchemy Table"],
				legendary:
				[
					"Frog Leg",
					"Balloon Pufferfish",
					"Zephyr Fish"
				]
			}
		},

		crates:
		{
			priority: 2,
			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Dungeon Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Stockade Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"honey":
	{
		has_quests: true,

		items:
		{
			pre_hardmode:
			{
				plentiful: [],
				common: [],
				uncommon:
				[
					"Honeyfin"
				],
				rare:
				[
					"Honeyfin"
				],
				epic:
				[

				],
				legendary:
				[

				]
			}
		}
	},

	"lava":
	{
		has_quests: false,

		items:
		{
			pre_hardmode:
			{
				plentiful: [],
				common: [],
				uncommon: [],
				rare: ["Obsidifish"],
				epic: ["Flarefin Koi"],
				legendary:
				[
					"Bottomless Lava Bucket",
					"Lava Absorbant Sponge",
					"Demon Conch"
				]
			},

			hardmode:
			{
				plentiful: [],
				common: [],
				uncommon: [],
				rare: [],
				epic: [],
				legendary: ["Obsidian Swordfish"]
			}
		},

		crates:
		{
			priority: 1,
			pre_hardmode:
			{
				plentiful: ["Obsidian Crate"],
				common: [],
				uncommon: [],
				rare: [],
				epic: [],
				legendary: []
			},
			hardmode:
			{
				plentiful: ["Hellstone Crate"],
				common: [],
				uncommon: [],
				rare: [],
				epic: [],
				legendary: []
			}
		}
	}
}

/**
 * @type {Object.<string, FishingDropTables>}
 */
export const InfectionTables =
{
	"corruption":
	{
		items:
		{
			pre_hardmode:
			{
				plentiful:
				[
				],
				common:
				[
					"Ebonkoi"
				],
				uncommon:
				[
				],
				rare:
				[
					"Purple Clubberfish"
				],
				epic: [],
				legendary:
				[
				]
			},

			hardmode:
			{
				plentiful: [],
				common: [],
				uncommon: [],
				rare: [],
				epic: [],
				legendary:
				[
					"Toxicarp"
				]
			}
		},

		crates:
		{
			priority: 4,
			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Corrupt Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Defiled Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},

	"crimson":
	{
		items:
		{
			pre_hardmode:
			{
				plentiful: [],
				common:
				[
					"Crimson Tigerfish"
				],

				uncommon:
				[
					"Hemopiranha"
				],

				rare: [],
				epic: [],
				legendary: []
			},

			hardmode:
			{
				plentiful: [],
				common: [],
				uncommon: [],
				rare: [],
				epic: [],
				legendary:
				[
					"Bladetongue"
				]
			}
		},

		crates:
		{
			priority: 4,
			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Crimson Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Hematic Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	},
	
	"hallow":
	{
		items:
		{
			hardmode:
			{
				plentiful: [],
				common: [],
				uncommon:
				[
					"Princess Fish"
				],

				rare:
				[
					"Prismite"
				],

				epic:
				[
					"Crystal Serpent",
					"Lady of the Lake"
				],

				legendary:
				[

				]
			},
		},

		crates:
		{
			priority: 5,

			pre_hardmode:
			{
				plentiful: ["Wooden Crate"],
				common: [],
				uncommon: ["Iron Crate"],
				rare: ["Halloweds Crate"],
				epic: ["Golden Crate"],
				legendary: ["Golden Crate"]
			},
			
			hardmode:
			{
				plentiful: ["Pearlwood Crate"],
				common: [],
				uncommon: ["Mythril Crate"],
				rare: ["Divine Crate"],
				epic: ["Titanium Crate"],
				legendary: ["Titanium Crate"]
			}
		}
	}
}

/**
 * @type {Object.<string, FishingDropTables>}
 */
export const HeightTables =
{
	"surface":
	{
		"jungle":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: ["Double Cod"],
					rare: [],
					epic: [],
					legendary: []
				}
			}
		},
		
		"ocean":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful:
					[
						"Trout"
					],
					common:
					[
						"Red Snapper",
						"Tuna"
					],
					uncommon:
					[
						"Shrimp",
						"Bomb Fish"
					],
					rare:
					[
						"Pink Jellyfish"
					],
					epic:
					[
						"Swordfish",
						"Reaver Shark",
						"Sawtooth Shark"
					],
					legendary:
					[
						"Frog Leg",
						"Balloon Pufferfish",
						"Zephyr Fish"
					]
				}
			},

			crates:
			{
				priority: 3,
				pre_hardmode:
				{
					plentiful: ["Wooden Crate"],
					common: [],
					uncommon: ["Iron Crate"],
					rare: ["Ocean Crate"],
					epic: ["Golden Crate"],
					legendary: ["Golden Crate"]
				},
				
				hardmode:
				{
					plentiful: ["Pearlwood Crate"],
					common: [],
					uncommon: ["Mythril Crate"],
					rare: ["Seaside Crate"],
					epic: ["Titanium Crate"],
					legendary: ["Titanium Crate"]
				}
			}
		}
	},

	"underground":
	{
		"pure":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common:[],
					uncommon: ["Armored Cavefish"],
					rare: [],
					epic: [],
					legendary: ["Golden Carp"]
				},

				hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: [],
					epic: [],
					legendary: []
				}
			}
		},

		"jellyfish":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common:[],
					uncommon: [],
					rare: ["Stinkfish"],
					epic: [],
					legendary: []
				},

				hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: [],
					epic: [],
					legendary: []
				}
			}
		},

		"desert":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: [],
					epic: [],
					legendary: []
				},

				hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: [],
					epic: [],
					legendary: []
				}
			}
		},
		
		"jungle":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: ["Variegated Lardfish"],
					rare: [],
					epic: [],
					legendary: []
				},

				hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: [],
					epic: [],
					legendary: []
				}
			}
		}
	},

	"caverns":
	{
		"jellyfish":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common:[],
					uncommon: [],
					rare: ["Blue Jellyfish"],
					epic: [],
					legendary: []
				},

				hardmode:
				{
					plentiful: [],
					common: [],
					uncommon: [],
					rare: ["Green Jellyfish"],
					epic: [],
					legendary: []
				}
			}
		}
	},

	"sky":
	{
		"pure":
		{
			items:
			{
				pre_hardmode:
				{
					plentiful: [],
					common:[],
					uncommon: ["Damselfish"],
					rare: [],
					epic: [],
					legendary: []
				}
			},

			crates:
			{
				priority: 9,

				pre_hardmode:
				{
					plentiful: ["Wooden Crate"],
					common: [],
					uncommon: ["Iron Crate"],
					rare: ["Sky Crate"],
					epic: ["Golden Crate"],
					legendary: ["Golden Crate"]
				},

				hardmode:
				{
					plentiful: ["Wooden Crate"],
					common: [],
					uncommon: ["Iron Crate"],
					rare: ["Azure Crate"],
					epic: ["Golden Crate"],
					legendary: ["Golden Crate"]
				}
			}
		}
	}
}
