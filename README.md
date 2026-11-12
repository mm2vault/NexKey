# NexKey

**A customizable keyboard for Android and iOS.**

NexKey is being built as a privacy-first keyboard platform with a shared app experience, a theme studio, and native keyboard extensions for each operating system.

## Project status

The repository contains a React Native app scaffold, an Expo config plugin that generates a first Android InputMethodService prototype, and the initial product architecture. The Android keyboard is an early development prototype and has not yet been built or device-tested. The iOS keyboard extension remains to be implemented.

## Planned capabilities

- Android InputMethodService prototype (early; build/device testing pending)\n- iOS keyboard extension (planned)
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
