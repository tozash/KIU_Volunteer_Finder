# Milestone 4 - Auth Modals

Implements basic authentication UI and state handling.

## Added
- `AuthModal` component with login and register forms validated by React Hook Form and Zod
- `useAuth` hook and `AuthProvider` to manage auth state stored in `localStorage`
- Integration with `NavBar` to open the modal when not logged in and provide logout

## How to test
Run linting (may fail if deps missing):
```bash
npm run lint
```
