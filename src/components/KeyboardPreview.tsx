import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { KeyboardTheme } from '../theme/presets';

export function KeyboardPreview({ theme }: { theme: KeyboardTheme }) {
  const rows = ['qwertyuiop', 'asdfghjkl', '⇧zxcvbnm⌫'];
  return (
    <View style={[styles.keyboard, { backgroundColor: theme.background }]}>
      <View style={styles.suggestions}><Text style={[styles.suggestion,{color:theme.text}]}>How</Text><Text style={[styles.suggestion,{color:theme.text}]}>are</Text><Text style={[styles.suggestion,{color:theme.accent}]}>you?</Text></View>
      {rows.map((row, rowIndex) => <View key={rowIndex} style={styles.row}>{row.split('').map((key, index) => <View key={index} style={[styles.key,{backgroundColor: rowIndex === 2 && (key === '⇧' || key === '⌫') ? theme.accent : theme.key, borderRadius:theme.radius}]}><Text style={[styles.keyText,{color:rowIndex === 2 && (key === '⇧' || key === '⌫') ? '#FFFFFF' : theme.text}]}>{key}</Text></View>)}</View>)}
      <View style={styles.row}><View style={[styles.special,{backgroundColor:theme.key,borderRadius:theme.radius}]}><Text style={[styles.keyText,{color:theme.text}]}>?123</Text></View><View style={[styles.space,{backgroundColor:theme.key,borderRadius:theme.radius}]}><Text style={[styles.keyText,{color:theme.text}]}>English (US)</Text></View><View style={[styles.special,{backgroundColor:theme.accent,borderRadius:theme.radius}]}><Text style={styles.keyText}>↵</Text></View></View>
    </View>
  );
}
const styles=StyleSheet.create({keyboard:{padding:9,borderRadius:16,gap:7},suggestions:{height:23,flexDirection:'row',justifyContent:'space-around',alignItems:'center'},suggestion:{fontSize:10,fontWeight:'700'},row:{flexDirection:'row',justifyContent:'center',gap:4},key:{flex:1,height:37,alignItems:'center',justifyContent:'center'},keyText:{fontSize:12,fontWeight:'600'},special:{width:48,height:37,alignItems:'center',justifyContent:'center'},space:{flex:1,height:37,alignItems:'center',justifyContent:'center'}});
