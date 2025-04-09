# ABN AMRO Assignment

## Development Setup

### Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run linting checks (using @antfu/eslint-config)
npm run lint

# Run type checking
npm run typecheck
```

## Git Workflow

### Pre-commit Hooks

This project uses Husky and lint-staged to enforce code quality checks before each commit. The following checks run automatically on staged files when you attempt to commit:

1.  ESLint (`npm run lint`) using `@antfu/eslint-config`.
2.  TypeScript type checking (`npm run typecheck`).

If any of these checks fail, your commit will be prevented until you fix the issues.

### Making Changes

1.  Make your changes in your feature branch.
2.  Stage your changes: `git add .`
3.  Commit your changes: `git commit -m "your message"`
    - Pre-commit hooks will automatically run on staged files.
    - If checks pass, your commit will complete.
    - If checks fail, fix the issues and try committing again.
4.  Push your changes: `git push`

### Troubleshooting

If you need to bypass the pre-commit hooks in exceptional cases (not recommended), you can use:

```bash
git commit -m "your message" --no-verify
```

## Unit Testing (Vitest)

This project uses [Vitest](https://vitest.dev/) for unit testing, primarily focused on testing individual Vue components within a simulated Nuxt environment.

- **Test Files:** Located in `app/components/__tests__/*.spec.ts` (as per `vitest.config.ts`).
- **Environment:** Tests run in a `nuxt` environment.
- **Global Stubs:** Common Nuxt components like `NuxtLink`, `NuxtImg`, and `NuxtPicture` are automatically stubbed during tests (see `vitest.setup.ts`) to isolate the component under test.
- **Purpose:** Tests verify component rendering, behavior, and interactions in isolation.

**Available Scripts:**

```bash
# Run all unit tests
npm run unit

# Run unit tests in UI mode for interactive debugging
npm run unit:ui

# Run unit tests and generate a coverage report
npm run unit:coverage
```

## E2E Testing (Playwright)

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. E2E tests simulate real user interactions across different browsers to verify application flows and ensure accessibility compliance using `axe-core`.

- **Test Files:** Located in the `e2e` directory (as per `playwright.config.ts`).
- **Web Server:** Automatically starts the development server (`npm run dev`) on `http://localhost:3000` before running tests.
- **Browsers Tested:** Chromium (Desktop) and Mobile Chrome (Pixel 5).
- **Screenshot Styling:** A custom stylesheet (`e2e/screenshot.css`) is applied for consistent screenshot comparisons.
- **Purpose:** These tests cover critical user journeys from start to finish in a realistic browser environment.

Before running the tests for the first time, install the required browser binaries:

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
