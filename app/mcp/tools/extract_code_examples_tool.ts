import type { ToolContext } from '@jrmc/adonis-mcp/types/context'
import type { BaseSchema } from '@jrmc/adonis-mcp/types/method'

import { Tool } from '@jrmc/adonis-mcp'
import { isReadOnly, isOpenWorld, isIdempotent } from '@jrmc/adonis-mcp/tool_annotations'
import { DocumentationService } from '#services/documentation_service'

type Schema = BaseSchema<{
  filename: { type: 'string' }
}>

/**
 * Tool to extract code examples from documentation files
 */
@isReadOnly()
@isOpenWorld()
@isIdempotent()
export default class ExtractCodeExamplesTool extends Tool<Schema> {
  name = 'extract_code_examples'
  title = 'Extract Code Examples'
  description = 'Extracts all code blocks from a documentation file with their language and line numbers'

  async handle({ args, response }: ToolContext<Schema>) {
    const typedArgs = args as { filename?: string } | undefined
    const filename = typedArgs?.filename

    if (!filename || filename.trim() === '') {
      return response.error('Filename is required')
    }

    const documentationService = new DocumentationService()

    try {
      const content = await documentationService.fetchMarkdownFile(filename)

      const codeBlocks: Array<{
        language: string
        code: string
        lineNumber: number
      }> = []

      // Parse line by line to extract code blocks
      const lines = content.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Check if this line starts a code block
        const blockStart = line.match(/^```(\w+)?$/)
        if (blockStart) {
          const blockLanguage: string = blockStart[1] || 'text'

          // Find the end of the code block
          const codeLines: string[] = []
          let j = i + 1

          while (j < lines.length && !lines[j].match(/^```$/)) {
            codeLines.push(lines[j])
            j++
          }

          if (j < lines.length) {
            codeBlocks.push({
              language: blockLanguage,
              code: codeLines.join('\n'),
              lineNumber: i + 1
            })
          }
        }
      }

      if (codeBlocks.length === 0) {
        return response.text(`No code blocks found in '${filename}'`)
      }

      return response.structured({
        filename: filename,
        totalBlocks: codeBlocks.length,
        codeBlocks: codeBlocks
      })
    } catch (error) {
      if (error instanceof Error) {
        return response.error(`Failed to extract code examples: ${error.message}`)
      }
      return response.error('Failed to extract code examples from documentation')
    }
  }

  schema() {
    return {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'Name of the documentation file (without .md extension, e.g., "resources", "tools")'
        }
      },
      required: ['filename']
    } as Schema
  }
}
