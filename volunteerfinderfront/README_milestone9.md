# Milestone 9 - Testing & Mock API

Adds basic testing setup using Vitest, React Testing Library and Mock Service Worker.

## Added
- `vitest.config.ts` and `tsconfig.vitest.json` for the test environment.
- MSW handlers under `src/mocks` mocking `/events`, `/auth` and `/applications`.
- Example tests for Landing and MySubmissions pages.
- `npm run test` script.

Run tests with:

```bash
npm run test
```

Linting still runs with `npm run lint`.
