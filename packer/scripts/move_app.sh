#!/bin/bash

sudo adduser csye6225 --shell /usr/sbin/nologin

sudo mv /tmp/webapp.zip /opt/webapp.zip
# set ownership
sudo chown csye6225:csye6225 /opt/webapp.zip
sudo unzip /opt/webapp.zip -d /opt/webapp
sudo chown -R csye6225:csye6225 /opt/webapp
