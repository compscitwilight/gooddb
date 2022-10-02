@echo off
title gooddb
cls

if exist ../cli/index.ts (
    ts-node ../cli/index.ts  
    pause
) else (
    color 4
    echo "Could not find gooddb command line entry point."
)