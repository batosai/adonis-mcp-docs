export class DocumentationService {
  private readonly baseUrl = 'https://raw.githubusercontent.com/batosai/adonis-mcp/main/docs'

  async fetchMarkdownFile(name: string): Promise<string> {
    const url = `${this.baseUrl}/${name}.md`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Markdown file '${name}.md' not found`)
        }
        throw new Error(`Failed to fetch markdown file: ${response.statusText}`)
      }

      const content = await response.text()
      return content
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching markdown file '${name}': ${error.message}`)
      }
      throw new Error(`Unknown error fetching markdown file '${name}'`)
    }
  }

  async fileExists(name: string): Promise<boolean> {
    const url = `${this.baseUrl}/${name}.md`

    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  async getFileSize(name: string): Promise<number | null> {
    const url = `${this.baseUrl}/${name}.md`

    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) {
        return null
      }

      const contentLength = response.headers.get('content-length')
      return contentLength ? parseInt(contentLength, 10) : null
    } catch {
      return null
    }
  }
}
