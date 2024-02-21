#!/bin/bash

# move and run the service
sudo systemctl enable mysqld.service
sudo mv /tmp/app.service /etc/systemd/system/app.service
sudo systemctl daemon-reload
sudo systemctl enable app.service
