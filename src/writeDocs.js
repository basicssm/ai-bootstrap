import fs from "fs"
import { generateRepoMap } from "./generateRepoMap.js"

export async function writeDocs(content) {

  if (!fs.existsSync("ai")) {
    fs.mkdirSync("ai")
  }

  if (!fs.existsSync("ai/prompts")) {
    fs.mkdirSync("ai/prompts")
  }

  fs.writeFileSync("ai/project-overview.md", content.projectOverview)
  fs.writeFileSync("ai/architecture.md", content.architecture)
  fs.writeFileSync("ai/coding-standards.md", content.codingStandards)
  fs.writeFileSync("ai/prompts/task-template.md", content.taskTemplate)
  fs.writeFileSync("ai/dependency-graph.md", content.dependencyGraph)
  fs.writeFileSync("ai/feature-map.md", content.featureMap)

  const repoMap = generateRepoMap()

  fs.writeFileSync("ai/repo-map.md", repoMap)

}