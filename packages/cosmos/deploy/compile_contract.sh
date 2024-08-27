#!/bin/bash

# Go to contracts directory
cd contracts

# Build contract
cargo build --lib

# Store the output of `uname -m` in a variable
arch=$(uname -m)

# Conditional execution based on the architecture
if [ "$arch" == "arm64" ]; then
  docker run --rm -v "$(pwd)":/code \
    --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
    --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    cosmwasm/rust-optimizer-arm64:0.15.1
else
  docker run --rm -v "$(pwd)":/code \
    --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
    --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    cosmwasm/rust-optimizer:0.15.1
fi