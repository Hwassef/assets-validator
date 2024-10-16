# Asset Validator for Flutter

![Asset Validator](https://img.shields.io/badge/Flutter-AssetValidator-blue?style=flat-square)

## Overview

**Asset Validator** is a Visual Studio Code extension designed to help Flutter developers ensure that their declared assets in `pubspec.yaml` are correctly placed in the project directory and are actively used in the codebase. The extension checks for missing and unused assets, providing a clear output for developers.

## Features

- **Check Asset Placement**: Validates that all declared assets exist in the specified directories.
- **Check Asset Usage**: Scans the project files to ensure that all declared assets are used in the code.
- **Real-time Progress Updates**: Displays progress notifications while validating assets, helping users track the validation process.
- **Clear Output Logs**: Outputs structured results in a dedicated output channel, highlighting missing and unused assets.
- **Easy Integration**: Simple command to initiate validation with no configuration needed.

## Installation

1. Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac).
2. Search for **Asset Validator**.
3. Click **Install**.

## Usage

1. Ensure you have a `pubspec.yaml` file in your Flutter project with declared assets.
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type and select **Asset Validator: Validate** to run the validation process.
4. Check the output channel for results regarding missing and unused assets.

## Output

The extension provides feedback in the output channel, detailing:

- **Starting asset validation...**
- List of declared assets.
- Missing assets (if any).
- Unused assets (if any).
- Completion status.

## Example Output

==================== 🛠️ Flutter Asset Validator 🛠====================

🔍 Starting asset validation...

Declared assets:

📄 assets/images/logo.png

📄 assets/images/icon.png

❌ Missing assets:

🚫 assets/images/missing\_image.png

⚠️ Unused assets:

⚠️ assets/images/icon.png

=============== ✔️ Asset validation completed. ✔️=====================

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests for enhancements or bug fixes.

## Acknowledgments

- Thanks to the [VS Code API](https://code.visualstudio.com/api) for providing a robust environment for extension development.
- Special thanks to the Flutter community for ongoing support and feedback.
