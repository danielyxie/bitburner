import { BlackOperation } from "./BlackOperation";
import { IMap } from "../types";

export const BlackOperations: IMap<BlackOperation> = {};

(function() {
    BlackOperations["Operation Typhoon"] = new BlackOperation({
        name:"Operation Typhoon",
        desc:"Obadiah Zenyatta is the leader of a RedWater PMC. It has long " +
             "been known among the intelligence community that Zenyatta, along " +
             "with the rest of the PMC, is a Synthoid.<br><br>" +
             "The goal of Operation Typhoon is to find and eliminate " +
             "Zenyatta and RedWater by any means necessary. After the task " +
             "is completed, the actions must be covered up from the general public.",
        baseDifficulty:2000, reqdRank:2.5e3,
        rankGain:50, rankLoss:10, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Zero"] = new BlackOperation({
        name:"Operation Zero",
        desc:"AeroCorp is one of the world's largest defense contractors. " +
             "Its leader, Steve Watataki, is thought to be a supporter of " +
             "Synthoid rights. He must be removed.<br><br>" +
             "The goal of Operation Zero is to covertly infiltrate AeroCorp and " +
             "uncover any incriminating evidence or " +
             "information against Watataki that will cause him to be removed " +
             "from his position at AeroCorp. Incriminating evidence can be " +
             "fabricated as a last resort. Be warned that AeroCorp has some of " +
             "the most advanced security measures in the world.",
        baseDifficulty:2500, reqdRank:5e3,
        rankGain:60, rankLoss:15, hpLoss:50,
        weights:{hack:0.2,str:0.15,def:0.15,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true,
    });
    BlackOperations["Operation X"] = new BlackOperation({
        name:"Operation X",
        desc:"We have recently discovered an underground publication " +
             "group called Samizdat. Even though most of their publications " +
             "are nonsensical conspiracy theories, the average human is " +
             "gullible enough to believe them. Many of their works discuss " +
             "Synthoids and pose a threat to society. The publications are spreading " +
             "rapidly in China and other Eastern countries.<br><br>" +
             "Samizdat has done a good job of keeping hidden and anonymous. " +
             "However, we've just received intelligence that their base of " +
             "operations is in Ishima's underground sewer systems. Your task is to " +
             "investigate the sewer systems, and eliminate Samizdat. They must " +
             "never publish anything again.",
        baseDifficulty:3000, reqdRank:7.5e3,
        rankGain:75, rankLoss:15, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Titan"] = new BlackOperation({
        name:"Operation Titan",
        desc:"Several months ago Titan Laboratories' Bioengineering department " +
             "was infiltrated by Synthoids. As far as we know, Titan Laboratories' " +
             "management has no knowledge about this. We don't know what the " +
             "Synthoids are up to, but the research that they could " +
             "be conducting using Titan Laboraties' vast resources is potentially " +
             "very dangerous.<br><br>" +
             "Your goal is to enter and destroy the Bioengineering department's " +
             "facility in Aevum. The task is not just to retire the Synthoids there, but " +
             "also to destroy any information or research at the facility that " +
             "is relevant to the Synthoids and their goals.",
        baseDifficulty:4000, reqdRank:10e3,
        rankGain:100, rankLoss:20, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Ares"] = new BlackOperation({
        name:"Operation Ares",
        desc:"One of our undercover agents, Agent Carter, has informed us of a " +
             "massive weapons deal going down in Dubai between rogue Russian " +
             "militants and a radical Synthoid community. These weapons are next-gen " +
             "plasma and energy weapons. It is critical for the safety of humanity " +
             "that this deal does not happen.<br><br>" +
             "Your task is to intercept the deal. Leave no survivors.",
        baseDifficulty:5000, reqdRank:12.5e3,
        rankGain:125, rankLoss:20, hpLoss:200,
        weights:{hack:0,str:0.25,def:0.25,dex:0.25,agi:0.25,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Archangel"] = new BlackOperation({
        name:"Operation Archangel",
        desc:"Our analysts have discovered that the popular Red Rabbit brothel in " +
             "Amsterdam is run and 'staffed' by MK-VI Synthoids. Intelligence " +
             "suggests that the profit from this brothel is used to fund a large " +
             "black market arms trafficking operation.<br><br>"  +
             "The goal of this operation is to take out the leaders that are running " +
             "the Red Rabbit brothel. Try to limit the number of other casualties, " +
             "but do what you must to complete the mission.",
        baseDifficulty:7500, reqdRank:15e3,
        rankGain:200, rankLoss:20, hpLoss:25,
        weights:{hack:0,str:0.2,def:0.2,dex:0.3,agi:0.3,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Juggernaut"] = new BlackOperation({
        name:"Operation Juggernaut",
        desc:"The CIA has just encountered a new security threat. A new " +
             "criminal group, lead by a shadowy operative who calls himself " +
             "Juggernaut, has been smuggling drugs and weapons (including " +
             "suspected bioweapons) into Sector-12. We also have reason " +
             "to believe the tried to break into one of Universal Energy's " +
             "facilities in order to cause a city-wide blackout. The CIA " +
             "suspects that Juggernaut is a heavily-augmented Synthoid, and " +
             "have thus enlisted our help.<br><br>" +
             "Your mission is to eradicate Juggernaut and his followers.",
        baseDifficulty:10e3, reqdRank:20e3,
        rankGain:300, rankLoss:40, hpLoss:300,
        weights:{hack:0,str:0.25,def:0.25,dex:0.25,agi:0.25,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Red Dragon"] = new BlackOperation({
        name:"Operation Red Dragon",
        desc:"The Tetrads criminal organization is suspected of " +
             "reverse-engineering the MK-VI Synthoid design. We believe " +
             "they altered and possibly improved the design and began " +
             "manufacturing their own Synthoid models in order to bolster " +
             "their criminal activities.<br><br>" +
             "Your task is to infiltrate and destroy the Tetrads' base of operations " +
             "in Los Angeles. Intelligence tells us that their base houses " +
             "one of their Synthoid manufacturing units.",
        baseDifficulty:12.5e3, reqdRank:25e3,
        rankGain:500, rankLoss:50, hpLoss:500,
        weights:{hack:0.05,str:0.2,def:0.2,dex:0.25,agi:0.25,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation K"] = new BlackOperation({
        name:"Operation K",
        desc:"CODE RED SITUATION. Our intelligence tells us that VitaLife " +
             "has discovered a new android cloning technology. This technology " +
             "is supposedly capable of cloning Synthoid, not only physically " +
             "but also their advanced AI modules. We do not believe that " +
             "VitaLife is trying to use this technology illegally or " +
             "maliciously, but if any Synthoids were able to infiltrate the " +
             "corporation and take advantage of this technology then the " +
             "results would be catastrophic.<br><br>" +
             "We do not have the power or jurisdiction to shutdown this down " +
             "through legal or political means, so we must resort to a covert " +
             "operation. Your goal is to destroy this technology and eliminate " +
             "anyone who was involved in its creation.",
        baseDifficulty:15e3, reqdRank:30e3,
        rankGain:750, rankLoss:60, hpLoss:1000,
        weights:{hack:0.05,str:0.2,def:0.2,dex:0.25,agi:0.25,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Deckard"] = new BlackOperation({
        name:"Operation Deckard",
        desc:"Despite your success in eliminating VitaLife's new android-replicating " +
             "technology in Operation K, we've discovered that a small group of " +
             "MK-VI Synthoids were able to make off with the schematics and design " +
             "of the technology before the Operation. It is almost a certainty that " +
             "these Synthoids are some of the rogue MK-VI ones from the Synthoid Uprising." +
             "The goal of Operation Deckard is to hunt down these Synthoids and retire " +
             "them. I don't need to tell you how critical this mission is.",
        baseDifficulty:20e3, reqdRank:40e3,
        rankGain:1e3, rankLoss:75, hpLoss:200,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Tyrell"] = new BlackOperation({
        name:"Operation Tyrell",
        desc:"A week ago Blade Industries reported a small break-in at one " +
             "of their Aevum Augmentation storage facitilities. We figured out " +
             "that The Dark Army was behind the heist, and didn't think any more " +
             "of it. However, we've just discovered that several known MK-VI Synthoids " +
             "were part of that break-in group.<br><br>" +
             "We cannot have Synthoids upgrading their already-enhanced abilities " +
             "with Augmentations. Your task is to hunt down the associated Dark Army " +
             "members and eliminate them.",
         baseDifficulty:25e3, reqdRank:50e3,
         rankGain:1.5e3, rankLoss:100, hpLoss:500,
         weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
         decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
         isKill:true,
    });
    BlackOperations["Operation Wallace"] = new BlackOperation({
        name:"Operation Wallace",
        desc:"Based on information gathered from Operation Tyrell, we've discovered " +
             "that The Dark Army was well aware that there were Synthoids amongst " +
             "their ranks. Even worse, we believe that The Dark Army is working " +
             "together with other criminal organizations such as The Syndicate and " +
             "that they are planning some sort of large-scale takeover of multiple major " +
             "cities, most notably Aevum. We suspect that Synthoids have infiltrated " +
             "the ranks of these criminal factions and are trying to stage another " +
             "Synthoid uprising.<br><br>" +
             "The best way to deal with this is to prevent it before it even happens. " +
             "The goal of Operation Wallace is to destroy the Dark Army and " +
             "Syndicate factions in Aevum immediately. Leave no survivors.",
         baseDifficulty:30e3, reqdRank:75e3,
         rankGain:2e3, rankLoss:150, hpLoss:1500,
         weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
         decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
         isKill:true,
    });
    BlackOperations["Operation Shoulder of Orion"] = new BlackOperation({
        name:"Operation Shoulder of Orion",
        desc:"China's Solaris Space Systems is secretly launching the first " +
             "manned spacecraft in over a decade using Synthoids. We believe " +
             "China is trying to establish the first off-world colonies.<br><br>" +
             "The mission is to prevent this launch without instigating an " +
             "international conflict. When you accept this mission you will be " +
             "officially disavowed by the NSA and the national government until after you " +
             "successfully return. In the event of failure, all of the operation's " +
             "team members must not let themselves be captured alive.",
        baseDifficulty:35e3, reqdRank:100e3,
        rankGain:2.5e3, rankLoss:500, hpLoss:1500,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true,
    });
    BlackOperations["Operation Hyron"] = new BlackOperation({
        name:"Operation Hyron",
        desc:"Our intelligence tells us that Fulcrum Technologies is developing " +
             "a quantum supercomputer using human brains as core " +
             "processors. This supercomputer " +
             "is rumored to be able to store vast amounts of data and " +
             "perform computations unmatched by any other supercomputer on the " +
             "planet. But more importantly, the use of organic human brains " +
             "means that the supercomputer may be able to reason abstractly " +
             "and become self-aware.<br><br>" +
             "I do not need to remind you why sentient-level AIs pose a serious " +
             "thread to all of mankind.<br><br>" +
             "The research for this project is being conducted at one of Fulcrum " +
             "Technologies secret facilities in Aevum, codenamed 'Alpha Ranch'. " +
             "Infiltrate the compound, delete and destroy the work, and then find and kill the " +
             "project lead.",
        baseDifficulty:40e3, reqdRank:125e3,
        rankGain:3e3, rankLoss:1e3, hpLoss:500,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Morpheus"] = new BlackOperation({
        name:"Operation Morpheus",
        desc:"DreamSense Technologies is an advertising company that uses " +
             "special technology to transmit their ads into the peoples " +
             "dreams and subconcious. They do this using broadcast transmitter " +
             "towers. Based on information from our agents and informants in " +
             "Chonqging, we have reason to believe that one of the broadcast " +
             "towers there has been compromised by Synthoids and is being used " +
             "to spread pro-Synthoid propaganda.<br><br>" +
             "The mission is to destroy this broadcast tower. Speed and " +
             "stealth are of the upmost important for this.",
        baseDifficulty:45e3, reqdRank:150e3,
        rankGain:4e3, rankLoss:1e3, hpLoss:100,
        weights:{hack:0.05,str:0.15,def:0.15,dex:0.3,agi:0.3,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true,
    });
    BlackOperations["Operation Ion Storm"] = new BlackOperation({
        name:"Operation Ion Storm",
        desc:"Our analysts have uncovered a gathering of MK-VI Synthoids " +
             "that have taken up residence in the Sector-12 Slums. We " +
             "don't know if they are rogue Synthoids from the Uprising, " +
             "but we do know that they have been stockpiling " +
             "weapons, money, and other resources. This makes them dangerous.<br><br>" +
             "This is a full-scale assault operation to find and retire all of these " +
             "Synthoids in the Sector-12 Slums.",
        baseDifficulty:50e3, reqdRank:175e3,
        rankGain:5e3, rankLoss:1e3, hpLoss:5000,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Annihilus"] = new BlackOperation({
        name:"Operation Annihilus",
        desc:"Our superiors have ordered us to eradicate everything and everyone " +
             "in an underground facility located in Aevum. They tell us " +
             "that the facility houses many dangerous Synthoids and " +
             "belongs to a terrorist organization called " +
             "'The Covenant'. We have no prior intelligence about this " +
             "organization, so you are going in blind.",
        baseDifficulty:55e3, reqdRank:200e3,
        rankGain:7.5e3, rankLoss:1e3, hpLoss:10e3,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Ultron"] = new BlackOperation({
        name:"Operation Ultron",
        desc:"OmniTek Incorporated, the original designer and manufacturer of Synthoids, " +
             "has notified us of a malfunction in their AI design. This malfunction, "  +
             "when triggered, causes MK-VI Synthoids to become radicalized and seek out " +
             "the destruction of humanity. They say that this bug affects all MK-VI Synthoids, " +
             "not just the rogue ones from the Uprising.<br><br>" +
             "OmniTek has also told us they they believe someone has triggered this " +
             "malfunction in a large group of MK-VI Synthoids, and that these newly-radicalized Synthoids " +
             "are now amassing in Volhaven to form a terrorist group called Ultron.<br><br>" +
             "Intelligence suggests Ultron is heavily armed and that their members are " +
             "augmented. We believe Ultron is making moves to take control of " +
             "and weaponize DeltaOne's Tactical High-Energy Satellite Laser Array (THESLA).<br><br>" +
             "Your task is to find and destroy Ultron.",
        baseDifficulty:60e3, reqdRank:250e3,
        rankGain:10e3, rankLoss:2e3, hpLoss:10e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Centurion"] = new BlackOperation({
        name:"Operation Centurion",
        desc:"D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)<br><br>" +
             "Throughout all of humanity's history, we have relied on " +
             "technology to survive, conquer, and progress. Its advancement became our primary goal. " +
             "And at the peak of human civilization technology turned into " +
             "power. Global, absolute power.<br><br>" +
             "It seems that the universe is not without a sense of irony.<br><br>" +
             "D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)",
        baseDifficulty:70e3, reqdRank:300e3,
        rankGain:15e3, rankLoss:5e3, hpLoss:10e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
    BlackOperations["Operation Vindictus"] = new BlackOperation({
        name:"Operation Vindictus",
        desc:"D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)<br><br>" +
             "The bits are all around us. The daemons that hold the Node " +
             "together can manifest themselves in many different ways.<br><br>" +
             "D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)",
        baseDifficulty:75e3, reqdRank:350e3,
        rankGain:20e3, rankLoss:20e3, hpLoss:20e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
    BlackOperations["Operation Daedalus"] = new BlackOperation({
        name:"Operation Daedalus",
        desc:"Yesterday we obeyed kings and bent our neck to emperors. " +
             "Today we kneel only to truth.",
        baseDifficulty:80e3, reqdRank:400e3,
        rankGain:40e3, rankLoss:10e3, hpLoss:100e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
})()