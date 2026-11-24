"""Рендер поста из JSON в PNG без браузера пользователя.

Использование:
    pip install playwright && playwright install chromium
    python tools/render.py post.json out/

post.json в том же формате, что «JSON» в конструкторе: {format, rubric, cards:[{t, d}]}.
PNG сохраняются в двойном размере, как при выгрузке из конструктора.
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    post = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    srv = serve()
    url = f"http://127.0.0.1:{srv.server_address[1]}/buzz/render.html"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 2000, "height": 2000}, device_scale_factor=2)
        page.goto(url)
        page.evaluate("p => window.renderPost(p)", post)
        page.wait_for_function("window.__done === true", timeout=30000)
        for i, card in enumerate(post["cards"]):
            el = page.query_selector(f"#c{i} .cv")
            name = out / f"{i + 1:02d}_{card['t']}.png"
            el.screenshot(path=str(name))
            print(name)
        browser.close()
    srv.shutdown()


if __name__ == "__main__":
    main()
