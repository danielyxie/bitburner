setMemberTask() Netscript Function
==================================

.. js:function:: setMemberTask(memberName, taskName)

    :param string memberName: Name of Gang member to assign
    :param string taskName: Task to assign

    Attempts to assign the specified Gang Member to the specified task.
    If an invalid task is specified, the Gang member will be set to idle ("Unassigned")

    :returns: True if the Gang Member was successfully assigned to the task. False otherwise
