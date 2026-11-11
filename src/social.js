export const NETWORKS = [
 {name:'Instagram',host:'instagram.com',mark:'IG'}, {name:'TikTok',host:'tiktok.com',mark:'♪'},
 {name:'Facebook',host:'facebook.com',mark:'f'}, {name:'YouTube',host:'youtube.com',mark:'▶'},
 {name:'WhatsApp',host:'wa.me',mark:'W'}, {name:'Telegram',host:'t.me',mark:'✈'},
 {name:'X / Twitter',host:'x.com',mark:'X'}, {name:'Threads',host:'threads.net',mark:'@'},
 {name:'LinkedIn',host:'linkedin.com',mark:'in'}, {name:'Pinterest',host:'pinterest.com',mark:'P'},
 {name:'Snapchat',host:'snapchat.com',mark:'S'}, {name:'Twitch',host:'twitch.tv',mark:'T'},
 {name:'Discord',host:'discord.com',mark:'D'}, {name:'Spotify',host:'spotify.com',mark:'♫'},
 {name:'Tienda',host:'',mark:'▣'}, {name:'Sitio web',host:'',mark:'↗'}
];
export function identifyNetwork(url){try{const host=new URL(url).hostname.toLowerCase().replace(/^www\./,'');return NETWORKS.find(n=>n.host&&(host===n.host||host.endsWith('.'+n.host)))||null}catch{return null}}
