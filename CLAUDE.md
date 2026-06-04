# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Frontend SPA for the utility-billing app. See `../CLAUDE.md` for the monorepo overview and the backend API. This file documents the `utilities-front/` Angular package specifically.

## Commands

```bash
npm start                 # ng serve — dev server on localhost:4200 (dev config)
npm run build             # ng build — production build (default configuration)
npm run watch             # ng build --watch (development config)
npm test                  # ng test — Vitest via the @angular/build:unit-test builder
ng test --watch           # re-run on change
ng test --include='**/current.spec.ts'   # run a single spec file
```

There is no lint script; Prettier (`.prettierrc`, printWidth 100, single quotes, `angular` parser for HTML) is the only formatter.

## Stack notes (this is bleeding-edge Angular 21)

- **Standalone components only** — no NgModules. Every component sets `imports` itself. Class names carry **no suffix** (`Current`, `History`, `Settings`, `Layout`, `Header`) and files are lowercase by feature (`current.ts`, `current.html`, `current.scss`).
- **Signal-based state, no NgRx.** Services expose `signal()`/`computed()`/`linkedSignal()`; components read them directly in templates.
- **Experimental Signal Forms** — `form()` imported from `@angular/forms/signals` (not the classic `FormGroup`). A `signal`/`linkedSignal` holds the model, `form(model)` wraps it. See [current.ts](src/app/features/current/current.ts) and [settings.ts](src/app/features/settings/settings.ts). This API is unstable across Angular versions.
- **Temporal, not `Date`.** Date math uses `@js-temporal/polyfill` (`Temporal.Now`, `Temporal.PlainYearMonth`), centralized in [date.service.ts](src/app/shared/services/date.service.ts). Do not introduce `new Date()`.
- **PrimeNG runs `unstyled: true`** (see [app.config.ts](src/app/app.config.ts)). PrimeNG ships no theme CSS; all styling is hand-written SCSS under `src/styles/` (`custom-primeng.scss`, `components.scss`, `variables.scss`, `scrollbar.scss`), composed in [styles.scss](src/styles.scss). Style PrimeNG components yourself; don't expect a theme.

## Folder layout

- **`core/`** — app-wide singletons wired once: [interceptor.ts](src/app/core/interceptor.ts), [guards/auth-guard.ts](src/app/core/guards/auth-guard.ts), and the [layout/](src/app/core/layout/) shell.
- **`features/`** — one folder per route component: `login`, `current`, `history`, `settings`, plus `header` (rendered inside the layout).
- **`shared/`** — reusable pieces: `services/` (auth, date, utilities), `components/tooltip/`, `directives/tooltip.directive.ts`.

## Auth & routing flow

- [app.config.ts](src/app/app.config.ts) registers `provideAppInitializer(() => inject(AuthService).getUserInfo())` — on boot the app calls `GET /api/me` and populates `AuthService.user` (a signal) before routes activate.
- [interceptor.ts](src/app/core/interceptor.ts) clones every request with `withCredentials: true` (session cookie) and **redirects to `/login` on any 401**.
- [auth-guard.ts](src/app/core/guards/auth-guard.ts) converts the `user` signal to an observable, waits for the first non-null value, and otherwise routes to `/login`.
- [app.routes.ts](src/app/app.routes.ts): `/login` is public; everything else is a child of `Layout` guarded by `authGuard`, with `''` redirecting to `current`.

## Data layer

[utilities.service.ts](src/app/shared/services/utilities.service.ts) is the single API client for utility data. `latestRecord$` and `history$` are `shareReplay`-cached so multiple subscribers (Current + Settings both call `getLatestRecord()`) share one HTTP call. `latestRecord` is also mirrored into a signal for synchronous template/`computed` reads.

The canonical server shape is `HistoryRecord` in [history.interface.ts](src/app/features/history/history.interface.ts): `metrics` is nested per utility (`water`/`electricity` carry `{consumption, registered, paid}`; `heating`/`security`/`service` carry only `{paid}`). The history table flattens this via `columns.config.ts` (each column declares `format`: `string` | `nested` | `currency`).

## Environment

`src/environments/environment.ts` (dev) and `environment.prod.ts` (swapped in at build via `fileReplacements`). `environment.host` points at the backend (`http://localhost:3000` in dev). All API URLs are built as `${environment.host}/...`.
