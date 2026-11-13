import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MiniKeyboard } from '../components/KeyboardPreview';
import { Icon } from '../components/Icon';
import { Eyebrow, Press, Reveal, Subtitle, Title } from '../components/ui';
import { useAppearance } from '../design/AppearanceContext';
import { radius, space, type } from '../design/tokens';
import { themes } from '../theme/presets';

type Props = { selectedTheme: number; hasCustomTheme: boolean; onPick: (index: number) => void };

export function ThemesScreen({ selectedTheme, hasCustomTheme, onPick }: Props) {
  const { c } = useAppearance();
  return (
    <>
      <Reveal>
        <Eyebrow>Your collection</Eyebrow>
        <Title>Discover themes.</Title>
        <Subtitle>Pick a starting point and customize it in Theme Studio.</Subtitle>
      </Reveal>

      <View style={styles.grid}>
        {themes.map((item, index) => {
          const active = !hasCustomTheme && selectedTheme === index;
          return (
            <Reveal key={item.id} delay={80 + index * 70} style={styles.cell}>
              <Press onPress={() => onPick(index)} style={[styles.card, { backgroundColor: c.surface, borderColor: active ? c.primary : c.border, borderWidth: active ? 1.5 : 1 }]}>
                <MiniKeyboard theme={item} />
                <View style={styles.meta}>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.label, { color: c.text }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[type.caption, { color: c.textMuted, marginTop: 2 }]} numberOfLines={2}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.footer}>
                  <View style={styles.swatches}>
                    {[item.background, item.key, item.accent].map((color, i) => (
                      <View key={i} style={[styles.swatch, { backgroundColor: color, borderColor: c.border, marginLeft: i === 0 ? 0 : -6 }]} />
                    ))}
                  </View>
                  {active ? (
                    <View style={[styles.activeBadge, { backgroundColor: c.primarySoft }]}>
                      <Icon name="check" size={12} color={c.primary} />
                      <Text style={[type.caption, { color: c.primary, fontWeight: '700', fontSize: 11 }]}>Active</Text>
                    </View>
                  ) : (
                    <Icon name="chevron" size={18} color={c.textFaint} />
                  )}
                </View>
              </Press>
            </Reveal>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.xl },
  cell: { width: '48%', flexGrow: 1 },
  card: { borderRadius: radius.lg, padding: space.md, gap: space.md },
  meta: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  swatches: { flexDirection: 'row' },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
});
