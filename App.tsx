import React, { useEffect, useState } from 'react';
import { Alert, NativeModules, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { themes, type KeyboardTheme } from './src/theme/presets';
import { AppearanceProvider, useAppearance } from './src/design/AppearanceContext';
import { isHex6, radius, space } from './src/design/tokens';
import { Icon } from './src/components/Icon';
import { Press } from './src/components/ui';
import { TabBar, type TabItem } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { StudioScreen, type ColorKey } from './src/screens/StudioScreen';
import { ThemesScreen } from './src/screens/ThemesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import type { Tab } from './src/screens/types';

const STORAGE_KEY = 'nexkey.custom-theme.v1';
const APP_VERSION = '0.3.1';
const colorFields: { key: ColorKey; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'key', label: 'Key color' },
  { key: 'text', label: 'Text color' },
  { key: 'accent', label: 'Accent color' },
];

const tabs: TabItem<Tab>[] = [
  { key: 'Home', label: 'Home', icon: 'home' },
  { key: 'Studio', label: 'Studio', icon: 'studio' },
  { key: 'Themes', label: 'Themes', icon: 'themes' },
  { key: 'Settings', label: 'Settings', icon: 'settings' },
];

export default function App() {
  return (
    <AppearanceProvider>
      <NexKeyApp />
    </AppearanceProvider>
  );
}

