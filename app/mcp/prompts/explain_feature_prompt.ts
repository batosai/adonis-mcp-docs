import type { PromptContext, CompleteContext } from '@jrmc/adonis-mcp/types/context'
import type { BaseSchema, InferJSONSchema } from '@jrmc/adonis-mcp/types/method'

import { Prompt } from '@jrmc/adonis-mcp'

type Schema = BaseSchema<{
  feature: { type: 'string' }
  level?: { type: 'string' }
}>

/**
 * Prompt to explain a feature from the documentation with examples
 */
export default class ExplainFeaturePrompt extends Prompt<Schema> {
  name = 'explain_feature'
  title = 'Explain Documentation Feature'
  description =
    'Get a detailed explanation of an adonis-mcp feature with code examples and best practices'

  async handle({ args, response }: PromptContext<Schema>) {
    const feature = args?.feature
    const level = args?.level || 'intermediate'

    return [
      response.text(`Please explain the "${feature}" feature in adonis-mcp in detail.`),
      response.text(`Target audience level: ${level}`),
      response.text(''),
      response.text('Include the following in your explanation:'),
      response.text('1. **Overview**: What is this feature and why is it useful?'),
      response.text('2. **How it works**: Explain the core concepts and mechanics'),
      response.text('3. **Code Examples**: Provide practical, working code examples'),
      response.text('4. **Common Use Cases**: When and why to use this feature'),
      response.text('5. **Best Practices**: Tips for effective implementation'),
      response.text('6. **Common Pitfalls**: What to avoid and potential issues'),
      response.text('7. **Related Features**: Other features that work well with this'),
      response.text(''),
      response.embeddedResource('file:///resources.md'),
      response.embeddedResource('file:///tools.md'),
      response.embeddedResource('file:///prompts.md'),
      response.text(''),
      response.text('Use the embedded documentation resources above as reference.'),
    ]
  }

  async complete({ args, response }: CompleteContext<InferJSONSchema<Schema>>) {
    const typedArgs = args as { feature?: string; level?: string } | undefined

    // Provide feature suggestions
    if (typedArgs?.feature !== undefined) {
      return response.complete({
        values: [
          'resources',
          'tools',
          'prompts',
          'resource templates',
          'tool annotations',
          'completions',
          'authentication',
          'authorization',
          'sessions',
          'unit testing',
          'inspector',
          'middleware',
        ],
      })
    }

    // Provide level suggestions
    if (typedArgs?.level !== undefined) {
      return response.complete({
        values: ['beginner', 'intermediate', 'advanced'],
      })
    }

    return response.complete({ values: [] })
  }

  schema() {
    return {
      type: 'object',
      properties: {
        feature: {
          type: 'string',
          description:
            'The feature or concept to explain (e.g., "resources", "tools", "prompts", "authentication")',
        },
        level: {
          type: 'string',
          description:
            'Target audience level: beginner, intermediate, or advanced (default: intermediate)',
        },
      },
      required: ['feature'],
    } as Schema
  }
}
