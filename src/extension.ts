import * as fs from 'fs';
import * as vscode from 'vscode';
import { parse } from 'yaml';
const outputChannel = vscode.window.createOutputChannel('Asset Validator');

function getDeclaredAssets(): string[] | null {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) { return null; }

	const pubspecPath = vscode.Uri.joinPath(workspaceFolder.uri, 'pubspec.yaml').fsPath;
	if (!fs.existsSync(pubspecPath)) { return null; }

	const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
	const pubspecData = parse(pubspecContent);

	if (pubspecData.flutter && pubspecData.flutter.assets) {
		return pubspecData.flutter.assets;
	}
	return null;
}

function checkAssetPlacement(declaredAssets: string[]): string[] {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) { return []; }

	const missingAssets: string[] = [];
	declaredAssets.forEach(asset => {
		const assetPath = vscode.Uri.joinPath(workspaceFolder.uri, asset).fsPath;
		if (!fs.existsSync(assetPath)) {
			missingAssets.push(asset);
		}
	});

	return missingAssets;
}

async function checkAssetUsage(declaredAssets: string[], progress: vscode.Progress<{ message?: string, increment?: number }>): Promise<string[]> {
	const unusedAssets: string[] = [];
	const totalAssets = declaredAssets.length;

	for (let i = 0; i < totalAssets; i++) {
		const asset = declaredAssets[i];
		const found = await searchAssetInWorkspace(asset);
		if (!found) {
			unusedAssets.push(asset);
		}

		// Update the progress bar
		const percentage = ((i + 1) / totalAssets) * 100;
		progress.report({ message: `Checking asset usage: ${asset}`, increment: percentage / totalAssets });
	}

	return unusedAssets;
}

async function searchAssetInWorkspace(asset: string): Promise<boolean> {
	const dartFiles = await vscode.workspace.findFiles('**/*.dart', '**/node_modules/**');

	for (const file of dartFiles) {
		const document = await vscode.workspace.openTextDocument(file);
		const text = document.getText();
		if (text.includes(asset)) {
			return true; // Asset found in this file
		}
	}

	return false; // Asset not found in any file
}

async function validateAssets() {
	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Asset Validator",
		cancellable: false
	}, async (progress) => {
		const declaredAssets = getDeclaredAssets();
		outputChannel.clear(); // Clear the output channel for every new run
		outputChannel.appendLine('========================================');
		outputChannel.appendLine('     🛠️  Flutter Asset Validator');
		outputChannel.appendLine('========================================');
		outputChannel.appendLine('');

		if (!declaredAssets) {
			outputChannel.appendLine('⚠️  No assets declared in `pubspec.yaml`.');
			outputChannel.show(true); // Show the output channel to the user
			return;
		}

		progress.report({ message: "Starting asset validation..." });

		outputChannel.appendLine('🔍 Starting asset validation...');
		outputChannel.appendLine('');
		outputChannel.appendLine('Declared assets:');
		declaredAssets.forEach(asset => {
			outputChannel.appendLine(`  - 📄 ${asset}`);
		});
		outputChannel.appendLine('');

		progress.report({ message: "Checking asset placements..." });
		const missingAssets = checkAssetPlacement(declaredAssets);

		progress.report({ message: "Checking asset usage..." });
		const unusedAssets = await checkAssetUsage(declaredAssets, progress);

		// Display the validation results
		outputChannel.appendLine('Validation Results:');
		outputChannel.appendLine('------------------------------');

		if (missingAssets.length === 0 && unusedAssets.length === 0) {
			outputChannel.appendLine('✅ All assets are correctly placed and used. Great job! 🎉');
		} else {
			if (missingAssets.length > 0) {
				outputChannel.appendLine('❌ Missing assets:');
				missingAssets.forEach(asset => {
					outputChannel.appendLine(`  - 🚫 ${asset}`);
				});
			} else {
				outputChannel.appendLine('✅ No missing assets found.');
			}

			outputChannel.appendLine(''); // Separate missing from unused
			if (unusedAssets.length > 0) {
				outputChannel.appendLine('⚠️  Unused assets:');
				unusedAssets.forEach(asset => {
					outputChannel.appendLine(`  - ⚠️ ${asset}`);
				});
			} else {
				outputChannel.appendLine('✅ All assets are being used.');
			}
		}

		outputChannel.appendLine('');
		outputChannel.appendLine('====================================');
		outputChannel.appendLine('✔️  Asset validation completed.');
		outputChannel.appendLine('====================================');
		outputChannel.show(true); // Show the output channel to the user
	});
}

export function activate(context: vscode.ExtensionContext) {
	const validateCommand = vscode.commands.registerCommand('assetValidator.validate', validateAssets);
	context.subscriptions.push(validateCommand);
}
