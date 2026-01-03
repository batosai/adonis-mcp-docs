# Adonis MCP Documentation Server

MCP (Model Context Protocol) server to access adonis-mcp documentation.

## 📋 Resources

### `file:///{name}.md` - Documentation Markdown File
Resource template to retrieve markdown documentation files from the GitHub repository.

**Available files:**
- `inspector` - MCP Inspector tool documentation
- `installation` - Installation guide
- `introduction` - Introduction to MCP
- `prompts` - Prompts documentation
- `resources` - Resources documentation
- `sessions` - Session management
- `tools` - Tools documentation
- `unit-tests` - Unit testing

**Usage example:**
```
file:///resources.md
file:///tools.md
```

## 🛠️ Tools

### 1. `list_documentation`
Lists all available documentation files with their descriptions.

**Parameters:** None

**Returns:** Structured list of all available documentation files

**Annotations:**
- `@isReadOnly()` - Read-only
- `@isIdempotent()` - Can be called multiple times without side effects

### 2. `search_in_docs`
Search for a keyword or phrase across all documentation files.

**Parameters:**
- `query` (string, required) - The keyword or phrase to search for
- `caseSensitive` (boolean, optional) - Case-sensitive search (default: false)

**Returns:** List of matches with context (2 lines before/after)

**Annotations:**
- `@isReadOnly()` - Read-only
- `@isOpenWorld()` - Accesses external resources (GitHub)
- `@isIdempotent()` - Can be called multiple times without side effects

**Example:**
```json
{
  "query": "Resource templates",
  "caseSensitive": false
}
```

### 3. `extract_code_examples`
Extracts all code blocks from a documentation file with their languages and line numbers.

**Parameters:**
- `filename` (string, required) - File name (without .md extension)

**Returns:** Structured list of all code blocks with their language, content, and line number

**Annotations:**
- `@isReadOnly()` - Read-only
- `@isOpenWorld()` - Accesses external resources (GitHub)
- `@isIdempotent()` - Can be called multiple times without side effects

**Example:**
```json
{
  "filename": "resources"
}
```

## 🎯 Prompts

### `explain_feature`
Guide to get a detailed explanation of an adonis-mcp feature with code examples.

**Parameters:**
- `feature` (string, required) - The feature to explain
- `level` (string, optional) - Audience level: "beginner", "intermediate", "advanced" (default: "intermediate")

**Suggested features:**
- resources
- tools
- prompts
- resource templates
- tool annotations
- completions
- authentication
- authorization
- sessions
- unit testing
- inspector
- middleware

**Example:**
```json
{
  "feature": "resource templates",
  "level": "intermediate"
}
```

## 🚀 Usage

### Installation

Install globally via npm:
```bash
npm install -g adonis-mcp-server
```

Or use with npx (no installation required):
```bash
npx adonis-mcp-server
```

### Testing locally before publishing

1. Build the project:
```bash
npm run build
```

2. Test with npx locally:
```bash
cd build
node bin/mcp.js
```

### Start the MCP server

```bash
adonis-mcp-server
```

Or with npx:
```bash
npx adonis-mcp-server
```

### Configuration for MCP Clients

Add to your Claude Desktop or Cursor MCP configuration:

```json
{
  "mcpServers": {
    "adonis-mcp-docs": {
      "command": "npx",
      "args": ["adonis-mcp-server"]
    }
  }
}
```

## 📦 Services

### `DocumentationService`
Manages retrieval of remote markdown files from GitHub.

**Methods:**
- `fetchMarkdownFile(name: string)` - Fetches a markdown file
- `fileExists(name: string)` - Checks if a file exists
- `getFileSize(name: string)` - Gets the size of a file

### `ResourceCompletionService`
Provides completion suggestions for documentation file names.

**Methods:**
- `getCompletions(prefix?: string)` - Returns files matching the prefix
- `getAllNames()` - Returns all available file names

## 🔍 Combined Usage Examples

### Search then read
1. Use `search_in_docs` to find where a concept is documented
2. Use the `file:///{name}.md` resource to read the complete content

### Extract and analyze
1. Use `extract_code_examples` to get all examples
2. Analyze the code with a custom prompt

### Explore then explain
1. Use `list_documentation` to see what's available
2. Use the `explain_feature` prompt to get a detailed explanation

## 📝 Technical Notes

- **Base URL:** `https://raw.githubusercontent.com/batosai/adonis-mcp/main/docs`
- **Format:** Markdown (`.md`)
- **Search:** Case-insensitive by default with 2 lines of context
- **Parsing:** Code block extraction with automatic language detection

## 🎨 Advanced Features

- ✅ Completions enabled for all templates
- ✅ Tool annotations to guide AI
- ✅ Robust error handling
- ✅ Search with context
- ✅ Automatic extraction of all code blocks with language detection
