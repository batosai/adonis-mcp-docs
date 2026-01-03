import type { ToolContext } from '@jrmc/adonis-mcp/types/context'

import { Tool } from '@jrmc/adonis-mcp'
import { isReadOnly, isIdempotent } from '@jrmc/adonis-mcp/tool_annotations'

/**
 * Tool to list all available documentation files
 */
@isReadOnly()
@isIdempotent()
export default class ListDocumentationTool extends Tool {
  name = 'list_documentation'
  title = 'List Documentation Files'
  description = 'Lists all available documentation markdown files with their names and descriptions'

  async handle({ response }: ToolContext) {
    const documentationFiles = [
      {
        name: 'inspector',
        description: 'Documentation about the MCP Inspector tool for debugging and testing'
      },
      {
        name: 'installation',
        description: 'Installation guide for setting up adonis-mcp in your project'
      },
      {
        name: 'introduction',
        description: 'Introduction to the Model Context Protocol (MCP) and adonis-mcp'
      },
      {
        name: 'prompts',
        description: 'Guide on creating and using prompts in your MCP server'
      },
      {
        name: 'resources',
        description: 'Documentation about MCP resources and how to create them'
      },
      {
        name: 'sessions',
        description: 'Information about session management in MCP'
      },
      {
        name: 'tools',
        description: 'Guide on creating and implementing tools in your MCP server'
      },
      {
        name: 'unit-tests',
        description: 'Documentation on writing unit tests for your MCP components'
      }
    ]

    return response.structured({
      total: documentationFiles.length,
      files: documentationFiles
    })
  }
}
