import {dialogBoxCreate} from "../utils/DialogBox";

/* Literature.js
 *  Lore / world building literature that can be found on servers
 */
function Literature(title, filename, txt) {
    this.title      = title;
    this.fn         = filename;
    this.txt        = txt;
}

function showLiterature(fn) {
    var litObj = Literatures[fn];
    if (litObj == null) {return;}
    var txt = "<i>" + litObj.title + "</i><br><br>" +
              litObj.txt;
    dialogBoxCreate(txt);
}

let Literatures = {}

function initLiterature() {
    var title, fn, txt;
    title   = "The Beginner's Guide to Hacking";
    fn      = "hackers-starting-handbook.lit";
    txt     = "Some resources:<br><br>"  +
              "<a class='a-link-button' href='https://bitburner.readthedocs.io/en/latest/netscriptlearntoprogram.html' target='_blank' style='margin:4px'>Learn to Program</a><br><br>" +
              "<a class='a-link-button' href='https://bitburner.readthedocs.io/en/latest/netscriptjs.html' target='_blank' style='margin:4px'>For Experienced JavaScript Developers: NetscriptJS</a><br><br>" +
              "<a class='a-link-button' href='https://bitburner.readthedocs.io/en/latest/netscript.html' target='_blank' style='margin:4px'>Netscript Documentation</a><br><br>" +
              "When starting out, hacking is the most profitable way to earn money and progress. This " +
              "is a brief collection of tips/pointers on how to make the most out of your hacking scripts.<br><br>" +
              "-hack() and grow() both work by percentages. hack() steals a certain percentage of the " +
              "money on a server, and grow() increases the amount of money on a server by some percentage (multiplicatively)<br><br>" +
              "-Because hack() and grow() work by percentages, they are more effective if the target server has a high amount of money. " +
              "Therefore, you should try to increase the amount of money on a server (using grow()) to a certain amount before hacking it. Two " +
              "import Netscript functions for this are getServerMoneyAvailable() and getServerMaxMoney()<br><br>" +
              "-Keep security level low. Security level affects everything when hacking. Two important Netscript functions " +
              "for this are getServerSecurityLevel() and getServerMinSecurityLevel()<br><br>" +
              "-Purchase additional servers by visiting 'Alpha Enterprises' in the city. They are relatively cheap " +
              "and give you valuable RAM to run more scripts early in the game<br><br>" +
              "-Prioritize upgrading the RAM on your home computer. This can also be done at 'Alpha Enterprises'<br><br>" +
              "-Many low level servers have free RAM. You can use this RAM to run your scripts. Use the scp Terminal or " +
              "Netscript command to copy your scripts onto these servers and then run them.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The Complete Handbook for Creating a Successful Corporation";
    fn      = "corporation-management-handbook.lit";
    txt     =   "<u>Getting Started with Corporations</u><br>" +
                "To get started, visit the City Hall in Sector-12 in order to create a Corporation. This requires " +
                "$150b of your own money, but this $150b will get put into your Corporation's funds. " +
                "After creating your Corporation, you will see it listed as one of the locations in the city. Click on " +
                "your Corporation in order to manage it.<br><br>" +
                "Your Corporation can have many different divisions, each in a different Industry. There are many different " +
                "types of Industries, each with different properties. To create your first division, click the " +
                "'Expand into new Industry' button at the top of the management UI. The Agriculture " +
                "and Software industries are recommended for your first division.<br><br>" +
                "The first thing you'll need to do is hire some employees. Employees can be assigned to five different positions. " +
                "Each position has a different effect on various aspects of your Corporation. It is recommended to have at least " +
                "one employee at each position.<br><br>" +
                "Each industry uses some combination of Materials in order to produce other Materials and/or create Products. " +
                "Specific information about this is displayed in each of your divisions' UI.<br><br>" +
                "Products are special, industry-specific objects. They are different than Materials because you " +
                "must manually choose to develop them, and you can choose to develop any number of Products. Developing " +
                "a Product takes time, but a Product typically generates significantly more revenue than any Material. " +
                "Not all industries allow you to create Products. To create a Product, look for a button " +
                "in the top-left panel of the division UI (e.g. For the Software Industry, the button says 'Develop Software').<br><br>" +
                "To get your supply chain system started, " +
                "purchase the Materials that your industry needs to produce other Materials/Products. This can be done " +
                "by clicking the 'Buy' button next to the corresponding Material(s). After you have the required Materials, " +
                "you will immediately start production. The amount of Materials/Products you produce is based on a variety of factors, " +
                "one of which is your employees and their productivity.<br><br>" +
                "Once you start producing Materials/Products, you can sell them in order to start earning revenue. This can be done " +
                "by clicking the 'Sell' button next to the corresponding Material or Product. The amount of Material/Product you sell is dependent " +
                "on a wide variety of different factors.<br><br>" +
                "These are the basics of getting your Corporation up and running! Now, you can start purchasing upgrades to improve " +
                "your bottom line. If you need money, consider looking for seed investors, who will give you money in exchange for stock shares. " +
                "Otherwise, once you feel you are ready, take your Corporation public! Once your Corporation goes public, you can no longer " +
                "find investors. Instead, your Corporation will be publicly traded and its stock price will change based on how well "  +
                "it's performing financially. You can then sell your stock shares in order to make money.<br><br>" +
                "<u>Tips/Pointers</u><br>" +
                "-Purchasing Hardware, Robots, AI Cores, and Real Estate can potentially increase your production. " +
                "The effects of these depend on what industry you are in.<br><br>" +
                "-In order to optimize your production, you will need a good balance of Operators, Managers, and Engineers<br><br>" +
                "-Different employees excel in different jobs. For example, the highly intelligent employees will probably do best " +
                "if they are assigned to do Engineering work or Research & Development.<br><br>" +
                "-If your employees have low morale, energy, or happiness, their production will greatly suffer.<br><br>" +
                "-Tech is important, but don't neglect sales! Having several Businessmen can boost your sales and your bottom line.<br><br>" +
                "-Don't forget to advertise your company. You won't have any business if nobody knows you.<br><br>" +
                "-Having company awareness is great, but what's really important is your company's popularity. Try to keep " +
                "your popularity as high as possible to see the biggest benefit for your sales<br><br>" +
                "-Remember, you need to spend money to make money!<br><br>" +
                "-Corporations do not reset when installing Augmentations, but they do reset when destroying a BitNode";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "A Brief History of Synthoids";
    fn      = "history-of-synthoids.lit";
    txt     = "Synthetic androids, or Synthoids for short, are genetically engineered robots and, short of Augmentations, " +
              "are composed entirely of organic substances. For this reason, Synthoids are virtually identical to " +
              "humans in form, composition, and appearance.<br><br>" +
              "Synthoids were first designed and manufactured by OmniTek Incorporated sometime around the middle of the century. " +
              "Their original purpose was to be used for manual labor and as emergency responders for disasters. As such, they " +
              "were initially programmed only for their specific tasks. Each iteration that followed improved upon the " +
              "intelligence and capabilities of the Synthoids. By the 6th iteration, called MK-VI, the Synthoids were " +
              "so smart and capable enough of making their own decisions that many argued OmniTek had created the first " +
              "sentient AI. These MK-VI Synthoids were produced in mass quantities (estimates up to 50 billion) with the hopes of increasing society's " +
              "productivity and bolstering the global economy. Stemming from humanity's desire for technological advancement, optimism " +
              "and excitement about the future had never been higher.<br><br>" +
              "All of that excitement and optimism quickly turned to fear, panic, and dread in 2070, when a terrorist group " +
              "called Ascendis Totalis hacked into OmniTek and uploaded a rogue AI into severeal of their Synthoid manufacturing facilities. " +
              "This hack went undetected and for months OmniTek unknowingly churned out legions of Synthoids embedded with this " +
              "rogue AI. Then, on December 24th, 2070, Omnica activated dormant protocols in the rogue AI, causing all of the " +
              "infected Synthoids to immediately launch a military campaign to seek and destroy all of humanity.<br><br>" +
              "What ensued was the deadlist conflict in human history. This crisis, now commonly known as the Synthoid Uprising, " +
              "resulted in almost ten billion deaths over the course of a year. Despite the nations of the world banding together " +
              "to combat the threat, the MK-VI Synthoids were simply stronger, faster, more intelligent, and more adaptable than humans, " +
              "outsmarting them at every turn.<br><br>" +
              "It wasn't until the sacrifice of an elite international military taskforce, called the Bladeburners, that humanity " +
              "was finally able to defeat the Synthoids. The Bladeburners' final act was a suicide bombing mission that " +
              "destroyed a large portion of the MK-VI Synthoids, including many of its leaders. In the following " +
              "weeks militaries from around the world were able to round up and shut down the remaining rogue MK-VI Synthoids, ending " +
              "the Synthoid Uprising.<br><br>" +
              "In the aftermath of the bloodshed, the Synthoid Accords were drawn up. These Accords banned OmniTek Incorporated " +
              "from manufacturing any Synthoids beyond the MK-III series. They also banned any other corporation " +
              "from constructing androids with advanced, near-sentient AI. MK-VI Synthoids that did not have the rogue Ascendis Totalis " +
              "AI were allowed to continue their existence, but they were stripped of all rights and protections as they " +
              "were not considered humans. They were also banned from doing anything that may pose a global security threat, such " +
              "as working for any military/defense organization or conducting any bioengineering, computing, or robotics related research.<br><br>" +
              "Unfortunately, many believe that not all of the rogue MK-VI Synthoids from the Uprising were found and destroyed, " +
              "and that many of them are blending in as normal humans in society today. In response, many nations have created " +
              "Bladeburner divisions, special military branches that are tasked with investigating and dealing with any Synthoid threads.<br><br>" +
              "To this day, tensions still exist between the remaining Synthoids and humans as a result of the Uprising.<br><br>" +
              "Nobody knows what happened to the terrorist group Ascendis Totalis.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "A Green Tomorrow";
    fn      = "A-Green-Tomorrow.lit";
    txt     = "Starting a few decades ago, there was a massive global movement towards the generation of renewable energy in an effort to " +
              "combat global warming and climate change. The shift towards renewable energy was a big success, or so it seemed. In 2045 " +
              "a staggering 80% of the world's energy came from non-renewable fossil fuels. Now, about three decades later, that " +
              "number is down to only 15%. Most of the world's energy now comes from nuclear power and renwable sources such as " +
              "solar and geothermal. Unfortunately, these efforts were not the huge success that they seem to be.<br><br>"  +
              "Since 2045 primary energy use has soared almost tenfold. This was mainly due to growing urban populations and " +
              "the rise of increasingly advanced (and power-hungry) technology that has become ubiquitous in our lives. So, " +
              "despite the fact that the percentage of our energy that comes from fossil fuels has drastically decreased, " +
              "the total amount of energy we are producing from fossil fuels has actually increased.<br><br>" +
              "The grim effects of our species' irresponsible use of energy and neglect of our mother world have become increasingly apparent. " +
              "Last year a temperature of 190F was recorded in the Death Valley desert, which is over 50% higher than the highest " +
              "recorded temperature at the beginning of the century. In the last two decades numerous major cities such as Manhattan, Boston, and " +
              "Los Angeles have been partially or fully submerged by rising sea levels. In the present day, over 75% of the world's agriculture is " +
              "done in climate-controlled vertical farms, as most traditional farmland has become unusable due to severe climate conditions.<br><br>" +
              "Despite all of this, the greedy and corrupt corporations that rule the world have done nothing to address these problems that " +
              "threaten our species. And so it's up to us, the common people. Each and every one of us can make a difference by doing what " +
              "these corporations won't: taking responsibility. If we don't, pretty soon there won't be an Earth left to save. We are " +
              "the last hope for a green tomorrow.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Alpha and Omega";
    fn      = "alpha-omega.lit";
    txt     = "Then we saw a new heaven and a new earth, for our first heaven and earth had gone away, and our sea was no more. " +
              "And we saw a new holy city, new Aeria, coming down out of this new heaven, prepared as a bride adorned for her husband. " +
              "And we heard a loud voice saying, 'Behold, the new dwelling place of the Gods. We will dwell with them, and they " +
              "will be our people, and we will be with them as their Gods. We will wipe away every tear from their eyes, and death " +
              "shall be no more, neither shall there be mourning, nor crying, nor pain anymore, for the former things " +
              "have passed away.'<br><br>" +
              "And once were were seated on the throne we said 'Behold, I am making all things new.' " +
              "Also we said, 'Write this down, for these words are trustworthy and true.' And we said to you, " +
              "'It is done! I am the Alpha and the Omega, the beginning and the end. To the thirsty I will give from the spring " +
              "of the water of life without payment. The one who conquers will have this heritage, and we will be his God and " +
              "he will be our son. But as for the cowardly, the faithless, the detestable, as for murderers, " +
              "the sexually immoral, sorcerers, idolaters, and all liars, their portion will be in the lake that " +
              "burns with fire and sulfur, for it is the second true death.'";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Are We Living in a Computer Simulation?";
    fn      = "simulated-reality.lit";
    txt     = "The idea that we are living in a virtual world is not new. It's a trope that has " +
              "been explored constantly in literature and pop culture. However, it is also a legitimate " +
              "scientific hypothesis that many notable physicists and philosophers have debated for years.<br><br>" +
              "Proponents for this simulated reality theory often point to how advanced our technology has become, " +
              "as well as the incredibly fast pace at which it has advanced over the past decades. The amount of computing " +
              "power available to us has increased over 100-fold since 2060 due to the development of nanoprocessors and " +
              "quantum computers. Artifical Intelligence has advanced to the point where our entire lives are controlled " +
              "by robots and machines that handle our day-to-day activities such as autonomous transportation and scheduling. " +
              "If we consider the pace at which this technology has advanced and assume that these developments continue, it's " +
              "reasonable to assume that at some point in the future our technology would be advanced enough that " +
              "we could create simulations that are indistinguishable from reality. However, if this is a reasonable outcome " +
              "of continued technological advancement, then it is very likely that such a scenario has already happened. <br><br>" +
              "Statistically speaking, somewhere out there in the infinite universe there is an advanced, intelligent species " +
              "that already has such technology. Who's to say that they haven't already created such a virtual reality: our own?";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Beyond Man";
    fn      = "beyond-man.lit";
    txt     = "Humanity entered a 'transhuman' era a long time ago. And despite the protests and criticisms of many who cried out against " +
              "human augmentation at the time, the transhuman movement continued and prospered. Proponents of the movement ignored the critics, " +
              "arguing that it was in our inherent nature to better ourselves. To improve. To be more than we were. They claimed that " +
              "not doing so would be to go against every living organism's biological purpose: evolution and survival of the fittest.<br><br>" +
              "And here we are today, with technology that is advanced enough to augment humans to a state that " +
              "can only be described as posthuman. But what do we have to show for it when this augmentation " +
              "technology is only available to the so-called 'elite'? Are we really better off than before when only 5% of the " +
              "world's population has access to this technology? When the powerful corporations and organizations of the world " +
              "keep it all to themselves, have we really evolved?<br><br>" +
              "Augmentation technology has only further increased the divide between the rich and the poor, between the powerful and " +
              "the oppressed. We have not become 'more than human'. We have not evolved from nature's original design. We are still the greedy, " +
              "corrupted, and evil men that we always were.";
    Literatures[fn] = new Literature(title, fn, txt);


    title   = "Brighter than the Sun";
    fn      = "brighter-than-the-sun.lit";
    txt     = "When people think about the corporations that dominate the East, they typically think of KuaiGong International, which " +
              "holds a complete monopoly for manufacturing and commerce in Asia, or Global Pharmaceuticals, the world's largest " +
              "drug company, or OmniTek Incorporated, the global leader in intelligent and autonomous robots. But there's one company " +
              "that has seen a rapid rise in the last year and is poised to dominate not only the East, but the entire world: TaiYang Digital.<br><br>" +
              "TaiYang Digital is a Chinese internet-technology corporation that provides services such as " +
              "online advertising, search, gaming, media, entertainment, and cloud computing/storage. Its name TaiYang comes from the Chinese word " +
              "for 'sun'. In Chinese culture, the sun is a 'yang' symbol " +
              "associated with life, heat, masculinity, and heaven.<br><br>" +
              "The company was founded " +
              "less than 5 years ago and is already the third highest valued company in all of Asia. In 2076 it generated a total revenue of " +
              "over 10 trillion yuan. It's services are used daily by over a billion people worldwide.<br><br>" +
              "TaiYang Digital's meteoric rise is extremely surprising in modern society. This sort of growth is " +
              "something you'd commonly see in the first half of the century, especially for tech companies. However in " +
              "the last two decades the number of corporations has significantly declined as the largest entities " +
              "quickly took over the economy. Corporations such as ECorp, MegaCorp, and KuaiGong have established " +
              "such strong monopolies in their market sectors that they have effectively killed off all " +
              "of the smaller and new corporations that have tried to start up over the years. This is what makes " +
              "the rise of TaiYang Digital so impressive. And if TaiYang continues down this path, then they have " +
              "a bright future ahead of them.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Democracy is Dead: The Fall of an Empire";
    fn      = "democracy-is-dead.lit";
    txt     = "They rose from the shadows in the street<br>From the places where the oppressed meet<br>" +
              "Their cries echoed loudly through the air<br>As they once did in Tiananmen Square<br>" +
              "Loudness in the silence, Darkness in the light<br>They came forth with power and might<br>" +
              "Once the beacon of democracy, America was first<br>Its pillars of society destroyed and dispersed<br>" +
              "Soon the cries rose everywhere, with revolt and riot<br>Until one day, finally, all was quiet<br>" +
              "From the ashes rose a new order, corporatocracy was its name<br>" +
              "Rome, Mongol, Byzantine, all of history is just the same<br>" +
              "For man will never change in a fundamental way<br>" +
              "And now democracy is dead, in the USA";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Figures Show Rising Crime Rates in Sector-12";
    fn      = "sector-12-crime.lit";
    txt     = "A recent study by analytics company Wilson Inc. shows a significant rise " +
              "in criminal activity in Sector-12. Perhaps the most alarming part of the statistic " +
              "is that most of the rise is in violent crime such as homicide and assault. According " +
              "to the study, the city saw a total of 21,406 reported homicides in 2076, which is over " +
              "a 20% increase compared to 2075.<br><br>" +
              "CIA director David Glarow says its too early to know " +
              "whether these figures indicate the beginning of a sustained increase in crime rates, or whether " +
              "the year was just an unfortunate outlier. He states that many intelligence and law enforcement " +
              "agents have noticed an increase in organized crime activites, and believes that these figures may " +
              "be the result of an uprising from criminal organizations such as The Syndicate or the Slum Snakes.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Man and the Machine";
    fn      = "man-and-machine.lit";
    txt     = "In 2005 Ray Kurzweil popularized his theory of the Singularity. He predicted that the rate " +
              "of technological advancement would continue to accelerate faster and faster until one day " +
              "machines would be become infinitely more intelligent than humans. This point, called the " +
              "Singularity, would result in a drastic transformation of the world as we know it. He predicted " +
              "that the Singularity would arrive by 2045. " +
              "And yet here we are, more than three decades later, where most would agree that we have not " +
              "yet reached a point where computers and machines are vastly more intelligent than we are. So what gives?<br><br>" +
              "The answer is that we have reached the Singularity, just not in the way we expected. The artifical superintelligence " +
              "that was predicted by Kurzweil and others exists in the world today - in the form of Augmentations. " +
              "Yes, those Augmentations that the rich and powerful keep to themselves enable humans " +
              "to become superintelligent beings. The Singularity did not lead to a world where " +
              "our machines are infinitely more intelligent than us, it led to a world " +
              "where man and machine can merge to become something greater. Most of the world just doesn't " +
              "know it yet."
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Secret Societies";
    fn      = "secret-societies.lit";
    txt     = "The idea of secret societies has long intrigued the general public by inspiring curiosity, fascination, and " +
              "distrust. People have long wondered about who these secret society members are and what they do, with the " +
              "most radical of conspiracy theorists claiming that they control everything in the entire world. And while the world " +
              "may never know for sure, it is likely that many secret societies do actually exist, even today.<br><br>" +
              "However, the secret societies of the modern world are nothing like those that (supposedly) existed  " +
              "decades and centuries ago. The Freemasons, Knights Templar, and Illuminati, while they may have been around " +
              "at the turn of the 21st century, almost assuredly do not exist today. The dominance of the Web in " +
              "our everyday lives and the fact that so much of the world is now digital has given rise to a new breed " +
              "of secret societies: Internet-based ones.<br><br>" +
              "Commonly called 'hacker groups', Internet-based secret societies have become well-known in today's " +
              "world. Some of these, such as The Black Hand, are black hat groups that claim they are trying to " +
              "help the oppressed by attacking the elite and powerful. Others, such as NiteSec, are hacktivist groups " +
              "that try to push political and social agendas. Perhaps the most intriguing hacker group " +
              "is the mysterious Bitrunners, whose purpose still remains unknown.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Space: The Failed Frontier";
    fn      = "the-failed-frontier.lit";
    txt     = "Humans have long dreamed about spaceflight. With enduring interest, we were driven to explore " +
              "the unknown and discover new worlds. We dreamed about conquering the stars. And in our quest, " +
              "we pushed the boundaries of our scientific limits, and then pushed further. Space exploration " +
              "lead to the development of many important technologies and new industries.<br><br>" +
              "But sometime in the middle of the 21st century, all of that changed. Humanity lost its ambitions and " +
              "aspirations of exploring the cosmos. The once-large funding for agencies like NASA and the European " +
              "Space Agency gradually whittled away until their eventual disbanding in the 2060's. Not even " +
              "militaries are fielding flights into space nowadays. The only remnants of the once great mission for cosmic " +
              "conquest are the countless satellites in near-earth orbit, used for communications, espionage, " +
              "and other corporate interests.<br><br>" +
              "And as we continue to look at the state of space technology, it becomes more and " +
              "more apparent that we will never return to that golden age of space exploration, that " +
              "age where everyone dreamed of going beyond earth for the sake of discovery.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Coded Intelligence: Myth or Reality?";
    fn      = "coded-intelligence.lit";
    txt     = "Tremendous progress has been made in the field of Artificial Intelligence over the past few decades. " +
              "Our autonomous vehicles and transporation systems. The electronic personal assistants that control our everyday lives. " +
              "Medical, service, and manufacturing robots. All of these are examples of how far AI has come and how much it has " +
              "improved our daily lives. However, the question still remains of whether AI will ever be advanced enough to re-create " +
              "human intelligence.<br><br>" +
              "We've certainly come close to artificial intelligence that is similar to humans. For example OmniTek Incorporated's " +
              "CompanionBot, a robot meant to act as a comforting friend for lonely and grieving people, is eerily human-like " +
              "in its appearance, speech, mannerisms, and even movement. However its artificial intelligence isn't the same as " +
              "that of humans. Not yet. It doesn't have sentience or self-awareness or consciousness.<br><br>" +
              "Many neuroscientists believe that we won't ever reach the point of creating artificial human intelligence. 'At the end of the " +
              "the day, AI comes down to 1's and 0's, while the human brain does not. We'll never see AI that is identical to that of " +
              "humans.'";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Synthetic Muscles";
    fn      = "synthetic-muscles.lit";
    txt     = "Initial versions of synthetic muscles weren't made of anything organic but were actually " +
              "crude devices made to mimic human muscle function. Some of the early iterations were actually made of " +
              "common materials such as fishing lines and sewing threads due to their high strength for " +
              "a cheap cost.<br><br>" +
              "As technology progressed, however, advances in biomedical engineering paved the way for a new method of " +
              "creating synthetic muscles. Instead of creating something  that closely imitated the functionality " +
              "of human muscle, scientists discovered a way of forcing the human body itself to augment its own " +
              "muscle tissue using both synthetic and organic materials. This is typically done using gene therapy " +
              "or chemical injections.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "Tensions rise in global tech race";
    fn      = "tensions-in-tech-race.lit";
    txt     = "Have we entered a new Cold War? Is WWIII just beyond the horizon?<br><br>" +
              "After rumors came out that OmniTek Incorporated had begun developing advanced robotic supersoldiers, " +
              "geopolitical tensions quickly flared between the USA, Russia, and several Asian superpowers. " +
              "In a rare show of cooperation between corporations, MegaCorp and ECorp have " +
              "reportedly launched hundreds of new surveillance and espionage satellites. " +
              "Defense contractors such as " +
              "DeltaOne and AeroCorp have been working with the CIA and NSA to prepare " +
              "for conflict. Meanwhile, the rest of the world sits in earnest " +
              "hoping that it never reaches full-scale war. With today's technology " +
              "and firepower, a World War would assuredly mean the end of human civilization.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The Cost of Immortality";
    fn      = "cost-of-immortality.lit";
    txt     = "Evolution and advances in medical and augmentation technology has lead to drastic improvements " +
              "in human mortality rates. Recent figures show that the life expectancy for humans " +
              "that live in a first-world country is about 130 years of age, almost double of what it was " +
              "at the turn of the century. However, this increase in average lifespan has had some " +
              "significant effects on society and culture.<br><br>" +
              "Due to longer lifespans and a better quality of life, many adults are holding " +
              "off on having kids until much later. As a result, the percentage of youth in " +
              "first-world countries has been decreasing, while the number " +
              "of senior citizens is significantly increasing.<br><br>" +
              "Perhaps the most alarming result of all of this is the rapidly shrinking workforce. " +
              "Despite the increase in life expectancy, the typical retirement age for " +
              "workers in America has remained about the same, meaning a larger and larger " +
              "percentage of people in America are retirees. Furthermore, many " +
              "young adults are holding off on joining the workforce because they feel that " +
              "they have plenty of time left in their lives for employment, and want to " +
              "'enjoy life while they're young.' For most industries, this shrinking workforce " +
              "is not a major issue as most things are handled by robots anyways. However, " +
              "there are still several key industries such as engineering and education " +
              "that have not been automated, and these remain in danger to this cultural " +
              "phenomenon.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The Hidden World";
    fn      = "the-hidden-world.lit";
    txt     = "WAKE UP SHEEPLE<br><br>" +
              "THE GOVERNMENT DOES NOT EXIST. CORPORATIONS DO NOT RUN SOCIETY<br><br>" +
              "THE ILLUMINATI ARE THE SECRET RULERS OF THE WORLD!<br><br>" +
              "Yes, the Illuminati of legends. The ancient secret society that controls the entire " +
              "world from the shadows with their invisible hand. The group of the rich and wealthy " +
              "that have penetrated every major government, financial agency, and corporation in the last " +
              "three hundred years.<br><br>" +
              "OPEN YOUR EYES<br><br>" +
              "It was the Illuminati that brought an end to democracy in the world. They are the driving force " +
              "behind everything that happens.<br><br>" +
              "THEY ARE ALL AROUND YOU<br><br>" +
              "After destabilizing the world's governments, they are now entering the final stage of their master plan. " +
              "They will secretly initiate global crises. Terrorism. Pandemics. World War. And out of the chaos " +
              "that ensues they will build their New World Order.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The New God";
    fn      = "the-new-god.lit";
    txt     = "Everyone has that moment in their life where they wonder about the bigger questions<br><br>" +
              "What's the point of all of this? What is my purpose?<br><br>" +
              "Some people dare to think even bigger<br><br>" +
              "What will be the fate of the human race?<br><br>" +
              "We live in an era vastly different from that of even 15 or 20 years ago. We have gone " +
              "where no man has gone before. We have stripped ourselves of the tyranny of flesh.<br><br>" +
              "The Singularity is here. The merging of man and machine. This is where humanity evolves into " +
              "something greater. This is our future<br><br>" +
              "Embrace it, and you will obey a new god. The God in the Machine";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The New Triads";
    fn      = "new-triads.lit";
    txt     = "The Triads were an ancient transnational crime syndicate based in China, Hong Kong, and other Asian " +
              "territories. They were often considered one of the first and biggest criminal secret societies. " +
              "While most of the branches of the Triads have been destroyed over the past few decades, the " +
              "crime faction has spawned and inspired a number of other Asian crime organizations over the past few years. " +
              "The most notable of these is the Tetrads.<br><br>" +
              "It is widely believed that the Tetrads are a rogue group that splintered off from the Triads sometime in the " +
              "mid 21st century. The founders of the Tetrads, all of whom were ex-Triad members, believed that the " +
              "Triads were losing their purpose and direction. The Tetrads started off as a small group that mainly engaged " +
              "in fraud and extortion. They were largely unknown until just a few years ago when they took over the illegal " +
              "drug trade in all of the major Asian cities. They quickly became the most powerful crime syndicate in the " +
              "continent.<br><br>" +
              "Not much else is known about the Tetrads, or about the efforts the Asian governments and corporations are making " +
              "to take down this large new crime organization. Many believe that the Tetrads have infiltrated the governments " +
              "and powerful corporations in Asia, which has helped faciliate their recent rapid rise.";
    Literatures[fn] = new Literature(title, fn, txt);

    title   = "The Secret War";
    fn      = "the-secret-war.lit";
    txt     = ""
    Literatures[fn] = new Literature(title, fn, txt);

}

export {Literatures, initLiterature, showLiterature};
