#!/bin/bash

set -e

# Install ops agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# Move ops agent config
sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent
sudo systemctl restart google-cloud-ops-agent
