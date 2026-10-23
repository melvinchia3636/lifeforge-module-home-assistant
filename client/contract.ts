export const contract = {
  "settings": {
    "get": {
      "method": "get",
      "description": "Get the Home Assistant connection settings",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "settings": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid",
                      "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                    },
                    "base_url": {
                      "type": "string"
                    },
                    "created": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "updated": {
                      "type": "string",
                      "format": "date-time"
                    }
                  },
                  "required": [
                    "id",
                    "base_url",
                    "created",
                    "updated"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "settings"
          ],
          "additionalProperties": false
        }
      }
    },
    "save": {
      "method": "post",
      "description": "Save the Home Assistant connection settings",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "base_url": {
              "type": "string"
            }
          },
          "required": [
            "base_url"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "base_url": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "base_url",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
      }
    },
    "test": {
      "method": "get",
      "description": "Test the connection to Home Assistant",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "base_url": {
              "type": "string"
            }
          },
          "required": [
            "base_url"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "location_name": {
              "type": "string"
            },
            "version": {
              "type": "string"
            }
          },
          "required": [
            "location_name",
            "version"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "stats": {
    "get": {
      "method": "get",
      "description": "Get the current state of the Home Assistant air purifier",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "power": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "preset_mode": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "preset_modes": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "percentage": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "pm1": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "pm25": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "pm10": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "air_quality": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "temperature": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "humidity": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "filter_life": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "fault": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "uv": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "anion": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "display": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "brightness": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "brightness_options": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "manual_fan_level": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "manual_fan_level_options": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "child_lock": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "buzzer": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "null"
                }
              ]
            },
            "motor_rpm": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "updated_at": {
              "type": "string"
            }
          },
          "required": [
            "power",
            "preset_mode",
            "preset_modes",
            "percentage",
            "pm1",
            "pm25",
            "pm10",
            "air_quality",
            "temperature",
            "humidity",
            "filter_life",
            "fault",
            "uv",
            "anion",
            "display",
            "brightness",
            "brightness_options",
            "manual_fan_level",
            "manual_fan_level_options",
            "child_lock",
            "buzzer",
            "motor_rpm",
            "updated_at"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "history": {
    "get": {
      "method": "get",
      "description": "Get purifier history from Home Assistant",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "range": {
              "type": "string",
              "enum": [
                "6h",
                "24h",
                "7d"
              ]
            }
          },
          "required": [
            "range"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "points": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "t": {
                    "type": "number"
                  },
                  "pm1": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "pm25": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "pm10": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "temperature": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "humidity": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  }
                },
                "required": [
                  "t",
                  "pm1",
                  "pm25",
                  "pm10",
                  "temperature",
                  "humidity"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "points"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "control": {
    "call": {
      "method": "post",
      "description": "Call a whitelisted Home Assistant purifier action",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "action": {
              "type": "string",
              "enum": [
                "power_on",
                "power_off",
                "set_mode",
                "set_fan_speed",
                "uv_on",
                "uv_off",
                "anion_on",
                "anion_off",
                "display_on",
                "display_off",
                "set_brightness",
                "set_manual_fan_level",
                "child_lock_on",
                "child_lock_off",
                "buzzer_on",
                "buzzer_off"
              ]
            },
            "value": {
              "type": "string"
            }
          },
          "required": [
            "action"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    }
  }
} as const

export default contract
