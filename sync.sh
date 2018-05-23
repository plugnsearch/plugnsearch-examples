#!/bin/bash
rsync -rv --exclude 'node_modules' --exclude 'results' --exclude 'finalResults' --exclude '.git' --exclude 'sync.sh' . calamari@dancesocially.com:/home/calamari/websearch-examples
