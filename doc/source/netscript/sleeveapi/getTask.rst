getTask() Netscript Function
=======================================

.. js:function:: getTask(sleeveNumber)

    :param int sleeveNumber: index of the sleeve to retrieve task from.

    Return the current task that the sleeve is performing. type is set to "Idle" if the sleeve isn't doing anything

.. code-block:: javascript

    {
        task:            number, // task type
        crime:           number, // crime currently attempting, if any
        location:        number, // location of the task, if any
        gymStatType:     number, // stat being trained at the gym, if any
        factionWorkType: number, // faction work type being performed, if any
    }
