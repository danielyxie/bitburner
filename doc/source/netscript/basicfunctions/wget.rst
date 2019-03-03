wget() Netscript Function
=========================

.. js:function:: wget(url, target[, hostname/ip=current ip])

    :param string url: URL to pull data from
    :param string target: Filename to write data to. Must be script or text file
    :param string ip: Optional hostname/ip of server for target file.
    :RAM cost: 0 GB

    Retrieves data from a URL and downloads it to a file on the specified server. The data can only
    be downloaded to a script (.script, .ns, .js) or a text file (.txt). If the file already exists,
    it will be overwritten by this command.

    Note that it will not be possible to download data from many websites because they do not allow
    cross-origin resource sharing (CORS). Example::

        wget("https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md", "game_readme.txt");

    **IMPORTANT:** This is an asynchronous function that returns a Promise. The Promise's resolved
    value will be a boolean indicating whether or not the data was successfully
    retrieved from the URL. Because the function is async and returns a Promise,
    it is recommended you use :code:`wget` in :ref:`netscriptjs`.

    In NetscriptJS, you must preface any call to
    :code:`wget` with the :code:`await` keyword (like you would :code:`hack` or :code:`sleep`).

    :code:`wget` will still work in :ref:`netscript1`, but the functions execution will not
    be synchronous (i.e. it may not execute when you expect/want it to). Furthermore, since Promises are not
    supported in ES5, you will not be able to process the returned value of :code:`wget` in
    Netscript 1.0.
