# NexKey

**A customizable keyboard for Android and iOS.**

NexKey is being built as a privacy-first keyboard platform with a shared app experience, a theme studio, and native keyboard extensions for each operating system.

## Project status

This repository currently contains the first application scaffold and product architecture. The React Native app is the shared control center; it is **not yet a working system keyboard**. Native Android IME and iOS keyboard-extension targets still need to be implemented and tested on their respective platforms.

## Planned capabilities

- Android and iOS keyboard extensions
- Theme Studio: colors, key shapes, typography, spacing and image backgrounds
- Theme preview, save, import/export and community sharing
- Turkish, Azerbaijani, English and additional languages
- Suggestions and on-device typing preferences
- Optional AI writing tools with explicit consent
- Free and Premium tiers
- In-app version information and store-based update guidance

## Run the app

Requires Node.js and a development environment capable of running Expo / React Native.

```bash
npm install
npx expo start
```

For native development builds, use the platform-specific Expo / React Native tooling. Expo Go is only for previewing the shared app UI; it cannot provide the custom system keyboard extensions.

## Important platform notes

- Android keyboard integration will use a native Kotlin `InputMethodService`.
- iOS keyboard integration will use a Swift Custom Keyboard Extension and must respect Apple's extension restrictions.
- Android app updates should be delivered through Google Play or the chosen trusted distribution channel. iOS updates are distributed through the App Store. NexKey will not silently install APKs or bypass store controls.
- Typing content must not be transmitted to NexKey servers by default. Remote AI features will require clear opt-in.

See [Architecture](docs/architecture.md), [Privacy](docs/privacy.md) and [Roadmap](docs/roadmap.md).
