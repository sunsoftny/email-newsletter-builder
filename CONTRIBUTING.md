# Contributing to Email Newsletter Builder

Thank you for your interest in contributing! We welcome contributions from the community to help make this the best email builder for React.

## 🛠️ Development Setup

1.  **Fork and Clone** the repository.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Dev Server**:
    ```bash
    npm run dev
    ```
    This will launch the test environment at `http://localhost:3000`.

## 🐛 Reporting Bugs

Please use the [GitHub Issues](https://github.com/sunsoftny/email-newsletter-builder/issues) tab to report bugs. Include:
- Steps to reproduce
- Expected behavior vs. actual behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open a new Issue and tag it as `enhancement`. We love hearing about new use cases!

## 📥 Pull Requests

1.  Create a new branch for your feature or fix: `git checkout -b feature/amazing-feature`.
2.  Commit your changes with clear messages.
3.  Push to your fork and open a Pull Request against `main`.
4.  Ensure your code follows the existing style (we use ESLint).

## 🤖 AI Development

If you are working on the AI modules:
- The `src/lib/types.ts` file defines the `AiFeatures` interface.
- Mock implementations for development are located in `src/lib/mock-ai.ts`.
- Ensure any new AI props are backend-agnostic (use callbacks, not direct API calls).

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
