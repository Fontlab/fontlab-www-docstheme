<!-- this_file: examples/starter/README.md -->

# FontLab MaterialX starter

Requires uv and Python 3.13. From this directory:

```sh
uv venv --python 3.13
uv pip install -r requirements.txt
uv run properdocs serve -f mkdocs.yml
```

Open the URL printed by ProperDocs. `site_url` includes `/docs/`, so preview
may be mounted at that path. Change `site_name` and `site_url` in `mkdocs.yml`
before publishing. `uv run properdocs build -f mkdocs.yml --strict` generates `site/`.
Publish the contents of `site/` to your static host, including `search/`.

No Node build is needed to consume the CDN. Internet access is needed for the
shared assets, fonts and menus. The four shared CSS/JS assets are versioned but
receive compatible fixes in place. See https://i.fontlab.com/fltheme26/ for
existing-site integration, optional branding, control ownership and updates.
