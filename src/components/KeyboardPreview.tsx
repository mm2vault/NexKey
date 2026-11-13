import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { KeyboardTheme } from '../theme/presets';
import { mix, readableOn, withAlpha } from '../design/tokens';
import { Icon } from './Icon';

type KeyProps = {
  label?: string;
  glyph?: 'shift';
  background: string;
  color: string;
  radius: number;
  flex?: number;
  width?: number;
  bubble?: boolean;
  bubbleBg: string;
  bubbleColor: string;
  accent: string;
};

function PreviewKey({ label, glyph, background, color, radius, flex, width, bubble, bubbleBg, bubbleColor, accent }: KeyProps) {
  const [down, setDown] = useState(false);
  const face = down ? mix(background, accent, 0.4) : background;
  const edge = mix(background, '#000000', 0.38);
  return (
    <Pressable
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      style={[styles.keyWrap, flex !== undefined && { flex }, width !== undefined && { width }, down && { zIndex: 20 }]}
    >
      {down && bubble && label ? (
        <View style={[styles.bubble, { backgroundColor: bubbleBg, borderRadius: Math.max(8, radius + 2) }]}>
          <Text style={[styles.bubbleText, { color: bubbleColor }]}>{label}</Text>
        </View>
      ) : null}
      <View
        style={[
          styles.key,
          { backgroundColor: face, borderRadius: radius, borderBottomColor: edge, transform: [{ translateY: down ? 1 : 0 }] },
        ]}
      >
        {glyph === 'shift' ? <Icon name="shift" size={16} color={color} /> : <Text style={[styles.keyText, { color }]}>{label}</Text>}
      </View>
    </Pressable>
  );
}

export function KeyboardPreview({ theme }: { theme: KeyboardTheme }) {
  const topRow = 'qwertyuiop'.split('');
  const midRow = 'asdfghjkl'.split('');
  const lowRow = 'zxcvbnm'.split('');
  const keyColor = theme.key;
  const onAccent = readableOn(theme.accent);
  const bubbleBg = mix(theme.key, theme.text, 0.14);

  const letter = (ch: string) => (
    <PreviewKey key={ch} label={ch} background={keyColor} color={theme.text} radius={theme.radius} flex={1} bubble bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
  );

  return (
    <View style={[styles.keyboard, { backgroundColor: theme.background }]}>
      <View style={styles.suggestions}>
        {['How', 'are', 'you?'].map((word, i) => (
          <View key={word} style={[styles.suggestionCell, i > 0 && { borderLeftColor: withAlpha(theme.text, 0.14), borderLeftWidth: StyleSheet.hairlineWidth }]}>
            <Text style={[styles.suggestion, { color: i === 2 ? theme.accent : theme.text, fontWeight: i === 2 ? '700' : '500' }]}>{word}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>{topRow.map(letter)}</View>
      <View style={[styles.row, styles.inset]}>{midRow.map(letter)}</View>
      <View style={styles.row}>
        <PreviewKey glyph="shift" background={theme.accent} color={onAccent} radius={theme.radius} width={40} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
        {lowRow.map(letter)}
        <PreviewKey label="⌫" background={theme.accent} color={onAccent} radius={theme.radius} width={40} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
      </View>
      <View style={styles.row}>
        <PreviewKey label="?123" background={keyColor} color={theme.text} radius={theme.radius} width={46} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
        <PreviewKey label="☺" background={keyColor} color={theme.text} radius={theme.radius} width={34} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
        <PreviewKey label="English (US)" background={keyColor} color={withAlpha(theme.text, 0.75)} radius={theme.radius} flex={1} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
        <PreviewKey label="↵" background={theme.accent} color={onAccent} radius={theme.radius} width={46} bubbleBg={bubbleBg} bubbleColor={theme.text} accent={theme.accent} />
      </View>
    </View>
  );
}

/** Tiny keyboard silhouette used in theme cards. */
export function MiniKeyboard({ theme }: { theme: KeyboardTheme }) {
  const rows = [10, 9, 7];
  const r = Math.min(theme.radius, 6) * 0.5 + 1;
  return (
    <View style={[styles.mini, { backgroundColor: theme.background }]}>
      <View style={[styles.miniBar, { backgroundColor: withAlpha(theme.text, 0.18) }]} />
      {rows.map((count, rowIndex) => (
        <View key={rowIndex} style={styles.miniRow}>
          {Array.from({ length: count }).map((_, i) => {
            const edge = rowIndex === 2 && (i === 0 || i === count - 1);
            return <View key={i} style={[styles.miniKey, { backgroundColor: edge ? theme.accent : theme.key, borderRadius: r, flex: edge ? 1.4 : 1 }]} />;
          })}
        </View>
      ))}
      <View style={styles.miniRow}>
        <View style={[styles.miniKey, { backgroundColor: theme.key, borderRadius: r, flex: 1.4 }]} />
        <View style={[styles.miniKey, { backgroundColor: theme.key, borderRadius: r, flex: 5 }]} />
        <View style={[styles.miniKey, { backgroundColor: theme.accent, borderRadius: r, flex: 1.4 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { padding: 8, borderRadius: 18, gap: 6 },
  suggestions: { height: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  suggestionCell: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 18 },
  suggestion: { fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  inset: { paddingHorizontal: 14 },
  keyWrap: { height: 40 },
  key: { flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2 },
  keyText: { fontSize: 14, fontWeight: '500' },
  bubble: { position: 'absolute', bottom: 44, alignSelf: 'center', minWidth: 34, height: 40, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  bubbleText: { fontSize: 20, fontWeight: '600' },
  mini: { padding: 6, borderRadius: 10, gap: 3 },
  miniBar: { height: 4, borderRadius: 2, width: '40%', alignSelf: 'center', marginBottom: 1 },
  miniRow: { flexDirection: 'row', gap: 2, height: 10, paddingHorizontal: 0 },
  miniKey: { height: 10 },
});
