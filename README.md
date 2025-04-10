# ABN AMRO Assignment: "ABNFLIX" 🎬

## Development Setup 🛠️

### Prerequisites ✅

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm

### Installation 📦

```bash
# Install dependencies
npm install
```

### Development Commands ▶️

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

### Recommended VS Code Extensions 🧑‍💻

For an optimal development experience, I recommend installing the following VS Code extensions:

- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)**: Provides autocompletion, linting, syntax highlighting, and documentation for Tailwind CSS.
- **[Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind)**: An opinionated class sorter for Tailwind CSS that automatically enforces a consistent order for your classes.

## Application Structure (`app/`) 📁

The `app/` directory contains the core of the Nuxt 3 application, following standard conventions:

- **`app.vue`**: 🚪 The main entry point for your application's layout and routing.
- **`components/`**: 🧱 Contains reusable Vue components. Components in this directory are auto-imported by Nuxt.
- **`composables/`**: 🎣 Stores reusable Vue Composition API functions (composables). These are also auto-imported.
- **`layouts/`**: 🖼️ Defines different page layouts for your application (e.g., default, authenticated).
- **`pages/`**: 📄 Contains your application's views and routes. Nuxt automatically generates routes based on the file structure here.
- **`types/`**: 🏷️ Holds TypeScript type definitions specific to your application.

## Git Workflow 🔄

### Pre-commit Hooks 🔒

This project uses Husky and lint-staged to enforce code quality checks before each commit. The following checks run automatically on staged files when you attempt to commit:

1.  ESLint (`npm run lint`) using `@antfu/eslint-config`.
2.  TypeScript type checking (`npm run typecheck`).

If any of these checks fail, your commit will be prevented until you fix the issues.

### Making Changes ✨

1.  Make your changes in your feature branch.
2.  Stage your changes: `git add .`
3.  Commit your changes: `git commit -m "your message"`
    - Pre-commit hooks will automatically run on staged files.
    - If checks pass, your commit will complete.
    - If checks fail, fix the issues and try committing again.
4.  Push your changes: `git push` 🚀

### Troubleshooting ❓

If you need to bypass the pre-commit hooks in exceptional cases (not recommended), you can use:

```bash
git commit -m "your message" --no-verify
```

## Unit Testing (Vitest) 🧪

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

## E2E Testing (Playwright) 🤖

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

## Architectural Choices & Assignment Alignment 🎯

This project aims to fulfill the requirements of the ABN AMRO frontend developer assignment by demonstrating familiarity with modern frontend technologies, clean code practices, and testing methodologies.

### Framework Choice: Nuxt 3 (Vue 3) ✨

Nuxt 3 was chosen for this assignment due to several key advantages:

- **Developer Experience:** Nuxt provides an excellent development experience with features like file-based routing, auto-imports for components and composables, and integrated TypeScript support, leading to faster development and cleaner code organization.
- **Performance:** Built on Vite and Vue 3, Nuxt offers great performance characteristics, including server-side rendering (SSR) capabilities out-of-the-box, although this project primarily focuses on client-side rendering.
- **Ecosystem:** Leveraging the Vue 3 ecosystem allows for the use of modern tools like Pinia (though not used here) and the Composition API, which enhances code reusability and maintainability (e.g., `useFetchShows`, `useDebounce`).
- **Structure:** Nuxt's conventional directory structure (`pages/`, `components/`, `composables/`) naturally encourages modularity and separation of concerns, aligning with the assignment's focus on clean and reusable code.

### Meeting Assignment Requirements ✅

- **Core Functionality:** The application fetches TV show data from the TVMaze API (`composables/useFetchShows.ts`) and displays genre-based lists on the dashboard (`pages/index.vue`, `components/GenreList.vue`), with navigation to a detailed view (`pages/shows/[id].vue`, `components/Show/ShowDetail.vue`). Search functionality is also implemented (`components/Search/`).
- **Responsiveness & UI:** [Tailwind CSS](https://tailwindcss.com/) is used for styling, ensuring a responsive and mobile-friendly design. The UI aims for a simple yet eye-catching aesthetic as requested. E2E tests specifically include checks on mobile viewport sizes.
- **Clean Code & Best Practices:** The project emphasizes clean code through:
  - **TypeScript:** For static typing and improved code quality.
  - **Modularity:** Components (`components/`) and reusable logic (`composables/`) are well-defined.
  - **Linting:** Enforced via ESLint (`@antfu/eslint-config`) and pre-commit hooks (Husky) to maintain code consistency.
  - **Structure:** Follows Nuxt conventions for clear organization.
- **Testing:** Comprehensive testing is included:
  - **Unit Tests (Vitest):** Located in `app/components/__tests__`, covering individual components and composables (as required). Run with `npm run unit`.
  - **End-to-End Tests (Playwright):** Located in `e2e/tests`, verifying key user flows (dashboard view, navigation to details, search) and accessibility checks across desktop and mobile browsers. Run with `npm run e2e`.
- **Reusability:** Composables (`useFetchShows`, `useDebounce`) and a structured component library (`components/Base`, `components/Show`, `components/Search`) promote code reuse.
- **Minimal Scaffolding:** While Nuxt provides a framework structure, the core components, logic, and UI styling represent original creation efforts rather than relying heavily on pre-built templates.
