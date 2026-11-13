import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useAppearance } from '../design/AppearanceContext';

export type IconName =
  | 'home'
  | 'studio'
  | 'themes'
  | 'settings'
  | 'check'
  | 'chevron'
  | 'plus'
  | 'minus'
  | 'sun'
  | 'moon'
  | 'auto'
  | 'keyboard'
  | 'lock'
  | 'refresh'
  | 'spark'
  | 'info'
  | 'shift';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Background colour used for cut-outs (moon). Defaults to the surface colour. */
  cut?: string;
  strokeWidth?: number;
};

const abs: ViewStyle = { position: 'absolute' };

/** Lightweight line icons drawn with plain Views — no extra native packages required. */
export function Icon({ name, size = 22, color, cut, strokeWidth }: Props) {
  const { c } = useAppearance();
  const col = color ?? c.text;
  const bg = cut ?? c.surface;
  const s = size;
  const w = strokeWidth ?? Math.max(1.6, s * 0.085);
  const box: ViewStyle = { width: s, height: s };

  switch (name) {
    case 'home':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.27, top: s * 0.12, width: s * 0.46, height: s * 0.46, borderTopWidth: w, borderLeftWidth: w, borderColor: col, borderTopLeftRadius: w, transform: [{ rotate: '45deg' }] }]} />
          <View style={[abs, { left: s * 0.24, top: s * 0.37, width: s * 0.52, height: s * 0.5, borderWidth: w, borderTopWidth: 0, borderColor: col, borderBottomLeftRadius: s * 0.1, borderBottomRightRadius: s * 0.1 }]} />
          <View style={[abs, { left: s * 0.43, top: s * 0.62, width: s * 0.14, height: s * 0.25, borderWidth: w, borderBottomWidth: 0, borderColor: col, borderTopLeftRadius: s * 0.07, borderTopRightRadius: s * 0.07 }]} />
        </View>
      );
    case 'themes': {
      const cell = s * 0.3;
      const spots: [number, number][] = [[0.14, 0.14], [0.56, 0.14], [0.14, 0.56], [0.56, 0.56]];
      return (
        <View style={box}>
          {spots.map(([x, y], i) => (
            <View key={i} style={[abs, { left: s * x, top: s * y, width: cell, height: cell, borderWidth: w, borderColor: col, borderRadius: s * 0.09 }]} />
          ))}
        </View>
      );
    }
    case 'studio':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.21, top: s * 0.29, width: s * 0.58, height: s * 0.58, borderWidth: w, borderColor: col, borderRadius: s * 0.29, borderTopLeftRadius: 0, transform: [{ rotate: '45deg' }] }]} />
          <View style={[abs, { left: s * 0.4, top: s * 0.55, width: s * 0.12, height: s * 0.12, borderRadius: s * 0.06, backgroundColor: col }]} />
        </View>
      );
    case 'settings': {
      const rows: [number, number][] = [[0.24, 0.62], [0.5, 0.32], [0.76, 0.68]];
      const knob = s * 0.26;
      return (
        <View style={box}>
          {rows.map(([y, x], i) => (
            <React.Fragment key={i}>
              <View style={[abs, { left: s * 0.12, top: s * y - w / 2, width: s * 0.76, height: w, borderRadius: w, backgroundColor: col }]} />
              <View style={[abs, { left: s * x - knob / 2, top: s * y - knob / 2, width: knob, height: knob, borderRadius: knob / 2, backgroundColor: col }]} />
            </React.Fragment>
          ))}
        </View>
      );
    }
    case 'check':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.34, top: s * 0.16, width: s * 0.3, height: s * 0.56, borderRightWidth: w * 1.2, borderBottomWidth: w * 1.2, borderColor: col, transform: [{ rotate: '45deg' }] }]} />
        </View>
      );
    case 'chevron':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.2, top: s * 0.31, width: s * 0.38, height: s * 0.38, borderTopWidth: w, borderRightWidth: w, borderColor: col, transform: [{ rotate: '45deg' }] }]} />
        </View>
      );
    case 'plus':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.18, top: s / 2 - w / 2, width: s * 0.64, height: w, borderRadius: w, backgroundColor: col }]} />
          <View style={[abs, { top: s * 0.18, left: s / 2 - w / 2, height: s * 0.64, width: w, borderRadius: w, backgroundColor: col }]} />
        </View>
      );
    case 'minus':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.18, top: s / 2 - w / 2, width: s * 0.64, height: w, borderRadius: w, backgroundColor: col }]} />
        </View>
      );
    case 'sun':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.31, top: s * 0.31, width: s * 0.38, height: s * 0.38, borderRadius: s * 0.19, borderWidth: w, borderColor: col }]} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View key={i} style={[abs, box, { transform: [{ rotate: `${i * 45}deg` }] }]}>
              <View style={[abs, { left: s / 2 - w / 2, top: s * 0.04, width: w, height: s * 0.14, borderRadius: w, backgroundColor: col }]} />
            </View>
          ))}
        </View>
      );
    case 'moon':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.14, top: s * 0.17, width: s * 0.68, height: s * 0.68, borderRadius: s * 0.34, backgroundColor: col }]} />
          <View style={[abs, { left: s * 0.36, top: s * 0.05, width: s * 0.58, height: s * 0.58, borderRadius: s * 0.29, backgroundColor: bg }]} />
        </View>
      );
    case 'auto':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.1, top: s * 0.1, width: s * 0.8, height: s * 0.8, borderRadius: s * 0.4, borderWidth: w, borderColor: col, overflow: 'hidden' }]}>
            <View style={{ width: '50%', height: '100%', backgroundColor: col }} />
          </View>
        </View>
      );
    case 'keyboard': {
      const dot = Math.max(2, w * 1.1);
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.05, top: s * 0.2, width: s * 0.9, height: s * 0.6, borderWidth: w, borderColor: col, borderRadius: s * 0.12 }]} />
          {[0.24, 0.45, 0.66].map((x, i) => <View key={`a${i}`} style={[abs, { left: s * x, top: s * 0.34, width: dot, height: dot, borderRadius: 1, backgroundColor: col }]} />)}
          {[0.3, 0.51].map((x, i) => <View key={`b${i}`} style={[abs, { left: s * x, top: s * 0.46, width: dot, height: dot, borderRadius: 1, backgroundColor: col }]} />)}
          <View style={[abs, { left: s * 0.3, top: s * 0.6, width: s * 0.4, height: dot, borderRadius: 1, backgroundColor: col }]} />
        </View>
      );
    }
    case 'lock':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.3, top: s * 0.12, width: s * 0.4, height: s * 0.42, borderWidth: w, borderBottomWidth: 0, borderColor: col, borderTopLeftRadius: s * 0.2, borderTopRightRadius: s * 0.2 }]} />
          <View style={[abs, { left: s * 0.2, top: s * 0.44, width: s * 0.6, height: s * 0.44, borderRadius: s * 0.1, backgroundColor: col }]} />
        </View>
      );
    case 'refresh':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.14, top: s * 0.14, width: s * 0.72, height: s * 0.72, borderRadius: s * 0.36, borderWidth: w, borderColor: col, borderTopColor: 'transparent', transform: [{ rotate: '-30deg' }] }]} />
          <View style={[abs, { left: s * 0.5, top: s * 0.02, width: 0, height: 0, borderLeftWidth: s * 0.12, borderRightWidth: s * 0.12, borderBottomWidth: s * 0.2, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: col, transform: [{ rotate: '90deg' }] }]} />
        </View>
      );
    case 'spark':
      return (
        <View style={box}>
          <View style={[abs, { left: s / 2 - w * 0.6, top: s * 0.06, width: w * 1.2, height: s * 0.88, borderRadius: w, backgroundColor: col }]} />
          <View style={[abs, { top: s / 2 - w * 0.6, left: s * 0.06, height: w * 1.2, width: s * 0.88, borderRadius: w, backgroundColor: col }]} />
          <View style={[abs, { left: s / 2 - w * 0.4, top: s * 0.22, width: w * 0.8, height: s * 0.56, borderRadius: w, backgroundColor: col, transform: [{ rotate: '45deg' }] }]} />
          <View style={[abs, { left: s / 2 - w * 0.4, top: s * 0.22, width: w * 0.8, height: s * 0.56, borderRadius: w, backgroundColor: col, transform: [{ rotate: '-45deg' }] }]} />
        </View>
      );
    case 'info':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.1, top: s * 0.1, width: s * 0.8, height: s * 0.8, borderRadius: s * 0.4, borderWidth: w, borderColor: col }]} />
          <View style={[abs, { left: s / 2 - w * 0.7, top: s * 0.28, width: w * 1.4, height: w * 1.4, borderRadius: w, backgroundColor: col }]} />
          <View style={[abs, { left: s / 2 - w * 0.6, top: s * 0.46, width: w * 1.2, height: s * 0.26, borderRadius: w, backgroundColor: col }]} />
        </View>
      );
    case 'shift':
      return (
        <View style={box}>
          <View style={[abs, { left: s * 0.18, top: s * 0.12, width: 0, height: 0, borderLeftWidth: s * 0.32, borderRightWidth: s * 0.32, borderBottomWidth: s * 0.4, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: col }]} />
          <View style={[abs, { left: s * 0.38, top: s * 0.5, width: s * 0.24, height: s * 0.3, backgroundColor: col, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }]} />
        </View>
      );
    default:
      return <View style={box} />;
  }
}
