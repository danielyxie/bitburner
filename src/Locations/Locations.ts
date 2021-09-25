/**
 * Map of all Locations in the game
 * Key = Location name, value = Location object
 */
import { City } from "./City";
import { Cities } from "./Cities";
import { Location, IConstructorParams } from "./Location";
import { CityName } from "./data/CityNames";
import { LocationsMetadata } from "./data/LocationsMetadata";

import { IMap } from "../types";

export const Locations: IMap<Location> = {};

/**
 * Here, we'll initialize both Locations and Cities data. These can both
 * be initialized from the `LocationsMetadata`
 */
function constructLocation(p: IConstructorParams): Location {
  if (!p.name) {
    throw new Error(`Invalid constructor parameters for Location. No 'name' property`);
  }

  if (Locations[p.name] instanceof Location) {
    console.warn(`Property with name ${p.name} already exists and is being overwritten`);
  }

  Locations[p.name] = new Location(p);

  return Locations[p.name];
}

// First construct all cities
Cities[CityName.Aevum] = new City(CityName.Aevum);
Cities[CityName.Chongqing] = new City(CityName.Chongqing);
Cities[CityName.Ishima] = new City(CityName.Ishima);
Cities[CityName.NewTokyo] = new City(CityName.NewTokyo);
Cities[CityName.Sector12] = new City(CityName.Sector12);
Cities[CityName.Volhaven] = new City(CityName.Volhaven);

Cities[CityName.Aevum].asciiArt = `
   [aevum police headquarters]       26                                         
                                   o                                            
           I                        \\  [bachman & associates]                  
            \\  56                    B                                         
             x                        \\         [summit university]            
              \\                        \\  28                                  
               \\ [snap fitness gym]     x       o--L-----------N               
                K                        \\     /                               
                 \\                        \\   Q               [casino]        
                  x 58                     \\ /  [travel agency]                
                   \\         94     95      o                                  
     90             x 59     o------o       |                                   
                     \\      /        \\      |             98    102  103      
      o--------O------x----o 93    96 o-----+------------o       o----o         
                       \\                    |             \\     /             
        [hospital]      \\  61    [ecorp]    x 31        99 o-F-o 101           
                         o                  |                                   
                         |      o---E--     |            [fulcrum tech.]        
                         x 62  /            A  [aerocorp]                       
    [crush fitness gym]  |    /             |                                   
                         |   /              |                                   
         o--------D------+--o               o                                   
                         |                  |\\  [rho construction]             
                         H [netlink tech.]  | J                                 
                         |                  |  \\                               
                         |               34 x   \\                              
           [clarke inc.] C                  |    \\    [world stock exchange]   
                         |                  |     \\                            
                         |                  |      o-M-------R--------o         
[galactic cybersystems]  G               35 x                                   
                         |                      [watchdog security]             
                         |                                                      
                      67 o                                                      
                                                                                
                                    [the slums] P                               `;
Cities[CityName.Chongqing].asciiArt = `
                                    |                                           
                                 75 o                                           
                                     \\                                         
                                      o 76                                      
                            7 |       |                                         
                              |       + 77                                      
       [world stock exchange] F       |                                         
                               \\      o 78      [kuaigong international]       
                                \\    /                                         
                         38 o----x--x------x------A------G--                    
                           /    39  |      41             [church]  
                       37 o         + 79    o--x--x-C-0                         
                         /          |      /                                    
                        /     x-----+-----x-----0   [hospital]                  
[solaris space system] B            |                                           
                       |            + 80                                        
                       |            |                                           
                    34 o            E [travel agency]                           
                                    |                                           
                                    |                                           
                                    x 82                                        
             [the slums] D                                                      `;
Cities[CityName.Ishima].asciiArt = `
                                          o 59                                  
                  o        o              |                                     
 [storm tech.]    |        |              G [world stock exchange]              
                  |        |         28   |                                     
     23 o--C------o--------+----x----o    |                                     
       /         / 25      |   27     \\   x 57                                 
      /         /          |           \\  |                                    
     /         /           |            \\ |                                    
    o 22      o            |             \\| 29/56                              
              |            |              o                                     
              | [hospital] D             / \\      3       2      1             
              o            |            /   \\     o-------x------o             
             /             o           /     \\   /                             
   48 o     /                      55 x       \\ /                              
       \\   /                         /         x                               
        \\ /         [nova medical]  /      4/30 \\                             
      49 x                         A             \\                             
        / \\                       /               \\                           
       /   \\    [travel agency]  F                 o 31                        
      /     \\           51      /                                              
     /       o----B------x-----o                                                
    o      50                  52                                               
              [omega soft.]                                                     
                                       [the slums] E                            `;
