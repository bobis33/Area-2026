# Contributing to Area

This guide ensures contributions are **consistent, readable, and maintainable**.

---

## Contribution workflow
We strictly use **GitHub Issues** and **Pull Requests** (PRs).
No direct commits to `main` are allowed.

### Create / Find an Issue
Before contributing, make sure there is an **open issue** for your task.
If not, **create one** using the provided templates:

- **Bug Report**
- **Feature Request**

### Branching & PR Naming
Each contribution must be developed in a dedicated branch.
Branches and Pull Requests must follow this naming convention:
```
<Type>/<Scope>/<Sub-scope>
```
- **Type** → `Feature` | `Fix` | `Refactor` | `Docs` | `Test` | `CI`
- **Scope** → `Client` | `Server`
- **Sub-scope** → `Mobile` | `Web`

This ensures consistency across branches and PRs, making it easy to identify the purpose of each contribution at a glance.

### Commit Norms
| Commit Type | Description                                                                                                               |
|:------------|:--------------------------------------------------------------------------------------------------------------------------|
| build       | Changes that affect the build system or external dependencies (npm, make, etc.)                                           |
| ci          | Changes related to integration files and scripts or configuration (Travis, Ansible, BrowserStack, etc.)                   |
| feat        | Addition of a new feature                                                                                                 |
| fix         | Bug fix                                                                                                                   |
| perf        | Performance improvements                                                                                                  |
| refactor    | Modification that neither adds a new feature nor improves performance                                                     |
| style       | Change that does not affect functionality or semantics (indentation, formatting, adding space, renaming a variable, etc.) |
| docs        | Writing or updating documentation                                                                                         |
| test        | Addition or modification of tests                                                                                         |

## Code Style

### Typescript

### CSS

### Yaml
- Extention : `.yml`