#!/bin/bash

version=8.28.0

wget https://github.com/gitleaks/gitleaks/releases/download/v${version}/gitleaks_${version}_linux_x64.tar.gz
tar -xf gitleaks_${version}_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/