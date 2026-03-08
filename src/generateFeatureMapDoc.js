export function generateFeatureMapDoc(features) {

  if (!features.length) {
    return `
# Feature Map

No feature-based structure detected.

Consider organizing the project using:

src/features/
`
  }

  let md = "# Feature Map\n\n"

  md += "Main functional areas detected in the repository.\n\n"

  features.forEach(feature => {

    md += `## ${feature.name}\n\n`

    md += `Location:\n${feature.path}\n\n`

    if (feature.files.length) {

      md += "Main files:\n\n"

      feature.files.forEach(f => {
        md += `- ${f}\n`
      })

      md += "\n"
    }

  })

  return md

}