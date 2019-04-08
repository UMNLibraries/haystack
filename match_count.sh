#!/bin/bash

awk '{ SUM += $1} END { print SUM }' logs/matches.log