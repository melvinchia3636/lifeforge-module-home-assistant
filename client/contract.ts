export type EndpointControlCall_OutputNO_CONTENT = void;

export interface Contract {
  settings: {
    get: EndpointSettingsGet;
    save: EndpointSettingsSave;
    test: EndpointSettingsTest;
  };
  stats: {
    get: EndpointStatsGet;
  };
  history: {
    get: EndpointHistoryGet;
  };
  control: {
    call: EndpointControlCall;
  };
}
export interface EndpointSettingsGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointSettingsGet_OutputOK;
  };
  media: null;
}
export interface EndpointSettingsGet_OutputOK {
  settings: {
    id: string;
    base_url: string;
    created: string;
    updated: string;
  } | null;
}
export interface EndpointSettingsSave {
  method: "post";
  input: {
    body?: EndpointSettingsSave_InputBody;
  };
  output: {
    OK: EndpointSettingsSave_OutputOK;
  };
  media: null;
}
export interface EndpointSettingsSave_InputBody {
  base_url: string;
}
export interface EndpointSettingsSave_OutputOK {
  id: string;
  base_url: string;
  created: string;
  updated: string;
}
export interface EndpointSettingsTest {
  method: "get";
  input: {
    query?: EndpointSettingsTest_InputQuery;
  };
  output: {
    OK: EndpointSettingsTest_OutputOK;
  };
  media: null;
}
export interface EndpointSettingsTest_InputQuery {
  base_url: string;
}
export interface EndpointSettingsTest_OutputOK {
  location_name: string;
  version: string;
}
export interface EndpointStatsGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointStatsGet_OutputOK;
  };
  media: null;
}
export interface EndpointStatsGet_OutputOK {
  power: boolean | null;
  preset_mode: string | null;
  preset_modes: string[];
  percentage: number | null;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  air_quality: string | null;
  temperature: number | null;
  humidity: number | null;
  filter_life: number | null;
  fault: string | null;
  uv: boolean | null;
  anion: boolean | null;
  display: boolean | null;
  brightness: string | null;
  brightness_options: string[];
  manual_fan_level: string | null;
  manual_fan_level_options: string[];
  child_lock: boolean | null;
  buzzer: boolean | null;
  motor_rpm: number | null;
  updated_at: string;
}
export interface EndpointHistoryGet {
  method: "get";
  input: {
    query?: EndpointHistoryGet_InputQuery;
  };
  output: {
    OK: EndpointHistoryGet_OutputOK;
  };
  media: null;
}
export interface EndpointHistoryGet_InputQuery {
  range: "6h" | "24h" | "7d";
}
export interface EndpointHistoryGet_OutputOK {
  points: {
    t: number;
    pm1: number | null;
    pm25: number | null;
    pm10: number | null;
    temperature: number | null;
    humidity: number | null;
  }[];
}
export interface EndpointControlCall {
  method: "post";
  input: {
    body?: EndpointControlCall_InputBody;
  };
  output: {
    NO_CONTENT: EndpointControlCall_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointControlCall_InputBody {
  action:
    | "power_on"
    | "power_off"
    | "set_mode"
    | "set_fan_speed"
    | "uv_on"
    | "uv_off"
    | "anion_on"
    | "anion_off"
    | "display_on"
    | "display_off"
    | "set_brightness"
    | "set_manual_fan_level"
    | "child_lock_on"
    | "child_lock_off"
    | "buzzer_on"
    | "buzzer_off";
  value?: string;
}