Cities[CityName.NewTokyo].asciiArt = `
                                                                                
                                                                                
                  o                                                             
                   \\                                                           
                    \\    [defcomm]                                             
                     \\                                                         
                      o--x---A--x--o [travel agency]                            
                      7  8     10   G                                           
             [vitalife]              o 12   [global pharmaceuticals]            
                                     |                                          
               o--D-x----x-------x-C-+--------x--x-B-x---x-o                    
                   21   22      23    \\      24 25  26  27                     
                                       \\                                       
                          [noodle bar]  x 14                                    
                                         \\                                     
                                          \\                                    
                    [hospital]             o 15 [world stock exchange]          
                                           |                                    
                  o--x--E--x-----x-----x---+---x----x--H--x-o                   
                                           |                                    
                                           |                                    
                                           o 17                                 
                                                                                
                                                                                
                                                                                
                                           F  [the slums]                       
                                                                                `;
Cities[CityName.Sector12].asciiArt = `
          78                                                     o 97           
          o                               [icarus microsystems] /               
          N [powerhouse gym]  o                                I                
    1     |                   |                               /                 
    o-----+---x----o 4        A [alpha ent.]     o-------o   /                  
          |   3     \\         |                           \\ /                 
          |          \\        |     [iron gym]             x 95                
     (79) x           \\       |                           / \\                 
          |            o-E----+----x----J--o 10          /   o----T--o          
          |                   |    8        \\        94 x                      
       80 x       [city hall] |              x 11      /  [world stock exchange]
          |                   |               \\       /                        
          |                   C [cia]          \\     /                         
          Q  [hospital]       |                 F   P [universal energy]        
          |                   o      [deltaone]  \\ /                           
          |                          35 o---------x 13/92/36                    
          L  [megacorp]  33            /         / \\                           
          |              o------------o 34      /   \\                          
 (29)     |             /    [carmichael sec.] D     \\                         
    o-----+-----x------o                      /       O [rothman university]    
          |     31     32              [nsa] M                                  
          |                                 /                                   
          B [blade industries]             H                                    
          |                               / [four sigma]                        
          |      [joe's guns]            /                                      
          |                             /                                       
       85 o--G--------K--------S-------o 88                [the slums] R        
                                                                                
          [foodnstuff]     [travel agency]                                      `;
Cities[CityName.Volhaven].asciiArt = `
                                 [omnia cybersystems]                           
                   17         66               68                               
                  o            o------G-------o                                 
                   \\          /                \\                              
                    \\        o 65               o 69                           
      [syscore sec.] H       |                  |                               
                      \\      |                  |     [millenium fitness gym]  
                       \\     |  21 22   23  24  |     26                       
                        o----+--x--x----x---x---+-----x-------D-----o           
                      19     |                  |                   28          
                             |                  F [omnitek inc.]                
                  [hospital] J 63               o                               
                             |                 / 72                             
                   3         |    5     6     /                 9               
                    o--------+----x-----x----+----------M-------o               
                   /         |               |                                  
                  /       61 x [helios labs] B    [world stock exchange]        
 [travel agency] L           |               |                                  
                /            |               o                                  
               /             E [nwo]        / 75                                
              /  [computek]  |             /                                    
             /       A-------o------I-----o                                     
          1 o                |            |                                     
                             |    [zb]    o 77                                  
                  [lexocorp] C                                                  
                             |                                                  
                             o                                                  
                            57                                                  
                                                                                
                                                                                
                                     [the slums] K                              `;

// Then construct all locations, and add them to the cities as we go.
for (const metadata of LocationsMetadata) {
  const loc = constructLocation(metadata);

  const cityName = loc.city;
  if (cityName === null) {
    // Generic location, add to all cities
    for (const city in Cities) {
      Cities[city].addLocation(loc.name);
    }
  } else {
    Cities[cityName].addLocation(loc.name);
  }
}
