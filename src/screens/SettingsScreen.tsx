import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card, Eyebrow, InfoRow, Reveal, SectionLabel, Segmented, Title } from '../components/ui';
import { useAppearance, type AppearanceMode } from '../design/AppearanceContext';
import { space, type } from '../design/tokens';

type Props = {
  appVersion: string;
  updateMessage: string;
  updateBusy: boolean;
  loaded: boolean;
  onCheckUpdates: () => void;
};

export function SettingsScreen({ appVersion, updateMessage, updateBusy, loaded, onCheckUpdates }: Props) {
  const { c, mode, setMode } = useAppearance();
  return (
    <>
      <Reveal>
        <Eyebrow>Preferences</Eyebrow>
        <Title>Settings</Title>
      </Reveal>

      <Reveal delay={70}>
        <SectionLabel>Appearance</SectionLabel>
        <Card>
          <Segmented<AppearanceMode>
            value={mode}
            onChange={setMode}
            options={[
              { value: 'system', label: 'System', icon: 'auto' },
              { value: 'light', label: 'Light', icon: 'sun' },
              { value: 'dark', label: 'Dark', icon: 'moon' },
            ]}
          />
          <Text style={[type.caption, { color: c.textMuted, marginTop: space.md }]}>
            Choose how the NexKey app looks. Keyboard themes are edited separately in Theme Studio.
          </Text>
        </Card>
      </Reveal>

      <Reveal delay={140}>
        <SectionLabel>General</SectionLabel>
        <Card style={styles.list}>
          <InfoRow icon="info" title="App version" value={`${appVersion} · In-app update support`} />
          <InfoRow icon="keyboard" title="Keyboard status" value="Android IME prototype · Device testing pending" />
          <InfoRow icon="lock" title="Privacy" value="Typed text is not sent to a server by this prototype." last />
        </Card>
      </Reveal>

      <Reveal delay={210}>
        <SectionLabel>NexKey updates</SectionLabel>
        <Card>
          <Text style={[type.body, { color: c.text }]}>{updateMessage}</Text>
          <Reveal style={{ marginTop: space.md }}>
            <Button label={updateBusy ? 'Checking…' : 'Check for updates'} onPress={onCheckUpdates} icon="refresh" variant="soft" busy={updateBusy} />
          </Reveal>
          <Text style={[type.caption, { color: c.textFaint, marginTop: space.md }]}>
            App interface updates can be delivered in-app after the EAS update channel is configured. Native keyboard engine changes still require a store or installer update.
          </Text>
        </Card>
        <Text style={[type.caption, { color: c.textFaint, marginTop: space.lg, textAlign: 'center' }]}>
          {loaded ? 'Local theme storage is ready.' : 'Loading your saved theme…'}
        </Text>
      </Reveal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: space.xs },
});
