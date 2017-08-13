/* Literature.js
 *  Lore / world building literature that can be found on servers
 */
function Literature(title, filename, txt) {
    this.title      = title;
    this.fn         = filename;
    this.txt        = txt;
}

Literature.prototype.display = function() {
    var txt = this.title + "<br><br>" +
              "<i>" + this.txt + "</i>";
    dialogBoxCreate(txt);
}

Literature.prototype.addToserver = function(server) {
    if (server == null) {
        console.log("WARNING: Could not locate server");
        return;
    }
    server.messages.push(this);
}

Literature.prototype.toJSON = function() {
    return Generic_toJSON("Literature", this);
}

Literature.fromJSON = function(value) {
    return Generic_fromJSON(Literature, value.data);
}

Reviver.constructors.Literature = Literature;

Literatures = {}

function initLiterature() {
    var title, fn, txt;
    title   = "A Green Tomorrow"; //Tomorrow is Green
    fn      = "A-Green-Tomorrow.lit";
    txt     = "In the past few decades, there has been a massive global movement towards the generation of renewable energy in an effort to" +
              "combat global warming and climate change. The shift towards renewable energy was a big success";
    Literatures[fn] = new Literature(title, fn);
    title = "Alpha and Omega"; //Cryptic article about BitNodes
    title = "Are we living in a simulated reality?"; //lol
    title = "Beyond Man"; //Better than nature?
    title = "Brighter than the Sun"; // Article about TaiYang Digital
    title = "Democracy is Dead: The Fall of an Empire"; //Government is a powerless figurehead, megacorporation rule
    title = "Fall of an Empire";
    title = "Figures show rising crime rates in Sector-12"; //Article about the Syndicate
    title = "Man and the Machine"; //Blurring the Boundaries between Man and the Machine
    title = "Secret Societies"; //Talks about how hacking factions have replaced typical secret societies like Illuminati
    title = "Space: The Failed Frontier"; //A Frontier too far?
    title = "Coded Intelligence: Myth or Reality?"; //Discusses whether true intelligence can be implemented in software. Foreshadows intelligence stat in later BItnodes
    title = "Synthetic Muscles"; //Artificial muscles
    title = "Tensions rise in global tech race"; //Article about competition+conflict between tech mega corps (OmniTek, ECorp..Taiyang? etc.)
    title = "The Cost of Immortality"; //Grey Skies
    title = "The Hidden World"; //The Sleepwalking World
    title = "The New God"; //Singularity Church of the MachineGod
    title = "The New Triads"; //About tetrads, Dragon Heads: The Triads of the 21st Century
    title = "The Secret War"; //War between those who wanted Augmentations widely available and those who wanted to keep it secret
    title = "An uncertain future for Defense Contractors"; //Less war and globalism = less profit for defense contractors
}
