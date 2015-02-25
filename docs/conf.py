# -*- coding: utf-8 -*-

# The master toctree document.
master_doc = 'index'


# -- Options for HTML output ---------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = 'default'

# Only import and set the theme if we're building docs locally
if not os.environ.get('READTHEDOCS', None) == 'True':
    # Only set the theme if it's available
    try:
        import sphinx_rtd_theme
    except:
        print("could not find sphinx_rtd_theme, using default")
        print(sys.path)
    else:
        html_theme = 'sphinx_rtd_theme'
        html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]


