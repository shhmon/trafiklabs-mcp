import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  constructPath,
  makeRequest,
  content,
  formatCallAtLocation,
  filterByScheduledWindow,
} from "./utils";
import {
  ArrivalsResponse,
  DeparturesResponse,
  StopSearchResponse,
} from "./types";

// Create server instance
const server = new McpServer({
  name: "trafiklab-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-departures",
  "Get departures from trafiklab (window of 10 minutes from provided time)",
  {
    areaId: z.string().describe("Area ID"),
    time: z
      .string()
      .optional()
      .describe("The time to look up, in YYYY-MM-DD\THH:mm format"),
  },
  async ({ areaId, time }) => {
    const path = constructPath(["departures", areaId, time]);
    const data = await makeRequest<DeparturesResponse>(path);

    if (!data) {
      return content("Failed to retrieve data " + JSON.stringify(data));
    }

    const filtered = time
      ? filterByScheduledWindow(data.departures, time)
      : data.departures;
    const formatted = formatCallAtLocation(filtered);

    const output = `Departures for ${areaId} at ${time} in json:\n\n${JSON.stringify(formatted)}`;

    return content(output);
  },
);

server.tool(
  "get-arrivals",
  "Get arrivals from trafiklab (window of 10 minutes from provided time)",
  {
    areaId: z.string().describe("Area ID"),
    time: z
      .string()
      .optional()
      .describe("The time to look up, in YYYY-MM-DD\THH:mm format"),
  },
  async ({ areaId, time }) => {
    const path = constructPath(["arrivals", areaId, time]);
    const data = await makeRequest<ArrivalsResponse>(path);

    if (!data) {
      return content("Failed to retrieve data " + JSON.stringify(data));
    }

    const filtered = time
      ? filterByScheduledWindow(data.arrivals, time)
      : data.arrivals;
    const formatted = formatCallAtLocation(filtered);
    const output = `Departures for ${areaId} at ${time} in json:\n\n${JSON.stringify(formatted)}`;

    return content(output);
  },
);

server.tool(
  "search-stops",
  "Search stops from trafiklab",
  {
    name: z.string().describe("Name query"),
  },
  async ({ name }) => {
    const path = constructPath(["stops", "name", name]);
    const data = await makeRequest<StopSearchResponse>(path);

    if (!data) {
      return content("Failed to retrieve data " + JSON.stringify(data));
    }

    const formatted = data.stop_groups.map(
      ({ id, name, stops, transport_modes }) => ({
        areaId: id,
        name,
        stops,
        transport_modes,
      }),
    );

    const output = `Result for search query ${name} in json:\n\n${JSON.stringify(formatted)}`;

    return content(output);
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
