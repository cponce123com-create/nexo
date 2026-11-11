export const SECTION_LABELS={notice:'Aviso',links:'Enlaces',store:'Tienda',faq:'Preguntas frecuentes'};
export const SECTION_KEYS=Object.keys(SECTION_LABELS);
export const THEMES=[{id:'nexo',label:'NEXO',color:'#7439b6',theme:'lila'},{id:'sunset',label:'Atardecer',color:'#bc426f',theme:'claro'},{id:'nature',label:'Naturaleza',color:'#26765b',theme:'claro'},{id:'night',label:'Noche',color:'#9f72dc',theme:'oscuro'}];
export function normalizeSections(value){const ordered=Array.isArray(value)?value.filter((x,i,a)=>SECTION_KEYS.includes(x)&&a.indexOf(x)===i):[];return [...ordered,...SECTION_KEYS.filter(x=>!ordered.includes(x))]}
export function moveSection(value,key,direction){const order=normalizeSections(value),i=order.indexOf(key),j=i+direction;if(i>=0&&j>=0&&j<order.length&&Math.abs(direction)===1)[order[i],order[j]]=[order[j],order[i]];return order}
