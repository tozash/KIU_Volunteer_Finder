# Milestone 6 - Create and Edit Event Pages

Adds basic forms for organizers to create and modify events. A dummy event dataset is used so functionality can be tested without a backend.

## Added
- `CreateEvent` page with image URL input and dynamic question list.
- `EditEvent` page populated with the dummy event data.
- `dummyEvents` in `src/lib/dummyData.ts` referenced by landing and detail pages.

## Usage
Forms update the in-memory list and log results to the console. Run linting with:

```bash
npm run lint
```

Linting may fail if dependencies are missing.
