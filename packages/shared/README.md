# @careflow/shared

Shared package for CareFlow monorepo.

## Exports
- **Schemas**: Zod schemas for all data models (e.g. `UserSchema`, `TicketSchema`).
- **Types**: TypeScript types inferred from Zod schemas (e.g. `User`, `Ticket`).
- **Mock Engine**: 
  - `mockApi`: Typed mock API methods for simulating backend endpoints.
  - `initEventBus`, `subscribe`, `emit`: Event bus for real-time syncing across apps.
  - `seedDemoData`, `resetDB`: Helper functions for managing local demo data.
  - `orderQueue`, `fairnessScore`, `slotCrowdLevel`: Queue and booking helper logic.
- **UI Kit**: Shared React components (`Button`, `Card`, `Badge`, `Modal`, `ThemeToggle`, `Skeleton`, `EmptyState`, `StatTile`).

## Usage
Import from `@careflow/shared`:
```ts
import { mockApi, Ticket, Button } from '@careflow/shared';
```
