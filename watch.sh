#!/bin/bash
 
DIR_TO_WATCH="data"
COMMAND="sudo go run build.go"
 
trap "echo Exited!; exit;" SIGINT SIGTERM
while [[ 1=1 ]]
do
  watch --chgexit -n 1 "ls --all -l --recursive --full-time ${DIR_TO_WATCH} | sha256sum" && ${COMMAND}
  sleep 1
done