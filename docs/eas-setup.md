# EAS setup and release guide

NexKey is already linked to the Expo project owned by `eleddin01`. The EAS project ID and update URL are configured in `app.json`.

## One-time GitHub token setup

The repository's GitHub Actions workflows need an Expo access token:

1. Create an access token in your Expo account settings.
2. In GitHub, open the NexKey repository → Settings → Secrets and variables → Actions → New repository secret.
3. Name it exactly `EXPO_TOKEN` and paste the token into GitHub's secret field. Never paste the token into chat or commit it to the repository.

## Build an Android APK

1. Open the repository's Actions tab.
2. Select **EAS Build** → **Run workflow**.
3. Choose `android` and the `preview` profile.
4. Open the EAS build link when the build completes and download the APK.

The `preview` profile produces an installable APK. The `production` profile produces an Android App Bundle (AAB) for Google Play distribution. Production build numbers are configured to auto-increment.

## Publish an in-app update

1. Open Actions → **Publish EAS Update** → **Run workflow**.
2. Choose the matching update branch: `preview` for preview builds or `production` for production builds.
3. Enter a short release note and run it.

Only compatible installed builds whose channel is linked to the selected branch can receive that update through the NexKey Settings updater / Expo Updates.

## Important limits

- OTA updates are only for compatible JavaScript, UI, and bundled asset changes.
- Changes to Kotlin/Swift keyboard engines, native permissions, native dependencies, or extension configuration require a new native build.
- Android installation/update requires the user's approval through the package installer or a trusted store. iOS native updates go through the App Store.
- The iOS keyboard extension is not implemented yet; an iOS app build alone will not add a system keyboard.
