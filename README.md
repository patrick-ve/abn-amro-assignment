# ABN AMRO Assignment

## Development Setup

### Prerequisites

- Node.js (version specified in package.json)
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Git Workflow

### Pre-commit Hooks

This project uses Husky to enforce code quality checks before each commit. The following checks run automatically when you attempt to commit:

1.  ESLint (`npm run lint`)
2.  TypeScript type checking (`npm run typecheck`)

If any of these checks fail, your commit will be prevented until you fix the issues.

### Making Changes

1.  Make your changes in your feature branch
2.  Stage your changes: `git add .`
3.  Commit your changes: `git commit -m "your message"`
    - Pre-commit hooks will automatically run
    - If checks pass, your commit will complete
    - If checks fail, fix the issues and try committing again
4.  Push your changes: `git push`

### Troubleshooting

If you need to bypass the pre-commit hooks in exceptional cases (not recommended), you can use:

```bash
git commit -m "your message" --no-verify
```

## Unit Testing

This project uses [Vitest](https://vitest.dev/) for unit testing, primarily focused on testing individual Vue components.

- Test files are located in `app/components/__tests__`.
- Tests verify component rendering, behavior, and interactions in isolation.

**Available Scripts:**

```bash
# Run all unit tests
npm run unit

# Run unit tests in UI mode for interactive debugging
npm run unit:ui

# Run unit tests and generate a coverage report
npm run unit:coverage
```

## E2E Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. E2E tests simulate real user interactions within the browser to verify application flows and ensure accessibility compliance using `axe-core`.

- Test files are located in `e2e/tests`.
- These tests cover critical user journeys from start to finish.

Before running the tests for the first time, you need to install the required browser binaries:

```bash
npx playwright install
```

**Available Scripts:**

```bash
# Run all E2E tests
npm run e2e

# Run E2E tests in UI mode for debugging
npm run e2e:ui

# Run E2E tests and update snapshots if they have changed
npm run e2e:update
```
