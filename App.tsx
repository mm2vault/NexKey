import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { KeyboardPreview } from './src/components/KeyboardPreview';
import { themes, type KeyboardTheme } from './src/theme/presets';

type Tab = 'Home' | 'Studio' | 'Themes' | 'Settings';
const STORAGE_KEY = 'nexkey.custom-theme.v1';
const colorFields: { key: 'background' | 'key' | 'text' | 'accent'; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'key', label: 'Key color' },
  { key: 'text', label: 'Text color' },
  { key: 'accent', label: 'Accent color' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [customTheme, setCustomTheme] = useState<KeyboardTheme>(themes[0]);
  const [hasCustomTheme, setHasCustomTheme] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const theme = hasCustomTheme ? customTheme : themes[selectedTheme];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        const parsed = JSON.parse(value) as KeyboardTheme;
        if (parsed && typeof parsed.background === 'string' && typeof parsed.key === 'string') {
          setCustomTheme(parsed);
          setHasCustomTheme(true);
        }
      }
    }).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  const choosePreset = (index: number) => {
    setSelectedTheme(index);
    setCustomTheme(themes[index]);
    setHasCustomTheme(false);
  };

  const updateColor = (field: 'background' | 'key' | 'text' | 'accent', value: string) => {
    setCustomTheme(current => ({ ...current, [field]: value.toUpperCase() }));
    setHasCustomTheme(true);
  };

  const saveTheme = async () => {
    const valid = colorFields.every(({ key }) => /^#[0-9A-Fa-f]{6}$/.test(customTheme[key]));
    if (!valid) {
      Alert.alert('Invalid color', 'Use a six-digit HEX color, for example #9B7BFF.');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customTheme));
      setHasCustomTheme(true);
      Alert.alert('Theme saved', 'Your custom NexKey theme is saved on this device.');
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  };

  const resetTheme = async () => {
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
    setCustomTheme(themes[selectedTheme]);
    setHasCustomTheme(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.header}>
        <View><Text style={styles.wordmark}>NEX<Text style={styles.accent}>KEY</Text></Text><Text style={styles.tagline}>YOUR KEYS. YOUR STYLE.</Text></View>
        <View style={styles.premium}><Text style={styles.premiumText}>✦ PREMIUM</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === 'Home' && <>
          <Text style={styles.eyebrow}>WELCOME TO YOUR KEYBOARD</Text>
          <Text style={styles.title}>Make every{'\n'}keystroke yours.</Text>
          <Text style={styles.subtitle}>A keyboard that feels like you. Create a look, make it yours, and take it everywhere.</Text>
          <View style={styles.previewCard}><View style={styles.cardHeading}><Text style={styles.cardTitle}>LIVE PREVIEW</Text><Text style={styles.live}>● LIVE</Text></View><KeyboardPreview theme={theme} /></View>
          <Text style={styles.sectionTitle}>QUICK ACCESS</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab('Studio')}><Text style={styles.quickIcon}>✦</Text><Text style={styles.quickTitle}>Theme Studio</Text><Text style={styles.quickSub}>Build your style</Text></TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab('Themes')}><Text style={styles.quickIcon}>▦</Text><Text style={styles.quickTitle}>My themes</Text><Text style={styles.quickSub}>Explore designs</Text></TouchableOpacity>
          </View>
          <View style={styles.notice}><Text style={styles.noticeTitle}>ANDROID KEYBOARD PROTOTYPE</Text><Text style={styles.noticeText}>The native Android keyboard prototype is in development. This app preview does not yet replace your system keyboard.</Text></View>
        </>}

        {tab === 'Studio' && <>
          <Text style={styles.eyebrow}>CREATE SOMETHING UNIQUE</Text><Text style={styles.title}>Theme Studio</Text>
          <Text style={styles.subtitle}>Choose a preset, edit its colors and key shape, then save your design on this device.</Text>
          <View style={styles.previewCard}><View style={styles.cardHeading}><Text style={styles.cardTitle}>LIVE PREVIEW</Text><Text style={styles.live}>● LIVE</Text></View><KeyboardPreview theme={theme} /></View>
          <Text style={styles.sectionTitle}>START WITH A STYLE</Text>
          <View style={styles.themeList}>{themes.map((item, index) => <TouchableOpacity key={item.id} style={[styles.themeOption, !hasCustomTheme && selectedTheme === index && styles.themeSelected]} onPress={() => choosePreset(index)}><View style={[styles.swatch, { backgroundColor: item.background }]} /><View style={{flex:1}}><Text style={styles.themeName}>{item.name}</Text><Text style={styles.themeDesc}>{item.description}</Text></View><Text style={styles.check}>{!hasCustomTheme && selectedTheme === index ? '✓' : '○'}</Text></TouchableOpacity>)}</View>
          <Text style={styles.sectionTitle}>CUSTOM COLORS · HEX</Text>
          {colorFields.map(({key,label}) => <View key={key} style={styles.colorRow}><View style={[styles.colorDot,{backgroundColor:/^#[0-9A-Fa-f]{6}$/.test(customTheme[key]) ? customTheme[key] : '#555555'}]} /><Text style={styles.colorLabel}>{label}</Text><TextInput value={customTheme[key]} onChangeText={value => updateColor(key,value)} autoCapitalize="characters" maxLength={7} placeholder="#FFFFFF" placeholderTextColor="#626A7E" style={styles.colorInput} /></View>)}
          <View style={styles.radiusRow}><View style={{flex:1}}><Text style={styles.themeName}>Key corner radius</Text><Text style={styles.themeDesc}>Adjust the shape of each key</Text></View><TouchableOpacity style={styles.stepButton} onPress={() => {setCustomTheme(t=>({...t,radius:Math.max(0,t.radius-1)}));setHasCustomTheme(true);}}><Text style={styles.stepText}>−</Text></TouchableOpacity><Text style={styles.radiusValue}>{customTheme.radius}</Text><TouchableOpacity style={styles.stepButton} onPress={() => {setCustomTheme(t=>({...t,radius:Math.min(22,t.radius+1)}));setHasCustomTheme(true);}}><Text style={styles.stepText}>+</Text></TouchableOpacity></View>
          <TouchableOpacity style={styles.saveButton} onPress={saveTheme}><Text style={styles.saveButtonText}>SAVE MY THEME</Text></TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetTheme}><Text style={styles.resetText}>Reset to selected preset</Text></TouchableOpacity>
          <Text style={styles.helper}>Your saved theme stays on this device. Custom images, font files and cloud sync are planned for later.</Text>
        </>}

        {tab === 'Themes' && <>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text><Text style={styles.title}>Discover themes.</Text><Text style={styles.subtitle}>Pick a starting point and customize it in Theme Studio.</Text>
          {themes.map((item, index) => <TouchableOpacity key={item.id} style={styles.themeOption} onPress={() => {choosePreset(index);setTab('Studio');}}><View style={[styles.swatch,{backgroundColor:item.background}]} /><View style={{flex:1}}><Text style={styles.themeName}>{item.name}</Text><Text style={styles.themeDesc}>{item.description}</Text></View><Text style={styles.arrow}>↗</Text></TouchableOpacity>)}
        </>}

        {tab === 'Settings' && <>
          <Text style={styles.eyebrow}>PREFERENCES</Text><Text style={styles.title}>Settings</Text>
          <View style={styles.setting}><Text style={styles.settingTitle}>App version</Text><Text style={styles.settingValue}>0.2.0 · Theme Studio update</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Keyboard status</Text><Text style={styles.settingValue}>Android IME prototype · Device testing pending</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Privacy</Text><Text style={styles.settingValue}>Typed text is not sent to a server by this prototype.</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Updates</Text><Text style={styles.settingValue}>Android and iOS store-based updates will be configured before release.</Text></View>
          <Text style={styles.helper}>{loaded ? 'Local theme storage is ready.' : 'Loading your saved theme…'}</Text>
        </>}
      </ScrollView>

      <View style={styles.nav}>{(['Home','Studio','Themes','Settings'] as Tab[]).map(item => <TouchableOpacity key={item} style={styles.navItem} onPress={() => setTab(item)}><Text style={[styles.navIcon, tab === item && styles.navActive]}>{({Home:'⌂',Studio:'✧',Themes:'▦',Settings:'⚙'} as Record<Tab,string>)[item]}</Text><Text style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#090B12'},header:{paddingHorizontal:22,paddingTop:14,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#1D2230'},wordmark:{fontSize:25,fontWeight:'900',letterSpacing:2,color:'#F6F7FB'},accent:{color:'#9B7BFF'},tagline:{fontSize:9,letterSpacing:2.2,color:'#747B91',marginTop:2},premium:{borderWidth:1,borderColor:'#6650A8',backgroundColor:'#211A35',paddingHorizontal:11,paddingVertical:7,borderRadius:20},premiumText:{fontSize:10,fontWeight:'800',color:'#C9B9FF',letterSpacing:1},content:{padding:22,paddingBottom:32},eyebrow:{color:'#9D83FF',fontSize:10,fontWeight:'800',letterSpacing:2,marginBottom:10},title:{fontSize:34,fontWeight:'900',color:'#F5F4FA',lineHeight:39,letterSpacing:-1},subtitle:{fontSize:14,lineHeight:22,color:'#969DB0',marginTop:10,marginBottom:22},previewCard:{backgroundColor:'#121622',borderColor:'#252B3B',borderWidth:1,borderRadius:22,padding:14,marginBottom:26},cardHeading:{flexDirection:'row',justifyContent:'space-between',marginBottom:12},cardTitle:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:'#AAB0C1'},live:{fontSize:9,color:'#74D6AE',fontWeight:'800'},sectionTitle:{fontSize:11,fontWeight:'800',letterSpacing:1.6,color:'#858DA2',marginTop:20,marginBottom:12},quickRow:{flexDirection:'row',gap:12},quickCard:{flex:1,backgroundColor:'#151A28',borderWidth:1,borderColor:'#272D3E',borderRadius:18,padding:15},quickIcon:{fontSize:22,color:'#B49DFF',marginBottom:10},quickTitle:{fontSize:14,fontWeight:'800',color:'#F4F2FA'},quickSub:{fontSize:11,color:'#8D94A8',marginTop:4},notice:{marginTop:18,padding:15,borderRadius:16,backgroundColor:'#17152A',borderWidth:1,borderColor:'#30264E'},noticeTitle:{fontSize:10,fontWeight:'800',letterSpacing:1.2,color:'#BDAAFF'},noticeText:{fontSize:12,lineHeight:19,color:'#A5A0B7',marginTop:7},nav:{height:70,backgroundColor:'#0E111A',borderTopWidth:1,borderTopColor:'#202638',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},navItem:{alignItems:'center',minWidth:65},navIcon:{fontSize:20,color:'#737B90'},navLabel:{fontSize:10,color:'#737B90',marginTop:3},navActive:{color:'#B8A5FF'},themeList:{gap:10},themeOption:{flexDirection:'row',alignItems:'center',gap:12,padding:13,backgroundColor:'#141925',borderRadius:15,borderWidth:1,borderColor:'#252B3B',marginBottom:9},themeSelected:{borderColor:'#9B7BFF',backgroundColor:'#1C1930'},swatch:{width:38,height:38,borderRadius:12,borderWidth:1,borderColor:'#FFFFFF22'},themeName:{fontSize:14,fontWeight:'800',color:'#F3F1F9'},themeDesc:{fontSize:11,color:'#8991A5',marginTop:3},check:{fontSize:18,color:'#BBA8FF'},arrow:{fontSize:17,color:'#BBA8FF'},helper:{fontSize:11,lineHeight:18,color:'#7F879A',marginTop:14},setting:{padding:16,backgroundColor:'#141925',borderRadius:14,borderWidth:1,borderColor:'#252B3B',marginBottom:10},settingTitle:{fontSize:13,fontWeight:'800',color:'#F0EFF7'},settingValue:{fontSize:11,color:'#9299AC',marginTop:6},colorRow:{flexDirection:'row',alignItems:'center',padding:12,backgroundColor:'#141925',borderRadius:13,borderWidth:1,borderColor:'#252B3B',marginBottom:8},colorDot:{width:22,height:22,borderRadius:7,borderWidth:1,borderColor:'#FFFFFF44'},colorLabel:{flex:1,marginLeft:11,fontSize:12,fontWeight:'700',color:'#E8E7F0'},colorInput:{width:92,textAlign:'center',paddingVertical:7,paddingHorizontal:8,borderRadius:8,backgroundColor:'#090D16',color:'#FFFFFF',fontSize:12,fontWeight:'700'},radiusRow:{flexDirection:'row',alignItems:'center',padding:14,backgroundColor:'#141925',borderRadius:13,borderWidth:1,borderColor:'#252B3B',marginTop:5},stepButton:{width:34,height:34,borderRadius:10,backgroundColor:'#29233E',alignItems:'center',justifyContent:'center'},stepText:{fontSize:21,color:'#C8B8FF'},radiusValue:{width:34,textAlign:'center',fontSize:14,fontWeight:'800',color:'#FFFFFF'},saveButton:{marginTop:16,backgroundColor:'#8B6CF0',padding:16,borderRadius:13,alignItems:'center'},saveButtonText:{fontSize:12,fontWeight:'900',letterSpacing:1.3,color:'#FFFFFF'},resetButton:{padding:13,alignItems:'center'},resetText:{fontSize:12,fontWeight:'700',color:'#AFA2E9'}}
);
