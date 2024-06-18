#!/bin/bash
set -e

# copy and run the service
cd /etc/systemd/system/
sudo touch /etc/systemd/system/app.service
sudo cp /tmp/app.service /etc/systemd/system/app.service
sudo systemctl daemon-reload
sudo systemctl enable app.service
