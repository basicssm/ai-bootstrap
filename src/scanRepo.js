import fs from "fs"
import path from "path"

const IGNORE = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage"
]

export async function scanRepo(dir = process.cwd()) {
  function walk(folder) {
    const files = fs.readdirSync(folder)

    return files
      .filter(f => !IGNORE.includes(f))
      .map(file => {
        const full = path.join(folder, file)
        const stat = fs.statSync(full)

        if (stat.isDirectory()) {
          return {
            type: "folder",
            name: file,
            children: walk(full)
          }
        }

        return {
          type: "file",
          name: file
        }
      })
  }

  return walk(dir)
}