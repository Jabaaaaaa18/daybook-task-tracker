# Daybook

Daybook is a local Windows desktop wrapper for the task-tracker prototype.

## Download and run

- **Installer**: run `Daybook-Setup-1.0.0-x64.exe` from the `release` folder and follow the setup prompts.
- **Portable**: run `Daybook-Portable-1.0.0-x64.exe` from the `release` folder without installing.

The app stores requests and demo account roles locally on the device. It does not sync data or provide real authentication or authorization. The role chooser is for demonstration only. Do not enter confidential information.

## Build on Windows

1. Install Node.js LTS.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dist`.
5. Find the installer and portable app in `release`.

The app is unsigned, so Windows SmartScreen may show a warning when opening a locally built download.
