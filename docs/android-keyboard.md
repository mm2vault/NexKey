# Android keyboard prototype

The Expo config plugin `plugins/withNexKeyKeyboard.js` adds a native Android input-method service during prebuild.

## Generate the native Android project

```bash
npm install
npx expo prebuild --platform android
```

The plugin writes:
- `android/app/src/main/java/com/mm2vault/nexkey/keyboard/NexKeyInputMethodService.kt`
- `android/app/src/main/res/xml/nexkey_input_method.xml`
- An exported IME service entry protected by `android.permission.BIND_INPUT_METHOD`

Build and install the Android app, then open Android Settings → System → Languages & input → On-screen keyboard / Manage keyboards. Enable NexKey and select it from the keyboard switcher.

Menu labels vary by Android manufacturer.

## Prototype limitations

This is the first real InputMethodService implementation, not a release-ready keyboard. It currently supports basic character insertion, a number/symbol layout toggle, shift, space, period, editor action / enter and backspace. It does not yet provide full language-specific layouts, predictive suggestions, emoji browsing, theme synchronization, accessibility polish or device-tested reliability.

The keyboard does not request network access or send typed text to a server. Do not enter sensitive information into an untested development keyboard.
