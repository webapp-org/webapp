#!/bin/bash

# Install MySQL
sudo yum install mysql-server -y

# Start MySQL server
sudo systemctl start mysqld.service

# Update MySQL password
mysql --connect-expired-password -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'chinmay1234';"

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install unzip and unzip the assignment folder
sudo yum install unzip
# unzip Chinmay_Gulhane_002831871_02-1.zip 

echo "Dependencies installed successfully."
