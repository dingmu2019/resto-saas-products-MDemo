---
name: "github-submit"
description: "Submits local changes to a GitHub repository. Invoke when user wants to push code to GitHub."
---

# GitHub Submit

This skill automates the process of staging changes, committing them, and pushing to a remote GitHub repository.

## Usage

When invoked, this skill will:
1. Stage all changes (`git add .`)
2. Commit changes with a descriptive message (`git commit -m "..."`)
3. Push to the specified remote branch (`git push origin <branch>`)

## Troubleshooting

- **Network Issues**: If the push fails due to network restrictions, ensure you have a stable internet connection or use a proxy.
- **Authentication**: Ensure your local environment is authenticated with GitHub (e.g., via `gh auth login` or SSH keys).
- **Manual Push**: If all else fails, run `git push -u origin main` in your local terminal.
