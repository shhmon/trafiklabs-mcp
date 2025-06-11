# Trafiklab MCP Server

MCP server for [Trafiklab API](https://www.trafiklab.se/)

## Usage

Node 18+

- `npm install && npm run build`
- Add MCP config to your LLM with:
    - command: "node"
    - args: ["/path/to/build/index.js", "<trafiklab API key>"]

## Known issues

MCP seems slightly wonky when using nvm and running node servers locally. You might need to either specify the full path to a node 18+ binary or uninstall older node versions in nvm that you might have lingering locally.
