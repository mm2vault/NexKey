import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardPreview } from '../components/KeyboardPreview';
import { Icon, type IconName } from '../components/Icon';
import { Card, Eyebrow, IconBadge, Press, Reveal, SectionLabel, Subtitle, Title } from '../components/ui';
import { useAppearance } from '../design/AppearanceContext';
import { radius, space, type } from '../design/tokens';
import type { KeyboardTheme } from '../theme/presets';
import type { Tab } from './types';

type Props = { theme: KeyboardTheme; themeName: string; goTo: (tab: Tab) => void };

const steps = [
  'Install and open NexKey',
  'Android Settings → System → Languages & input',
  'Manage on-screen keyboards → enable NexKey',
  'Pick NexKey from the keyboard switcher',
];

export function HomeScreen({ theme, themeName, goTo }: Props) {
  const { c } = useAppearance();
  const quick: { tab: Tab; icon: IconName; title: string; sub: string }[] = [
    { tab: 'Studio', icon: 'studio', title: 'Theme Studio', sub: 'Build your style' },
    { tab: 'Themes', icon: 'themes', title: 'Themes', sub: 'Explore designs' },
  ];

  return (
    <>
      <Reveal>
        <Eyebrow>Welcome to your keyboard</Eyebrow>
        <Title>Make every{'\n'}keystroke yours.</Title>
        <Subtitle>Create a look, make it yours, and take it everywhere.</Subtitle>
      </Reveal>

      <Reveal delay={80} style={{ marginTop: space.xl }}>
        <Card style={styles.heroCard}>
          <View pointerEvents="none" style={[styles.glow, { backgroundColor: c.primary, opacity: 0.12 }]} />
          <View style={styles.cardHeading}>
            <View style={styles.themeChip}>
              <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              <Text style={[type.caption, { color: c.textMuted, fontWeight: '700' }]}>{themeName}</Text>
            </View>
            <View style={styles.live}>
              <View style={[styles.dot, { backgroundColor: c.success }]} />
              <Text style={[type.eyebrow, { color: c.success, fontSize: 10 }]}>LIVE PREVIEW</Text>
            </View>
          </View>
          <KeyboardPreview theme={theme} />
          <Text style={[type.caption, { color: c.textFaint, marginTop: space.md, textAlign: 'center' }]}>Tap the keys to try the feel</Text>
        </Card>
      </Reveal>

      <Reveal delay={160}>
        <SectionLabel>Quick access</SectionLabel>
        <View style={styles.quickRow}>
          {quick.map((item) => (
            <Press key={item.tab} style={[styles.quickCard, { backgroundColor: c.surface, borderColor: c.border }]} onPress={() => goTo(item.tab)}>
              <IconBadge name={item.icon} />
              <Text style={[type.label, { color: c.text, marginTop: space.md }]}>{item.title}</Text>
              <Text style={[type.caption, { color: c.textMuted, marginTop: 2 }]}>{item.sub}</Text>
            </Press>
          ))}
        </View>
      </Reveal>

      <Reveal delay={240}>
        <SectionLabel>Set up the keyboard</SectionLabel>
        <Card>
          {steps.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: c.primarySoft }]}>
                <Text style={[type.caption, { color: c.primary, fontWeight: '800' }]}>{i + 1}</Text>
              </View>
              <Text style={[type.body, { color: c.text, flex: 1 }]}>{step}</Text>
            </View>
          ))}
          <View style={[styles.note, { backgroundColor: c.surfaceAlt }]}>
            <Icon name="info" size={16} color={c.textMuted} cut={c.surfaceAlt} />
            <Text style={[type.caption, { color: c.textMuted, flex: 1 }]}>
              The native Android keyboard is a prototype still in development. This preview does not replace your system keyboard yet.
            </Text>
          </View>
        </Card>
      </Reveal>
    </>
  );
}

const styles = StyleSheet.create({
  heroCard: { overflow: 'hidden', padding: space.md },
  glow: { position: 'absolute', top: -90, right: -70, width: 240, height: 240, borderRadius: 120 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: space.md },
  themeChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  quickRow: { flexDirection: 'row', gap: space.md },
  quickCard: { flex: 1, borderWidth: 1, borderRadius: radius.lg, padding: space.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 7 },
  stepNumber: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', padding: space.md, borderRadius: radius.md, marginTop: space.md },
});
