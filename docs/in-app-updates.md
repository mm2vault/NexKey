# In-app updates

NexKey uses Expo Updates for over-the-air updates to compatible JavaScript and app-bundle changes. The Settings screen includes a manual check, download and restart action.

## EAS project

The NexKey app is linked to the Expo project owned by `eleddin01`. Its EAS project ID and update URL are already stored in `app.json`.

## Release channels

- Preview builds use the `preview` channel and produce an installable Android APK.
- Production builds use the `production` channel and produce an Android App Bundle for store distribution.
- The GitHub Actions workflow `.github/workflows/eas-update.yml` can publish to either `preview` or `production`.

To publish manually, authenticate with EAS and run:

```bash
eas update --channel preview --message "Preview release notes"
```

Use `--channel production` for the production channel. The GitHub workflow requires an `EXPO_TOKEN` repository secret; never commit or share the token.

## Native updates

Build and distribute a new native binary whenever native Android/iOS code, permissions, keyboard extensions, or native dependencies change. OTA updates cannot replace native binaries or modify the keyboard extension engine.

Android APK updates must still use Android's package installer with user approval or a trusted app store. iOS native updates must go through the App Store. Expo Go does not support testing the native keyboard extension.
