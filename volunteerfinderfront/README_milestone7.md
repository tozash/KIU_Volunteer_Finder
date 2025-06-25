# Milestone 7 - Organizer Dashboard

Adds basic pages for organizers to manage events and volunteers.

## Added
- `MyEvents` page listing dummy events with **Manage Event** and **Manage Volunteers** buttons.
- `Volunteers` page displaying volunteer applications with filter, sort and status actions.
- `VolunteerCard` component reused in the Volunteers page.
- Routes for `/my-events`, `/edit-event/:id` and `/events/:id/volunteers`.

## Usage
All data lives in memory so refresh will reset any changes. Run linting with:

```bash
npm run lint
```

Linting may fail if dependencies are missing.
