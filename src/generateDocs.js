import { detectArchitecture } from "./detectArchitecture.js"

export async function generateDocs(context) {
  const openAiApiKey = process.env.OPENAI_API_KEY
  const openAiEnabled = process.env.AI_BOOTSTRAP_USE_OPENAI !== "0"

  if (openAiApiKey && openAiEnabled) {
    try {
      return await generateDocsWithOpenAI(context, openAiApiKey)
    } catch (error) {
      console.warn(`OpenAI generation failed, using local generator instead: ${error.message}`)
    }
  } else {
    console.log("ℹ️ OpenAI not configured. Using local documentation generator.")
  }

  return generateDocsLocally(context)
}

async function generateDocsWithOpenAI(context, apiKey) {
  const { default: OpenAI } = await import("openai")
  const client = new OpenAI({ apiKey })

  const prompt = `
${context.instructions}

Stack:
${JSON.stringify(context.stack, null, 2)}

Structure:
${JSON.stringify(context.structure, null, 2)}

Return a JSON object with these keys only:
- projectOverview
- architecture
- codingStandards
- taskTemplate

Each value must be markdown text.
No code fences.
`

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: prompt
  })

  return parseDocsPayload(response.output_text)
}

function parseDocsPayload(outputText) {
  try {
    return JSON.parse(outputText)
  } catch {
    const jsonStart = outputText.indexOf("{")
    const jsonEnd = outputText.lastIndexOf("}")

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("Could not parse OpenAI response as JSON")
    }

    return JSON.parse(outputText.slice(jsonStart, jsonEnd + 1))
  }
}

function generateDocsLocally(context) {
  const architecture = detectArchitecture(context.structure)
  const topLevel = context.structure
    .filter(node => node.type === "folder")
    .map(node => node.name)
  const frameworksLine = (context.stack.frameworks || [context.stack.framework]).join(", ")
  const testingLine = (context.stack.testingTools || [context.stack.testing]).join(", ")

  const projectOverview = `# Project Overview

## Stack

- Frameworks: ${frameworksLine}
- Language: ${context.stack.language}
- Testing: ${testingLine}
- Package manager: ${context.stack.packageManager}
- Runtime: ${context.stack.runtime || "Unknown"}

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Test

\`\`\`bash
npm test
\`\`\`
`

  const architectureDoc = `# Architecture

## Detected style

- Type: ${architecture.type}
- Confidence: ${architecture.confidence}

## Top-level folders

${topLevel.length ? topLevel.map(folder => `- ${folder}`).join("\n") : "- No folders detected"}
`

  const codingStandards = `# Coding Standards

## Inferred conventions

- Use ${context.stack.language} across the repository.
- Keep modules focused and cohesive.
- Prefer clear folder names aligned with domain or feature boundaries.
- Maintain a consistent import style.

## Testing

- Detected tools: ${testingLine}.
- Add tests near implementation or under a dedicated \`tests/\` folder.
- Cover core paths and feature behavior.
`

  const taskTemplate = `# Task Prompt Template

Use this when asking an AI assistant to work in this repository.

## Template

Context:
- Read \`/ai/project-overview.md\`
- Read \`/ai/architecture.md\`
- Read \`/ai/coding-standards.md\`

Task:
[Describe the task]

Constraints:
- Keep existing behavior unless requested otherwise.
- Follow project conventions and folder structure.
- Add or update tests when behavior changes.

Output:
- Explain the changes.
- List touched files.
- Mention risks or follow-up work.
`

  return {
    projectOverview,
    architecture: architectureDoc,
    codingStandards,
    taskTemplate
  }
}
