export type TransportMode =
  | "BUS"
  | "METRO"
  | "TRAIN"
  | "TRAM"
  | "TAXI"
  | "BOAT";

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  transport_modes: TransportMode[];
  alerts: Alert[];
}

export interface CallAtLocation {
  scheduled: string;
  realtime: string;
  delay: number;
  canceled: string; // "true" or "false"
  agency: Agency;
  route: Route;
  trip: Trip;
  stop: StopAtCall;
  scheduled_platform: Platform | null;
  realtime_platform: Platform | null;
  alerts: Alert[];
  is_realtime: boolean;
}

export interface Agency {
  id: string;
  name: string;
  operator: string | null;
}

export interface Route {
  name: string;
  designation: string;
  transport_mode: TransportMode;
  transport_mode_code: number;
  direction: string;
  origin: LocationRef;
  destination: LocationRef;
}

export interface Trip {
  trip_id: string;
  start_date: string;
  technical_number: number;
}

export interface LocationRef {
  id: string;
  name: string;
}

export interface StopAtCall {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Platform {
  id: string;
  name: string;
}

export interface Alert {
  type?: string;
  title?: string;
  text?: string;
}

export interface DeparturesResponse {
  timestamp: string;
  query: {
    queryTime: string;
    query: string;
  };
  stops: Stop[];
  departures: CallAtLocation[];
}

export interface ArrivalsResponse {
  timestamp: string;
  query: {
    queryTime: string;
    query: string;
  };
  stops: Stop[];
  arrivals: CallAtLocation[];
}

// ----------------------
// Stops API Types Below
// ----------------------

export type AreaType = "META_STOP" | "RIKSHALLPLATS";

export interface StopSearchQuery {
  queryTime: string;
  query: string | null;
}

export interface StopSearchStop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface StopGroup {
  id: string;
  name: string;
  area_type: AreaType;
  average_daily_stop_times: number;
  transport_modes: TransportMode[];
  stops: StopSearchStop[];
}

export interface StopSearchResponse {
  timestamp: string;
  query: StopSearchQuery;
  stop_groups: StopGroup[];
}
