'use strict';
const NS = 'http://www.w3.org/2000/svg';
const chart = document.querySelector('#chart');
let data = [], selected = 'svdiff_e0.2', subject = 'dog', setting = 't02';
function node(name, attrs, content) { const e = document.createElementNS(NS, name); for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v); if(content!==undefined)e.textContent=content;chart.appendChild(e);return e; }
function drawChart(){
 chart.replaceChildren();const x=v=>65+(Math.log10(v)-Math.log10(4))/(Math.log10(7000)-Math.log10(4))*620; const y=v=>330-(v-.32)/.42*290;
 for(const v of [.35,.45,.55,.65,.70]){node('line',{x1:65,x2:685,y1:y(v),y2:y(v),stroke:'#e7ebe3'});node('text',{x:52,y:y(v)+4,'text-anchor':'end',fill:'#636c64','font-size':13},v.toFixed(2));}
 for(const v of [10,100,1000]){node('text',{x:x(v),y:355,'text-anchor':'middle',fill:'#636c64','font-size':13},v.toLocaleString());}
 node('text',{x:380,y:386,'text-anchor':'middle',fill:'#636c64','font-size':13},'Stored artifact size (MiB, log scale)');
 node('text',{x:65,y:20,fill:'#636c64','font-size':13},'Mean DINO ↑');
 const full=data.find(d=>d.variant==='dreambooth_full');node('line',{x1:65,x2:685,y1:y(full.dino),y2:y(full.dino),stroke:'#7b8579','stroke-dasharray':'5 4'});
 const ladder=data.filter(d=>d.variant.startsWith('svdiff_e')).sort((a,b)=>a.mib-b.mib);
 node('path',{d:ladder.map((r,i)=>`${i?'L':'M'}${x(r.mib)},${y(r.dino)}`).join(' '),fill:'none',stroke:'#257363','stroke-width':3});
 for(const r of ladder){const c=node('circle',{cx:x(r.mib),cy:y(r.dino),r:r.variant===selected?8:4,fill:r.variant===selected?'#d6f17d':'#257363',stroke:'#257363','stroke-width':2});const t=document.createElementNS(NS,'title');t.textContent=`${r.variant.replace('svdiff_e','t = ')}: ${r.mib.toFixed(1)} MiB, DINO ${r.dino.toFixed(4)}`;c.appendChild(t);}
 const q=data.find(d=>d.variant==='qdelta_b4');node('rect',{x:x(q.mib)-5,y:y(q.dino)-5,width:10,height:10,fill:'#bd8138',transform:`rotate(45 ${x(q.mib)} ${y(q.dino)})`});
 const r=data.find(d=>d.variant===selected);node('text',{x:Math.min(x(r.mib)+12,560),y:y(r.dino)+30,fill:'#257363','font-size':14,'font-weight':700},`${r.mib.toFixed(1)} MiB / ${r.dino.toFixed(3)}`);
 document.querySelector('#point h3').innerHTML=`${r.mib.toFixed(1)} <small>MiB</small>`;document.querySelector('#point-dino').textContent=r.dino.toFixed(4);document.querySelector('#point-retention').textContent=(100*r.dino/full.dino).toFixed(1)+'%';
}
fetch('assets/results.json').then(r=>{if(!r.ok)throw new Error('Data unavailable');return r.json()}).then(d=>{data=d;drawChart()}).catch(()=>{chart.setAttribute('aria-label','Interactive chart unavailable. The verified results remain in the table and CSV below.');node('text',{x:40,y:180,fill:'#636c64','font-size':16},'See the measured results in the table below.');});
document.querySelectorAll('#thresholds button').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.variant;document.querySelectorAll('#thresholds button').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));if(data.length)drawChart();}));
const labels={t05:'t = 0.5 · 708.3 MiB',t02:'t = 0.2 · 150.9 MiB',t01:'t = 0.1 · 55.3 MiB',t001:'t = 0.01 · 5.6 MiB'};
function updateComparison(){const title=subject[0].toUpperCase()+subject.slice(1);document.querySelector('#before-img').src=`assets/${subject}-full.webp`;document.querySelector('#before-img').alt=`Full-model ${subject} output`;document.querySelector('#after-img').src=`assets/${subject}-${setting}.webp`;document.querySelector('#after-img').alt=`Delta-SVD ${subject} output at ${labels[setting]}`;document.querySelector('#explorer-caption').textContent=`${title} · ${labels[setting]} mean artifact size`;}
document.querySelectorAll('[data-subject]').forEach(b=>b.addEventListener('click',()=>{subject=b.dataset.subject;document.querySelectorAll('[data-subject]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));updateComparison();}));
document.querySelector('#compression').addEventListener('change',e=>{setting=e.target.value;updateComparison();});
document.querySelector('#comparison-slider').addEventListener('input',e=>{const v=e.target.value;document.querySelector('#after').style.clipPath=`inset(0 ${100-v}% 0 0)`;document.querySelector('#divider').style.left=v+'%';});
