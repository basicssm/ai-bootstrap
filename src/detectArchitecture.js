import fs from "fs"

export function detectArchitecture(structure) {

  const folders = JSON.stringify(structure)

  if (folders.includes("features") || folders.includes("modules")) {
    return {
      type: "Feature-based architecture",
      confidence: "high"
    }
  }

  if (
    folders.includes("controllers") &&
    folders.includes("services") &&
    folders.includes("repositories")
  ) {
    return {
      type: "Layered architecture",
      confidence: "high"
    }
  }

  if (
    folders.includes("domain") &&
    folders.includes("application") &&
    folders.includes("infrastructure")
  ) {
    return {
      type: "Clean Architecture / DDD",
      confidence: "high"
    }
  }

  if (
    folders.includes("ports") &&
    folders.includes("adapters")
  ) {
    return {
      type: "Hexagonal architecture",
      confidence: "medium"
    }
  }

  return {
    type: "Unknown / Custom architecture",
    confidence: "low"
  }

}