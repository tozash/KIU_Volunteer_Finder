# Milestone 10 - Polish & QA

Final polish with a global toast system and responsive tweaks.

## Added
- `ToastProvider` and `useToast` hook in `components/common/Toast.tsx`.
- Wrapped app with the toast provider.
- Toast notifications on application submission, cancellation and event save actions.
- Responsive containers on main pages for wide screens.
- Accessibility improvement using `aria-live` on the toast region.

## Usage
Run the dev server as usual:

```bash
npm run dev
```

Linting and tests remain:

```bash
npm run lint
npm run test
```

Both commands may fail if dependencies are missing in the environment.
