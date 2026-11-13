import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes, type ColorScheme, type Palette } from './tokens';

export type AppearanceMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'nexkey.appearance.v1';

type AppearanceValue = {
  mode: AppearanceMode;
  scheme: ColorScheme;
  c: Palette;
  setMode: (mode: AppearanceMode) => void;
};

const AppearanceContext = createContext<AppearanceValue>({
  mode: 'system',
  scheme: 'dark',
  c: palettes.dark,
  setMode: () => {},
});

const isMode = (value: unknown): value is AppearanceMode =>
  value === 'system' || value === 'light' || value === 'dark';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<AppearanceMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (isMode(value)) setModeState(value);
      })
      .catch(() => {});
  }, []);

  const setMode = useCallback((next: AppearanceMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: ColorScheme = mode === 'system' ? (system === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo<AppearanceValue>(
    () => ({ mode, scheme, c: palettes[scheme], setMode }),
    [mode, scheme, setMode],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export const useAppearance = () => useContext(AppearanceContext);
