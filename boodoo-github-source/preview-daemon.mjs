import { mkdirSync, openSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const workDir = resolve(root, "work");
mkdirSync(workDir, { recursive: true });

const logPath = resolve(workDir, "dev-server.log");
const pidPath = resolve(workDir, "dev-server.pid");
const logFd = openSync(logPath, "a");

const child = spawn(
  "node",
  ["./node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3000"],
  {
    cwd: root,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }
  }
);

child.unref();
writeFileSync(pidPath, `${child.pid}\n`);
console.log(`Started BooDoo preview on http://127.0.0.1:3000/ with PID ${child.pid}`);
