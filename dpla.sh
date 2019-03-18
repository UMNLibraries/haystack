#!/bin/bash
FILES='./dpla_data/*'
for f in $FILES
do
  nohup nvm use v8.10.0; time node run.js -i ${f} -r 'http://hub-client.lib.umn.edu/lookups/34.json' -b 'ul-haystacker-umbra' &
done