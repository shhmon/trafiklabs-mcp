import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { CallAtLocation } from "./types";

const API_KEY = process.argv[2];
const API_BASE = "https://realtime-api.trafiklab.se/v1";

export const makeRequest = async <T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> => {
  const targetUrl = new URL(API_BASE);
  targetUrl.pathname += path;

  const headers = {
    "User-Agent": "some-application/1.0",
    Accept: "application/json",
  };

  const queryParams = new URLSearchParams(params);

  queryParams.set("key", API_KEY);

  targetUrl.search = queryParams.toString();

  try {
    const response = await fetch(targetUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
};

export const constructPath = (parts: Array<string | null | undefined>) =>
  parts.reduce(
    (acc, curr) => (curr ? [acc, curr].join("/") : acc),
    "",
  ) as string;

export const content = (text: string) =>
  ({
    content: [
      {
        type: "text",
        text,
      },
    ],
  }) as CallToolResult;

export const formatCallAtLocation = (calls: CallAtLocation[]) =>
  calls.map(
    ({
      agency,
      canceled,
      delay,
      scheduled,
      route: { transport_mode, direction, origin, destination },
    }) => ({
      scheduled,
      agency: agency.name,
      canceled,
      delay,
      route: {
        transport_mode,
        direction,
        origin,
        destination,
      },
    }),
  );

export const filterByScheduledWindow = <T extends { scheduled: string }>(
  items: T[],
  referenceTime: string,
): T[] => {
  const ref = new Date(referenceTime).getTime();
  const max = ref + 10 * 60 * 1000; // 10 minutes in ms

  return items.filter((item) => {
    const scheduled = new Date(item.scheduled).getTime();
    return scheduled >= ref && scheduled <= max;
  });
};