function NexKeyApp() {
  const { c, scheme, setMode } = useAppearance();
  const [tab, setTab] = useState<Tab>('Home');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [customTheme, setCustomTheme] = useState<KeyboardTheme>(themes[0]);
  const [hasCustomTheme, setHasCustomTheme] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('Tap below to check for an update.');
  const theme: KeyboardTheme = hasCustomTheme
    ? {
        ...customTheme,
        background: isHex6(customTheme.background) ? customTheme.background : themes[selectedTheme].background,
        key: isHex6(customTheme.key) ? customTheme.key : themes[selectedTheme].key,
        text: isHex6(customTheme.text) ? customTheme.text : themes[selectedTheme].text,
        accent: isHex6(customTheme.accent) ? customTheme.accent : themes[selectedTheme].accent,
        radius: Number.isFinite(customTheme.radius)
          ? Math.min(22, Math.max(0, customTheme.radius))
          : themes[selectedTheme].radius,
      }
    : themes[selectedTheme];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        const parsed = JSON.parse(value) as Partial<KeyboardTheme>;
        const validTheme =
          isHex6(parsed.background) &&
          isHex6(parsed.key) &&
          isHex6(parsed.text) &&
          isHex6(parsed.accent) &&
          typeof parsed.radius === 'number' &&
          Number.isFinite(parsed.radius) &&
          parsed.radius >= 0 &&
          parsed.radius <= 22;
        if (validTheme) {
          setCustomTheme({ ...themes[0], ...parsed } as KeyboardTheme);
          setHasCustomTheme(true);
        }
      }
    }).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const keyboardBridge = NativeModules.NexKeyKeyboard as
      | { setTheme: (themeJson: string) => Promise<boolean> }
      | undefined;
    if (!keyboardBridge?.setTheme) return;
    keyboardBridge.setTheme(JSON.stringify(theme)).catch(() => {});
  }, [theme.background, theme.key, theme.text, theme.accent, theme.radius]);

  const choosePreset = (index: number) => {
    setSelectedTheme(index);
    setCustomTheme(themes[index]);
    setHasCustomTheme(false);
  };

  const updateColor = (field: ColorKey, value: string) => {
    setCustomTheme(current => ({ ...current, [field]: value.toUpperCase() }));
    setHasCustomTheme(true);
  };

  const changeRadius = (delta: number) => {
    setCustomTheme(t => ({ ...t, radius: Math.min(22, Math.max(0, t.radius + delta)) }));
    setHasCustomTheme(true);
  };

  const saveTheme = async () => {
    const valid = colorFields.every(({ key }) => isHex6(customTheme[key])) && Number.isFinite(customTheme.radius) && customTheme.radius >= 0 && customTheme.radius <= 22;
    if (!valid) {
      Alert.alert('Invalid color', 'Use a six-digit HEX color, for example #9B7BFF.');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customTheme));
      setHasCustomTheme(true);
      Alert.alert('Theme saved', 'Your custom NexKey theme is saved on this device.');
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  };

  const checkForUpdates = async () => {
    if (!Updates.isEnabled) {
      setUpdateMessage('In-app updates are not configured for this build yet. A release channel and EAS project connection are required.');
      return;
    }

    setUpdateBusy(true);
    setUpdateMessage('Checking for updates…');

    try {
      const result = await Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        setUpdateMessage('You are using the latest available app update.');
        return;
      }

      setUpdateMessage('Update found. Downloading…');
      await Updates.fetchUpdateAsync();

      Alert.alert('Update ready', 'NexKey has downloaded an update. Restart now to apply it?', [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Restart now',
          onPress: () => {
            Updates.reloadAsync().catch(() => {
              setUpdateMessage('Update downloaded, but the app could not restart. Please reopen it.');
            });
          },
        },
      ]);
      setUpdateMessage('Update downloaded and ready to apply.');
    } catch (error) {
      setUpdateMessage(error instanceof Error ? error.message : 'Could not check for updates.');
    } finally {
      setUpdateBusy(false);
    }
  };

  const resetTheme = async () => {
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
    setCustomTheme(themes[selectedTheme]);
    setHasCustomTheme(false);
  };

  const themeName = hasCustomTheme ? 'Custom theme' : themes[selectedTheme].name;
  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { paddingTop: topInset + space.md, borderBottomColor: c.border }]}>
        <View>
          <Text style={[styles.wordmark, { color: c.text }]}>NEX<Text style={{ color: c.primary }}>KEY</Text></Text>
          <Text style={[styles.tagline, { color: c.textFaint }]}>YOUR KEYS. YOUR STYLE.</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.premium, { backgroundColor: c.primarySoft, borderColor: c.primary + '55' }]}>
            <Icon name="spark" size={12} color={c.primary} />
            <Text style={[styles.premiumText, { color: c.primary }]}>PREMIUM</Text>
          </View>
          <Press
            onPress={() => setMode(scheme === 'dark' ? 'light' : 'dark')}
            style={[styles.iconButton, { backgroundColor: c.surface, borderColor: c.border }]}
            accessibilityLabel={scheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <Icon name={scheme === 'dark' ? 'sun' : 'moon'} size={20} color={c.text} cut={c.surface} />
          </Press>
        </View>
      </View>

      <ScrollView key={tab} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {tab === 'Home' && <HomeScreen theme={theme} themeName={themeName} goTo={setTab} />}
        {tab === 'Studio' && (
          <StudioScreen
            theme={theme}
            customTheme={customTheme}
            selectedTheme={selectedTheme}
            hasCustomTheme={hasCustomTheme}
            colorFields={colorFields}
            choosePreset={choosePreset}
            updateColor={updateColor}
            changeRadius={changeRadius}
            saveTheme={saveTheme}
            resetTheme={resetTheme}
          />
        )}
        {tab === 'Themes' && (
          <ThemesScreen
            selectedTheme={selectedTheme}
            hasCustomTheme={hasCustomTheme}
            onPick={(index) => { choosePreset(index); setTab('Studio'); }}
          />
        )}
        {tab === 'Settings' && (
          <SettingsScreen
            appVersion={APP_VERSION}
            updateMessage={updateMessage}
            updateBusy={updateBusy}
            loaded={loaded}
            onCheckUpdates={checkForUpdates}
          />
        )}
      </ScrollView>

      <TabBar items={tabs} active={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: space.xl, paddingBottom: space.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  wordmark: { fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  tagline: { fontSize: 9, letterSpacing: 2.2, marginTop: 2, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  premium: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill },
  premiumText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  iconButton: { width: 40, height: 40, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.xl, paddingBottom: 36 },
});
