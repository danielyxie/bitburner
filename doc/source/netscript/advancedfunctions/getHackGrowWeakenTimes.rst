getHackTime(), getGrowTime(), & getWeakenTime()
===============================================

The :js:func:`getHackTime`, :js:func:`getGrowTime`, and :js:func:`getWeakenTime`
all take an additional third optional parameter for specifying a specific intelligence
level to see how that would affect the hack/grow/weaken times. This parameter
defaults to your current intelligence level.

(Intelligence is unlocked after obtaining Source-File 5).

The function signatures are then::

    getHackTime(hostname/ip[, hackLvl=current level, intLvl=current level])
    getGrowTime(hostname/ip[, hackLvl=current level, intLvl=current level])
    getWeakenTime(hostname/ip[, hackLvl=current level, intLvl=current level])
    
    :RAM cost: 0.05 GB
