#!/bin/bash

sudo adduser csye6225 --shell /usr/sbin/nologin

sudo mv /tmp/webapp.zip /home/webapp.zip
# set ownership
sudo chown csye6225:csye6225 /home/webapp.zip
sudo unzip /home/webapp.zip -d /home/webapp
sudo chown -R csye6225:csye6225 /home/webapp
