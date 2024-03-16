#!/bin/bash

set -e

# Install ops agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# Add ops agent configuration
sudo tee /etc/google-cloud-ops-agent/config.yaml > /dev/null <<'EOL'
logging:
  receivers:
    custom_log:
      type: files
      include_paths:
      - /var/log/webapp/webapp.log
  processors:
    parse_json_logs:
      type: parse_json
    set_severity:
      type: modify_fields
      fields:
        severity:
          copy_from: jsonPayload.level
          map_values:
            "info": "INFO"
            "error": "ERROR"
            "warn": "WARNING"
  service:
    pipelines:
      default_pipeline:
        receivers: [custom_log]
        processors: [parse_json_logs, set_severity]
EOL
