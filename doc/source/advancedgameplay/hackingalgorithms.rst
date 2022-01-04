

Hacking algorithms
==================

There are 3 main family of hacking algorithms. This guide will go over each of them and give advice on how to
implement them.

Self-contained algorithms
-------------------------

Implementation difficulty: Easy

pros: 

* Easy to implement
* Does not require other scripts to work
* Works at any stage of the game

cons:

* Limits income generation
* Very inefficient with ram
* Makes poor use of your script online time.

This family of algorithms are the simplest to implement they are called self-contained because a single script
contains everything needed to maintain a constant flow of money.

The general logic goes like this:

    .. code-block:: javascript

        for ever {
            if security is not minimum {
                weaken(target)
            } else if money is not maximum {
                grow(target)
            } else {
                hack(target)
            }
        }

This is a perfectly fine algorithm to start with and can get you through most of the game. But it does have
some very serious issues.

- It tends to make all your scripts on every server do the same thing.
  This means if you are 0.01 security above minimum most scripts will be doing a weaken when only a
  handful of thread should be.
- At higher thread count it can drain a server of all it's money in 1 hack(). Recovering from $0 is
  possible but extremely slow.
- It makes very poor use of the servers RAM. To implement this you will need to call functions like
  getServerSecurityLevel and that functions ram cost will be multiplied by the number of thread.
   
loop algorithms
---------------

Implementation difficulty: Easy to Medium.

pros: 

* Simple to understand
* Works at any stage of the game
* Maximize RAM usage.

cons:

* Support scripts are required to make things easy.

We can kill 2 birds with 1 stone from the previous algorithm by splitting our 3 main functions into 3 files

    .. code-block:: javascript

        for ever {
            hack(target) // or grow, or weaken
        }

Now we take the total amount of thread available and split it. We allocate:
- 1 part to the hack script.
- 10 part to the grow script.
- 2 part to the weaken script.

Meaning if we have room for 100 thread across all network 7 thread will go to hack, 76 thread to grow and 15 to weaken.
These ratios are arbitrary and can be improved but this is generally a good idea.

Carefull when applying this algorithm that you monitor the amount of money in the server, it should hover around maximum.
For that reason it may be wise to start the hack script later than the grow / weaken. If you find that the ratio is not
right feel free to modify it.

To some extent it's better to split the grow processes into smaller parts.
4 process with 20 thread each is better than 1 process with 80 threads.

It can be useful to add a delay to your scripts in order to prevent them from all starting at the same time.
The sleep function has no RAM cost.

batch algorithms (aka hwgw or cycles)
-------------------------------------

Implementation difficulty: Hard

pros: 

* Maximize money

cons:

* Very hard to implement
* Does not work well without a large player bought server.

Batch algorithms are so called because you have a master script that `exec` a lot of other scripts in batches.

The basic building blocks are even simpler than the previous algorithm but a controller is required and is much
more complex.

    .. code-block:: javascript

        sleep(a bit)
        hack(target) // or grow, or weaken

We need to know a couple of things before we can implement this algorithm.

- The effect of hack / grow depends on the server security.
- The time it takes for hack/grow/weaken takes to complete is determined when the
  function is called but the effect is calculated at the end.

A batch consist of a set of 4 special process

1. A hack script that will remove a predefined, precalculated amount of money from the server.
2. A weaken script that counters the security increase of the hack process.
3. A grow script that counters the money decrease of the hack process.
4. A weaken script that counters the security increase of the grow process.

It is also important that these 4 scripts finish in the order specified. Hence why you need a delay in your script.
It's possible to make a batch with 3 scripts (hgw) but that it less efficient as the effectiveness of `grow` is based off server security.

Here's a picture demonstrating batch in action.

.. image:: batch.png

For batches to work the server needs to be at max money and min security. It is possible to use batches
to reach max money and min sec, just don't use any hack in your cycles.

The time set between each script ending cannot be tighter than 20ms as this is the best the javascript engine can do.

