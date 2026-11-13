# NexKey design system

The app UI and the native Android keyboard share one visual language: violet accent, calm neutral surfaces, generous spacing, soft motion.

## Structure

- `src/design/tokens.ts` — colour palettes (dark and light), spacing, radius, type scale and colour helpers (`mix`, `withAlpha`, `readableOn`).
- `src/design/AppearanceContext.tsx` — app appearance (System / Light / Dark). The choice is stored locally under `nexkey.appearance.v1`; keyboard themes keep their own storage key.
- `src/components/Icon.tsx` — line icons drawn with plain Views, so no icon font or SVG package is needed.
- `src/components/ui.tsx` — shared primitives: `Press` (scale feedback), `Reveal` (entrance animation), `Card`, `Button`, `Segmented`, `InfoRow`, headings.
- `src/components/TabBar.tsx` — bottom navigation with a sliding indicator.
- `src/components/KeyboardPreview.tsx` — interactive keyboard preview (pressed keys, key pop-ups) and `MiniKeyboard` for theme cards.
- `src/screens/*` — Home, Studio, Themes and Settings. They are presentational: all state, storage and update logic stays in `App.tsx`.

## Rules

- Take colours from `useAppearance().c`; do not hard-code hex values in screens.
- Use the `space` and `radius` tokens for layout.
- Animations use the native driver (`transform`, `opacity`) only.
- Add no native packages for visuals; the UI must build with the current Expo SDK dependencies.

## Native keyboard

`plugins/withNexKeyKeyboard.js` generates the Kotlin `InputMethodService` plus three vector icons (`nexkey_ic_shift`, `nexkey_ic_backspace`, `nexkey_ic_enter`). The keyboard follows the system light/dark setting, shows raised keys with pressed states, gives haptic feedback and repeats backspace while held. Typing logic (commit text, delete, editor action, shift, symbols) is unchanged apart from deleting a selection when one exists.

Keyboard themes saved in Theme Studio are not yet applied to the native keyboard; see the roadmap.
