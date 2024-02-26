#!/bin/bash
set -e

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install unzip and unzip the assignment folder
sudo yum install -y zip unzip

echo "Dependencies installed successfully."
