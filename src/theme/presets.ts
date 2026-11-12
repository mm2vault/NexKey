export type KeyboardTheme = {
  id: string;
  name: string;
  description: string;
  background: string;
  key: string;
  text: string;
  accent: string;
  radius: number;
};

export const themes: KeyboardTheme[] = [
  { id:'midnight-violet', name:'Midnight Violet', description:'Deep dark tones with a violet glow', background:'#171523', key:'#29263A', text:'#F6F2FF', accent:'#8866F5', radius:9 },
  { id:'arctic-blue', name:'Arctic Blue', description:'Cool blue accents on a dark base', background:'#101B2A', key:'#1D3045', text:'#ECF7FF', accent:'#39A9E8', radius:7 },
  { id:'rose-noir', name:'Rose Noir', description:'Soft rose details with a dark finish', background:'#21151D', key:'#38232F', text:'#FFF0F6', accent:'#D66A9C', radius:13 },
  { id:'mono', name:'Mono', description:'Minimal black and white contrast', background:'#171717', key:'#303030', text:'#FFFFFF', accent:'#777777', radius:5 }
];
