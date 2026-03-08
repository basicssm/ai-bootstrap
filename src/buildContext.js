export function buildContext(structure, stack) {
  return {
    stack,
    structure,
    instructions: `
Analyze this repository and generate AI development documentation.

You must create:

/ai
   project-overview.md
   architecture.md
   coding-standards.md
   prompts/task-template.md

Focus on:
- architecture
- testing
- project scaffolding
`
  }
}