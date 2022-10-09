## Enter the Enderverse

This bitnode will have your sleeves and yourself move on a 2d grid to fight the Enders.
Players can access the Enderverse by accessing the glitch in Ishima.
Upon doing so they will have access to a new tab in which they can view the enderverse map.

The goal of this bitnode is to eliminate all the Enders in this Enderverse.

### Map layout

The enderverse is 10 x 10 cells big. A cell is 10 x 10 tile big. (about 4mb)

Each tile has a id representing the type of terrain on it. Some terrain can be traverse/occupied by entities, others can't.
e.g. dirt can be occupied by a sleeve but is slower than an asphalt tile.

Entities also have a cell+tile coordinate but some of them can move.
e.g. Sleeves are an entity that can be controlled by scripts.

### Stats

All stats but charisma are useful in the Enderverse. Althought the Enders special technology make them much less potent (like log2)

Strength determines the power of your attacks
Agility determines movement speed
Dexterity determines accuracy of attacks
Defense determine health points.

Hacking determine the ability to interact with special objects in the world.

### The base

Players start in their main cell. Which contains their base. This base is where your units respawn if they die. The base can also store energy to be used later.

### Moving

Moving, like almost all actions, can only be done via scripts, one tile at a time. The time it takes to move to the next tile depends on the agility of the entity and the type of tile they are trying to enter. Dirt takes longer than asphalt.

### Attacking

An entity can chose to attack any unit within its range. At first your entities will only have a range of 1, meaning they can only attack entities directly next to them. But this can be upgraded. The damage taken is determined with the entity strength and the time is determined by agility.

### Vision

It's not possible to know what is on a tile unless you have a unit within range of it. Your starting units all have 3 vision, which can be upgraded.

### Energy

Some tiles contain minable energy. Energy can be stored in sleeves or in the base. It can be spend to upgrade your units or to build helpful tools and entities such as roads or defense systems.

### Building

Building can be done by any main unit to a surrounding tile. Building anything costs energy which must be carried by your unit.

### Upgrades

Your starting units can be upgrade with energy and rewards found in the Enderverse.
Examples of upgradable stats:

- vision range
- attack range
- str/agi/dex/def bonus
- Energy capacity

### Chests

Chest can be found containing various improvements. From new buildings to stat upgrades for your units.

### Dying

When unit dies it comes back to life and gains a bonus based on it's exp. This bonus is only based on the max, it is not cummulative like gang members ascension.

### Waves

Every now and then the game will spawn waves of ennemies to attack the home base. If the players core is destroyed the player suffers heavy penalty. Those wave do get stronger over time but also nerfed in the event of a wipeout in order to prevent deadlock.

### Non-starting cells

The cells other than the starting one is where you can find better rewards but also stronger and stronger enemies. Those enemies only attack what's inside their cell and will not follow players back home. But their health is restored if none of your units are in that cell.
