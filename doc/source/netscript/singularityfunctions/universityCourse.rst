universityCourse() Netscript Function
=====================================

.. js:function:: universityCourse(universityName, courseName)
    :RAM cost: 2 GB

    :param string universityName:
        Name of university. Not case-sensitive. You must be in the correct city for whatever university you specify.

        * Summit University
        * Rothman University
        * ZB Institute Of Technology
    :param string courseName:
        Name of course. Not case-sensitive.

        * Study Computer Science
        * Data Strucures
        * Networks
        * Algorithms
        * Management
        * Leadership

        If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function.

        This function will automatically set you to start taking a course at a university. If you are already in the middle of some
        "working" action (such as working at a company, for a faction, or on a program), then running this function will automatically
        cancel that action and give you your earnings.

        The cost and experience gains for all of these universities and classes are the same as if you were to manually visit and take these classes.

        This function will return true if you successfully start taking the course, and false otherwise.
