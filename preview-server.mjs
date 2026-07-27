import { createReadStream, existsSync, mkdirSync, openSync, statSync, writeFileSync } from "node:fs";
import { createServer, request } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const publicDir = resolve(root, "out");
const workDir = resolve(root, "work");
const logPath = resolve(workDir, "preview-server.log");
const pidPath = resolve(workDir, "preview-server.pid");
const hostname = "127.0.0.1";
const port = 3000;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

mkdirSync(workDir, { recursive: true });

function isPreviewUp() {
  return new Promise((resolveReady) => {
    const req = request(
      { hostname, port, method: "HEAD", path: "/", timeout: 1200 },
      (res) => {
        res.resume();
        resolveReady(Boolean(res.statusCode && res.statusCode < 500));
      }
    );

    req.on("error", () => resolveReady(false));
    req.on("timeout", () => {
      req.destroy();
      resolveReady(false);
    });
    req.end();
  });
}

if (process.argv.includes("--daemon")) {
  if (await isPreviewUp()) {
    console.log(`BooDoo preview is already running at http://${hostname}:${port}/`);
    process.exit(0);
  }

  const logFd = openSync(logPath, "a");
  const child = spawn(process.execPath, [new URL(import.meta.url).pathname, "--serve"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", logFd, logFd]
  });

  child.unref();
  writeFileSync(pidPath, `${child.pid}\n`);
  console.log(`Started BooDoo preview on http://${hostname}:${port}/ with PID ${child.pid}`);
  process.exit(0);
}

if (!existsSync(publicDir)) {
  console.error("Missing static export. Run `npm run build` first.");
  process.exit(1);
}

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${hostname}:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const cleanPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(publicDir, cleanPath);
  const filePath = existsSync(requestedPath) && statSync(requestedPath).isDirectory()
    ? join(requestedPath, "index.html")
    : requestedPath;
  const fallbackPath = join(publicDir, "index.html");
  const resolvedFile = existsSync(filePath) ? filePath : fallbackPath;

  if (!resolvedFile.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const type = contentTypes[extname(resolvedFile)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(resolvedFile).pipe(res);
});

server.listen(port, hostname, () => {
  console.log(`BooDoo static preview ready at http://${hostname}:${port}/`);
});

setInterval(() => {
  console.log(`BooDoo static preview alive at ${new Date().toISOString()}`);
}, 30000);
