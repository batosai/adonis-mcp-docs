import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { isModernProtocolRequest } from '@jrmc/adonis-mcp/protocols/version'

export default class McpMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const body = ctx.request.body()
    const method = body.method

    const contentType = ctx.request.header('Content-Type')?.split(';', 1)[0]
    if (contentType !== 'application/json') {
      return ctx.response.badRequest('Content-Type header must be application/json')
    }

    const headerVersion = ctx.request.header('MCP-Protocol-Version')
    const metadataVersion = body.params?._meta?.['io.modelcontextprotocol/protocolVersion']

    if (isModernProtocolRequest(headerVersion, metadataVersion)) {
      return next()
    }

    if (method === 'initialize') {
      ctx.response.safeHeader('MCP-Session-Id', crypto.randomUUID())
    } else {
      const sessionId = ctx.request.header('MCP-Session-Id')

      if (!sessionId) {
        return ctx.response.badRequest('MCP-Session-Id header is required')
      }

      ctx.response.safeHeader('MCP-Session-Id', sessionId)
    }

    return next()
  }
}
