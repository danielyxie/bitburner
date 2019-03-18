getTask() Netscript Function
=======================================

.. js:function:: getTask(sleeveNumber)

    :param int sleeveNumber: Index of the sleeve to retrieve task from. See :ref:`here <netscript_sleeveapi_referencingaduplicatesleeve>`

    Return the current task that the sleeve is performing. type is set to "Idle" if the sleeve isn't doing anything

.. code-block:: javascript

    {
        task:            string, // task type
        crime:           string, // crime currently attempting, if any
        location:        string, // location of the task, if any
        gymStatType:     string, // stat being trained at the gym, if any
        factionWorkType: string, // faction work type being performed, if any
    }
