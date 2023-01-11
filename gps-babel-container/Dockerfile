FROM ubuntu:jammy

RUN apt-get update -y && apt-get install -y gpsbabel && apt-get install -y curl

ENTRYPOINT	["gpsbabel"]
