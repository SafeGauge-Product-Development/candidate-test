# SafeGauge Sensor Portal

A React/Vite portal for managing industrial sensor devices and viewing their live telemetry.

## Run locally

```bash
cd candidate-test-app
npm install
npm run dev
```

## Test accounts

- `admin` / `safegauge` - full device access
- `viewer` / `readonly` - read-only access

## Implemented
- Login and logout flows with role-aware controls.
- Centralized handling of authenticated 401 API responses: the saved session is cleared and the user is returned to login.
- Device list, create, edit, delete, loading, empty, and error states.
- Inline validation for device name, site, and sensor count, including API 422 field errors.
- Retries for transient 500 API failures.
- Selected-device live dashboard with latest reading, unit, last-updated time, and connection status.
- Telemetry subscriptions are cleaned up when switching devices or unmounting.

## Decisions and Trade-offs

- I used small React components and hooks rather than adding a state-management library for this scope.
- REST requests go through a shared wrapper so transient 500 retries and authenticated 401 handling are consistent.
- Persisting login on refresh isn't working. I attempted to store session token at a high level (AuthProvider), and used AI to try and solve it. When I could not I implemented the "reload device" buttons. Investigation concluded: the supplied mock API stores issued tokens only in module memory. The app saves the session in localStorage, but a full browser refresh reloads the mock and invalidates that token, causing a 401. I left the supplied mock unchanged as requested. In a production implementation, the server would provide a persistent or refreshable session.
- Alert-rule CRUD, live breach styling and tests were treated as stretch goals and are not implemented.


## Next Steps
- Add tests for the retry wrapper and the global 401 logout path.
- Add confirmation before deleting a device.
- Improve the responsive layout and replace temporary reload controls with more polished retry affordances.
- Extract repeated form validation/error rendering into reusable helpers.
- Refine component boundaries so validation and device form concerns are more isolated.
- Implement alert-rule CRUD and apply rules to live readings.
- Improve the device and form experience, including responsive layout and reduced state duplication.

## AI Use
I used GitHub Copilot to help with:

- Deciding where to place the provided mock API and SDK files in the Vite project.
- Reviewing and refining the API-wrapper/session structure.
- Small refactors, such as form labels.
- Investigating the mock API session-persistence limitation.
- Proofing documentation.
- Looking up or confirming React and JavaScript syntax while implementing features, such as conditional rendering and form handling.

All implementation decisions and final integration were reviewed and tested manually.

## Process Improvements

- Timebox investigation of external or harness-level limitations earlier, then document the result and move on.
- Make smaller, focused commits throughout implementation.
- Set up linting at the start of the task.