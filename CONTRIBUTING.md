# Contributing

Thanks for your interest in contributing to **DevToolsHub**!

This project is a collection of simple, fast developer tools. It is still in an early stage, so contributions of all sizes are welcome.

---

## How to Contribute

1.  **Fork** the repository.
2.  **Clone** your fork:
    ```bash
    git clone [https://github.com/your-username/devtools-hub.git](https://github.com/your-username/devtools-hub.git)
    cd devtools-hub
    ```
3.  **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  **Install dependencies and run the project**:
    ```bash
    pnpm install
    pnpm dev
    ```
5.  **Make your changes**.
6.  **Commit your changes**:
    ```bash
    git commit -m "feat: add clear button"
    ```
7.  **Push your branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request**.

---

## Contribution Guidelines

- Keep code **simple and readable**.
- Avoid **unnecessary dependencies**.
- Follow the **existing project structure**.
- Keep the **UI consistent**.
- Do **not** introduce breaking changes without discussion.

### Linking Issues

If your pull request fixes an issue, link it in the PR description using one of these keywords:

- `closes #issue-number`
- `fixes #issue-number`
- `resolves #issue-number`

> **Example:** `closes #4`
> This will automatically close the issue when the PR is merged.

---

## Pull Request Guidelines

- Keep PRs **small and focused**.
- Describe **what** you changed and **why**.
- Link **related issues**.
- Ensure the project runs **without errors**.

### PR Description Example:

```markdown
## What changed

Added copy success feedback.

## Related issue

closes #1
```
