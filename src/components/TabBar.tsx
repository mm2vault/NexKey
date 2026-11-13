import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useAppearance } from '../design/AppearanceContext';
import { Icon, type IconName } from './Icon';

export type TabItem<T extends string> = { key: T; label: string; icon: IconName };

export function TabBar<T extends string>({ items, active, onChange }: { items: TabItem<T>[]; active: T; onChange: (key: T) => void }) {
  const { c } = useAppearance();
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const tabWidth = width / items.length;
  const index = Math.max(0, items.findIndex((item) => item.key === active));

  useEffect(() => {
    if (tabWidth > 0) {
      Animated.spring(x, { toValue: index * tabWidth, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    }
  }, [index, tabWidth, x]);

  return (
    <View
      style={[styles.bar, { backgroundColor: c.surface, borderTopColor: c.border, paddingBottom: Platform.OS === 'android' ? 14 : 6 }]}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.inner}>
        {tabWidth > 0 && (
          <Animated.View style={[styles.indicator, { width: tabWidth, transform: [{ translateX: x }] }]}>
            <View style={[styles.indicatorPill, { backgroundColor: c.primary }]} />
          </Animated.View>
        )}
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <Pressable key={item.key} style={styles.item} onPress={() => onChange(item.key)} accessibilityRole="tab" accessibilityState={{ selected: isActive }} accessibilityLabel={item.label}>
              <Icon name={item.icon} size={23} color={isActive ? c.primary : c.textFaint} cut={c.surface} />
              <Text style={[styles.label, { color: isActive ? c.primary : c.textFaint, fontWeight: isActive ? '700' : '500' }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 6 },
  inner: { flexDirection: 'row' },
  item: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontSize: 11, letterSpacing: 0.2 },
  indicator: { position: 'absolute', top: -6, left: 0, alignItems: 'center' },
  indicatorPill: { width: 28, height: 3, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
});
