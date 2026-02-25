# Git Command Reference

## Setup & Auth

| Command                                          | What it does                 |
| ------------------------------------------------ | ---------------------------- |
| `gh auth login`                                  | Log in to GitHub via browser |
| `git config --global user.name "Your Name"`      | Set your name on commits     |
| `git config --global user.email "you@email.com"` | Set your email on commits    |

---

## Starting Work

| Command                            | What it does                              |
| ---------------------------------- | ----------------------------------------- |
| `git status`                       | Show changed, staged, and untracked files |
| `git log --oneline`                | Show recent commits in one line each      |
| `git checkout -b feat/branch-name` | Create a new branch and switch to it      |
| `git checkout main`                | Switch to the main branch                 |
| `git pull origin main`             | Pull latest changes from remote main      |
| `git branch`                       | List all local branches                   |
| `git branch -a`                    | List all branches including remote        |

---

## Saving Changes

| Command                               | What it does                                |
| ------------------------------------- | ------------------------------------------- |
| `git add .`                           | Stage all changed files                     |
| `git add apps/ packages/`             | Stage specific folders only                 |
| `git commit -m "feat: description"`   | Commit staged changes with a message        |
| `git push -u origin feat/branch-name` | Push branch to GitHub for the first time    |
| `git push`                            | Push subsequent commits (after `-u` is set) |

---

## Merging & Syncing

| Command            | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `git merge main`   | Merge main into your current branch              |
| `git fetch origin` | Download remote changes without applying them    |
| `git pull`         | Fetch and apply remote changes to current branch |

---

## Undoing Things

| Command                   | What it does                          |
| ------------------------- | ------------------------------------- |
| `git restore filename.ts` | Discard unsaved changes to a file     |
| `git restore .`           | Discard all unsaved changes           |
| `git reset HEAD~1`        | Undo last commit, keep changes staged |
| `git stash`               | Temporarily shelve changes            |
| `git stash pop`           | Restore shelved changes               |
| `git diff`                | Show what changed since last commit   |

---

## GitHub Pull Requests

| Command                                             | What it does                |
| --------------------------------------------------- | --------------------------- |
| `gh pr create --title "title" --body "description"` | Create a pull request       |
| `gh pr list`                                        | List open pull requests     |
| `gh pr merge`                                       | Merge the current branch PR |

---

## Creating a New Repo

| Command                                                                | What it does                                        |
| ---------------------------------------------------------------------- | --------------------------------------------------- |
| `gh repo create repo-name --public --source=. --remote=origin --push`  | Create a public repo on GitHub from current folder  |
| `gh repo create repo-name --private --source=. --remote=origin --push` | Create a private repo on GitHub from current folder |

---

## Commit Message Convention

```
feat:     new feature
fix:      bug fix
refactor: code restructure
docs:     documentation changes
chore:    maintenance tasks
```

### Examples

```
git commit -m "feat: add clear history button"
git commit -m "fix: resolve createdAt type mismatch"
git commit -m "chore: update ingestion batch size"
```

---

## Daily Workflow

```bash
# 1. Pull latest changes before starting
git pull origin main

# 2. Create a new branch for your work
git checkout -b feat/your-feature

# 3. Make your changes, then stage and commit
git add .
git commit -m "feat: description of what you did"

# 4. Push to GitHub
git push -u origin feat/your-feature
```
