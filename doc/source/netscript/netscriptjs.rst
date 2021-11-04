.. _netscriptjs:

NetscriptJS (Netscript 2.0)
===========================
Netscript 2.0, or Netscript JS, is the improved version of Netscript that
allows users to write full-fledged Javascript code in their scripts, while
still being able to access the Netscript functions.

NetscriptJS was developed primarily by `Github user jaguilar <https://github.com/jaguilar>`_

On top of having almost all of the features and capabilities of JavaScript, NetscriptJS is also
significantly faster than Netscript 1.0.

This documentation will not go over any of the additional features of NetscriptJS, since
there is plenty of documentation on Javascript available on the web.

Browser compatibility
---------------------
As of the time of writing this, a few browsers do not support `dynamic import <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import>`_ functionality and therefore cannot run NetscriptJS scripts. These browsers will thus only be capable of using Netscript 1.0.

How to use NetscriptJS
----------------------
Working with NetscriptJS scripts is the same as Netscript 1.0 scripts. The only difference
is that NetscriptJS scripts use the ".ns" or ".js" extension rather than ".script". E.g.::

    $ nano foo.ns
    $ run foo.ns -t 100 arg1 arg2 arg3
    exec("foo.ns", "purchasedServer1", "100", "randomArg");

The caveat when using NetscriptJS to write scripts is that your code must be
asynchronous. Furthermore, instead of using the global scope and executing your code
sequentially, NetscriptJS uses a :code:`main()` function as an entry point.

Furthermore, the "Netscript environment" must be passed into a NetscriptJS script through
the main function. This environment includes all of the pre-defined Netscript functions
(:code:`hack()`, :code:`exec`, etc.) as well as the arguments you pass to the script.

Therefore, the signature of the :code:`main()` function must be::

    export async function main(ns) {
        ns.print("Starting script here");
        await ns.hack("foodnstuff"); //Use Netscript hack function
        ns.print(ns.args);           //The script arguments must be prefaced with ns as well
    }

Here is a summary of all rules you need to follow when writing Netscript JS code:

* Write :code:`await` before any call to the following Netscript functions:

    * hack
    * grow
    * weaken
    * sleep
    * prompt
    * wget
    * scp
    * write
    * writePort

* Any function that contains :code:`await` must be declared as :code:`async`

* Always :code:`await` any function that is marked as :code:`async`

* Any functions that you want to be visible from other scripts must be marked with :code:`export`.

* **Do not write any infinite loops without using a** :code:`sleep` **or one of the timed Netscript functions like** :code:`hack`. Doing so will freeze your game.

* Any global variable declared in a NetscriptJS script is shared between all instances of that
  script. For example, assume you write a script *foo.ns* and declared a global variable like so::

      //foo.ns
      let globalVariable;

      export async function main(ns) {
          globalVariable = ns.args.length;
          while(true) {
              ns.tprint(globalVariable);
              await ns.sleep(3000);
          }
      }

  Then, you ran multiple instances of *foo.ns*::

      $ run foo.ns 1
      $ run foo.ns 1 2 3
      $ run foo.ns 1 2 3 4 5

  Then all three instances of foo.ns will share the same instance of :code:`globalVariable`.
  (In this example, the value of :code:`globalVariable` will be set to 5 because the
  last instance of *foo.ns* to run has 5 arguments. This means that all three instances of
  the script will repeatedly print the value 5).

  These global variables can be thought of as `C++ static class members <https://www.tutorialspoint.com/cplusplus/cpp_static_members.htm>`_,
  where a NetscriptJS script is a class and a global variable is a static member within that class.

Examples
--------

**Script Scheduler (scriptScheduler.ns)**

This script shows some of the new functionality that is available in NetscriptJS,
including objects and object constructors, changing an object's prototype, and
importing other NetscriptJS scripts::

    import {tprintColored} from "tprintColored.ns"; //Importing from other NetscriptJS scripts works!

    function ScriptJob(params) {
        if (params.fn == null) {
            throw new Error("No Filename (fn) passed into ScriptJob ctor");
        }

        this.fn         = params.fn;
        this.threads    = params.threads ? params.threads : 1;
        this.args       = params.args    ? params.args : [];
    }

    ScriptJob.prototype.run = function(ns) {
        let runArgs = [this.fn, this.threads].concat(this.args);
        if (!ns.run.apply(this, runArgs)) {
            throw new Error("Unable to run " + this.fn + " on " +ns.getHostname());
        }
        tprintColored("Running " + this.fn + " on " + ns.getHostname(), "blue");
    }

    ScriptJob.prototype.exec = function(ns, target) {
        ns.scp(this.fn, target);

        let execArgs = [this.fn, target, this.threads].concat(this.args);
        if (!ns.exec.apply(this, execArgs)) {
            throw new Error("Unable to execute " + this.fn + " on " + target);
        }
        tprintColored("Executing " + this.fn + " on " + target, "blue");
    }

    export async function main(ns) {
        tprintColored("Starting scriptScheduler.ns", "red");
        try {
            let job = new ScriptJob({
                fn:         "test.js",
                threads:    1,
                args:       ["foodnstuff"]
            });
            job.run(ns);
            job.exec(ns, "foodnstuff");
        } catch (e) {
            ns.tprint("Exception thrown in scriptScheduler.ns: " + e);
        }
    }

Final Note
----------
NetscriptJS opens up a lot of possibilities when scripting. I look forward to seeing
the scripts that people come up with. Just remember that the power and capabilities of
NetscriptJS come with risks. Please backup your save if you're going to experiment with
NetscriptJS and report any serious exploits.

With great power comes great responsibility

Happy hacking
