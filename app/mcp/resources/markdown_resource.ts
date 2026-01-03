import type { ResourceContext, CompleteContext } from '@jrmc/adonis-mcp/types/context'

import { Resource } from '@jrmc/adonis-mcp'
import { DocumentationService } from '#services/documentation_service'
import { ResourceCompletionService } from '#services/resource_completion_service'

type Args = {
  name: string
}

export default class MarkdownResource extends Resource<Args> {
  name = 'documentation_file'
  uri = 'file:///{name}.md'
  mimeType = 'text/markdown'

  title = 'Documentation Markdown File'
  description = 'Dynamic resource to access markdown documentation files. Use {name} parameter to specify the file to retrieve.'

  async handle({ args, response }: ResourceContext<Args>) {
    const documentationService = new DocumentationService()
    const name = args?.name

    if (!name) {
      throw new Error('File name is required')
    }

    const content = await documentationService.fetchMarkdownFile(name)
    this.size = content.length

    return response.text(content)
  }

  async complete({ args, response }: CompleteContext<Args>) {
    const resourceCompletionService = new ResourceCompletionService()
    const completions = resourceCompletionService.getCompletions(args?.name)
    console.log(completions)
    return response.complete({ values: completions })
  }
}
