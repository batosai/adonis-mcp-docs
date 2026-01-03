export class ResourceCompletionService {
  private readonly names = ['inspector', 'installation', 'introduction', 'prompts', 'resources', 'sessions', 'tools', 'unit-tests']

  getCompletions(prefix?: string): string[] {
    if (!prefix || prefix.trim() === '') {
      return this.names
    }

    const normalizedPrefix = prefix.toLowerCase().trim()
    return this.names.filter(name =>
      name.toLowerCase().startsWith(normalizedPrefix)
    )
  }
}
