import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppearance } from '../design/AppearanceContext';
import { radius, space, type } from '../design/tokens';
import { Icon, type IconName } from './Icon';

/** Pressable with a soft scale animation. */
export function Press({
  children,
  onPress,
  style,
  disabled,
  scaleTo = 0.97,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleTo?: number;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (value: number) =>
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Fades and lifts its children into place. Use `delay` to stagger. */
export function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 380,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);
  return (
    <Animated.View
      style={[
        style,
        { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function Card({ children, style, tone = 'surface' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'surface' | 'alt' | 'accent' }) {
  const { c, scheme } = useAppearance();
  const backgroundColor = tone === 'alt' ? c.surfaceAlt : tone === 'accent' ? c.primarySoft : c.surface;
  const borderColor = tone === 'accent' ? c.primary + '55' : c.border;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderColor },
        scheme === 'light' && styles.cardShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  const { c } = useAppearance();
  return <Text style={[type.eyebrow, { color: c.primary, marginBottom: space.sm }]}>{String(children).toUpperCase()}</Text>;
}

export function Title({ children }: { children: React.ReactNode }) {
  const { c } = useAppearance();
  return <Text style={[type.title, { color: c.text }]}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  const { c } = useAppearance();
  return <Text style={[type.body, { color: c.textMuted, marginTop: space.sm }]}>{children}</Text>;
}

export function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  const { c } = useAppearance();
  return (
    <View style={styles.sectionLabel}>
      <Text style={[type.eyebrow, { color: c.textFaint }]}>{String(children).toUpperCase()}</Text>
      {right}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  busy,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'soft' | 'ghost';
  icon?: IconName;
  disabled?: boolean;
  busy?: boolean;
}) {
  const { c } = useAppearance();
  const fg = variant === 'primary' ? c.primaryText : c.primary;
  const backgroundColor = variant === 'primary' ? c.primary : variant === 'soft' ? c.primarySoft : 'transparent';
  return (
    <Press onPress={onPress} disabled={disabled || busy} style={[styles.button, { backgroundColor, opacity: disabled || busy ? 0.6 : 1 }]}>
      {busy ? <ActivityIndicator size="small" color={fg} /> : icon ? <Icon name={icon} size={18} color={fg} cut={backgroundColor} /> : null}
      <Text style={[type.label, { color: fg, letterSpacing: 0.3 }]}>{label}</Text>
    </Press>
  );
}

export function IconBadge({ name, tone = 'primary' }: { name: IconName; tone?: 'primary' | 'neutral' }) {
  const { c } = useAppearance();
  const backgroundColor = tone === 'primary' ? c.primarySoft : c.surfaceAlt;
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Icon name={name} size={20} color={tone === 'primary' ? c.primary : c.textMuted} cut={backgroundColor} />
    </View>
  );
}

/** Title + value row used in settings lists. */
export function InfoRow({ icon, title, value, last }: { icon: IconName; title: string; value: string; last?: boolean }) {
  const { c } = useAppearance();
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}>
      <IconBadge name={icon} tone="neutral" />
      <View style={{ flex: 1 }}>
        <Text style={[type.label, { color: c.text }]}>{title}</Text>
        <Text style={[type.caption, { color: c.textMuted, marginTop: 2 }]}>{value}</Text>
      </View>
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon: IconName }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { c } = useAppearance();
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  const x = useRef(new Animated.Value(0)).current;
  const segment = width > 0 ? (width - 8) / options.length : 0;

  useEffect(() => {
    Animated.spring(x, { toValue: index * segment, useNativeDriver: true, speed: 22, bounciness: 5 }).start();
  }, [index, segment, x]);

  return (
    <View
      style={[styles.segmented, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
    >
      {segment > 0 && (
        <Animated.View style={[styles.segmentThumb, { width: segment, backgroundColor: c.surface, borderColor: c.border, transform: [{ translateX: x }] }]} />
      )}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable key={option.value} style={styles.segment} onPress={() => onChange(option.value)} accessibilityRole="button" accessibilityLabel={option.label}>
            <Icon name={option.icon} size={16} color={active ? c.primary : c.textMuted} cut={active ? c.surface : c.surfaceAlt} />
            <Text style={[type.caption, { color: active ? c.text : c.textMuted, fontWeight: '700' }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg },
  cardShadow: { shadowColor: '#1B1B3A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xxl, marginBottom: space.md },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, minHeight: 50, paddingHorizontal: space.xl, borderRadius: radius.md },
  badge: { width: 40, height: 40, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  segmented: { flexDirection: 'row', padding: 4, borderRadius: radius.md, borderWidth: 1 },
  segment: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  segmentThumb: { position: 'absolute', top: 4, bottom: 4, left: 4, borderRadius: radius.sm + 2, borderWidth: StyleSheet.hairlineWidth },
});
