# In-app updates

NexKey uses Expo Updates for over-the-air updates to compatible JavaScript and app-bundle changes. The Settings screen includes a manual check, download and restart action.

## Required release setup

1. Create or select the NexKey EAS project.
2. Run `eas update:configure` and commit the generated EAS project ID and update URL in `app.json`.
3. Create the intended update branch/channel and configure the EAS build profile to use it.
4. Publish a compatible update with `eas update --branch production --message "Release notes"`.
5. Build and distribute a new native binary whenever native Android/iOS code, permissions, keyboard extensions, or native dependencies change.

The in-app updater is not expected to work in Expo Go or in builds where Updates is disabled/unconfigured. The repository still needs an EAS project ID, so OTA publishing is not activated yet.

Android native APK updates must still use Android's package installer with user approval or a trusted app store. iOS native updates must go through the App Store. OTA updates cannot replace native binaries or modify the keyboard extension engine.
