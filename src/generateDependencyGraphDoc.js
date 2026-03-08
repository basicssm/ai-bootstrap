export function generateDependencyGraphDoc(graph) {

  let md = "# Dependency Graph\n\n"

  md += "This file describes internal module dependencies.\n\n"

  Object.entries(graph).forEach(([file, deps]) => {

    if (deps.length === 0) return

    md += `## ${file}\n\n`

    deps.forEach(dep => {
      md += `→ ${dep}\n`
    })

    md += "\n"

  })

  return md

}