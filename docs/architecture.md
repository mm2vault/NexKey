# NexKey architecture

## Shared application

The first app scaffold uses React Native + TypeScript. It owns onboarding, theme editing, theme library, account surfaces, settings, subscription UI and update information.

## Native keyboard engines

The shared React Native app is not itself a system keyboard. Separate native targets are required:

- **Android:** Kotlin `InputMethodService`, input-method XML metadata, keyboard view/layout, lifecycle and subtype/language configuration.
- **iOS:** Swift Custom Keyboard Extension target, keyboard view controller, host-app communication through explicitly configured App Groups where appropriate, and compliance with extension limitations.

The native engines should consume a shared, versioned theme schema. Keep platform-specific rendering adapters so unsupported features degrade gracefully.

## Theme data

A theme should be serializable and portable. Initial fields: id, schemaVersion, name, colors, key shape/radius, typography, spacing, optional background asset reference, sound and haptic preferences. Validate imported themes before loading them.

## Services (later milestone)

- Authentication and cloud sync: evaluate Firebase after data model and privacy requirements are finalized.
- Community: moderation, reporting, upload limits and abuse prevention are required before public sharing.
- Premium: use Apple / Google in-app purchase systems for digital features.
- Updates: store-managed application updates; app may show version and release notes but must not bypass platform installation controls.

## Development sequence

1. Shared app scaffold and visual system.
2. Native Android keyboard prototype and device testing.
3. iOS keyboard extension target and device testing.
4. Shared theme schema and live theme application.
5. Language/input features, accessibility and privacy review.
6. Accounts, community, subscriptions and update metadata.
