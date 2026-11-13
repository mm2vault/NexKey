import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardPreview } from '../components/KeyboardPreview';
import { Icon, type IconName } from '../components/Icon';
import { Button, Card, Eyebrow, IconBadge, Press, Reveal, SectionLabel, Subtitle, Title } from '../components/ui';
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
    { tab: 'Studio', icon: 'studio', title: 'Theme Studio', sub: 'Make it yours' },
    { tab: 'Themes', icon: 'themes', title: 'Theme collection', sub: 'Find your look' },
  ];

  return (
    <>
      <Reveal>
        <View style={styles.welcomeRow}>
          <View style={{ flex: 1 }}>
            <Eyebrow>Your keyboard, reimagined</Eyebrow>
            <Title>Every detail,\nyour signature.</Title>
            <Subtitle>A more personal typing experience starts with a look that feels like you.</Subtitle>
          </View>
          <View style={[styles.brandMark, { backgroundColor: c.primarySoft, borderColor: c.primary + '44' }]}>
            <Text style={[styles.brandN, { color: c.primary }]}>N</Text>
            <View style={[styles.brandSpark, { backgroundColor: c.primary }]} />
          </View>
        </View>
      </Reveal>

      <Reveal delay={80} style={{ marginTop: space.xl }}>
        <Card style={styles.heroCard}>
          <View pointerEvents="none" style={[styles.glow, { backgroundColor: c.primary, opacity: 0.14 }]} />
          <View style={styles.cardHeading}>
            <View>
              <Text style={[type.eyebrow, { color: c.textFaint }]}>YOUR CURRENT LOOK</Text>
              <View style={styles.themeNameRow}>
                <View style={[styles.dot, { backgroundColor: theme.accent }]} />
                <Text style={[type.label, { color: c.text }]}>{themeName}</Text>
              </View>
            </View>
            <View style={[styles.live, { backgroundColor: c.primarySoft }]}>
              <View style={[styles.dot, { backgroundColor: c.success }]} />
              <Text style={[type.eyebrow, { color: c.success, fontSize: 9 }]}>PREVIEW</Text>
            </View>
          </View>
          <KeyboardPreview theme={theme} />
          <Text style={[type.caption, { color: c.textFaint, marginTop: space.md, textAlign: 'center' }]}>A preview of your keyboard style</Text>
          <Button label="Customize this look" onPress={() => goTo('Studio')} icon="studio" />
        </Card>
      </Reveal>

      <Reveal delay={160}>
        <SectionLabel>Make it yours</SectionLabel>
        <View style={styles.quickRow}>
          {quick.map((item) => (
            <Press key={item.tab} style={[styles.quickCard, { backgroundColor: c.surface, borderColor: c.border }]} onPress={() => goTo(item.tab)}>
              <IconBadge name={item.icon} />
              <Text style={[type.label, { color: c.text, marginTop: space.md }]}>{item.title}</Text>
              <Text style={[type.caption, { color: c.textMuted, marginTop: 3 }]}>{item.sub}</Text>
              <View style={styles.cardArrow}>
                <Icon name="arrow-right" size={15} color={c.primary} />
              </View>
            </Press>
          ))}
        </View>
      </Reveal>

      <Reveal delay={240}>
        <SectionLabel>Get started</SectionLabel>
        <Card>
          <View style={styles.setupHeader}>
            <View style={[styles.setupIcon, { backgroundColor: c.primarySoft }]}>
              <Icon name="keyboard" size={18} color={c.primary} cut={c.primarySoft} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.label, { color: c.text }]}>Activate NexKey</Text>
              <Text style={[type.caption, { color: c.textMuted, marginTop: 2 }]}>A few quick steps in Android settings</Text>
            </View>
          </View>
          {steps.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: c.primarySoft }]}>
                <Text style={[type.caption, { color: c.primary, fontWeight: '800' }]}>{String(i + 1).padStart(2, '0')}</Text>
              </View>
              <Text style={[type.body, { color: c.text, flex: 1 }]}>{step}</Text>
            </View>
          ))}
          <View style={[styles.note, { backgroundColor: c.surfaceAlt }]}>
            <Icon name="info" size={16} color={c.textMuted} cut={c.surfaceAlt} />
            <Text style={[type.caption, { color: c.textMuted, flex: 1 }]}>
              The Android keyboard engine is still a prototype. This screen previews the design and does not yet apply every custom theme to the system keyboard.
            </Text>
          </View>
        </Card>
      </Reveal>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  brandMark: { width: 58, height: 58, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: space.lg },
  brandN: { fontSize: 30, fontWeight: '900', letterSpacing: -2 },
  brandSpark: { position: 'absolute', width: 6, height: 6, borderRadius: 3, top: 11, right: 11 },
  heroCard: { overflow: 'hidden', padding: space.md, gap: space.sm },
  glow: { position: 'absolute', top: -90, right: -70, width: 240, height: 240, borderRadius: 120 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: space.sm },
  themeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  dot: { width: 7, height: 7, borderRadius: 4 },
  quickRow: { flexDirection: 'row', gap: space.md },
  quickCard: { flex: 1, minHeight: 132, borderWidth: 1, borderRadius: radius.lg, padding: space.lg },
  cardArrow: { alignSelf: 'flex-end', marginTop: space.md },
  setupHeader: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.md },
  setupIcon: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  step: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 8 },
  stepNumber: { width: 32, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', padding: space.md, borderRadius: radius.md, marginTop: space.md },
});
