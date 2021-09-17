commitCrime() Netscript Function
================================

.. js:function:: commitCrime(crime)

    :RAM cost: 5 GB
    :param string crime:
        Name of crime to attempt. Not case-sensitive. This argument is fairly lenient in terms of what inputs it accepts.
        Here is a list of valid inputs for all of the crimes:

        * shoplift
        * rob store
        * mug
        * larceny
        * deal drugs
        * bond forgery
        * traffick arms
        * homicide
        * grand theft auto
        * kidnap
        * assassinate
        * heist

    If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function.

    This function is used to automatically attempt to commit crimes. If you are already in the middle of some 'working' action
    (such as working for a company or training at a gym), then running this function will automatically cancel that action and give you your earnings.

    This function returns the number of milliseconds it takes to attempt the specified crime (e.g It takes 60 seconds to attempt the 'Rob Store' crime,
    so running ``commitCrime('rob store')`` will return 60000).

    Warning: I do not recommend using the time returned from this function to try and schedule your crime attempts.
    Instead, I would use the :doc:`isBusy<isBusy>` Singularity function to check whether you have finished attempting a crime.
    This is because although the game sets a certain crime to be X amount of seconds, there is no guarantee that your
    browser will follow that time limit.
