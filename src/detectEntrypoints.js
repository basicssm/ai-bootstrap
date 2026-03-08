import fs from "fs"
import path from "path"

const ENTRYPOINT_PATTERNS = [
  "index.js",
  "index.ts",
  "main.js",
  "main.ts",
  "app.js",
  "app.ts",
  "server.js",
  "server.ts",
  "App.tsx",
  "App.jsx",
  "main.tsx",
  "main.jsx"
]

export function detectEntrypoints(dir = process.cwd()) {

  const results = []

  function walk(folder) {

    const files = fs.readdirSync(folder)

    files.forEach(file => {

      const full = path.join(folder, file)
      const stat = fs.statSync(full)

      if (stat.isDirectory()) {

        if (
          file === "node_modules" ||
          file === ".git" ||
          file === "dist" ||
          file === "build"
        ) return

        walk(full)

      } else {

        if (ENTRYPOINT_PATTERNS.includes(file)) {

          results.push(path.relative(process.cwd(), full))

        }

      }

    })

  }

  walk(dir)

  return results

}