import sys, os, subprocess

project = u'Bitburner'
copyright = u'2017, Daniel Xie'
master_doc = 'index'
templates_path = ['_templates']
extensions = []
source_suffix = '.rst'
version = '1.0.0'
exclude_patterns = ['_build']

# -- HTML theme settings ------------------------------------------------

html_show_sourcelink = False

import guzzle_sphinx_theme

extensions.append("guzzle_sphinx_theme")
html_theme_path = guzzle_sphinx_theme.html_theme_path()
html_theme = 'guzzle_sphinx_theme'

# Guzzle theme options (see theme.conf for more information)
html_theme_options = {
    "project_nav_name": "Bitburner",
}
