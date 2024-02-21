#!/bin/bash
set -e
# unable mysql service
sudo systemctl enable mysqld.service

# move and run the service
sudo mv /tmp/app.service /etc/systemd/system/app.service
sudo systemctl daemon-reload
sudo systemctl enable app.service
