import type { ToolContext } from '@jrmc/adonis-mcp/types/context'
import type { BaseSchema } from '@jrmc/adonis-mcp/types/method'

import { Tool } from '@jrmc/adonis-mcp'
import { isReadOnly, isOpenWorld, isIdempotent } from '@jrmc/adonis-mcp/tool_annotations'
import { DocumentationService } from '#services/documentation_service'

type Schema = BaseSchema<{
  query: { type: 'string' }
  caseSensitive?: { type: 'boolean' }
}>

/**
 * Tool to search for content across all documentation files
 */
@isReadOnly()
@isOpenWorld()
@isIdempotent()
export default class SearchInDocsTool extends Tool<Schema> {
  name = 'search_in_docs'
  title = 'Search in Documentation'
  description = 'Search for a keyword or phrase across all documentation files and return matching sections'

  async handle({ args, response }: ToolContext<Schema>) {
    const query = args?.query
    const caseSensitive = args?.caseSensitive ?? false

    if (!query || query.trim() === '') {
      return response.error('Search query is required')
    }

    const documentationService = new DocumentationService()
    const fileNames = [
      'inspector',
      'installation',
      'introduction',
      'prompts',
      'resources',
      'sessions',
      'tools',
      'unit-tests'
    ]

    const results: Array<{
      file: string
      matches: Array<{ lineNumber: number; line: string; context: string[] }>
    }> = []

    // Search in each documentation file
    for (const fileName of fileNames) {
      try {
        const content = await documentationService.fetchMarkdownFile(fileName)
        const lines = content.split('\n')
        const matches: Array<{ lineNumber: number; line: string; context: string[] }> = []

        const searchQuery = caseSensitive ? query : query.toLowerCase()

        lines.forEach((line, index) => {
          const searchLine = caseSensitive ? line : line.toLowerCase()

          if (searchLine.includes(searchQuery)) {
            // Get context: 2 lines before and 2 lines after
            const contextBefore = lines.slice(Math.max(0, index - 2), index)
            const contextAfter = lines.slice(index + 1, Math.min(lines.length, index + 3))

            matches.push({
              lineNumber: index + 1,
              line: line.trim(),
              context: [...contextBefore, ...contextAfter].map(l => l.trim())
            })
          }
        })

        if (matches.length > 0) {
          results.push({
            file: fileName,
            matches: matches
          })
        }
      } catch (error) {
        // Skip files that cannot be fetched
        continue
      }
    }

    if (results.length === 0) {
      return response.text(`No results found for query: "${query}"`)
    }

    const totalMatches = results.reduce((sum, result) => sum + result.matches.length, 0)

    return response.structured({
      query: query,
      caseSensitive: caseSensitive,
      totalFiles: results.length,
      totalMatches: totalMatches,
      results: results
    })
  }

  schema() {
    return {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query (keyword or phrase to find in documentation)'
        },
        caseSensitive: {
          type: 'boolean',
          description: 'Whether the search should be case-sensitive (default: false)'
        }
      },
      required: ['query']
    } as Schema
  }
}
