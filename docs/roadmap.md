# Roadmap

## Phase 0 — Foundation (in progress)
- [x] Create repository and shared React Native app scaffold
- [x] Establish initial dark visual system and keyboard preview
- [x] Premium UI redesign: shared design system, dark/light appearance, redesigned screens and keyboard (see design-system.md)
- [x] Document native architecture and privacy requirements
- [ ] Run dependency install, typecheck and device build

## Phase 1 — Real keyboard
- [x] Add Android Kotlin InputMethodService generation through Expo config plugin
- [ ] Build, install and test Android IME on a physical device
- [ ] Add guided enable/select keyboard onboarding
- [x] Declare initial Android language subtypes (English, Turkish, Azerbaijani)
- [ ] iOS Custom Keyboard Extension target
- [ ] Enable/disable instructions and platform testing

## Phase 2 — Theme Studio
- [x] Editable HEX colors in the app preview
- [x] Adjustable key corner radius
- [x] Save custom theme locally on the device
- [ ] Photo backgrounds and asset picker
- [ ] Font and spacing controls
- [ ] Duplicate, import and export themes
- [ ] Apply saved theme to native keyboards

## Phase 3 — Typing features
- [ ] Turkish, Azerbaijani and English native layouts
- [ ] Suggestions and personal dictionary
- [x] Basic number/symbol layout toggle
- [ ] Emoji keyboard, haptics, sound and accessibility controls

## Phase 4 — Product services
- [ ] Accounts and cloud backup (opt-in)
- [ ] Community theme discovery and moderation
- [ ] Free / Premium entitlements and store billing
- [x] In-app update check/download/restart flow added (EAS project linked; channel publishing pending)
- [ ] Version check, release notes and store update links

## Phase 5 — Release readiness
- [ ] Privacy and security review
- [ ] Accessibility and localization review
- [ ] Android and iOS device testing
- [ ] Store assets, policy disclosures and release process
