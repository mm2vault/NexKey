import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { KeyboardPreview } from './src/components/KeyboardPreview';
import { themes } from './src/theme/presets';

type Tab = 'Home' | 'Studio' | 'Themes' | 'Settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const theme = themes[selectedTheme];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>NEX<Text style={styles.accent}>KEY</Text></Text>
          <Text style={styles.tagline}>YOUR KEYS. YOUR STYLE.</Text>
        </View>
        <View style={styles.premium}><Text style={styles.premiumText}>✦ PREMIUM</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'Home' && <>
          <Text style={styles.eyebrow}>WELCOME TO YOUR KEYBOARD</Text>
          <Text style={styles.title}>Make every{ '\n' }keystroke yours.</Text>
          <Text style={styles.subtitle}>A keyboard that feels like you. Create a look, make it yours, and take it everywhere.</Text>
          <View style={styles.previewCard}>
            <View style={styles.cardHeading}><Text style={styles.cardTitle}>LIVE PREVIEW</Text><Text style={styles.live}>● LIVE</Text></View>
            <KeyboardPreview theme={theme} />
          </View>
          <Text style={styles.sectionTitle}>QUICK ACCESS</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab('Studio')}><Text style={styles.quickIcon}>✦</Text><Text style={styles.quickTitle}>Theme Studio</Text><Text style={styles.quickSub}>Build your style</Text></TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => setTab('Themes')}><Text style={styles.quickIcon}>▦</Text><Text style={styles.quickTitle}>My themes</Text><Text style={styles.quickSub}>Explore designs</Text></TouchableOpacity>
          </View>
          <View style={styles.notice}><Text style={styles.noticeTitle}>COMING TO YOUR DEVICE</Text><Text style={styles.noticeText}>Native keyboard setup is the next development milestone. This preview app does not replace your system keyboard yet.</Text></View>
        </>}
        {tab === 'Studio' && <>
          <Text style={styles.eyebrow}>CREATE SOMETHING UNIQUE</Text><Text style={styles.title}>Theme Studio</Text>
          <Text style={styles.subtitle}>Choose a base look and preview your keyboard.</Text>
          <KeyboardPreview theme={theme} />
          <Text style={styles.sectionTitle}>START WITH A STYLE</Text>
          <View style={styles.themeList}>{themes.map((item, index) => <TouchableOpacity key={item.id} style={[styles.themeOption, selectedTheme === index && styles.themeSelected]} onPress={() => setSelectedTheme(index)}><View style={[styles.swatch, { backgroundColor: item.background }]} /><View style={{flex:1}}><Text style={styles.themeName}>{item.name}</Text><Text style={styles.themeDesc}>{item.description}</Text></View><Text style={styles.check}>{selectedTheme === index ? '✓' : '○'}</Text></TouchableOpacity>)}</View>
          <Text style={styles.helper}>Custom photos, fonts, key shapes and saving will be added in the next Studio milestone.</Text>
        </>}
        {tab === 'Themes' && <>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text><Text style={styles.title}>Discover themes.</Text>
          <Text style={styles.subtitle}>A starter collection to explore the NexKey visual direction.</Text>
          {themes.map((item, index) => <TouchableOpacity key={item.id} style={styles.themeOption} onPress={() => {setSelectedTheme(index);setTab('Studio');}}><View style={[styles.swatch, {backgroundColor:item.background}]} /><View style={{flex:1}}><Text style={styles.themeName}>{item.name}</Text><Text style={styles.themeDesc}>{item.description}</Text></View><Text style={styles.arrow}>↗</Text></TouchableOpacity>)}
        </>}
        {tab === 'Settings' && <>
          <Text style={styles.eyebrow}>PREFERENCES</Text><Text style={styles.title}>Settings</Text>
          <View style={styles.setting}><Text style={styles.settingTitle}>App version</Text><Text style={styles.settingValue}>0.1.0 · Initial preview</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Keyboard status</Text><Text style={styles.settingValue}>Native extension in development</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Privacy</Text><Text style={styles.settingValue}>Typing data is not sent by this preview app.</Text></View>
          <View style={styles.setting}><Text style={styles.settingTitle}>Updates</Text><Text style={styles.settingValue}>Store-based updates will be integrated before release.</Text></View>
        </>}
      </ScrollView>

      <View style={styles.nav}>{(['Home','Studio','Themes','Settings'] as Tab[]).map(item => <TouchableOpacity key={item} style={styles.navItem} onPress={() => setTab(item)}><Text style={[styles.navIcon, tab === item && styles.navActive]}>{({Home:'⌂',Studio:'✧',Themes:'▦',Settings:'⚙'} as Record<Tab,string>)[item]}</Text><Text style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#090B12'},header:{paddingHorizontal:22,paddingTop:14,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#1D2230'},wordmark:{fontSize:25,fontWeight:'900',letterSpacing:2,color:'#F6F7FB'},accent:{color:'#9B7BFF'},tagline:{fontSize:9,letterSpacing:2.2,color:'#747B91',marginTop:2},premium:{borderWidth:1,borderColor:'#6650A8',backgroundColor:'#211A35',paddingHorizontal:11,paddingVertical:7,borderRadius:20},premiumText:{fontSize:10,fontWeight:'800',color:'#C9B9FF',letterSpacing:1},content:{padding:22,paddingBottom:32},eyebrow:{color:'#9D83FF',fontSize:10,fontWeight:'800',letterSpacing:2,marginBottom:10},title:{fontSize:34,fontWeight:'900',color:'#F5F4FA',lineHeight:39,letterSpacing:-1},subtitle:{fontSize:14,lineHeight:22,color:'#969DB0',marginTop:10,marginBottom:22},previewCard:{backgroundColor:'#121622',borderColor:'#252B3B',borderWidth:1,borderRadius:22,padding:14,marginBottom:26},cardHeading:{flexDirection:'row',justifyContent:'space-between',marginBottom:12},cardTitle:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:'#AAB0C1'},live:{fontSize:9,color:'#74D6AE',fontWeight:'800'},sectionTitle:{fontSize:11,fontWeight:'800',letterSpacing:1.6,color:'#858DA2',marginBottom:12},quickRow:{flexDirection:'row',gap:12},quickCard:{flex:1,backgroundColor:'#151A28',borderWidth:1,borderColor:'#272D3E',borderRadius:18,padding:15},quickIcon:{fontSize:22,color:'#B49DFF',marginBottom:10},quickTitle:{fontSize:14,fontWeight:'800',color:'#F4F2FA'},quickSub:{fontSize:11,color:'#8D94A8',marginTop:4},notice:{marginTop:18,padding:15,borderRadius:16,backgroundColor:'#17152A',borderWidth:1,borderColor:'#30264E'},noticeTitle:{fontSize:10,fontWeight:'800',letterSpacing:1.2,color:'#BDAAFF'},noticeText:{fontSize:12,lineHeight:19,color:'#A5A0B7',marginTop:7},nav:{height:70,backgroundColor:'#0E111A',borderTopWidth:1,borderTopColor:'#202638',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},navItem:{alignItems:'center',minWidth:65},navIcon:{fontSize:20,color:'#737B90'},navLabel:{fontSize:10,color:'#737B90',marginTop:3},navActive:{color:'#B8A5FF'},themeList:{gap:10},themeOption:{flexDirection:'row',alignItems:'center',gap:12,padding:13,backgroundColor:'#141925',borderRadius:15,borderWidth:1,borderColor:'#252B3B',marginBottom:9},themeSelected:{borderColor:'#9B7BFF',backgroundColor:'#1C1930'},swatch:{width:38,height:38,borderRadius:12,borderWidth:1,borderColor:'#FFFFFF22'},themeName:{fontSize:14,fontWeight:'800',color:'#F3F1F9'},themeDesc:{fontSize:11,color:'#8991A5',marginTop:3},check:{fontSize:18,color:'#BBA8FF'},arrow:{fontSize:17,color:'#BBA8FF'},helper:{fontSize:11,lineHeight:18,color:'#7F879A',marginTop:14},setting:{padding:16,backgroundColor:'#141925',borderRadius:14,borderWidth:1,borderColor:'#252B3B',marginBottom:10},settingTitle:{fontSize:13,fontWeight:'800',color:'#F0EFF7'},settingValue:{fontSize:11,color:'#9299AC',marginTop:6}}
);
