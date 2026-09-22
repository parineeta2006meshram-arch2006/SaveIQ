@echo off
title SaveIQ - AI Savings Goal Tracker
echo Starting SaveIQ Local Server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
