/* BitNode.js */

BitNodes = {
    BitNode1:   new BitNode(1, "Source Genesis", "The original BitNode"),
    BitNode2:   new BitNode(2, "Rise of the Underworld", "COMING SOON"),    //Gangs
    BitNode3:   new BitNode(3, "The Price of Civilization", "COMING SOON"), //Corporate Warfare, Run own company
    BitNode4:   new BitNode(4, "The Singularity", "COMING SOON"),           //Everything automatable
    BitNode5:   new BitNode(5, "2084", "COMING SOON"),                      //Big Brother
    BitNode6:   new BitNode(6, "Hacktocracy", "COMING SOON"),               //Healthy Hacknet balancing mechanic
    BitNode7:   new BitNode(7, "Do Androids Dream?", "COMING SOON"),        //Build androids for automation
    BitNode8:   new BitNode(8, "Ghost of Wall Street", "COMING SOON"),      //Trading only viable strategy
    BitNode9:   new BitNode(9, "MegaCorp", "COMING SOON"),                  //Single corp/server with increasing difficulty
    BitNode10:  new BitNode(10, "Wasteland", "COMING SOON"),                //Postapocalyptic
    BitNode11:  new BitNode(11, "The Big Crash", "COMING SOON"),            //Crashing economy
    BitNode12:  new BitNode(12, "Eye of the World", "COMING SOON"),         //Become AI
}

function BitNode(n, name, desc="", info="") {
    this.number = n;
    this.name = name;
    this.desc = desc;
    this.info = info;
}