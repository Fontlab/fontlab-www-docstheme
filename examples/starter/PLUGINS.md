<!-- this_file: examples/starter/PLUGINS.md -->

# Choose documentation plugins

Start with the included MaterialX search and PyMdown extensions. Add a plugin
when a page or authoring workflow needs it, and declare its package in the same
environment that runs ProperDocs. Keep existing plugin options when merging YAML.

| Need | Package and configuration |
| --- | --- |
| Python API reference | [`mkdocstrings[python]`](https://mkdocstrings.github.io/python/usage/), `mkdocstrings` plugin, local `handlers.python.paths`; use `allow_inspection: false` for static analysis. Author a real `::: package.Class` directive. |
| Cross-page symbol links | [`mkdocs-autorefs`](https://github.com/mkdocstrings/autorefs), `autorefs`; use `[label][package.Class]` or a unique explicit heading anchor. |
| Code from checked-in source | [`mkdocs-codeinclude-plugin`](https://github.com/rnorth/mkdocs-codeinclude-plugin), `codeinclude: {title_mode: mkdocs-material, block_throw: true}`; paths are relative to the Markdown file. |
| Reused authored prose | [`mkdocs-include-markdown-plugin`](https://github.com/mondeja/mkdocs-include-markdown-plugin), `include-markdown`; use local files and keep relative-link rewriting enabled. |
| Directory navigation | [`mkdocs-awesome-nav`](https://lukasgeiter.github.io/mkdocs-awesome-nav/), `awesome-nav`; put deliberate ordering in `.nav.yml`. Small sites can retain explicit `nav`. |
| Directory metadata | [MaterialX meta](https://jaywhj.github.io/mkdocs-materialx/plugins/meta.html), `materialx/meta` before tags/search; author `.meta.yml` for a real folder default. Included with the theme. |
| Subject tags | [MaterialX tags](https://jaywhj.github.io/mkdocs-materialx/plugins/tags.html), `materialx/tags`; add page `tags` and a reachable page containing `<!-- material/tags -->`. |
| Search | [MaterialX search](https://jaywhj.github.io/mkdocs-materialx/plugins/search.html), `materialx/search`; preserve the generated `search/` directory when publishing. Hybrid sites may intentionally use global search. |
| Code, keys, tabs and disclosure | [PyMdown Extensions](https://facelessuser.github.io/pymdown-extensions/); keep the starter's tested Markdown extensions. |
| Wiki topic taxonomy | [`mkdocs-categories-plugin`](https://github.com/EddyLuten/mkdocs-categories-plugin), `categories`; use real `categories` frontmatter. Avoid adding a second taxonomy when tags or blog topic streams already serve readers. |
| Editing a local checkout in the browser | [`mkdocs-live-edit-plugin`](https://github.com/EddyLuten/mkdocs-live-edit-plugin), `live-edit` in a local serve profile; bind both HTTP and WebSocket servers to `127.0.0.1`. Use authored sources as `docs_dir`. |
| Combined printable HTML | [`mkdocs-print-site-plugin`](https://timvink.github.io/mkdocs-print-site-plugin/), `print-site` last; verify combined links and print layout. Prefer a separate profile for large references. This produces HTML, not a PDF file. |

Use `plugins` as a mapping in the base config and inherited profiles when a
profile adds plugins. MkDocs replaces lists during inheritance; a profile with
only `live-edit` in a list would silently remove search and all other plugins.

MaterialX's `navigation.path` supplies breadcrumbs and its native ToC supplies
section navigation. The requested [breadcrumbs plugin](https://github.com/mihaigalos/mkdocs-breadcrumbs-plugin)
0.1.14 generates index files in the source tree and depends on stock Material.
The requested [ToC sidebar plugin](https://github.com/zachhannum/mkdocs-toc-sidebar-plugin)
0.1.0 fails to import with MkDocs 1.6.1 because it uses the removed
`mkdocs.utils.string_types`. Keep the native features for this stack.

Before publishing, build with `properdocs build --strict`, inspect actual rendered
includes and links, try search and navigation, and verify any editing or print
workflow separately. Keep local authoring profiles out of deployment commands.
