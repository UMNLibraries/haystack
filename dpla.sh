#!/bin/bash

if [ ! -d "./dpla_data" ]; then
    mkdir 'dpla_data'
fi

# Get latest dpla dumps
nvm use v8.10.0; time node get_latest_dpla.js;

# Process dpla dumps
FILES='./dpla_data/*'
for f in $FILES
do
  nohup nvm use v8.10.0; time node run.js -i ${f} -r 'http://hub-client.lib.umn.edu/lookups/34.json' -b 'ul-haystacker-umbra' &
done