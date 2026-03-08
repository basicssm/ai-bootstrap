export function generateEntrypointsDoc(entrypoints) {

  return `
# Application Entrypoints

This document lists the main entrypoints detected in the project.

Entrypoints are files where the application starts execution.

They are important for both developers and AI tools to understand how the system is bootstrapped.

## Detected Entrypoints

${entrypoints.map(e => `- ${e}`).join("\n")}

## Notes

These files usually contain:

- Application initialization
- Dependency setup
- Server start
- Root React components

Generated automatically by ai-bootstrap.
`
}