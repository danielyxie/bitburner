Hacking algorithms
==================

There are three primary families of hacking algorithms. This guide will go over each of them and advise on how they can be implemented.

Self-contained algorithms
-------------------------
**Difficulty**: Easy  

Pros:   

* Easy to implement
* Does not require other scripts to work
* Works at any stage of the game

Cons:  

* Limits income generation
* Extremely RAM inefficient
* Utilizes script online time poorly
* Risk of over hacking

Self-contained algorithms are the simplest family of hacking algorithms to implement. Each script is tasked with choosing which function to execute based on the status of the target server. Because of this, they guarantee a consistent, but relatively small, flow of money. 

The general logic goes like this:

    .. code-block:: javascript

        loop forever {
            if security is not minimum {
                weaken(target)
            } else if money is not maximum {
                grow(target)
            } else {
                hack(target)
            }
        }

This algorithm is perfectly capable of paving the way through the majority of the game, but it has a few significant issues.

- It tends to make all your scripts on every server do the same thing. (e.g. If the target is 0.01 security above the minimum, all scripts will decide to weaken, when only a handful of threads should be devoted to the task)
- At higher thread counts, these scripts have the potential to hack the server to $0, or maximum security, requiring a long setup time while the scripts return the server to the best stats.
- Requires function calls such as `getServerSecurityLevel()` and `getServerMoneyAvailable()`, as well as calling all three hacking functions, increasing RAM cost which is multiplied by the number of allocated threads
   
Loop algorithms
---------------
**Difficulty**: Easy to Medium

Pros: 

* Simple to understand
* Works at any stage of the game
* Maximize RAM usage

Cons:

* Requires a script that handles deployment

By splitting our hack, weaken, and grow functions into three separate scripts, we can both remove our reliance on functions such as `getServerSecurityLevel()` as well as removing functions that cannot work concurrently, reducing RAM requirements, and thus increasing our thread limits. Loop scripts are formatted like this:

    .. code-block:: javascript

        loop forever {
            hack(target) // or grow, or weaken
        }

Now we can take the total amount of threads available and split it and allocate, for example:

- 1 part to the hack scripts
- 10 parts to the grow scripts
- 2 parts to the weaken scripts

Meaning if we have space for 100 threads across the entire network 7 threads will go to the hack scripts, 76 threads will go to the grow scripts and 15 threads will go to the weaken scripts. The ratios described here are arbitrary and can be greatly improved through the use of the analyze functions, and later, through the use of Formulas.exe.

When utilizing this strategy, monitor the amount of money and security on the target server, if the money is not hovering around maximum and the security around the minimum, the ratios should be tweaked until that is the case.

Growth can be made more efficient by dividing it into many processes, instead of one script with a high thread count. Four grow scripts with 20 threads will outperform one grow script with 80 threads.

Utilizing `sleep()` or `asleep()` to ensure that your scripts do not all start at the same time can decrease the chance of issues associated with overhacking occurring. Both functions have a ram cost of zero.

Batch algorithms (HGW, HWGW, or Cycles)
---------------------------------------
**Difficulty**: Hard

Pros:

* Maximum potential income

Cons:

* Very difficult to implement without prior programming knowledge
* Very difficult to make work on servers with less than 1TB of RAM

Batch algorithms utilize a master script that uses `exec()` many scripts which utilize a relevant hacking function in batches.

The scripts used to execute the hacking functions are even simpler than the previous algorithms but a complex controller is required to calculate the effect, time taken, and the necessary delay.

    .. code-block:: javascript

        sleep(a bit)
        hack(target) // or grow, or weaken

A few things need to be known before this algorithm can be implemented:

- The effects of hack and grow depend on the server security level, a higher security level results in a reduced effect. You only want these effects to occur when the security level is minimized.
- The time taken to execute hack, grow, or weaken is determined when the function is called and is based on the security level of the target server and your hacking level. You only want these effects to start when the security level is minimized.
- The effects of hack, grow, and weaken, are determined when the time is completed, rather than at the beginning. Hack should finish when security is minimum and money is maximum. Grow should finish when security is minimum, shortly after a hack occurred. Weaken should occur when security is not at a minimum due to a hack or grow increasing it.

A single batch consists of four actions:

1. A hack script removes a predefined, precalculated amount of money from the target server.
2. A weaken script counters the security increase of the hack script.
3. A grow script counters the money decrease caused by the hack script.
4. A weaken script counters the security increase caused by the grow script.

It is also important that these 4 scripts finish in the order specified above, and all of their effects be precalculated to optimize the ratios between them. This is the reason for the delay in the scripts. 

It is possible to create batches with 3 scripts (HGW) but the efficiency of grow will be harmed by the security increase caused by the hack scripts.

The following is an image demonstrating batches in action:

.. image:: batch.png

Batches only function predictably when the target server is at minimum security and maximum money, so your script must also handle preparing a server for your batches. You can utilize batches to prepare a server by using no hack threads during preparation.

Depending on your computer's performance as well as a few other factors, the necessary delay between script execution times may range between 20ms and 200ms, you want to fine-tune this value to be as low as possible while also avoiding your scripts finishing out of order. Anything lower than 20ms will not work due to javascript limitations.
