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

# Run unit tests
npm run unit

# Run e2e tests
npm run e2e
```

## Git Workflow

### Pre-commit Hooks

This project uses Husky to enforce code quality checks before each commit. The following checks run automatically when you attempt to commit:

1. ESLint (`npm run lint`)
2. TypeScript type checking (`npm run typecheck`)

If any of these checks fail, your commit will be prevented until you fix the issues.

### Making Changes

1. Make your changes in your feature branch
2. Stage your changes: `git add .`
3. Commit your changes: `git commit -m "your message"`
   - Pre-commit hooks will automatically run
   - If checks pass, your commit will complete
   - If checks fail, fix the issues and try committing again
4. Push your changes: `git push`

### Troubleshooting

If you need to bypass the pre-commit hooks in exceptional cases (not recommended), you can use:

```bash
git commit -m "your message" --no-verify
```

## E2E Testing

This project uses Playwright for end-to-end testing. Before running the tests for the first time, you need to install the required browsers:

```
npx playwright install
```
