import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardPreview, MiniKeyboard } from '../components/KeyboardPreview';
import { Icon } from '../components/Icon';
import { Button, Card, Eyebrow, Press, Reveal, SectionLabel, Subtitle, Title } from '../components/ui';
import { useAppearance } from '../design/AppearanceContext';
import { isHex6, radius, space, type } from '../design/tokens';
import { themes, type KeyboardTheme } from '../theme/presets';

export type ColorKey = 'background' | 'key' | 'text' | 'accent';

type Props = {
  theme: KeyboardTheme;
  customTheme: KeyboardTheme;
  selectedTheme: number;
  hasCustomTheme: boolean;
  colorFields: { key: ColorKey; label: string }[];
  choosePreset: (index: number) => void;
  updateColor: (field: ColorKey, value: string) => void;
  changeRadius: (delta: number) => void;
  saveTheme: () => void;
  resetTheme: () => void;
};

export function StudioScreen({ theme, customTheme, selectedTheme, hasCustomTheme, colorFields, choosePreset, updateColor, changeRadius, saveTheme, resetTheme }: Props) {
  const { c } = useAppearance();
  const fill = Math.min(1, Math.max(0, customTheme.radius / 22));

  return (
    <>
      <Reveal>
        <Eyebrow>Create something unique</Eyebrow>
        <Title>Theme Studio</Title>
        <Subtitle>Choose a preset, edit its colors and key shape, then save your design on this device.</Subtitle>
      </Reveal>

      <Reveal delay={80} style={{ marginTop: space.xl }}>
        <Card style={{ padding: space.md }}>
          <View style={styles.previewHead}>
            <Text style={[type.eyebrow, { color: c.textFaint }]}>LIVE PREVIEW</Text>
            <View style={styles.liveRow}>
              <View style={[styles.liveDot, { backgroundColor: c.success }]} />
              <Text style={[type.eyebrow, { color: c.success, fontSize: 10 }]}>LIVE</Text>
            </View>
          </View>
          <KeyboardPreview theme={theme} />
        </Card>
      </Reveal>

      <Reveal delay={140}>
        <SectionLabel>Start with a style</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presets} style={styles.presetScroll}>
          {themes.map((item, index) => {
            const active = !hasCustomTheme && selectedTheme === index;
            return (
              <Press key={item.id} onPress={() => choosePreset(index)} style={[styles.preset, { backgroundColor: c.surface, borderColor: active ? c.primary : c.border, borderWidth: active ? 1.5 : 1 }]}>
                <MiniKeyboard theme={item} />
                <View style={styles.presetMeta}>
                  <Text style={[type.caption, { color: c.text, fontWeight: '700' }]} numberOfLines={1}>{item.name}</Text>
                  {active ? <Icon name="check" size={14} color={c.primary} /> : null}
                </View>
              </Press>
            );
          })}
        </ScrollView>
      </Reveal>

      <Reveal delay={200}>
        <SectionLabel>Custom colors · HEX</SectionLabel>
        <Card style={{ paddingVertical: space.xs }}>
          {colorFields.map(({ key, label }, i) => {
            const valid = isHex6(customTheme[key]);
            return (
              <View key={key} style={[styles.colorRow, i < colorFields.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}>
                <View style={[styles.colorDot, { backgroundColor: valid ? customTheme[key] : c.textFaint, borderColor: c.border }]} />
                <Text style={[type.label, { color: c.text, flex: 1 }]}>{label}</Text>
                <TextInput
                  value={customTheme[key]}
                  onChangeText={(value: string) => updateColor(key, value)}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={7}
                  placeholder="#FFFFFF"
                  placeholderTextColor={c.textFaint}
                  style={[styles.colorInput, { backgroundColor: c.surfaceAlt, color: valid ? c.text : c.danger, borderColor: valid ? c.surfaceAlt : c.danger }]}
                />
              </View>
            );
          })}
        </Card>

        <Card style={styles.radiusCard}>
          <View style={{ flex: 1 }}>
            <Text style={[type.label, { color: c.text }]}>Key corner radius</Text>
            <Text style={[type.caption, { color: c.textMuted, marginTop: 2 }]}>Adjust the shape of each key</Text>
            <View style={[styles.track, { backgroundColor: c.surfaceAlt }]}>
              <View style={[styles.trackFill, { width: `${fill * 100}%`, backgroundColor: c.primary }]} />
            </View>
          </View>
          <View style={styles.stepper}>
            <Press onPress={() => changeRadius(-1)} style={[styles.stepButton, { backgroundColor: c.primarySoft }]} accessibilityLabel="Decrease radius">
              <Icon name="minus" size={18} color={c.primary} />
            </Press>
            <Text style={[type.label, { color: c.text, width: 30, textAlign: 'center' }]}>{customTheme.radius}</Text>
            <Press onPress={() => changeRadius(1)} style={[styles.stepButton, { backgroundColor: c.primarySoft }]} accessibilityLabel="Increase radius">
              <Icon name="plus" size={18} color={c.primary} />
            </Press>
          </View>
        </Card>
      </Reveal>

      <Reveal delay={260} style={{ marginTop: space.xl, gap: space.sm }}>
        <Button label="Save my theme" onPress={saveTheme} icon="check" />
        <Button label="Reset to selected preset" onPress={resetTheme} variant="ghost" />
        <Text style={[type.caption, { color: c.textFaint, textAlign: 'center', marginTop: space.xs }]}>
          Your saved theme stays on this device. Custom images, font files and cloud sync are planned for later.
        </Text>
      </Reveal>
    </>
  );
}

const styles = StyleSheet.create({
  previewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, paddingBottom: space.md },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  presetScroll: { marginHorizontal: -space.xl },
  presets: { paddingHorizontal: space.xl, gap: space.md },
  preset: { width: 150, borderRadius: radius.lg, padding: space.sm, gap: space.sm },
  presetMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 2 },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  colorDot: { width: 26, height: 26, borderRadius: 9, borderWidth: 1 },
  colorInput: { width: 96, textAlign: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: radius.sm, borderWidth: 1, fontSize: 13, fontWeight: '700' },
  radiusCard: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.md },
  track: { height: 6, borderRadius: 3, marginTop: space.md, overflow: 'hidden' },
  trackFill: { height: 6, borderRadius: 3 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepButton: { width: 38, height: 38, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
});
