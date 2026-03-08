import fs from "fs"
import path from "path"

const EXTENSIONS = [".js", ".ts", ".jsx", ".tsx"]

function getFiles(dir) {

  let results = []

  const files = fs.readdirSync(dir)

  files.forEach(file => {

    const full = path.join(dir, file)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {

      if (
        file === "node_modules" ||
        file === ".git" ||
        file === "dist" ||
        file === "build"
      ) return

      results = results.concat(getFiles(full))

    } else {

      if (EXTENSIONS.includes(path.extname(file))) {
        results.push(full)
      }

    }

  })

  return results
}

function extractImports(content) {

  const imports = []

  const importRegex = /import .* from ['"](.*)['"]/g
  const requireRegex = /require\(['"](.*)['"]\)/g

  let match

  while ((match = importRegex.exec(content))) {
    imports.push(match[1])
  }

  while ((match = requireRegex.exec(content))) {
    imports.push(match[1])
  }

  return imports
}

export function generateDependencyGraph(root = process.cwd()) {

  const files = getFiles(root)

  const graph = {}

  files.forEach(file => {

    const content = fs.readFileSync(file, "utf8")

    const imports = extractImports(content)

    graph[file] = imports

  })

  return graph

}