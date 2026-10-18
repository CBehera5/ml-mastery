from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "apps" / "web"
BUILD = APP / ".next"


class PreviewHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        request_path = unquote(urlsplit(path).path)
        if request_path.startswith("/_next/static/"):
            return str(BUILD / "static" / request_path.removeprefix("/_next/static/"))
        if request_path.startswith("/notebooks/"):
            return str(APP / "public" / request_path.lstrip("/"))
        route = request_path.strip("/") or "index"
        html = BUILD / "server" / "app" / f"{route}.html"
        if html.is_file():
            return str(html)
        return str(APP / "public" / route)

    def log_message(self, format: str, *args: object) -> None:
        print(format % args, flush=True)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 3001), PreviewHandler)
    print("ML Math Lab preview: http://127.0.0.1:3001", flush=True)
    server.serve_forever()
