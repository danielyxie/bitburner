recruitMember() Netscript Function
==================================

.. js:function:: recruitMember(name)

    :RAM cost: 2 GB

    :param string name: Name of member to recruit

    Attempt to recruit a new gang member.

    Possible reasons for failure:
    
    * Cannot currently recruit a new member
    * There already exists a member with the specified name

    :returns: True if the member was successfully recruited. False otherwise
