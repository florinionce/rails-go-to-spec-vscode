# Rails Go to Spec extension for VSCODE

Jump between code and spec in Rails projects.

To install search for

```
rails-go-to-spec-2
```

## Default keybinding:

- Ctrl + Shift + y
- Cmd + Shift + y (Mac)

## Redine shortcuts:

In keybindings.json

```
  ...
	{
		"key": "shift-cmd-y",
		"command": "rails-go-to-spec-2.railsGoToSpec",
		"when": "editorFocus"
	}
	...
```

## Local Installation

To install the extension locally for development:

1. Clone the repository:
```bash
git clone https://github.com/sporto/rails-go-to-spec-vscode.git
cd rails-go-to-spec-vscode
```

2. Install dependencies:
```bash
npm install
```

3. Compile the TypeScript code:
```bash
npm run compile
```

4. Package the extension:
```bash
npm install -g @vscode/vsce
vsce package
```

5. Install the extension in VS Code:
```bash
code --install-extension rails-go-to-spec-2-1.3.0.vsix
```

The extension should now be installed and ready to use. You can verify the installation by:
- Opening VS Code's Extensions panel (Cmd+Shift+X on macOS or Ctrl+Shift+X on Windows/Linux)
- Looking for "Rails Go to Spec 2" in your installed extensions
- Or running `code --list-extensions | grep rails-go-to-spec` in the terminal

To test the installation, open any Ruby file in your Rails project and use either:
- The keyboard shortcut (Cmd+Shift+Y on macOS or Ctrl+Shift+Y on Windows/Linux)
- Or right-click in the editor and select "Rails Go to Spec" from the context menu
