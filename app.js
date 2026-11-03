'use strict';
/* Detetives do Saber — A.R.S. HTML APPS e GAMES */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const hash=s=>{let h=0;s=String(s);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)};
const ic=n=>`<span class="material-icons-round" aria-hidden="true">${n}</span>`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function E(tag,p,...k){const e=document.createElement(tag);for(const a in (p||{})){const v=p[a];if(a==='class')e.className=v;else if(a==='html')e.innerHTML=v;else if(a.slice(0,2)==='on')e.addEventListener(a.slice(2),v);else if(v!==false&&v!=null)e.setAttribute(a,v===true?'':v)}k.flat().forEach(x=>{if(x!=null&&x!==false)e.append(x.nodeType?x:document.createTextNode(x))});return e}

let _tt;
function toast(msg,ico){const t=$('#toast');$('#toastIco').textContent=ico||'🕵️';$('#toastMsg').textContent=msg;t.classList.add('is-visible');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('is-visible'),2800)}

const Snd={ctx:null,
 play(k){ if(typeof DB!=='undefined'&&DB.set.sound===false)return;
  try{this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();const c=this.ctx;
   const seq={ok:[[660,.08],[880,.14]],collect:[[520,.06],[780,.1]],bad:[[200,.16]],win:[[523,.1],[659,.1],[784,.1],[1046,.3]],mail:[[880,.06],[660,.06],[990,.12]],flip:[[260,.05]]}[k]||[];
   let t=c.currentTime;seq.forEach(([f,d])=>{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02);t+=d*.9})}catch(e){}}};

function fmtTime(ts){const d=new Date(ts),n=new Date(),dd=Math.floor((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);
 const hm=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
 if(dd<=0)return{short:hm,full:'Hoje, '+hm};if(dd===1)return{short:'Ontem',full:'Ontem, '+hm};
 const w=d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');
 return{short:dd<7?w:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),full:d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})+', '+hm}}

/* ---------- diálogos genéricos ---------- */
const Dlg={
 open(node,opt){opt=opt||{};const m=$('#modal');m.innerHTML='';const w=E('div',{class:'dlg-back',onclick:e=>{if(e.target===w&&!opt.sticky)Dlg.close()}});
  const box=E('div',{class:'dlg '+(opt.cls||''),role:'dialog','aria-modal':'true'});
  if(opt.title)box.append(E('h3',{class:'dlg-t',html:opt.title}));
  if(typeof node==='string')box.insertAdjacentHTML('beforeend',node);else box.append(node);
  if(opt.actions){const a=E('div',{class:'dlg-a'});opt.actions.forEach(x=>a.append(E('button',{class:'bt '+(x.cls||''),type:'button',onclick:async()=>{const r=x.fn?await x.fn():null;if(r!==false)Dlg.close()}},x.t)));box.append(a)}
  w.append(box);m.append(w);m.hidden=false;const f=$('input,textarea,select',box);if(f&&!opt.nofocus)setTimeout(()=>f.focus(),30);return box},
 close(){const m=$('#modal');m.hidden=true;m.innerHTML=''},
 confirm(msg,ok){return new Promise(res=>{Dlg.open(`<p class="dlg-p">${msg}</p>`,{sticky:true,actions:[{t:'Cancelar',cls:'ghost',fn:()=>res(false)},{t:ok||'Confirmar',cls:'danger',fn:()=>res(true)}]})})},
 prompt(msg,val,type){return new Promise(res=>{const i=E('input',{class:'in',type:type||'text',value:val||'',autocomplete:'off'});const box=Dlg.open('',{sticky:true,actions:[{t:'Cancelar',cls:'ghost',fn:()=>res(null)},{t:'OK',fn:()=>res(i.value)}]});box.prepend(E('p',{class:'dlg-p'},msg),i);i.focus();i.addEventListener('keydown',e=>{if(e.key==='Enter'){res(i.value);Dlg.close()}})})}
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)Dlg.close()});

/* ---------- dados ---------- */
const KEY='detetivesDoSaber.v1';
const ANIMALS=['🐆','🦜','🦥','🦫','🐊','🐢','🐬','🦩','🐒','🦊','🐸','🐝'];
const AV_CLS=['fox','rabbit','owl','bear','deer','raccoon','bee','hedgehog'];
const avCls=a=>'avatar-'+AV_CLS[hash(a)%AV_CLS.length];
const SUBJ={historia:{n:'História',c:'#8a3324',i:'📜'},geografia:{n:'Geografia',c:'#2f6b66',i:'🗺️'},ciencias:{n:'Ciências',c:'#56743a',i:'🔬'}};
const NPC={owl:{n:'Seu Tonico Jabuti',a:'🐢',r:'Guardião da Memória · Amigo do Saber'},fox:{n:'Ubirajara Lobo-guará',a:'🦊',r:'Cartógrafo do Cerrado · Amigo do Saber'},bee:{n:'Iara Arara-azul',a:'🦜',r:'Naturalista do Pantanal · Amiga do Saber'},
 bear:{n:'Dona Lenta Preguiça',a:'🦥',r:'Sábia da Copa das Árvores · Amiga do Saber'},rac:{n:'Jaci Onça-pintada',a:'🐆',r:'Rastreadora da Mata · Amiga do Saber'},hed:{n:'Juca Jacaré',a:'🐊',r:'Fiscal do Rio · Amigo do Saber'},
 deer:{n:'Tucuxi Boto-cor-de-rosa',a:'🐬',r:'Navegante dos Rios · Amigo do Saber'},rab:{n:'Dona Capi Capivara',a:'🦫',r:'Mestra das Águas · Amiga do Saber'}};
const SUBJ_NPC={historia:'owl',geografia:'fox',ciencias:'bee'};
const npcAddr=k=>norm(NPC[k].n).replace(/ /g,'.')+'@animail.floresta';
const SUBJ_LINES=['Achei uma anotação antiga','Você precisa ver isto!','Pesquisando nos arquivos…','Um recado sobre o caso','Notícias da biblioteca','Descobri uma ligação','Psiu, detetive!','Um achado interessante'];
const SCORE={clue:2,rel:10,relMin:4,wrongPair:-1,wrongChoice:-2,hint:-1};

let DB=(function(){let d=null;try{d=JSON.parse(localStorage.getItem(KEY))}catch(e){}d=d||{};
 const base={users:{},session:null,books:{},hidden:{},mail:{},prog:{},cloud:{books:[]},sync:{},diary:{},notes:[]};
 const r=Object.assign(base,d);r.set=Object.assign({pass:'prof123',hard:false,sound:true,room:'',sbUrl:'',sbKey:''},d.set||{});return r})();
let _sv;function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function saveSoon(){clearTimeout(_sv);_sv=setTimeout(save,150)}
const me=()=>DB.users[DB.session]||null;

/* ---------- contas locais ---------- */
function addUser(o){
 const name=String(o.name||'').trim().replace(/\s+/g,' ');const id=slug(name);
 if(name.length<2||!id)throw new Error('Digite seu nome (pelo menos 2 letras).');
 if(DB.users[id])throw new Error('Já existe um detetive com esse nome neste aparelho. Use outro nome (ex.: acrescente a inicial do sobrenome).');
 const pin=String(o.pin||'').trim();if(pin&&!/^\d{4}$/.test(pin))throw new Error('O PIN precisa ter 4 números (ou deixe em branco).');
 const u={id,name,cls:String(o.cls||'').trim(),animal:o.animal||ANIMALS[0],pin,created:now()};
 DB.users[id]=u;DB.mail[id]=[];DB.prog[id]={};seedMail(u);save();Net.saveUser(u);return u}
function login(id,pin){const u=DB.users[id];if(!u)throw new Error('Detetive não encontrado.');if(u.pin&&String(pin||'')!==u.pin)throw new Error('PIN incorreto.');DB.session=id;save();return u}
function logout(){DB.session=null;save()}
const now=()=>Date.now();

/* ---------- cartas ---------- */
function addMail(id,m){const L=DB.mail[id]||(DB.mail[id]=[]);if(m.id&&L.some(x=>x.id===m.id))return false;
 L.push(Object.assign({id:uid(),ts:now(),read:false,star:false,arch:false,del:false,cat:'friends',kind:'user'},m));return true}
function seedMail(u){
 const T=(mins)=>now()-mins*60000,N=(k,o)=>Object.assign({fromName:NPC[k].n,fromAnimal:NPC[k].a,fromAddr:npcAddr(k),role:NPC[k].r,kind:'npc',cat:'news',curio:true},o);
 const L=[
  N('owl',{id:'w:welcome',cat:'adventure',curio:false,ts:T(5),subj:'Bem-vindo ao Animail, detetive!',star:true,body:[`Olá, ${u.name}!`,'Somos os Amigos do Saber, bichos da fauna brasileira que vivem neste correio. Estamos aqui para ajudar você com dicas e curiosidades sobre o que estuda nos livros.','Quando você abrir um livro na Biblioteca, vamos mandar cartas com pistas sobre as ligações entre os fatos. Mas atenção: a caixa tem muitas cartas! Use a lupa de busca (ou Ctrl + K) para procurar palavras-chave.','Você também pode escrever para os colegas que já têm conta: veja "Recentes" na lateral. Boa investigação!']}),
  N('rac',{id:'w:onca',ts:T(60*5),subj:'Curiosidade: a onça-pintada e a mordida mais forte',title:'Onça-pintada',body:[`Oi, ${u.name}!`,'Sou a maior felina das Américas e tenho uma das mordidas mais fortes entre os felinos: consigo furar até casco de jabuti! Vivo na Amazônia, no Pantanal, no Cerrado e na Mata Atlântica.','Gosto de água e nado muito bem, diferente de muitos gatos. Hoje ela está ameaçada pela perda de floresta, por isso precisamos cuidar da mata.']}),
  N('rab',{id:'w:capivara',ts:T(60*9),subj:'Curiosidade: capivara, a maior roedora do mundo',title:'Capivara',body:['Olá!','Eu sou a maior roedora do mundo: posso pesar mais de 50 quilos. Vivo em grupos perto de rios e lagos, e adoro um mergulho. Meus dentes de roedor nunca param de crescer, por isso vivo roendo capim.','Outros bichos, como pássaros, costumam pousar nas minhas costas, e eu não ligo nem um pouco.']}),
  N('bear',{id:'w:preguica',ts:T(60*28),subj:'Curiosidade: por que a preguiça é tão lenta?',title:'Bicho-preguiça',body:['Oi, devagarzinho!','Como poucas folhas dão pouca energia, eu me movo bem devagar para economizar. Desço da árvore só uma vez por semana, para fazer cocô. Meu pelo até cria algas verdes que me deixam camuflada.']}),
  N('deer',{id:'w:boto',ts:T(60*30),subj:'Curiosidade: o boto-cor-de-rosa e a lenda do Amazonas',title:'Boto-cor-de-rosa',body:['Olá, amigo!','Sou um golfinho de rio e vivo na Amazônia. Quanto mais velho, mais rosado eu fico. Na lenda do folclore, o boto se transforma em um rapaz elegante de chapéu, que vai às festas das vilas.','A ciência diz que eu uso sons para me guiar nas águas escuras do rio.']}),
  N('bee',{id:'w:arara',ts:T(60*52),subj:'Curiosidade: a arara-azul e os frutos duros',title:'Arara-azul',body:['Oi!','A arara-azul-grande é uma das maiores aves da família dos papagaios. Meu bico é tão forte que quebra o coco de palmeiras, como o acuri. Hoje vivo bem no Pantanal, onde há projetos para proteger a gente.']}),
  N('hed',{id:'w:jacare',ts:T(60*70),subj:'Curiosidade: jacaré e o equilíbrio do Pantanal',title:'Jacaré',body:['Salve!','O jacaré-do-pantanal ajuda a manter os rios equilibrados: come peixes doentes e fracos. Na seca, quando a lagoa quase some, os jacarés cavam buracos fundos e a água acumulada ajuda outros bichos a sobreviver.']}),
 ];
 L.forEach(m=>addMail(u.id,m));
}

/* ---------- livros: leitura, páginas e pistas ---------- */
const MK=/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;
function sentences(par){const out=[];let cur='',inM=false;for(let i=0;i<par.length;i++){const c=par[i],c2=par[i+1];
  if(c==='['&&c2==='['){inM=true}if(c===']'&&c2===']'){inM=false}
  cur+=c;if(!inM&&/[.!?]/.test(c)&&(c2===' '||c2==='\n')){out.push(cur.trim());cur=''}}
 if(cur.trim())out.push(cur.trim());return out}
function paginate(text){
 text=String(text||'').replace(/\r/g,'').trim();if(!text)return[];
 if(/^[ \t]*---[ \t]*$/m.test(text)){
  return text.split(/^[ \t]*---[ \t]*$/m).map(s=>s.trim()).filter(Boolean).map(r=>{const m=r.match(/^#\s*(.+)\n?/);let title='';if(m){title=m[1].trim();r=r.slice(m[0].length).trim()}return{title,src:r}})}
 const pages=[];let cur={title:'',src:''};const flush=()=>{if(cur.src.trim())pages.push(cur);cur={title:'',src:''}};
 text.split(/\n{2,}/).forEach(par=>{par=par.trim();if(!par)return;
  const m=par.match(/^#\s*(.+)\n?([\s\S]*)$/);if(m){flush();cur.title=m[1].trim();par=m[2].trim();if(!par)return}
  const parts=par.length>1000?sentences(par).reduce((a,s)=>{const l=a[a.length-1];if(l&&l.length+s.length<700)a[a.length-1]=l+' '+s;else a.push(s);return a},[]):[par];
  parts.forEach(p=>{if(cur.src&&cur.src.length+p.length>820){const t=cur.title;flush();cur.title=t?t+' (cont.)':''}cur.src+=(cur.src?'\n\n':'')+p})});
 flush();return pages}
function renderProse(src){return String(src).split(/\n{2,}/).map(par=>{par=par.trim();let last=0,html='';
  par.replace(MK,(m,t,l,off)=>{html+=esc(par.slice(last,off))+`<span class="clue" data-k="${slug(l||t)}" tabindex="0" role="button" title="Clique para guardar esta pista">${esc(t)}</span>`;last=off+m.length;return m});
  html+=esc(par.slice(last));return`<p>${html.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}</p>`}).join('')}
const _PB={};
function normBook(b){return Object.assign({id:'',title:'Sem título',subject:'historia',grade:'',icon:'',color:'',active:true,intro:'',text:'',rels:[],extras:''},b)}
function parseBook(b){
 const sig=b.text+'|'+JSON.stringify(b.rels||[])+'|'+(b.extras||'');if(_PB[b.id]&&_PB[b.id].sig===sig)return _PB[b.id];
 const pages=paginate(b.text),clues={},order=[];
 pages.forEach((pg,pi)=>{pg.html=renderProse(pg.src);pg.keys=[];
  pg.src.split(/\n{2,}/).forEach(par=>sentences(par).forEach(sn=>{sn.replace(MK,(m,t,l)=>{const k=slug(l||t);if(!k)return m;
   if(!clues[k]){clues[k]={key:k,label:(l||t).trim(),text:t.trim(),page:pi,ctx:sn.replace(MK,(mm,tt)=>'\u0001'+tt+'\u0002').replace(/\s+/g,' ').trim()};order.push(k)}
   if(pg.keys.indexOf(k)<0)pg.keys.push(k);return m})}))});
 const rels=[];(b.rels||[]).forEach((r,i)=>{if(r&&clues[r.a]&&clues[r.b]&&r.a!==r.b){const A=clues[r.a],B=clues[r.b];
   rels.push(Object.assign({},r,{id:'r'+i,i,q:r.q||`Qual é a relação entre «${A.label}» e «${B.label}»?`,label:r.label||`${A.label} e ${B.label} estão ligados.`}))}});
 return(_PB[b.id]={sig,pages,clues,order,rels})}
function ctxHtml(ctx){return esc(ctx).replace(/\u0001(.+?)\u0002/g,'<mark>$1</mark>')}

/* ---------- fontes de livros ---------- */
let REPO=[]; // livros.json publicado no repositório
function allBooks(){const m=new Map();
 [].concat(SAMPLES,REPO,DB.cloud.books||[],Object.keys(DB.books).map(k=>DB.books[k])).forEach(b=>{if(!b||!b.id||b.type==='note')return;if(b.deleted)m.delete(b.id);else m.set(b.id,b)});
 Object.keys(DB.hidden).forEach(id=>{if(DB.hidden[id])m.delete(id)});return Array.from(m.values()).map(normBook)}
function allNotes(){const m=new Map();[].concat(REPO,DB.cloud.books||[],DB.notes||[]).forEach(n=>{if(!n||!n.id||n.type!=='note')return;if(n.deleted)m.delete(n.id);else m.set(n.id,n)});return Array.from(m.values()).filter(n=>n.active!==false).sort((a,b)=>(b.ts||0)-(a.ts||0))}
const visibleBooks=()=>allBooks().filter(b=>b.active!==false);
const getBook=id=>allBooks().find(b=>b.id===id)||null;
const isSample=id=>SAMPLES.some(b=>b.id===id);

/* ---------- progresso ---------- */
function P(u,mid){const U=DB.prog[u]||(DB.prog[u]={});return U[mid]||(U[mid]={opened:0,pages:[],clues:[],links:[],tries:{},errs:0,pts:0,hints:[],done:0,t0:0,t1:0,pos:{},lastC:0})}
function addPts(p,n){p.pts=Math.max(0,p.pts+n)}
function stat(u,b){const info=parseBook(b),p=P(u,b.id);const rl=info.rels.length;
 return{p,info,clues:p.clues.filter(k=>info.clues[k]).length,nClues:info.order.length,links:p.links.filter(id=>info.rels.some(r=>r.id===id)).length,nRels:rl,pages:p.pages.length,nPages:info.pages.length+2,
  done:!!p.done,state:p.done?'done':(p.opened?'doing':'new')}}
function totals(u){let pts=0,clues=0,done=0;visibleBooks().forEach(b=>{const s=stat(u,b);pts+=s.p.pts;clues+=s.clues;done+=s.done?1:0});return{pts,clues,done}}
const RANKS=[[0,'Aprendiz de Detetive'],[20,'Detetive Júnior'],[60,'Detetive de Campo'],[120,'Detetive-Chefe'],[220,'Mestre dos Casos']];
const rankOf=pts=>RANKS.filter(r=>pts>=r[0]).pop()[1];

/* ---------- entrega das cartas de um livro ---------- */
function deliver(u,b){const info=parseBook(b),user=DB.users[u];let n=0;const dk=SUBJ_NPC[b.subject]||'owl';
 info.rels.forEach((r,i)=>{const A=info.clues[r.a],B=info.clues[r.b],k=NPC[r.from]?r.from:dk,npc=NPC[k];
  const body=[`Olá, ${user.name}!`,(r.exp||'').trim()||`Descobri que «${A.label}» e «${B.label}» estão ligados: ${r.label}`,'Anote essa ligação no seu Quadro de Evidências!'];
  if(addMail(u,{id:`m:${b.id}:r${i}`,kind:'mission',mid:b.id,cat:'adventure',rel:r.id,fromName:npc.n,fromAnimal:npc.a,fromAddr:npcAddr(k),role:npc.r,subj:SUBJ_LINES[(hash(b.id)+i)%SUBJ_LINES.length],body,tags:[A.label,B.label,b.title],ts:now()-rnd(3,50)*60000-i*7000}))n++});
 String(b.extras||'').split('\n').map(s=>s.trim()).filter(Boolean).forEach((ln,i)=>{const p=ln.split('|');if(p.length<2)return;const ks=Object.keys(NPC),k=ks[(hash(b.id)+i*3)%ks.length],npc=NPC[k];
  if(addMail(u,{id:`m:${b.id}:x${i}`,kind:'mission',mid:b.id,cat:'news',curio:true,title:p[0].trim(),fromName:npc.n,fromAnimal:npc.a,fromAddr:npcAddr(k),role:npc.r,subj:'Curiosidade: '+p[0].trim(),body:[`Olá, ${user.name}!`,p.slice(1).join('|').trim()],tags:[b.title],ts:now()-rnd(5,70)*60000}))n++});
 if(n){save()}return n}

/* ---------- livros de exemplo (podem ser editados na Área do professor) ---------- */
const SAMPLES=[
{id:'hist-primeiros',title:'Os Primeiros Habitantes do Brasil',subject:'historia',grade:'4º ano',icon:'📜',color:'',active:true,
 intro:'Antes das caravelas, o litoral já tinha donos e histórias. Descubra quem eram eles e o que aconteceu quando as velas portuguesas apareceram no horizonte.',
 text:`# Antes de 1500
Muito antes de existir o Brasil que conhecemos, estas terras já eram habitadas. Eram os [[povos originários|Povos originários]], formados por centenas de povos diferentes, cada um com sua língua, seus costumes e suas histórias.

Entre eles estavam os [[Tupis]], que viviam em grande parte do litoral. Moravam em aldeias, plantavam mandioca e milho, pescavam e caçavam. A natureza era a sua grande casa.

---
# A chegada das caravelas
Em [[1500]], uma esquadra portuguesa comandada por [[Pedro Álvares Cabral|Cabral]] chegou ao litoral da atual Bahia. Os portugueses encontraram povos que já viviam ali havia muitos séculos.

Pouco tempo depois, os europeus perceberam que na mata crescia uma árvore valiosa: o [[pau-brasil|Pau-brasil]]. Da sua madeira se tirava uma tinta vermelha, muito usada para tingir tecidos na Europa. Dizem que o nome "Brasil" lembra a cor de brasa dessa madeira.

---
# Trocas e trabalho
Para conseguir as toras de pau-brasil, os portugueses faziam [[escambo|Escambo]] com os indígenas: era a troca de mercadorias sem usar dinheiro. Os indígenas cortavam e carregavam a madeira e recebiam machados, espelhos e outros objetos.

Com o tempo, a exploração das florestas e a chegada de cada vez mais europeus mudaram para sempre a vida dos povos que aqui viviam.`,
 rels:[
  {a:'povos-originarios',b:'tupis',label:'Os Tupis eram um dos povos originários, que viviam no litoral.',from:'owl',
   exp:'Procurei nos arquivos da floresta: os Tupis eram apenas um dos muitos povos originários. Eles já viviam no litoral muito antes da chegada dos europeus, em aldeias, e plantavam mandioca e milho. Até hoje usamos palavras de origem tupi, como "abacaxi" e "mandioca".'},
  {a:'1500',b:'cabral',label:'Em 1500, a esquadra de Cabral chegou ao litoral da atual Bahia.',from:'owl',
   exp:'Em 1500, a esquadra comandada por Pedro Álvares Cabral avistou o litoral da atual Bahia. Esse ano ficou marcado nos livros de História como a chegada dos portugueses a estas terras. Mas lembre-se: Cabral não chegou a um lugar vazio!'},
  {a:'pau-brasil',b:'escambo',label:'O pau-brasil era conseguido pelo escambo: troca de madeira por objetos.',from:'rac',
   exp:'Achei um velho diário de bordo! Para conseguir o pau-brasil, aquela madeira de tinta vermelha, os portugueses usavam o escambo: davam espelhos, machados e outros objetos em troca do trabalho dos indígenas de cortar e carregar as toras. Nada de dinheiro nessa história.'},
  {a:'cabral',b:'povos-originarios',label:'Quando Cabral chegou, os povos originários já viviam aqui havia séculos.',from:'owl',
   exp:'Quando Cabral e sua esquadra chegaram, os povos originários já viviam aqui havia muitos séculos. Os portugueses não "descobriram" um lugar deserto: encontraram gente, línguas e culturas muito antigas.'}],
 extras:`Escambo: troca sem dinheiro | O escambo foi uma das primeiras formas de comércio entre indígenas e europeus. Hoje ainda existe nas feiras de troca de livros e de sementes, onde ninguém paga com dinheiro.
Palavras que vieram do tupi | Muitos nomes que usamos vieram do tupi: abacaxi, mandioca, tatu, capivara, jacaré, Pindorama. O tupi deu nome a rios, bichos e cidades por todo o Brasil.
O pau-brasil quase acabou | A Mata Atlântica tinha muito pau-brasil, mas a exploração foi tão grande que a árvore ficou rara. Hoje ela é protegida e cultivada em projetos de recuperação da mata.`},

{id:'geo-biomas',title:'Os Biomas do Brasil',subject:'geografia',grade:'4º ano',icon:'🗺️',color:'',active:true,
 intro:'O Brasil é um país gigante e cada pedaço dele tem um tipo de natureza. Siga as pistas e descubra o que faz cada bioma ser único, inclusive o que mora pertinho de Resende.',
 text:`# O que é um bioma?
Bioma é um grande conjunto de paisagens com clima, relevo, vegetação e animais parecidos. O Brasil tem seis biomas: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pantanal e Pampa.

A [[Amazônia]] é a maior floresta tropical do planeta. O clima é quente e úmido, chove muito e por ali corre o [[Rio Amazonas]], um dos maiores rios do mundo em volume de água.

---
# Do litoral ao sertão
A [[Mata Atlântica]] cobria a costa brasileira, do Nordeste ao Sul. Foi muito desmatada e hoje restou só uma pequena parte dela. Perto de Resende, o [[Parque Nacional do Itatiaia|Itatiaia]] protege um pedaço dessa floresta.

Já a [[Caatinga]] existe só no Brasil. O [[clima semiárido|Clima semiárido]] faz chover pouco e de forma irregular. Mesmo assim, plantas como o mandacaru sobrevivem ali.

---
# Terra de águas
O [[Pantanal]] fica no centro-oeste do país e é uma das maiores [[planícies alagáveis|Planície alagável]] do planeta. Na época das chuvas, os rios transbordam e boa parte da terra fica coberta de água.

Nesse bioma vivem jacarés, tuiuiús, capivaras e onças-pintadas. Cada bioma abriga seres vivos que souberam se adaptar às suas condições.`,
 rels:[
  {a:'amazonia',b:'rio-amazonas',label:'O Rio Amazonas corta a Amazônia, a maior floresta tropical do planeta.',from:'fox',
   exp:'Estudei o mapa da floresta e confirmei: o Rio Amazonas corta a Amazônia de lado a lado. A região tem clima quente e úmido, chove muito, e o rio carrega uma das maiores quantidades de água do mundo.'},
  {a:'mata-atlantica',b:'itatiaia',label:'O Parque Nacional do Itatiaia protege um pedaço da Mata Atlântica.',from:'fox',
   exp:'Boa notícia para quem mora perto de Resende: o Parque Nacional do Itatiaia, o primeiro parque nacional do Brasil, criado em 1937, protege um pedaço da Mata Atlântica. É por isso que ali ainda se veem tantas árvores e bichos que quase sumiram do resto da costa.'},
  {a:'caatinga',b:'clima-semiarido',label:'A Caatinga tem clima semiárido: chove pouco e de forma irregular.',from:'bee',
   exp:'Fui visitar o sertão! Na Caatinga, o clima semiárido faz chover pouco e de forma irregular. As plantas, como o mandacaru, aprenderam a guardar água para atravessar a seca.'},
  {a:'pantanal',b:'planicie-alagavel',label:'O Pantanal é uma planície alagável: na época das chuvas, fica coberto de água.',from:'fox',
   exp:'O Pantanal é uma enorme planície alagável. Quando chegam as chuvas, os rios transbordam e a água cobre boa parte do terreno, trazendo alimento para jacarés, peixes e aves como o tuiuiú.'}],
 extras:`O Cerrado, berço das águas | O Cerrado é chamado de berço das águas porque suas nascentes alimentam grandes bacias do Brasil. Suas árvores têm raízes tão profundas que parecem florestas de cabeça para baixo.
O Pantanal é uma grande planície | Durante as cheias, a água cobre boa parte do Pantanal. Na seca, os rios voltam ao leito e os bichos se juntam nas lagoas que sobram.
A Amazônia e os rios voadores | A floresta solta vapor de água pelas folhas, e o vento leva essa umidade para outras regiões do Brasil, como se fossem rios no céu.`},

{id:'cie-cadeias',title:'Quem Come Quem? Cadeias Alimentares',subject:'ciencias',grade:'4º ano',icon:'🔬',color:'',active:true,
 intro:'Em toda mata, lagoa ou quintal, a energia viaja de um ser vivo para outro. Descubra como a vida se alimenta e por que, na natureza, nada se perde.',
 text:`# De onde vem a energia?
Todos os seres vivos precisam de energia para viver. Quase toda a energia da vida na Terra vem da [[luz do Sol|Energia do Sol]].

As plantas sabem aproveitar essa energia. Usando luz, água e gás carbônico, elas fabricam o próprio alimento em um processo chamado [[fotossíntese|Fotossíntese]].

---
# Quem produz, quem consome
Por fabricarem seu próprio alimento, as plantas e as algas são chamadas de [[produtores|Produtores]].

Os animais não conseguem fabricar alimento. Por isso precisam comer outros seres vivos e são chamados de [[consumidores|Consumidores]]. Alguns comem plantas, outros comem animais, e alguns comem os dois.

---
# Nada se perde
Quando um ser vivo morre, entram em ação os [[decompositores|Decompositores]], como fungos e bactérias. Eles transformam os restos em nutrientes que voltam ao [[solo|Solo]] e ajudam novas plantas a crescer.

Uma cadeia alimentar pode ser assim: capim, gafanhoto, sapo, cobra e gavião. As setas mostram quem serve de alimento para quem.`,
 rels:[
  {a:'energia-do-sol',b:'fotossintese',label:'Na fotossíntese, as plantas usam a energia da luz do Sol.',from:'bee',
   exp:'Fiquei o dia todo no jardim observando as folhas. Na fotossíntese, as plantas usam a energia da luz do Sol, junto com água e gás carbônico, para fabricar o alimento delas. Sem Sol, o jardim não funcionaria!'},
  {a:'fotossintese',b:'produtores',label:'Os produtores fazem fotossíntese e fabricam o próprio alimento.',from:'bee',
   exp:'Você sabia que os produtores, como as plantas e as algas, ganham esse nome porque fazem fotossíntese? Eles fabricam o próprio alimento e viram a base de qualquer cadeia alimentar.'},
  {a:'consumidores',b:'produtores',label:'Os consumidores se alimentam, direta ou indiretamente, dos produtores.',from:'bear',
   exp:'Eu sou um consumidor, e sou muito bom nisso! Os consumidores não fabricam alimento, então comem outros seres vivos. Quem come planta se alimenta direto dos produtores. Quem come outros animais se alimenta deles de forma indireta, porque o bicho comido também se alimentou de produtores.'},
  {a:'decompositores',b:'solo',label:'Os decompositores devolvem nutrientes ao solo.',from:'hed',
   exp:'No meu mercado de cogumelos aprendi que fungos e bactérias são decompositores. Eles transformam restos de seres mortos em nutrientes que voltam ao solo, e as novas plantas crescem fortes graças a eles.'}],
 extras:`A onça no topo da cadeia | Quando a onça desaparece de uma mata, os animais que ela caça podem aumentar demais e desequilibrar o lugar. Proteger o predador também protege toda a floresta.
Fotossíntese: a cozinha da folha | As plantas fabricam o próprio alimento usando luz do sol, água e gás carbônico. Elas são as produtoras no começo de quase todas as cadeias alimentares.
Decompositores: os faxineiros da mata | Fungos e bactérias transformam folhas caídas e bichos mortos em nutrientes que voltam ao solo. Sem eles, a floresta ficaria cheia de lixo.`}
];

/* ---------- Sala online (opcional): Supabase via REST puro ---------- */
const Net={
 st:'off',cache:{users:[]},
 on(){return!!(DB.set.sbUrl&&DB.set.sbKey&&DB.set.room)},
 room(){return String(DB.set.room||'').trim().toUpperCase()},
 async req(path,opt){opt=opt||{};const k=DB.set.sbKey,u=DB.set.sbUrl.replace(/\/+$/,'');
  const r=await fetch(u+'/rest/v1/'+path,Object.assign({},opt,{headers:Object.assign({apikey:k,Authorization:'Bearer '+k,'Content-Type':'application/json'},opt.headers||{})}));
  const t=await r.text();if(!r.ok)throw new Error(t||r.status);return t?JSON.parse(t):null},
 up(table,rows){return this.req(table+'?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows)})},
 async test(){const r=await this.req('da_users?select=id&limit=1');return Array.isArray(r)},
 async users(){if(!this.on())return[];try{const r=await this.req('da_users?room=eq.'+encodeURIComponent(this.room())+'&select=*&order=created');this.cache.users=r||[];this.st='ok';return this.cache.users}catch(e){this.st='err';return this.cache.users}},
 async findUser(id){if(!this.on())return null;try{const r=await this.req('da_users?id=eq.'+encodeURIComponent(this.room()+':'+id)+'&select=*');return r&&r[0]||null}catch(e){return null}},
 saveUser(u){if(!this.on())return Promise.resolve();return this.up('da_users',[{id:this.room()+':'+u.id,room:this.room(),name:u.name,animal:u.animal,cls:u.cls||'',pin:u.pin||'',created:u.created}]).catch(()=>{})},
 sendMail(m,to){if(!this.on())return Promise.resolve();return this.up('da_mail',[{id:this.room()+':'+m.id,room:this.room(),to_id:to,from_id:m.fromId||'',from_name:m.fromName,from_animal:m.fromAnimal,subj:m.subj,body:(m.body||[]).join('\n\n'),ts:m.ts}]).catch(()=>{})},
 async pull(u){if(!this.on())return 0;try{const since=DB.sync[u]||0;
   const r=await this.req('da_mail?room=eq.'+encodeURIComponent(this.room())+'&to_id=eq.'+encodeURIComponent(u)+'&ts=gt.'+since+'&select=*&order=ts');let n=0,mx=since;
   (r||[]).forEach(x=>{mx=Math.max(mx,+x.ts);const id=x.id.split(':').slice(1).join(':');
    if(addMail(u,{id,kind:'user',cat:'friends',fromId:x.from_id,fromName:x.from_name,fromAnimal:x.from_animal,fromAddr:(x.from_id||'')+'@animail.floresta',subj:x.subj,body:String(x.body||'').split('\n\n'),ts:+x.ts}))n++});
   DB.sync[u]=mx;if(n)save();return n}catch(e){return 0}},
 pushProg(u,mid){if(!this.on())return;clearTimeout(this._pp);this._pp=setTimeout(()=>{const p=DB.prog[u]&&DB.prog[u][mid];if(!p)return;const us=DB.users[u];
   this.up('da_prog',[{id:this.room()+':'+u+':'+mid,room:this.room(),user_id:u,user_name:us?us.name:u,cls:us?us.cls:'',mid,data:{clues:p.clues,links:p.links,errs:p.errs,pts:p.pts,done:p.done,opened:p.opened,t0:p.t0,t1:p.t1,pages:p.pages.length},ts:now()}]).catch(()=>{})},1500)},
 async allProg(){if(!this.on())return[];try{return await this.req('da_prog?room=eq.'+encodeURIComponent(this.room())+'&select=*&order=ts.desc')||[]}catch(e){return[]}},
 async pullBooks(){if(!this.on())return;try{const r=await this.req('da_books?room=eq.'+encodeURIComponent(this.room())+'&select=*');DB.cloud.books=(r||[]).map(x=>x.data);save()}catch(e){}},
 async publish(arr){const rows=arr.map(b=>({id:this.room()+':'+b.id,room:this.room(),data:b,ts:now()}));return this.up('da_books',rows)}
};
/* link mágico: #sala=BASE64(JSON{u,k,r}) */
function roomLink(){const o={u:DB.set.sbUrl,k:DB.set.sbKey,r:DB.set.room};return location.href.split('#')[0]+'#sala='+btoa(unescape(encodeURIComponent(JSON.stringify(o))))}
function applyRoomHash(){const m=location.hash.match(/sala=([^&]+)/);if(!m)return false;try{const o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));
  if(o.u&&o.k&&o.r){DB.set.sbUrl=o.u;DB.set.sbKey=o.k;DB.set.room=o.r;save();history.replaceState(null,'',location.pathname+location.search);return true}}catch(e){}return false}
async function loadRepoConfig(){
 try{const r=await fetch('config.json',{cache:'no-store'});if(r.ok){const c=await r.json();if(c.sbUrl&&c.sbKey&&!DB.set.sbUrl){DB.set.sbUrl=c.sbUrl;DB.set.sbKey=c.sbKey;DB.set.room=c.room||DB.set.room;save()}}}catch(e){}
 try{const r=await fetch('livros.json',{cache:'no-store'});if(r.ok){const j=await r.json();if(Array.isArray(j))REPO=j}}catch(e){}
}

/* ---------- navegação, cabeçalho, entrada, biblioteca, diário ---------- */
const Views={};const S={mid:null};let CUR=null;
function go(name,arg){
 if(CUR&&Views[CUR]&&Views[CUR].unmount)Views[CUR].unmount();
 CUR=name;const old=$('#view'),v=document.createElement('main');v.id='view';v.className='view v-'+name;old.replaceWith(v);
 document.body.dataset.v=name;Dlg.close();
 renderTop();Views[name].mount(v,arg||{});window.scrollTo(0,0)}

function unreadCount(){const u=me();return u?(DB.mail[u.id]||[]).filter(m=>!m.read&&!m.arch&&!m.del&&m.box!=='sent').length:0}
function renderTop(){
 const t=$('#top'),u=me();if(!u||CUR==='login'||CUR==='teacher'){Arara.sync();t.hidden=true;document.body.classList.remove('has-top');return}
 t.hidden=false;document.body.classList.add('has-top');Arara.sync();const tot=totals(u.id),n=unreadCount(),act=CUR==='book'?'lib':CUR;
 t.innerHTML=`<div class="top-in"><button class="brand-top" data-go="lib" aria-label="Biblioteca"><span class="lens">🔎</span><span><b>Detetives</b> do Saber</span></button>
  <nav class="tabs" aria-label="Seções">
   <button data-go="lib" class="${act==='lib'?'on':''}"><span class="e">📚</span><span>Biblioteca</span></button>
   <button data-go="board" class="${act==='board'?'on':''}"><span class="e">📌</span><span>Quadro</span></button>
   <button data-go="mail" class="${act==='mail'?'on':''}"><span class="e">✉️</span><span>Animail</span>${n?`<i class="badge">${n}</i>`:''}</button>
   <button data-go="diary" class="${act==='diary'?'on':''}"><span class="e">🏅</span><span>Diário</span></button></nav>
  <div class="who"><span class="av ${avCls(u.animal)}">${u.animal}</span><span class="nm">${esc(u.name)}</span><span class="pt">★ ${tot.pts}</span><button class="bt ghost sm gear" data-act="settings" title="Configurações" aria-label="Configurações">⚙️</button></div></div>`;
}
document.addEventListener('click',e=>{
 const g=e.target.closest('#top [data-go]');if(g){const to=g.dataset.go;
  if(to==='board'){const b=S.mid&&getBook(S.mid)?S.mid:lastBookId();if(!b){toast('Abra um livro na Biblioteca para montar o seu quadro.','📚');go('lib');return}go('board',{mid:b});return}
  go(to);return}
 const a=e.target.closest('#top [data-act="settings"]');if(a)openSettings()});
function lastBookId(){const u=me();if(!u)return null;const U=DB.prog[u.id]||{};let best=null,t=0;visibleBooks().forEach(b=>{const p=U[b.id];if(p&&p.opened>t){t=p.opened;best=b.id}});return best}

function teacherGate(){Dlg.prompt('Senha do professor','','password').then(v=>{if(v===null)return;if(v===DB.set.pass)go('teacher');else{toast('Senha incorreta.','🔒')}})}

/* ---------- ENTRADA ---------- */
Views.login={
 mount(root){
  const users=Object.values(DB.users);let tab=users.length?'in':'new',sel=null,avatar=ANIMALS[0];
  const title=w=>w.split('').map((ch,i)=>`<span class="r r${i%8+1}">${ch}</span>`).join('');
  const draw=()=>{root.innerHTML=`<div class="login"><div class="lg-wrap">
   <div class="stamp-lg">CASO ABERTO</div>
   <h1 class="lg-title"><span class="lg-w">${title('DETETIVES')}</span><span class="lg-w2">${title('DO SABER')}</span></h1>
   <p class="lg-sub">Leia o livro, guarde as pistas, procure as respostas no Animail e ligue os fatos no quadro.</p>
   <div class="lg-card"><div class="lg-tabs"><button data-t="in" class="${tab==='in'?'on':''}">Entrar</button><button data-t="new" class="${tab==='new'?'on':''}">Criar conta</button></div>
   ${tab==='in'?`<div class="lg-body">
     ${users.length?`<p class="lg-h">Detetives neste aparelho</p><div class="chips">${users.map(x=>`<button class="chip ${sel===x.id?'on':''}" data-u="${x.id}"><span class="av ${avCls(x.animal)}">${x.animal}</span>${esc(x.name)}</button>`).join('')}</div>`:`<p class="lg-h">Ainda não há detetives aqui. Crie a primeira conta!</p>`}
     <label class="fl">Seu nome<input class="in" id="inName" autocomplete="off" value="${sel?esc(DB.users[sel].name):''}" placeholder="Ex.: Ana Clara"></label>
     <label class="fl">PIN <small>(se você criou um)</small><input class="in" id="inPin" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 números"></label>
     <p class="err" id="err"></p><button class="bt big" id="go">Entrar no caso</button></div>`
    :`<div class="lg-body"><label class="fl">Seu nome<input class="in" id="nwName" autocomplete="off" maxlength="30" placeholder="Ex.: Ana Clara"></label>
     <div class="row2"><label class="fl">Turma <small>(opcional)</small><input class="in" id="nwCls" maxlength="12" placeholder="Ex.: 401"></label>
     <label class="fl">PIN <small>(opcional)</small><input class="in" id="nwPin" inputmode="numeric" maxlength="4" placeholder="4 números"></label></div>
     <p class="lg-h">Escolha seu bichinho</p><div class="avs">${ANIMALS.map(a=>`<button class="avb ${a===avatar?'on':''}" data-a="${a}" aria-label="${a}">${a}</button>`).join('')}</div>
     <p class="err" id="err"></p><button class="bt big" id="go">Criar conta e entrar</button></div>`}
   </div>
   ${Net.on()?`<p class="lg-room">🌐 Sala online: <b>${esc(Net.room())}</b> — suas contas e cartas valem em qualquer aparelho.</p>`:`<p class="lg-room">💾 Sua conta fica salva neste aparelho.</p>`}
   <footer class="lg-foot"><button class="lnk" data-act="loadbk">💾 Carregar backup</button><button class="lnk" id="prof">🔐 Área do professor</button><span>A.R.S. HTML APPS e GAMES</span></footer></div></div>`;
   bind()};
  const err=m=>{const e=$('#err',root);if(e)e.textContent=m||''};
  const bind=()=>{
   $$('.lg-tabs button',root).forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
   $$('.chip',root).forEach(b=>b.onclick=()=>{sel=b.dataset.u;draw();setTimeout(()=>{const p=$('#inPin',root);if(p)p.focus()},20)});
   $$('.avb',root).forEach(b=>b.onclick=()=>{avatar=b.dataset.a;$$('.avb',root).forEach(x=>x.classList.toggle('on',x===b))});
   $('#prof',root).onclick=teacherGate;
   const go1=$('#go',root);
   const enter=async()=>{err('');go1.disabled=true;
    try{
     if(tab==='in'){const nm=$('#inName',root).value.trim(),id=slug(nm),pin=$('#inPin',root).value;if(!id)throw new Error('Digite seu nome.');
      if(!DB.users[id]&&Net.on()){const r=await Net.findUser(id);if(r){DB.users[id]={id,name:r.name,cls:r.cls||'',animal:r.animal,pin:r.pin||'',created:+r.created||now()};DB.mail[id]=DB.mail[id]||[];DB.prog[id]=DB.prog[id]||{};seedMail(DB.users[id])}}
      if(!DB.users[id])throw new Error('Não encontrei esse nome. Confira ou crie uma conta.');
      login(id,pin)}
     else{const nm=$('#nwName',root).value,id=slug(nm);if(Net.on()&&id){const r=await Net.findUser(id);if(r)throw new Error('Esse nome já existe na sala online. Acrescente a inicial do sobrenome.')}
      const u=addUser({name:nm,cls:$('#nwCls',root).value,pin:$('#nwPin',root).value,animal:avatar});login(u.id,u.pin)}
     afterLogin();go('lib')}
    catch(e){err(e.message||String(e));go1.disabled=false}};
   go1.onclick=enter;$$('input',root).forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')enter()}));
   const f=$('#inName,#nwName',root);if(f&&!sel)f.focus()};
  draw()}
};
function afterLogin(){const u=me();if(!u)return;Net.pullBooks().then(()=>{if(CUR==='lib')go('lib')});Net.pull(u.id).then(n=>{if(n){toast(`${n} ${n>1?'cartas novas':'carta nova'} no Animail!`,'✉️');renderTop()}})}

/* ---------- BIBLIOTECA ---------- */
Views.lib={
 mount(root){
  const u=me(),tot=totals(u.id),rank=rankOf(tot.pts);let flt=localStorage.getItem('dds.flt')||'all';
  const books=visibleBooks();
  const tile=b=>{const s=stat(u.id,b),c=bookColor(b),sj=SUBJ[b.subject]||SUBJ.historia,pct=s.nRels?Math.round(100*s.links/s.nRels):0;
   return`<button class="bk" data-open="${esc(b.id)}" style="--c:${c};--c2:${shade(c,-.35)}" aria-label="${esc(b.title)}">
   <span class="bk-spine"></span><span class="bk-cover"><span class="bk-over">${esc(sj.n)}${b.grade?' · '+esc(b.grade):''}</span><span class="bk-ico">${esc(b.icon||sj.i)}</span><span class="bk-title">${esc(b.title)}</span><span class="bk-orn">❦</span></span>
   ${s.done?'<span class="bk-rib done">CASO RESOLVIDO</span>':s.state==='doing'?'<span class="bk-rib">EM ANDAMENTO</span>':'<span class="bk-rib new">NOVO CASO</span>'}
   <span class="bk-info"><span class="bar"><i style="width:${pct}%"></i></span><span>📌 ${s.clues}/${s.nClues} · 🧵 ${s.links}/${s.nRels}</span></span></button>`};
  const draw=()=>{
   const list=books.filter(b=>flt==='all'||b.subject===flt),per=Math.max(2,Math.floor(Math.min(innerWidth-32,1088)/194));
   const rows=[];for(let i=0;i<list.length;i+=per)rows.push(list.slice(i,i+per));
   $('#shelves',root).innerHTML=rows.length?`<section class="shelf">${rows.map(r=>`<div class="shelf-row">${r.map(tile).join('')}</div><div class="plank"></div>`).join('')}</section>`:`<div class="empty"><p>📭 Nenhum livro por aqui ainda.</p><small>Peça ao professor para cadastrar um caso novo.</small></div>`;
   $$('.chips2 button',root).forEach(b=>b.classList.toggle('on',b.dataset.f===flt))};
  root.innerHTML=`<div class="lib"><div class="lib-hero"><div><p class="eyebrow">Biblioteca dos Casos</p><h1>Olá, ${esc(u.name)}! <span>${u.animal}</span></h1>
   <p class="lead">Escolha um livro, leia com atenção e guarde as pistas. Depois, procure as respostas nas cartas do Animail e ligue os fatos no Quadro de Evidências.</p></div>
   <div class="hero-stats"><div><b>${tot.pts}</b><span>pontos</span></div><div><b>${tot.clues}</b><span>pistas</span></div><div><b>${tot.done}</b><span>casos resolvidos</span></div><div class="rk"><b>${esc(rank)}</b><span>patente</span></div></div></div>
   <div class="chips2"><button data-f="all">📚 Todos</button><button data-f="historia">📜 História</button><button data-f="geografia">🗺️ Geografia</button><button data-f="ciencias">🔬 Ciências</button></div>
   <div id="shelves"></div>
   <footer class="lg-foot light"><button class="lnk" id="prof">🔐 Área do professor</button><span>A.R.S. HTML APPS e GAMES</span></footer></div>`;
  root.addEventListener('click',e=>{
   const o=e.target.closest('[data-open]');if(o){go('book',{mid:o.dataset.open});return}
   const f=e.target.closest('.chips2 button');if(f){flt=f.dataset.f;localStorage.setItem('dds.flt',flt);draw();return}
   if(e.target.closest('#prof'))teacherGate()});
  draw()}
};


/* ---------- LIVRO (baseado no "Bound View") ---------- */
function shade(hex,f){const m=/^#?([0-9a-f]{6})$/i.exec(hex||'');if(!m)return hex;const n=parseInt(m[1],16);let r=n>>16,g=n>>8&255,b=n&255;
 const t=f<0?0:255,a=Math.abs(f);r=Math.round((t-r)*a+r);g=Math.round((t-g)*a+g);b=Math.round((t-b)*a+b);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const bookColor=b=>b.color||(SUBJ[b.subject]||SUBJ.historia).c;
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI'];

Views.book={
 off:[],
 mount(root,arg){
  const b=getBook(arg.mid);if(!b){go('lib');return}
  const u=me().id,info=parseBook(b),p=P(u,b.id),sj=SUBJ[b.subject]||SUBJ.historia;
  S.mid=b.id;
  if(!p.opened){p.opened=now();p.t0=p.t0||now();const n=deliver(u,b);save();Net.pushProg(u,b.id);
   if(n)setTimeout(()=>{toast(`${n} ${n>1?'cartas novas chegaram':'carta nova chegou'} no Animail!`,'✉️');Snd.play('mail');renderTop()},1100)}
  const mode=arg.mode||localStorage.getItem('dds.mode')||(innerWidth<760?'simple':'book');
  const curveOn=localStorage.getItem('dds.curve')!=null?localStorage.getItem('dds.curve')==='1':!(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||matchMedia('(pointer:coarse)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches);
  const nP=info.pages.length,qLabel=q=>q===0?'Índice':q<=nP?'Pág. '+q:q===nP+1?'Dossiê':'—';
  const color=bookColor(b);

  /* ----- páginas ----- */
  const cluesGot=()=>p.clues.filter(k=>info.clues[k]).length;
  const pageIdx=()=>`<div class="page"><p class="eyebrow">${esc(sj.n)} · caso ${esc(b.grade||'')}</p><h1 class="title">${esc(b.title)}</h1><hr class="rule orn">
   <p class="lead">${esc(b.intro||'Leia com atenção, guarde as pistas e descubra as ligações.')}</p>
   <ul class="index">${info.pages.map((pg,i)=>`<li><span class="num">${ROMAN[i]||i+1}.</span> ${esc(pg.title||'Página '+(i+1))} <span class="dots"></span><span class="pg">${i+1}</span></li>`).join('')}
   <li><span class="num">★</span> Dossiê do caso <span class="dots"></span><span class="pg">${nP+1}</span></li></ul>
   <div class="pagefoot"><span>Índice</span><span>vire a página →</span></div></div>`;
  const pageTxt=(pg,i)=>`<div class="page" data-q="${i+1}"><p class="eyebrow">${esc(sj.n)} · página ${i+1}</p>${pg.title?`<h2 class="head">${esc(pg.title)}</h2>`:''}<div class="prose">${pg.html}</div>
   <div class="pagefoot"><span class="pf-clues" data-pg="${i}"></span><span>${i+1}</span></div></div>`;
  const pageDos=()=>`<div class="page" data-q="${nP+1}"><p class="eyebrow">Dossiê do caso</p><h2 class="head">Perguntas a resolver</h2>
   <p class="lead">Guarde as pistas do texto, procure as respostas nas cartas do Animail e ligue os fatos no Quadro de Evidências.</p>
   <ol class="qs">${info.rels.length?info.rels.map(r=>`<li data-rel="${r.id}">${esc(r.q)} <span class="tag"></span></li>`).join(''):'<li>O professor ainda não cadastrou perguntas para este caso.</li>'}</ol>
   <div class="actions"><button class="btn" data-go="board">📌 Abrir o Quadro</button><button class="btn ghost" data-go="mail">✉️ Ir ao Animail</button></div>
   <div class="pagefoot"><span>Dossiê</span><span>${nP+1}</span></div></div>`;
  const Q=[pageIdx()].concat(info.pages.map(pageTxt),[pageDos()]);
  if(Q.length%2)Q.push(`<div class="page colophon"><span class="big">❦</span><p class="eyebrow">Fim do livro</p><h2 class="head">Bom trabalho, detetive!</h2><p class="lead" style="max-width:34ch">Ainda falta ligar algum fato? Volte ao Quadro de Evidências.</p></div>`);
  const M=Q.length/2,N=M+2;
  const cover=`<div class="leather"><div class="frame"><span class="over">${esc(sj.i)} ${esc(sj.n)}${b.grade?' · '+esc(b.grade):''}</span><h1>${esc(b.title)}</h1><span class="orn">❦ ❦ ❦</span><span class="sub">Livro-caso do detetive ${esc(me().name)}</span><button class="btn brass" data-flip-next>Abrir o livro</button><span class="hint">ou toque no canto inferior direito</span></div></div>`;
  const endL=`<div class="endpaper"><div class="bookplate"><div class="over">Ex libris</div><div class="name">${esc(me().animal)} ${esc(me().name)}</div><div class="yr">Detetives do Saber · ${esc(sj.n)}</div></div></div>`;
  const endR=`<div class="endpaper"><div class="bookplate"><div class="over">Nota do encadernador</div><div class="name">Caso: ${esc(b.title)}</div><div class="yr">A.R.S. HTML APPS e GAMES</div></div></div>`;
  const back=`<div class="leather"><div class="frame"><span class="orn">❦</span><span class="sub">Detetives do Saber</span><span class="hint">${esc(sj.n)}</span></div></div>`;

  root.dataset.mode=mode;
  root.innerHTML=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="book-curve" x="-4%" y="-8%" width="108%" height="118%" color-interpolation-filters="sRGB"><feImage id="curve-map" preserveAspectRatio="none" result="map"/><feDisplacementMap id="disp" in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="warped"/><feGaussianBlur id="soft" in="warped" stdDeviation="0"/></filter></svg>
  <div class="bk-bar"><button class="bt ghost sm" data-go="lib">← Biblioteca</button>
   <div class="bk-ttl"><b>${esc(b.title)}</b><small id="bkSub"></small></div>
   <div class="bk-act"><button class="bt ghost sm" data-act="mode" title="Trocar entre livro 3D e leitura simples">${mode==='book'?'📄 Leitura simples':'📖 Livro 3D'}</button>
   ${mode==='book'?`<button class="bt ghost sm ${curveOn?'on':''}" data-act="curve" title="Curvatura das páginas">〰 Curva</button>`:''}
   <button class="bt sm" data-go="board">📌 Quadro <i class="cnt" id="cntClues">0</i></button><button class="bt sm" data-go="mail">✉️ Animail</button></div></div>
  ${mode==='book'?`<div class="stage"><div class="warp curved" id="warp"><div class="book closed-front" id="book" style="--leather-1:${color};--leather-2:${shade(color,-.3)};--leather-3:${shade(color,-.5)}"><div class="edge l"></div><div class="edge r"></div><div id="leaves"></div>
   <div class="spine3d" aria-hidden="true"><div class="sface"><span class="stitle">${esc(b.title)}</span></div><div class="sface rev"><span class="stitle">${esc(b.title)}</span></div></div><div class="gutter"></div></div></div></div>
   <div class="pager"><button class="navbtn" id="prev" disabled>‹ Anterior</button><span class="pos" id="pos"></span><button class="navbtn" id="next">Próxima ›</button></div>`
   :`<div class="simple" style="--leather-1:${color}"><div class="sheet" id="sheet"></div><div class="pager"><button class="navbtn" id="prev">‹ Anterior</button><span class="pos" id="pos"></span><button class="navbtn" id="next">Próxima ›</button></div></div>`}
  <p class="bk-help">Dica: clique nas frases <span class="clue demo">marcadas</span> para guardar pistas no seu Quadro de Evidências.</p>`;
  root.classList.toggle('hard',!!DB.set.hard);

  /* ----- pistas ----- */
  function refresh(){
   $$('.clue',root).forEach(el=>el.classList.toggle('got',p.clues.indexOf(el.dataset.k)>=0));
   $$('.pf-clues',root).forEach(el=>{const ks=info.pages[+el.dataset.pg].keys,g=ks.filter(k=>p.clues.indexOf(k)>=0).length;el.textContent=ks.length?`📌 ${g}/${ks.length} pistas nesta página`:'sem pistas aqui'});
   $$('.qs li[data-rel]',root).forEach(li=>{const ok=p.links.indexOf(li.dataset.rel)>=0,t=$('.tag',li);t.className='tag '+(ok?'ok':'warn');t.textContent=ok?'resolvida':'pendente'});
   $('#cntClues',root).textContent=cluesGot()+'/'+info.order.length;
   $('#bkSub',root).textContent=`${sj.n} · ${p.links.length}/${info.rels.length} ligações`;
  }
  let _lk='',_lt=0;
  function collect(k,ev){
   const c=info.clues[k];if(!c)return;if(k===_lk&&Date.now()-_lt<500)return;_lk=k;_lt=Date.now();
   if(p.clues.indexOf(k)>=0){toast('Essa pista já está no seu Quadro de Evidências.','📌');return}
   p.clues.push(k);addPts(p,SCORE.clue);if(!p.t0)p.t0=now();save();Net.pushProg(u,b.id);Snd.play('collect');refresh();renderTop();
   toast(`Pista guardada: ${c.label}`,'📌');
   const r=(ev&&ev.target&&ev.target.getBoundingClientRect)?ev.target.getBoundingClientRect():null;
   if(r){const f=E('div',{class:'pinfly'},'+'+SCORE.clue+' 📌');f.style.left=(r.left+r.width/2)+'px';f.style.top=r.top+'px';document.body.append(f);setTimeout(()=>f.remove(),1100)}
  }
  root.addEventListener('click',e=>{
   const cl=e.target.closest('.clue');if(cl&&!cl.classList.contains('demo')){collect(cl.dataset.k,e);return}
   const g=e.target.closest('[data-go]');if(g){go(g.dataset.go,{mid:b.id});return}
   const a=e.target.closest('[data-act]');if(a){
    if(a.dataset.act==='mode'){localStorage.setItem('dds.mode',mode==='book'?'simple':'book');go('book',{mid:b.id,mode:mode==='book'?'simple':'book'})}
    if(a.dataset.act==='curve'){localStorage.setItem('dds.curve',curveOn?'0':'1');go('book',{mid:b.id,c:cur})}}});
  root.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('clue')&&!e.target.classList.contains('demo')){e.preventDefault();collect(e.target.dataset.k,e)}});

  const markQ=q=>{if(q>=0&&q<=nP+1&&p.pages.indexOf(q)<0){p.pages.push(q);saveSoon()}};

  /* ===== modo simples ===== */
  let cur=0;
  if(mode==='simple'){
   const sheet=$('#sheet',root),prev=$('#prev',root),next=$('#next',root),tot=nP+2;
   let q=clamp(arg.page!=null?arg.page+1:(p.lastQ||0),0,tot-1);
   const show=()=>{sheet.innerHTML=Q[q];$('#pos',root).textContent=`${qLabel(q)} · ${q+1}/${tot}`;prev.disabled=q===0;next.disabled=q===tot-1;markQ(q);p.lastQ=q;refresh();sheet.scrollTop=0;window.scrollTo(0,0)};
   prev.onclick=()=>{q--;show()};next.onclick=()=>{q++;show()};
   const kd=e=>{if(e.target.closest('input,select,textarea'))return;if(e.key==='ArrowRight'&&q<tot-1){q++;show()}if(e.key==='ArrowLeft'&&q>0){q--;show()}};
   document.addEventListener('keydown',kd);this.off.push(()=>document.removeEventListener('keydown',kd));
   show();return}

  /* ===== modo livro 3D ===== */
  const leaves=[{f:cover,b:endL,cls:'cover'}];
  for(let j=0;j<M;j++)leaves.push({f:Q[2*j],b:Q[2*j+1]});
  leaves.push({f:endR,b:back,cls:'cover'});
  const leavesEl=$('#leaves',root),papers=[];
  leaves.forEach((L,i)=>{const pp=document.createElement('div');pp.className='paper'+(L.cls?' '+L.cls:'');pp.style.setProperty('--tz',(-(i)*0.6)+'px');
   pp.innerHTML=`<div class="face front">${L.f}<span class="corner next" data-dir="next"></span></div><div class="face back">${L.b}<span class="corner prev" data-dir="prev"></span></div>`;leavesEl.appendChild(pp);papers.push(pp)});
  let current=0,animating=false,prevClosed=true;
  const bookEl=$('#book',root),prevBtn=$('#prev',root),nextBtn=$('#next',root),posEl=$('#pos',root);
  const posLabel=c=>c===0?'Capa fechada':c===N?'Contracapa':(c>=2?qLabel(2*c-3):'Guardas')+' · '+(c<=M?qLabel(2*c-2):'Fim');
  function applyState(){
   prevBtn.disabled=current===0;nextBtn.disabled=current===N;posEl.textContent=posLabel(current);
   const closed=current===0||current===N;bookEl.classList.toggle('closed-front',current===0);bookEl.classList.toggle('closed-back',current===N);bookEl.classList.toggle('is-closed',closed);
   const T=24,fi=Math.min(Math.max(current-1,0),M);bookEl.style.setProperty('--tL',(fi/M*T).toFixed(1)+'px');bookEl.style.setProperty('--tR',((M-fi)/M*T).toFixed(1)+'px');
   if(current>=1&&current<=M+1){if(current<=M)markQ(2*current-2);if(current>=2)markQ(2*current-3)}
   papers.forEach((pp,i)=>{pp.classList.toggle('vf',i===current);pp.classList.toggle('vb',i===current-1)});
   p.lastC=current;cur=current;syncCurve(prevClosed&&!closed);prevClosed=closed;
  }
  function settle(pp){animating=true;const done=()=>{pp.classList.remove('turning');animating=false};pp.addEventListener('transitionend',done,{once:true});setTimeout(done,980)}
  function flip(dir){if(animating)return;
   if(dir==='next'&&current<N){const pp=papers[current];pp.classList.add('turning','flipped');current++;settle(pp);Snd.play('flip')}
   else if(dir==='prev'&&current>0){current--;const pp=papers[current];pp.classList.add('turning');pp.classList.remove('flipped');settle(pp);Snd.play('flip')}
   applyState()}
  function jump(c){bookEl.classList.add('no-anim');papers.forEach((pp,i)=>pp.classList.toggle('flipped',i<c));current=c;prevClosed=(c===0);applyState();requestAnimationFrame(()=>requestAnimationFrame(()=>bookEl.classList.remove('no-anim')))}
  prevBtn.onclick=()=>flip('prev');nextBtn.onclick=()=>flip('next');
  leavesEl.addEventListener('click',e=>{const c=e.target.closest('.corner');if(c)flip(c.dataset.dir)});
  root.addEventListener('click',e=>{if(e.target.matches('[data-flip-next]'))flip('next')});
  /* arrastar a folha / clicar na borda da página */
  (function(){let d=null,sup=false;const stage=$('#warp',root);if(!stage)return;stage.style.touchAction='pan-y';
   stage.addEventListener('pointerdown',e=>{if(e.button>0||animating)return;if(e.target.closest('.clue,button,a,input,textarea,select,.opt,[data-go],[data-flip-next]'))return;
    const r=stage.getBoundingClientRect(),right=e.clientX>r.left+r.width/2;let leaf=null;
    if(right&&current<N)leaf=papers[current];else if(!right&&current>0)leaf=papers[current-1];if(!leaf)return;
    d={x:e.clientX,y:e.clientY,right,leaf,half:r.width/2,mv:false,pr:0,id:e.pointerId}});
   window.addEventListener('pointermove',e=>{if(!d||e.pointerId!==d.id)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;
    if(!d.mv){if(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.2){if(Math.abs(dy)>14)d=null;return}d.mv=true;d.leaf.classList.add('turning');d.leaf.style.transition='none'}
    const pr=d.right?Math.max(0,Math.min(1,-dx/d.half)):Math.max(0,Math.min(1,dx/d.half));d.pr=pr;
    const ang=d.right?-180*pr:-180+180*pr;d.leaf.style.transform='rotateY('+ang.toFixed(1)+'deg) translateZ(var(--tz,0px))';e.preventDefault()},{passive:false});
   const end=e=>{if(!d||(e&&e.pointerId!==d.id))return;const x=d;d=null;
    if(!x.mv)return;sup=true;setTimeout(()=>{sup=false},80);
    x.leaf.style.transition='';x.leaf.style.transform='';
    if(x.pr>0.22)flip(x.right?'next':'prev');else{x.leaf.classList.add('turning');setTimeout(()=>x.leaf.classList.remove('turning'),900)}};
   let pd0=null;stage.addEventListener('pointerdown',e=>{pd0={x:e.clientX,y:e.clientY}},true);
   window.addEventListener('pointerup',e=>{const s0=pd0;pd0=null;if(!s0||Math.abs(e.clientX-s0.x)>8||Math.abs(e.clientY-s0.y)>8)return;if(!stage.contains(e.target))return;
    let hit=e.target.closest&&e.target.closest('.clue');
    if(!hit){const cs=$$('.paper.vf .clue,.paper.vb .clue',stage),pts=[[e.clientX,e.clientY]];try{const q=srcPoint(e.clientX,e.clientY);if(q)pts.push(q)}catch(er){}
     outer:for(const c of cs){for(const r of c.getClientRects()){for(const q of pts){if(q[0]>=r.left-3&&q[0]<=r.right+3&&q[1]>=r.top-3&&q[1]<=r.bottom+3){hit=c;break outer}}}}}
    if(hit&&!hit.classList.contains('demo')&&hit.dataset.k)collect(hit.dataset.k,{target:hit})});
   window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
   stage.addEventListener('click',e=>{if(sup){e.stopPropagation();e.preventDefault();return}
    if(e.target.closest('.clue,button,a,input,textarea,select,.opt,[data-go],.corner,[data-flip-next]'))return;
    const r=stage.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width;if(fx>0.93)flip('next');else if(fx<0.07)flip('prev')},true);
   this.off.push(()=>{window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end)})}).call(this);
  const kd=e=>{if(e.target.closest('input,select,textarea'))return;if(e.key==='ArrowRight')flip('next');if(e.key==='ArrowLeft')flip('prev')};
  document.addEventListener('keydown',kd);this.off.push(()=>document.removeEventListener('keydown',kd));

  /* ----- curvatura por lado (código do modelo, adaptado) ----- */
  const REG={x:0.04,w:1.08,y:0.08,h:1.18},HALF=0.5-REG.x/REG.w;
  const gyA=[[0.000,0],[0.068,0],[0.280,.38],[0.490,.55],[0.700,.38],[0.915,.15],[1.000,.12]];
  let dL=curveOn?12:0,dR=curveOn?12:0,gxLUT=[[0,128],[1,128]];
  const prof=t=>{if(t>=1)return 0;const base=Math.pow(1-t,2.2),round=0.04*Math.pow(Math.max(0,1-t/0.06),2);return Math.max(0,base-round)};
  const well=(t,D)=>{const w=Math.max(0,1-t/0.14);return 0.96*D*w*w};
  const lerpStops=(st,t)=>{if(t<=st[0][0])return st[0][1];for(let i=1;i<st.length;i++){if(t<=st[i][0]){const a=st[i-1],c=st[i];return a[1]+(c[1]-a[1])*(t-a[0])/(c[0]-a[0])}}return st[st.length-1][1]};
  const mapImg=$('#curve-map',root),warp=$('#warp',root),disp=$('#disp',root),soft=$('#soft',root);
  function rebuildMap(){const D=Math.max(dL,dR),steps=160;gxLUT=[];let stops='';
   for(let i=0;i<=steps;i++){const uu=i/steps;let g=128;if(D>0){const t=Math.min(1,Math.abs(uu-0.5)/HALF),d=uu<=0.5?dL:dR,dp=Math.max(d*prof(t),well(t,D));g=Math.round(128-127*dp/D)}
    gxLUT.push([uu,g]);stops+=`<stop offset="${uu.toFixed(5)}" stop-color="rgb(128,${g},128)"/>`}
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><defs><linearGradient id="gx" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient><linearGradient id="gy" x1="0" y1="0" x2="0" y2="1">${gyA.map(([o,a])=>`<stop offset="${o}" stop-color="rgb(128,128,128)" stop-opacity="${a}"/>`).join('')}</linearGradient></defs><rect width="1200" height="600" fill="url(#gx)"/><rect width="1200" height="600" fill="url(#gy)"/></svg>`;
   const uri='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);mapImg.setAttribute('href',uri);mapImg.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',uri)}
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;let scale=0,raf=null,curveTimer=null;
  const setScale=s=>{scale=s;disp.setAttribute('scale',s.toFixed(2));soft.setAttribute('stdDeviation',Math.min(0.35,s*0.013).toFixed(3))};
  function tweenTo(to,after){cancelAnimationFrame(raf);if(RM){setScale(to);if(after)after();return}
   const step=()=>{const d=to-scale;if(Math.abs(d)<0.15){setScale(to);if(after)after();return}setScale(scale+d*0.14);raf=requestAnimationFrame(step)};step()}
  function syncCurve(justOpened){clearTimeout(curveTimer);const D=Math.max(dL,dR),closed=current===0||current===N,goal=(closed||D===0)?0:2*D;
   if(goal===0){tweenTo(0,()=>{if(Math.max(dL,dR)===0)warp.classList.remove('curved')});return}
   warp.classList.add('curved');if(justOpened&&!RM)curveTimer=setTimeout(()=>tweenTo(goal),900);else tweenTo(goal)}
  rebuildMap();
  this.off.push(()=>{cancelAnimationFrame(raf);clearTimeout(curveTimer)});

  /* ----- correção de clique sob a curvatura ----- */
  function srcPoint(cx,cy){const r=warp.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom+40)return null;
   const uu=((cx-r.left)/r.width+REG.x)/REG.w,v=((cy-r.top)/r.height+REG.y)/REG.h,g=lerpStops(gxLUT,uu),a=lerpStops(gyA,v),eff=g*(1-a)+128*a,dy=scale*(eff/255-0.5);
   if(Math.abs(dy)<2)return null;return[cx,cy+dy]}
  function correctedTarget(e){if(!e.isTrusted||scale<0.5)return null;const pt=srcPoint(e.clientX,e.clientY);if(!pt)return null;
   const el=document.elementFromPoint(pt[0],Math.max(0,Math.min(pt[1],innerHeight-1)));if(!el||!warp.contains(el))return null;
   if(el===e.target||el.contains(e.target)||e.target.contains(el))return null;return el}
  const pd=e=>{const t=correctedTarget(e);if(!t)return;e.preventDefault();const ctl=t.closest('input, select, textarea');if(ctl)ctl.focus({preventScroll:true})};
  const ck=e=>{const t=correctedTarget(e);if(!t)return;e.preventDefault();e.stopPropagation();
   const ctl=t.closest('button, [data-flip-next], [data-go], .clue, label, input, select, textarea, .corner')||t;
   if(typeof ctl.click==='function')ctl.click();else ctl.dispatchEvent(new MouseEvent('click',{bubbles:true}))};
  document.addEventListener('pointerdown',pd,true);document.addEventListener('click',ck,true);
  this.off.push(()=>{document.removeEventListener('pointerdown',pd,true);document.removeEventListener('click',ck,true)});

  refresh();
  if(arg.page!=null){const q=arg.page+1,c=(q%2===0)?(q+2)/2:(q+3)/2;jump(c)}
  else if(arg.c!=null)jump(arg.c);
  else if(p.lastC&&p.lastC<N&&p.lastC>0)jump(p.lastC);
  else applyState();
 },
 unmount(){this.off.forEach(f=>{try{f()}catch(e){}});this.off=[];save()}
};

/* ---------- QUADRO DE EVIDÊNCIAS (baseado no "Evidence Board") ---------- */
const cutTitle=t=>String(t).split('').map(ch=>ch===' '?' ':`<span class="cut">${esc(ch)}</span>`).join('');
Views.board={
 off:[],
 mount(root,arg){
  const b=getBook(arg.mid||S.mid);if(!b){go('lib');return}
  S.mid=b.id;const u=me().id,info=parseBook(b),p=P(u,b.id),sj=SUBJ[b.subject]||SUBJ.historia;
  const ST={sort:'recent',loose:false,link:false,from:null,free:Object.keys(p.pos).length>0,ptr:null};
  const caseNo=String(allBooks().findIndex(x=>x.id===b.id)+1).padStart(3,'0');
  const words=b.title.toUpperCase().split(' ').map(w=>`<span class="w">${w.split('').map((ch,i)=>`<span class="r r${(i%8)+1}">${esc(ch)}</span>`).join('')}</span>`).join(' ');
  root.innerHTML=`<div class="board" id="board"><div class="board-grain" aria-hidden="true"></div><div class="board-flicker" aria-hidden="true"></div><div class="classified" id="classified" aria-hidden="true">ARQUIVO SECRETO</div>
   <header class="case-header"><div class="stamp">CASO Nº ${caseNo} · ${esc(sj.n.toUpperCase())}</div>
   <h1 class="case-title ${b.title.length>16?'long':''}">${words}<span class="r-sub">QUADRO DE EVIDÊNCIAS</span></h1>
   <div class="controls"><button class="ctrl is-active" data-sort="recent">NOVAS PRIMEIRO</button><button class="ctrl" data-sort="page">POR PÁGINA</button><button class="ctrl" data-filter="loose">SÓ AS SOLTAS</button>
    <button class="ctrl" data-action="link">&#9672; LIGAR PISTAS</button><button class="ctrl" data-action="reset">&#8634; REPRENDER</button>
    <button class="ctrl red" data-action="qs">❓ PERGUNTAS</button><button class="ctrl" data-action="mail">✉ ANIMAIL</button><button class="ctrl" data-action="book">📖 LIVRO</button></div>
   <p class="hint" id="hint"></p></header>
   <svg class="strings show" id="strings" aria-hidden="true"></svg><div class="knots" id="knots"></div>
   <main class="pinboard" id="pinboard" aria-live="polite"></main>
   <footer class="case-footer" id="footer"></footer></div>
   <div class="notes" id="notes" aria-hidden="true"><div class="notes-card" role="dialog" aria-modal="true"><button class="notes-close" data-close aria-label="Fechar">&times;</button><div id="note-body"></div></div></div>`;
  const boardEl=$('#board',root),pin=$('#pinboard',root),svg=$('#strings',root),knots=$('#knots',root),footer=$('#footer',root),hint=$('#hint',root),notes=$('#notes',root),nb=$('#note-body',root),stampEl=$('#classified',root);
  const linkedKeys=()=>{const s=new Set();p.links.forEach(id=>{const r=info.rels.find(x=>x.id===id);if(r){s.add(r.a);s.add(r.b)}});return s};
  const relOf=(a,c)=>info.rels.find(r=>(r.a===a&&r.b===c)||(r.a===c&&r.b===a));
  let justDragged=false,drag=null;

  function setHint(){
   if(!p.clues.length)hint.textContent='Ainda não há pistas. Abra o livro e clique nas frases marcadas para guardá-las aqui.';
   else if(ST.from)hint.textContent=`Ligando «${info.clues[ST.from].label}»… escolha a outra pista (clique de novo na mesma para cancelar).`;
   else hint.textContent='arraste as pistas para reorganizar · toque no título para ver a anotação · use o alfinete 🧵 para ligar duas pistas · leia as cartas do Animail para descobrir as ligações'}
  function render(anim){
   let list=p.clues.filter(k=>info.clues[k]).map((k,i)=>({k,i,c:info.clues[k]}));
   if(ST.sort==='page')list.sort((x,y)=>x.c.page-y.c.page||x.i-y.i);
   const lk=linkedKeys();if(ST.loose)list=list.filter(x=>!lk.has(x.k));
   pin.innerHTML='';
   if(!list.length){pin.append(E('div',{class:'empty-board'},E('b',{},p.clues.length?'Todas as pistas já estão ligadas!':'Nenhuma pista guardada ainda'),E('span',{},p.clues.length?'Clique em "SÓ AS SOLTAS" para ver todas de novo.':'Leia o livro e clique nas frases destacadas.'),p.clues.length?'':E('button',{class:'ctrl',onclick:()=>go('book',{mid:b.id})},'📖 ABRIR O LIVRO')))}
   list.forEach((x,idx)=>{
    const el=document.createElement('article');el.className='exhibit'+(lk.has(x.k)?' linked':'')+(ST.from===x.k?' tying':'');el.dataset.k=x.k;
    el.style.setProperty('--rot',(((hash(x.k)%9)-4))+'deg');el.style.animationDelay=(idx*0.04)+'s';
    if(ST.free){const ps=p.pos[x.k]||(p.pos[x.k]=defPos(idx));el.style.setProperty('--x',ps.x+'px');el.style.setProperty('--y',ps.y+'px')}
    if(idx===2)el.classList.add('haunted');
    el.innerHTML=`<button class="pinbtn" data-act="pin" aria-label="Ligar «${esc(x.c.label)}» com barbante" title="Ligar com barbante"></button>
     <div class="ex-meta"><span class="feed-source">PISTA ${String(x.i+1).padStart(2,'0')}</span><span class="pub-date">livro, pág. ${x.c.page+1}</span></div>
     <h2 class="ex-title" data-act="notes" title="abrir anotação">${cutTitle(x.c.label)}</h2><p class="ex-body">${ctxHtml(x.c.ctx)}</p>
     <div class="ex-actions"><button data-act="tie">🧵 LIGAR</button><button data-act="book">📖 LIVRO</button></div>`;
    pin.append(el)});
   if(ST.free){const h=Math.max(320,...Array.from(pin.children).map(c=>(parseFloat(c.style.getPropertyValue('--y'))||0)+240));pin.style.height=h+'px'}else pin.style.height='';
   pin.classList.toggle('free',ST.free);
   footer.textContent=`${p.clues.filter(k=>info.clues[k]).length} DE ${info.order.length} PISTAS NO QUADRO · ${p.links.length} DE ${info.rels.length} LIGAÇÕES${p.done?' · CASO RESOLVIDO':''}`;
   setHint();requestAnimationFrame(()=>drawStrings(anim))}
  function defPos(i){const w=pin.clientWidth||900,cols=Math.max(1,Math.floor(w/250));return{x:(i%cols)*250+6,y:Math.floor(i/cols)*250+6}}

  /* ----- barbantes ----- */
  const center=c=>{const r=c.getBoundingClientRect(),bb=boardEl.getBoundingClientRect();return{x:r.left-bb.left+r.width/2,y:r.top-bb.top+6}};
  function drawStrings(anim){
   svg.innerHTML='';knots.innerHTML='';const pos={};$$('.exhibit',pin).forEach(c=>pos[c.dataset.k]=center(c));
   const ns='http://www.w3.org/2000/svg';
   p.links.forEach(id=>{const r=info.rels.find(x=>x.id===id);if(!r||!pos[r.a]||!pos[r.b])return;const A=pos[r.a],B=pos[r.b],l=document.createElementNS(ns,'line');
    l.setAttribute('x1',A.x);l.setAttribute('y1',A.y);l.setAttribute('x2',B.x);l.setAttribute('y2',B.y);svg.appendChild(l);
    const k=E('button',{class:'knot',type:'button','data-rel':r.id,title:'Ver a anotação desta ligação',style:`left:${(A.x+B.x)/2}px;top:${(A.y+B.y)/2}px`},'✔');knots.append(k)});
   if(ST.from&&pos[ST.from]&&ST.ptr){const l=document.createElementNS(ns,'line'),A=pos[ST.from];l.setAttribute('x1',A.x);l.setAttribute('y1',A.y);l.setAttribute('x2',ST.ptr.x);l.setAttribute('y2',ST.ptr.y);l.setAttribute('class','pending');svg.appendChild(l)}
   svg.setAttribute('viewBox',`0 0 ${boardEl.clientWidth} ${boardEl.clientHeight}`);svg.classList.toggle('animate',!!anim);svg.classList.add('show')}
  const onRes=()=>{if(CUR==='board')drawStrings(false)};window.addEventListener('resize',onRes);this.off.push(()=>window.removeEventListener('resize',onRes));

  /* ----- arrastar ----- */
  function enterFree(){if(ST.free)return;const pr=pin.getBoundingClientRect(),h=pin.offsetHeight,snap=[];
   $$('.exhibit',pin).forEach(c=>{const r=c.getBoundingClientRect();snap.push({c,k:c.dataset.k,x:r.left-pr.left,y:r.top-pr.top})});
   ST.free=true;pin.classList.add('free');pin.style.height=h+'px';snap.forEach(s=>{p.pos[s.k]={x:s.x,y:s.y};s.c.style.setProperty('--x',s.x+'px');s.c.style.setProperty('--y',s.y+'px')})}
  pin.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.target.closest('a'))return;const card=e.target.closest('.exhibit');if(!card)return;
   enterFree();const k=card.dataset.k,ref=pin.getBoundingClientRect();drag={card,k,moved:false,ox:e.clientX-(ref.left+p.pos[k].x),oy:e.clientY-(ref.top+p.pos[k].y)};card.setPointerCapture(e.pointerId)});
  pin.addEventListener('pointermove',e=>{if(!drag)return;const ref=pin.getBoundingClientRect();
   let x=clamp(e.clientX-ref.left-drag.ox,0,pin.clientWidth-240),y=clamp(e.clientY-ref.top-drag.oy,0,Math.max(pin.clientHeight,600)-120);
   if(!drag.moved){drag.moved=true;drag.card.classList.add('dragging')}
   p.pos[drag.k]={x,y};drag.card.style.setProperty('--x',x+'px');drag.card.style.setProperty('--y',y+'px');
   if(y+260>pin.clientHeight)pin.style.height=(y+260)+'px';drawStrings(false)});
  const endDrag=()=>{if(!drag)return;if(drag.moved){justDragged=true;saveSoon()}drag.card.classList.remove('dragging');drag=null;setTimeout(()=>{justDragged=false},60)};
  pin.addEventListener('pointerup',endDrag);pin.addEventListener('pointercancel',endDrag);
  boardEl.addEventListener('pointermove',e=>{if(!ST.from)return;const bb=boardEl.getBoundingClientRect();ST.ptr={x:e.clientX-bb.left,y:e.clientY-bb.top};drawStrings(false)});

  /* ----- ligar ----- */
  function cancelLink(){ST.from=null;ST.ptr=null;$$('.exhibit.tying',pin).forEach(c=>c.classList.remove('tying'));setHint();drawStrings(false)}
  function pickCard(k){
   if(!ST.from){ST.from=k;ST.ptr=null;const c=$(`.exhibit[data-k="${CSS.escape(k)}"]`,pin);if(c)c.classList.add('tying');setHint();return}
   if(ST.from===k){cancelLink();return}
   const a=ST.from;cancelLink();tryLink(a,k)}
  function shakeCards(a,c){[a,c].forEach(k=>{const el=$(`.exhibit[data-k="${CSS.escape(k)}"]`,pin);if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}})}
  function tryLink(a,c){
   const rel=relOf(a,c);
   if(!rel){p.errs++;addPts(p,SCORE.wrongPair);save();Snd.play('bad');shakeCards(a,c);toast('Hmm… nenhuma carta liga essas duas pistas. Procure no Animail!','🕵️');renderTop();return}
   if(p.links.indexOf(rel.id)>=0){toast('Essas duas pistas já estão ligadas.','🧵');return}
   openRel(rel)}
  function openRel(rel){
   const A=info.clues[rel.a],B=info.clues[rel.b];
   const dis=(Array.isArray(rel.dis)?rel.dis:String(rel.dis||'').split('\n')).map(s=>s.trim()).filter(Boolean);
   let pool=shuffle(dis.concat(info.rels.filter(r=>r.id!==rel.id).map(r=>r.label)));
   const gen=[`«${A.label}» e «${B.label}» são a mesma coisa.`,`«${A.label}» e «${B.label}» não têm nenhuma ligação.`,`«${B.label}» é o contrário de «${A.label}».`];
   pool=pool.filter((s,i)=>pool.indexOf(s)===i&&s!==rel.label);let i=0;while(pool.length<3&&i<gen.length)pool.push(gen[i++]);
   const opts=shuffle([{t:rel.label,ok:true}].concat(pool.slice(0,3).map(t=>({t,ok:false}))));
   nb.innerHTML=`<div class="note-stamp">NOVA LIGAÇÃO</div><h3 class="note-title">${esc(A.label)} <span class="knot-i">🧵</span> ${esc(B.label)}</h3>
    <p class="note-text plain">Como essas duas pistas estão ligadas? Escolha a conclusão que combina com o que você leu nas cartas do Animail.</p>
    <div class="opts">${opts.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o.t)}</button>`).join('')}</div>
    <div class="ex-actions big"><button class="ctrl red" data-conf disabled>CONFIRMAR</button><button class="ctrl" data-cancel>CANCELAR</button></div>`;
   openNotes();let sel=-1;
   const cf=$('[data-conf]',nb);
   nb.onclick=e=>{
    const o=e.target.closest('.opt');if(o&&!o.disabled){sel=+o.dataset.j;$$('.opt',nb).forEach(x=>x.classList.toggle('sel',x===o));cf.disabled=false;return}
    if(e.target.closest('[data-cancel]')){closeNotes();return}
    if(e.target.closest('[data-conf]')&&sel>=0){
     const ch=opts[sel];
     if(!ch.ok){p.errs++;p.tries[rel.id]=(p.tries[rel.id]||0)+1;addPts(p,SCORE.wrongChoice);save();Snd.play('bad');const ob=$$('.opt',nb)[sel];ob.classList.add('bad');ob.disabled=true;cf.disabled=true;sel=-1;toast('Não é essa. Releia as cartas do Animail!','🧐');renderTop();return}
     confirmRel(rel,A,B)}};}
  function confirmRel(rel,A,B){
   const tr=p.tries[rel.id]||0,gain=Math.max(SCORE.relMin,SCORE.rel-2*tr);p.links.push(rel.id);addPts(p,gain);save();Net.pushProg(u,b.id);Snd.play('ok');renderTop();
   const done=info.rels.length>0&&info.rels.every(r=>p.links.indexOf(r.id)>=0);
   if(done&&!p.done){p.done=now();p.t1=now();save();Net.pushProg(u,b.id)}
   nb.onclick=null;
   nb.innerHTML=`<div class="note-stamp ok">LIGAÇÃO CONFIRMADA · +${gain}</div><h3 class="note-title">${esc(A.label)} <span class="knot-i">🧵</span> ${esc(B.label)}</h3><p class="note-text">${esc(rel.label)}</p>
    ${rel.exp?`<p class="note-line"><b>NO CADERNO:</b> ${esc(rel.exp)}</p>`:''}<div class="ex-actions big"><button class="ctrl red" data-ok>${done?'RESOLVER O CASO →':'CONTINUAR'}</button></div>`;
   nb.onclick=e=>{if(e.target.closest('[data-ok]')){closeNotes();render(true);if(done)setTimeout(finale,900)}};
   if(!done)render(true);}
  function finale(){
   Snd.play('win');stampEl.textContent='CASO RESOLVIDO';stampEl.classList.add('solved');stampEl.classList.remove('show');void stampEl.offsetWidth;stampEl.classList.add('show');
   const st=p.errs<=1?3:p.errs<=4?2:1;
   setTimeout(()=>{nb.onclick=null;
    nb.innerHTML=`<div class="note-stamp ok">CASO ENCERRADO</div><h3 class="note-title">Caso resolvido, detetive ${esc(me().name)}!</h3>
     <p class="note-stars">${'★'.repeat(st)}${'☆'.repeat(3-st)}</p><p class="note-line"><b>PONTOS NO CASO:</b> ${p.pts} · <b>ERROS:</b> ${p.errs}</p>
     <p class="note-text plain">O que você descobriu:</p><ul class="found">${info.rels.map(r=>`<li>${esc(r.label)}</li>`).join('')}</ul>
     <div class="ex-actions big"><button class="ctrl red" data-lib>📚 OUTROS CASOS</button><button class="ctrl" data-close>VER O QUADRO</button></div>`;
    nb.onclick=e=>{if(e.target.closest('[data-lib]'))go('lib')};openNotes()},1800)}

  /* ----- anotações e perguntas ----- */
  function openNotes(){notes.classList.add('open');notes.setAttribute('aria-hidden','false')}
  function closeNotes(){notes.classList.remove('open');notes.setAttribute('aria-hidden','true');nb.onclick=null}
  function noteCard(k){
   const c=info.clues[k],idx=p.clues.indexOf(k),rels=info.rels.filter(r=>(r.a===k||r.b===k)&&p.links.indexOf(r.id)>=0);
   nb.innerHTML=`<div class="note-stamp">PISTA ${String(idx+1).padStart(2,'0')} / ${esc(sj.n.toUpperCase())}</div><h3 class="note-title">${esc(c.label)}</h3>
    <p class="note-line"><b>ENCONTRADA EM:</b> ${esc(b.title)}, pág. ${c.page+1}</p><p class="note-line"><b>STATUS:</b> ${rels.length?'LIGADA':'SOLTA'}</p>
    <p class="note-text">${ctxHtml(c.ctx)}</p>
    <p class="note-line"><b>LIGAÇÕES CONFIRMADAS:</b> ${rels.length?'':'nenhuma ainda'}</p>${rels.map(r=>`<p class="note-line">• ${esc(r.label)}</p>`).join('')}
    <a class="note-open" href="#" data-book="${c.page}">VER NO LIVRO &rarr;</a>`;
   nb.onclick=e=>{const a=e.target.closest('[data-book]');if(a){e.preventDefault();go('book',{mid:b.id,page:+a.dataset.book})}};openNotes()}
  function relNote(id){const r=info.rels.find(x=>x.id===id);if(!r)return;const A=info.clues[r.a],B=info.clues[r.b];
   nb.innerHTML=`<div class="note-stamp ok">LIGAÇÃO CONFIRMADA</div><h3 class="note-title">${esc(A.label)} <span class="knot-i">🧵</span> ${esc(B.label)}</h3><p class="note-text">${esc(r.label)}</p>${r.exp?`<p class="note-line"><b>NO CADERNO:</b> ${esc(r.exp)}</p>`:''}`;nb.onclick=null;openNotes()}
  function qsPanel(){
   nb.innerHTML=`<div class="note-stamp">PERGUNTAS DO CASO</div><h3 class="note-title">O que falta descobrir?</h3><div class="qlist">${info.rels.map(r=>{
     const ok=p.links.indexOf(r.id)>=0,have=p.clues.indexOf(r.a)>=0&&p.clues.indexOf(r.b)>=0,miss=[r.a,r.b].filter(k=>p.clues.indexOf(k)<0).map(k=>info.clues[k].label);
     return`<div class="qrow ${ok?'ok':''}"><b>${ok?'✔':'?'} ${esc(r.q)}</b>${ok?`<small>${esc(r.label)}</small>`:have?`<small>Você já tem as duas pistas. Procure a resposta nas cartas do Animail.</small><span class="qa"><button class="ctrl" data-hint="${r.id}">💡 DICA (−1)</button> <button class="ctrl" data-find="${esc(info.clues[r.a].label)}">🔍 PROCURAR</button></span>`:`<small>Faltam pistas: ${esc(miss.join(', '))}. Leia o livro com atenção.</small>`}</div>`}).join('')||'<p class="note-text plain">Este caso ainda não tem perguntas.</p>'}</div>`;
   nb.onclick=e=>{const h=e.target.closest('[data-hint]'),f=e.target.closest('[data-find]');
    if(h){const r=info.rels.find(x=>x.id===h.dataset.hint);if(p.hints.indexOf(r.id)<0){p.hints.push(r.id);addPts(p,SCORE.hint);save();renderTop()}
     const sm=h.closest('.qrow').querySelector('small');sm.innerHTML=`Dica: procure nas cartas por <b>«${esc(info.clues[r.a].label)}»</b> ou <b>«${esc(info.clues[r.b].label)}»</b>.`}
    if(f){S.mailQ=f.dataset.find;go('mail')}};openNotes()}

  /* ----- eventos ----- */
  pin.addEventListener('click',e=>{
   if(justDragged){justDragged=false;return}
   const btn=e.target.closest('[data-act]');const card=e.target.closest('.exhibit');
   if(btn&&card){const k=card.dataset.k,a=btn.dataset.act;
    if(a==='pin'||a==='tie'){pickCard(k);return}
    if(a==='book'){go('book',{mid:b.id,page:info.clues[k].page});return}
    if(a==='notes'){if(ST.from){pickCard(k);return}noteCard(k);return}}
   if(card&&(ST.from||ST.link)){pickCard(card.dataset.k)}});
  knots.addEventListener('click',e=>{const k=e.target.closest('.knot');if(k)relNote(k.dataset.rel)});
  $('.controls',root).addEventListener('click',e=>{const bt=e.target.closest('button');if(!bt)return;
   if(bt.dataset.sort){ST.sort=bt.dataset.sort;$$('[data-sort]',root).forEach(x=>x.classList.toggle('is-active',x===bt));render()}
   if(bt.dataset.filter==='loose'){ST.loose=!ST.loose;bt.classList.toggle('is-active',ST.loose);render()}
   const a=bt.dataset.action;
   if(a==='link'){ST.link=!ST.link;bt.classList.toggle('is-active',ST.link);if(!ST.link)cancelLink();toast(ST.link?'Modo ligar: clique em duas pistas.':'Modo ligar desligado.','🧵')}
   if(a==='reset'){p.pos={};ST.free=false;pin.classList.remove('free');pin.style.height='';saveSoon();render()}
   if(a==='qs')qsPanel();
   if(a==='mail')go('mail');
   if(a==='book')go('book',{mid:b.id})});
  notes.addEventListener('click',e=>{if(e.target===notes||e.target.closest('[data-close]'))closeNotes()});
  const kd=e=>{if(e.key==='Escape'){if(notes.classList.contains('open'))closeNotes();else if(ST.from)cancelLink()}};document.addEventListener('keydown',kd);this.off.push(()=>document.removeEventListener('keydown',kd));
  const iv=setInterval(()=>{if(Math.random()<0.15&&!p.done){stampEl.textContent='ARQUIVO SECRETO';stampEl.classList.remove('show','solved');void stampEl.offsetWidth;stampEl.classList.add('show')}},13000);this.off.push(()=>clearInterval(iv));
  render(false);
  if(p.done)setTimeout(()=>{footer.classList.add('solved')},50);
 },
 unmount(){this.off.forEach(f=>{try{f()}catch(e){}});this.off=[];save()}
};

/* ---------- ANIMAIL (baseado no "AniMail") ---------- */
const CATS={friends:['Colegas','label-friends'],adventure:['Dicas do Saber','label-adventure'],news:['Curiosidades','label-news'],care:['Cuidados','label-care']};
Views.mail={
 off:[],
 mount(root,arg){
  const U=me(),uidd=U.id;
  root.dataset.theme=localStorage.getItem('animail-theme')==='dark'?'dark':'light';
  const st={folder:'inbox',cat:null,filter:'all',q:S.mailQ||'',sel:new Set(),open:null,fr:null};S.mailQ='';
  const L=()=>DB.mail[uidd]||(DB.mail[uidd]=[]);
  const byId=id=>L().find(m=>m.id===id);
  const folders=[['inbox','inbox','Caixa do Saber'],['starred','star','Favoritas'],['sent','send','Enviadas'],['hib','schedule','Hibernando'],['trash','delete','Lixeira']];
  root.innerHTML=`<div class="forest-decoration forest-decoration--left">${ic('eco')}${ic('eco')}${ic('spa')}</div><div class="forest-decoration forest-decoration--right">${ic('eco')}${ic('park')}${ic('eco')}</div>
  <div class="app-shell"><div class="mobile-backdrop" id="mobileBackdrop" aria-hidden="true"></div>
  <aside class="sidebar" id="sidebar"><div class="brand"><div class="brand__icon">${ic('pets')}</div><div class="brand__name">AniMail</div></div>
   <button class="compose-button" id="composeButton" type="button">${ic('edit')}<span>Escrever um bilhete</span></button>
   <nav class="mail-navigation" aria-label="Pastas">${folders.map(f=>`<button class="navigation-item ${f[0]==='inbox'?'is-active':''}" data-folder="${f[0]}" type="button"><span class="navigation-item__main">${ic(f[1])}<span>${f[2]}</span></span>${f[0]==='inbox'?'<span class="navigation-count" id="inboxCount">0</span>':''}</button>`).join('')}</nav>
   <div class="sidebar-divider"></div><div class="sidebar-section"><div class="sidebar-section__heading">Tipos de carta</div>
    <button class="label-item" data-cat="adventure" type="button"><span class="label-dot label-dot--moss"></span><span>Dicas do Saber</span></button>
    <button class="label-item" data-cat="news" type="button"><span class="label-dot label-dot--sun"></span><span>Curiosidades</span></button>
    <button class="label-item" data-cat="friends" type="button"><span class="label-dot label-dot--berry"></span><span>Colegas</span></button></div>
   <div class="sidebar-section"><div class="sidebar-section__heading">Amigos do Saber</div><div id="amigos" class="amg"></div></div>
   <div class="sidebar-section"><div class="sidebar-section__heading">Recentes</div><div id="recentes" class="amg"></div></div>
   <div class="forest-card"><div class="forest-card__art"><span class="forest-card__animal">🐆</span><span class="forest-card__tree forest-card__tree--one">${ic('park')}</span><span class="forest-card__tree forest-card__tree--two">${ic('park')}</span></div><strong>Atividade na floresta</strong><span id="onlineTxt"></span></div>
   <div class="sidebar-profile"><div class="profile-avatar">${U.animal}</div><div class="profile-details"><strong>${esc(U.name)}</strong><span>${esc(U.id)}@animail.floresta</span></div></div></aside>
  <main class="mail-main"><header class="topbar"><button class="icon-button menu-button" id="menuButton" type="button" aria-label="Abrir menu">${ic('menu')}</button>
   <label class="search-box">${ic('search')}<input id="searchInput" type="search" placeholder="Procurar nas cartas do Saber…" autocomplete="off"><kbd>Ctrl K</kbd></label>
   <div class="topbar-actions"><button class="icon-button theme-toggle" id="themeBtn" type="button" aria-label="Alternar tema">${ic('dark_mode')}</button>
    <button class="icon-button refresh-button" id="refreshBtn" type="button" aria-label="Atualizar" title="Atualizar">${ic('refresh')}</button>
    <div class="topbar-avatar">${U.animal}</div></div></header>
   <section class="inbox"><div class="inbox-heading"><div><div class="eyebrow"><span class="eyebrow-icon">🌿</span>Portal dos Amigos do Saber</div><h1 id="boxTitle">Caixa do Saber</h1><p id="boxSub"></p></div><div class="heading-mascot" aria-hidden="true"><span class="heading-mascot__animal">🦜</span><span class="heading-mascot__leaf">🍃</span></div></div>
    <div class="filter-row"><div class="filter-tabs" role="tablist"><button class="filter-tab is-active" data-filter="all" type="button">Todas</button><button class="filter-tab" data-filter="unread" type="button">Não lidas</button><button class="filter-tab" data-filter="starred" type="button">Favoritas</button></div>
     <div class="mail-actions"><label class="select-all"><input id="selectAll" type="checkbox"><span class="custom-checkbox"></span><span>Selecionar tudo</span></label>
      <button class="icon-button icon-button--small" id="markRead" type="button" title="Marcar como lidas">${ic('mark_email_read')}</button><button class="icon-button icon-button--small" id="delSel" type="button" title="Mover para a lixeira">${ic('delete')}</button></div></div>
    <div class="ask-bar" id="askBar" hidden><span>Cartas de <b></b></span><button class="reply-button reply-button--primary" id="askBtn" type="button">${ic('lightbulb')}Pedir uma dica</button><button class="reply-button" id="askClr" type="button">Ver todas</button></div>
    <div class="email-list" id="emailList" aria-live="polite"></div>
    <div class="empty-state" id="emptyState" hidden><div class="empty-state__illustration"><span class="empty-state__animal">🦥</span></div><h2>Nenhuma carta encontrada</h2><p id="emptyTxt">Tente outra palavra-chave.</p></div></section></main></div>
  <div class="reader-overlay" id="readerOverlay" aria-hidden="true"><article class="reader-window" role="dialog" aria-modal="true" aria-labelledby="readerSubject"><div class="reader-window__glow"></div><div class="reader-leaves" aria-hidden="true"><span>🍃</span><span>🌿</span><span>🍂</span></div>
   <header class="reader-toolbar"><button class="reader-back-button" id="closeReader" type="button">${ic('arrow_back')}<span>Voltar à floresta</span></button>
    <div class="reader-toolbar__actions"><button class="reader-action" id="rStar" type="button" title="Favoritar">${ic('star_border')}</button><button class="reader-action" id="rHib" type="button" title="Hibernar">${ic('archive')}</button><button class="reader-action" id="rDel" type="button" title="Lixeira">${ic('delete')}</button><button class="reader-action reader-close-inline" id="rClose" type="button" title="Fechar">${ic('close')}</button></div></header>
   <div class="reader-content"><div class="reader-category label-friends" id="rCat"></div><h2 id="readerSubject"></h2>
    <div class="reader-sender-row"><div class="reader-avatar avatar-fox" id="rAv">🦊</div><div class="reader-sender"><div class="reader-sender__identity"><strong id="rFrom"></strong><span id="rAddr"></span></div><button class="recipient-button" type="button" tabindex="-1" id="rTo"></button></div><time id="rDate"></time></div>
    <div class="reader-message" id="rMsg"></div><div class="tagrow" id="rTags"></div>
    <div class="reader-reply-actions"><button class="reply-button reply-button--primary" id="rReply" type="button">${ic('reply')}Mandar um pio</button><button class="reply-button" id="rFwd" type="button">${ic('forward')}Passar adiante</button></div></div></article></div>
  <div class="reader-overlay" id="composeOverlay" aria-hidden="true"><article class="reader-window compose-window" role="dialog" aria-modal="true"><header class="reader-toolbar"><button class="reader-back-button" id="cCancel" type="button">${ic('arrow_back')}<span>Cancelar</span></button><strong class="cw-t">Novo bilhete</strong><button class="reader-action reader-close-inline" id="cClose" type="button">${ic('close')}</button></header>
   <div class="reader-content cw"><label class="cf">Para<select id="cTo"></select></label><label class="cf">Assunto<input id="cSubj" maxlength="80" autocomplete="off"></label><label class="cf">Mensagem<textarea id="cBody" rows="8" maxlength="1500"></textarea></label>
    <p class="cf-err" id="cErr"></p><div class="reader-reply-actions"><button class="reply-button reply-button--primary" id="cSend" type="button">${ic('send')}Enviar pelo correio</button></div></div></article></div>`;
  const $$$=s=>$(s,root);
  const el={list:$$$('#emailList'),empty:$$$('#emptyState'),search:$$$('#searchInput'),sel:$$$('#selectAll'),ro:$$$('#readerOverlay'),co:$$$('#composeOverlay'),sidebar:$$$('#sidebar'),back:$$$('#mobileBackdrop')};
  el.search.value=st.q;

  /* ----- busca e listas ----- */
  const words=()=>norm(st.q).trim().split(/\s+/).filter(Boolean);
  function hl(s){s=String(s||'');const ws=words();if(!ws.length)return esc(s);const ns=norm(s);if(ns.length!==s.length)return esc(s);
   const m=new Array(s.length).fill(0);ws.forEach(w=>{let i=ns.indexOf(w);while(i>=0){for(let j=i;j<i+w.length;j++)m[j]=1;i=ns.indexOf(w,i+w.length)}});
   let out='',on=false;for(let i=0;i<s.length;i++){if(m[i]&&!on){out+='<mark>';on=true}if(!m[i]&&on){out+='</mark>';on=false}out+=esc(s[i])}return out+(on?'</mark>':'')}
  function visible(){const q=words(),L2=L();
   return L2.filter(m=>{let ok;
    if(q.length)ok=st.folder==='sent'?(m.box==='sent'&&!m.del):(!m.del&&m.box!=='sent');
    else if(st.folder==='inbox')ok=!m.arch&&!m.del&&m.box!=='sent';else if(st.folder==='starred')ok=m.star&&!m.del;
    else if(st.folder==='sent')ok=m.box==='sent'&&!m.del;else if(st.folder==='hib')ok=m.arch&&!m.del&&m.box!=='sent';else ok=!!m.del;
    if(!ok)return false;if(st.cat&&m.cat!==st.cat)return false;if(st.fr&&m.fromAddr!==st.fr)return false;if(st.filter==='unread'&&m.read)return false;if(st.filter==='starred'&&!m.star)return false;
    if(q.length){const hay=norm([m.fromName,m.fromAddr,m.toName,m.subj,(m.body||[]).join(' '),(m.tags||[]).join(' '),(CATS[m.cat]||[''])[0]].join(' '));return q.every(w=>hay.indexOf(w)>=0)}
    return true}).sort((a,b)=>b.ts-a.ts)}
  const preview=m=>{const b=(m.body||[]).filter(x=>!/^(Olá|Oi|Boa noite|Hello)[,!]?\s/.test(x)&&x.length>12);return(b[0]||m.body&&m.body[0]||'')};
  function card(m,i){const t=fmtTime(m.ts),sent=m.box==='sent',cat=CATS[m.cat]||CATS.friends,sel=st.sel.has(m.id);
   return`<article class="email-card ${!m.read&&!sent?'is-unread':''} ${sel?'is-selected':''}" data-id="${m.id}" tabindex="0" role="button" style="animation-delay:${Math.min(i*45,300)}ms">
    <label class="email-select"><input class="email-checkbox" type="checkbox" data-id="${m.id}" ${sel?'checked':''}><span class="custom-checkbox"></span></label>
    <button class="email-star ${m.star?'is-starred':''}" data-star="${m.id}" type="button" aria-label="Favoritar">${ic(m.star?'star':'star_border')}</button>
    <div class="email-sender-section"><div class="email-avatar ${avCls(sent?(DB.users[m.toId]?DB.users[m.toId].animal:'🐿️'):m.fromAnimal)}">${sent?(DB.users[m.toId]?DB.users[m.toId].animal:'🐿️'):m.fromAnimal}</div><div class="email-sender">${sent?'Para: '+esc(m.toName||''):hl(m.fromName)}</div></div>
    <div class="email-content"><div class="email-subject-line"><div class="email-subject">${hl(m.subj)}</div><span class="email-label ${cat[1]}">${cat[0]}</span></div><div class="email-preview">${hl(preview(m))}</div></div>
    <div class="email-meta"><time class="email-time">${t.short}</time>${!m.read&&!sent?'<span class="unread-dot"></span>':''}</div></article>`}
  const unread=()=>L().filter(m=>!m.read&&!m.arch&&!m.del&&m.box!=='sent').length;
  function render(){
   const v=visible();el.list.innerHTML=v.map(card).join('');el.empty.hidden=v.length>0;
   const n=unread(),fn=folders.find(f=>f[0]===st.folder)[2];
   $$$('#inboxCount').textContent=n;$$$('#boxTitle').textContent=words().length?'Resultado da busca':fn;
   $$$('#boxSub').innerHTML=words().length?`<strong>${v.length}</strong> ${v.length===1?'carta encontrada':'cartas encontradas'} para <strong>«${esc(st.q.trim())}»</strong>`:`Você tem <strong>${n} ${n===1?'carta nova':'cartas novas'}</strong>`;
   $$$('#emptyTxt').textContent=words().length?'Nenhuma carta tem essas palavras. Tente outra palavra-chave, um nome ou um assunto do livro.':'Esta pasta está vazia.';
   $$('[data-folder]',root).forEach(b=>b.classList.toggle('is-active',b.dataset.folder===st.folder&&!st.cat));
   $$('[data-cat]',root).forEach(b=>b.classList.toggle('is-active',b.dataset.cat===st.cat));
   $$('.filter-tab',root).forEach(b=>b.classList.toggle('is-active',b.dataset.filter===st.filter));
   const sv=v.filter(m=>st.sel.has(m.id)).length;el.sel.checked=v.length>0&&sv===v.length;el.sel.indeterminate=sv>0&&sv<v.length;
   const us=Object.keys(DB.users).length,on=Net.cache.users.length;$$$('#onlineTxt').textContent=Net.on()&&on?`${on} detetives na sala ${Net.room()}`:`${us} ${us===1?'detetive':'detetives'} neste aparelho`;
   $$$('#amigos').innerHTML=Object.keys(NPC).map(k=>`<button class="label-item amg-i ${st.fr===npcAddr(k)?'is-active':''}" data-fr="${k}" type="button"><span class="amg-av">${NPC[k].a}</span><span class="amg-t"><b>${esc(NPC[k].n)}</b></span></button>`).join('');
   const rec=recentUsers();$$$('#recentes').innerHTML=rec.length?rec.map(x=>`<button class="label-item amg-i" data-to="${esc(x.id)}" type="button"><span class="amg-av">${x.animal}</span><span class="amg-t"><b>${esc(x.name)}</b><small>${esc(x.cls||'nova conta')}</small></span></button>`).join(''):'<p class="amg-e">Ninguém além de você ainda. Chame os colegas!</p>';
   const ask=$$$('#askBar');if(ask){ask.hidden=!st.fr;if(st.fr){const k=Object.keys(NPC).find(x=>npcAddr(x)===st.fr);$$('b',ask)[0].textContent=NPC[k].a+' '+NPC[k].n;}}
   renderTop()}
  function recentUsers(){const m={};Object.values(DB.users).forEach(x=>{if(x.id!==uidd)m[x.id]=x});(Net.cache.users||[]).forEach(x=>{const id=String(x.id).split(':').slice(1).join(':');if(id&&id!==uidd&&!m[id])m[id]={id,name:x.name,animal:x.animal,cls:x.cls,created:+x.created||0}});
   return Object.values(m).sort((a,b)=>(b.created||0)-(a.created||0)).slice(0,6)}
  function askHint(k){const bid=S.mid&&getBook(S.mid)?S.mid:lastBookId();const b=bid&&getBook(bid);
   if(!b){toast('Abra um livro na Biblioteca primeiro: assim os amigos sabem sobre o que ajudar.','📚');return}
   const info=parseBook(b),p=P(uidd,b.id),open=info.rels.filter(r=>p.links.indexOf(r.id)<0);
   if(!open.length){toast('Você já resolveu todas as ligações deste caso! 🎉','🏅');return}
   const r=open[(p.hints.length)%open.length],A=info.clues[r.a],B=info.clues[r.b],npc=NPC[k];
   const ph=[`Procure nas cartas a palavra «${A.label}». Quem a menciona costuma falar também de outra pista deste livro.`,`Pense: «${B.label}» tem alguma ligação com «${A.label}»? Tente buscar por «${B.label}» na lupa.`,`Releia a página do livro onde aparece «${A.label}» e depois procure uma carta que fale sobre «${B.label}».`][p.hints.length%3];
   const id='h:'+b.id+':'+p.hints.length;p.hints.push(id);addPts(p,SCORE.hint);
   addMail(uidd,{id,kind:'npc',mid:b.id,cat:'adventure',fromName:npc.n,fromAnimal:npc.a,fromAddr:npcAddr(k),role:npc.r,subj:'Uma dica sobre «'+b.title+'»',body:[`Oi, ${U.name}!`,ph,'Dica dada, ponto a menos: a investigação é sua!'],tags:[A.label,B.label],ts:now(),read:false});
   save();Snd.play('mail');render();toast('Dica enviada! (−1 ponto)','💡')}

  /* ----- leitura ----- */
  function openMail(id){const m=byId(id);if(!m)return;st.open=id;if(!m.read&&m.box!=='sent'){m.read=true;saveSoon()}
   const cat=CATS[m.cat]||CATS.friends,sent=m.box==='sent';
   $$$('#readerSubject').innerHTML=hl(m.subj);$$$('#rCat').textContent=cat[0];$$$('#rCat').className='reader-category '+cat[1];
   $$$('#rFrom').innerHTML=hl(sent?U.name:m.fromName);$$$('#rAddr').textContent='<'+(sent?uidd+'@animail.floresta':m.fromAddr)+'>';
   $$$('#rAv').textContent=sent?U.animal:m.fromAnimal;$$$('#rAv').className='reader-avatar '+avCls(sent?U.animal:m.fromAnimal);
   $$$('#rTo').innerHTML=sent?`para ${esc(m.toName||'')}`:'para a minha toca';$$$('#rDate').textContent=fmtTime(m.ts).full;
   $$$('#rMsg').innerHTML=(m.body||[]).map(x=>`<p>${hl(x)}</p>`).join('')+(m.role?`<div class="reader-signature"><strong>${esc(m.fromName)}</strong><span>${esc(m.role)}</span></div>`:'');
   $$$('#rTags').innerHTML=(m.tags&&m.tags.length)?'<span class="tg-h">Assuntos desta carta:</span>'+m.tags.map(t=>`<span class="tg">#${esc(t)}</span>`).join(''):'';
   $$$('#rReply').hidden=!m.fromId||sent;
   starIcon(m);hibIcon(m);el.ro.classList.add('is-open');el.ro.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';render()}
  const starIcon=m=>{$$$('#rStar').classList.toggle('is-starred',!!m.star);$$$('#rStar').innerHTML=ic(m.star?'star':'star_border')};
  const hibIcon=m=>{$$$('#rHib').innerHTML=ic(m.arch?'unarchive':'archive');$$$('#rHib').title=m.arch?'Voltar para a caixa':'Hibernar'};
  function closeMail(){el.ro.classList.remove('is-open');el.ro.setAttribute('aria-hidden','true');document.body.style.overflow='';st.open=null}
  function toggleStar(id){const m=byId(id);if(!m)return;m.star=!m.star;save();if(st.open===id)starIcon(m);render()}
  const trash=(ids,restore)=>{ids.forEach(id=>{const m=byId(id);if(m)m.del=!restore});save();st.sel.clear();render()};

  /* ----- escrever ----- */
  async function openCompose(o){o=o||{};const sel=$$$('#cTo');sel.innerHTML='<option value="">Escolha um detetive…</option>';
   const seen={};Object.values(DB.users).forEach(x=>{if(x.id!==uidd){seen[x.id]=1;sel.append(E('option',{value:x.id},x.animal+' '+x.name+(x.cls?' ('+x.cls+')':'')))}});
   if(Net.on()){const r=await Net.users();r.forEach(x=>{const id=x.id.split(':').slice(1).join(':');if(id!==uidd&&!seen[id]){seen[id]=1;sel.append(E('option',{value:id,'data-n':x.name,'data-a':x.animal},x.animal+' '+x.name+(x.cls?' ('+x.cls+')':'')))}})}
   if(o.to)sel.value=o.to;$$$('#cSubj').value=o.subj||'';$$$('#cBody').value=o.body||'';$$$('#cErr').textContent='';
   el.co.classList.add('is-open');el.co.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>(o.to?$$$('#cBody'):sel).focus(),300)}
  function closeCompose(){el.co.classList.remove('is-open');el.co.setAttribute('aria-hidden','true');if(!el.ro.classList.contains('is-open'))document.body.style.overflow=''}
  function sendMail(){const sel=$$$('#cTo'),to=sel.value,subj=$$$('#cSubj').value.trim(),body=$$$('#cBody').value.trim(),err=$$$('#cErr');
   if(!to){err.textContent='Escolha para quem enviar.';return}if(!subj){err.textContent='Escreva um assunto.';return}if(body.length<2){err.textContent='Escreva a mensagem.';return}
   const opt=sel.options[sel.selectedIndex],toName=DB.users[to]?DB.users[to].name:(opt.dataset.n||to),paras=body.split(/\n+/).filter(Boolean),mid=uid(),ts=now();
   const base={subj,body:paras,fromId:uidd,fromName:U.name,fromAnimal:U.animal,fromAddr:uidd+'@animail.floresta',kind:'user',cat:'friends',ts};
   if(DB.users[to])addMail(to,Object.assign({id:mid,read:false},base));
   addMail(uidd,Object.assign({},base,{id:'s:'+mid,box:'sent',read:true,toId:to,toName}));save();
   Net.sendMail(Object.assign({id:mid},base),to);Snd.play('mail');closeCompose();toast('Bilhete enviado para '+toName+'!','📮');st.folder='sent';st.cat=null;render()}

  /* ----- eventos ----- */
  const closeMenu=()=>{el.sidebar.classList.remove('is-open');el.back.classList.remove('is-visible')};
  el.list.addEventListener('click',e=>{const s=e.target.closest('[data-star]'),c=e.target.closest('.email-card');
   if(s){e.stopPropagation();toggleStar(s.dataset.star);return}if(e.target.closest('.email-select'))return;if(c)openMail(c.dataset.id)});
  el.list.addEventListener('change',e=>{const cb=e.target.closest('.email-checkbox');if(!cb)return;if(cb.checked)st.sel.add(cb.dataset.id);else st.sel.delete(cb.dataset.id);render()});
  el.list.addEventListener('keydown',e=>{const c=e.target.closest('.email-card');if(c&&(e.key==='Enter'||e.key===' ')&&e.target===c){e.preventDefault();openMail(c.dataset.id)}});
  el.search.addEventListener('input',()=>{st.q=el.search.value;render()});
  $$('[data-folder]',root).forEach(b=>b.onclick=()=>{st.folder=b.dataset.folder;st.cat=null;st.fr=null;st.filter='all';st.sel.clear();st.q='';el.search.value='';render();closeMenu()});
  $$('[data-cat]',root).forEach(b=>b.onclick=()=>{st.cat=st.cat===b.dataset.cat?null:b.dataset.cat;st.fr=null;st.folder='inbox';render();closeMenu()});
  root.addEventListener('click',e=>{const f=e.target.closest('[data-fr]');if(f){const a=npcAddr(f.dataset.fr);st.fr=st.fr===a?null:a;st.folder='inbox';st.cat=null;st.filter='all';st.q='';el.search.value='';render();closeMenu();return}
   const t=e.target.closest('[data-to]');if(t){closeMenu();openCompose({to:t.dataset.to});return}
   if(e.target.closest('#askBtn')){askHint(Object.keys(NPC).find(x=>npcAddr(x)===st.fr));return}if(e.target.closest('#askClr')){st.fr=null;render()}});
  $$('.filter-tab',root).forEach(b=>b.onclick=()=>{st.filter=b.dataset.filter;render()});
  el.sel.onchange=()=>{visible().forEach(m=>{if(el.sel.checked)st.sel.add(m.id);else st.sel.delete(m.id)});render()};
  $$$('#markRead').onclick=()=>{if(!st.sel.size){toast('Selecione pelo menos uma carta.','📬');return}st.sel.forEach(id=>{const m=byId(id);if(m)m.read=true});st.sel.clear();save();render();toast('Cartas marcadas como lidas.','📬')};
  $$$('#delSel').onclick=()=>{if(!st.sel.size){toast('Selecione pelo menos uma carta.','📬');return}trash(Array.from(st.sel),st.folder==='trash');toast(st.folder==='trash'?'Cartas restauradas.':'Cartas na lixeira (dá para restaurar).','🗑️')};
  $$$('#closeReader').onclick=closeMail;$$$('#rClose').onclick=closeMail;el.ro.addEventListener('click',e=>{if(e.target===el.ro)closeMail()});
  $$$('#rStar').onclick=()=>toggleStar(st.open);
  $$$('#rHib').onclick=()=>{const m=byId(st.open);m.arch=!m.arch;save();closeMail();render();toast(m.arch?'Carta hibernando (pasta Hibernando).':'Carta de volta à caixa.','😴')};
  $$$('#rDel').onclick=()=>{const m=byId(st.open);const r=!!m.del;trash([m.id],r);closeMail();toast(r?'Carta restaurada.':'Carta na lixeira (dá para restaurar).','🗑️')};
  $$$('#rReply').onclick=()=>{const m=byId(st.open);closeMail();openCompose({to:m.fromId,subj:/^Re:/.test(m.subj)?m.subj:'Re: '+m.subj})};
  $$$('#rFwd').onclick=()=>{const m=byId(st.open);closeMail();openCompose({subj:'Enc: '+m.subj,body:'\n\n--- carta encaminhada de '+m.fromName+' ---\n'+(m.body||[]).join('\n')})};
  $$$('#composeButton').onclick=()=>{closeMenu();openCompose()};$$$('#cCancel').onclick=closeCompose;$$$('#cClose').onclick=closeCompose;$$$('#cSend').onclick=sendMail;
  $$$('#themeBtn').onclick=()=>{const d=root.dataset.theme!=='dark';root.dataset.theme=d?'dark':'light';localStorage.setItem('animail-theme',d?'dark':'light');th()};
  const th=()=>{$$$('#themeBtn').innerHTML=ic(root.dataset.theme==='dark'?'light_mode':'dark_mode')};th();
  $$$('#refreshBtn').onclick=async()=>{const i=$$$('#refreshBtn .material-icons-round');i.style.animation='refresh-spin 600ms ease';await Net.users();const n=await Net.pull(uidd);i.style.animation='';render();toast(n?`${n} ${n>1?'cartas novas':'carta nova'}!`:Net.on()?'Caixa atualizada.':'Caixa atualizada (modo neste aparelho).','🐿️')};
  $$$('#menuButton').onclick=()=>{el.sidebar.classList.add('is-open');el.back.classList.add('is-visible')};el.back.onclick=closeMenu;
  const kd=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el.search.focus();return}
   if(e.key==='Escape'){if(el.co.classList.contains('is-open'))closeCompose();else if(el.ro.classList.contains('is-open'))closeMail();else closeMenu()}};
  document.addEventListener('keydown',kd);this.off.push(()=>{document.removeEventListener('keydown',kd);document.body.style.overflow=''});
  const iv=setInterval(async()=>{if(!Net.on())return;const n=await Net.pull(uidd);if(n){render();Snd.play('mail');toast(`${n} ${n>1?'cartas novas':'carta nova'} na floresta!`,'✉️')}},20000);this.off.push(()=>clearInterval(iv));
  if(Net.on())Net.users().then(()=>render());
  render();if(st.q)el.search.focus();
 },
 unmount(){this.off.forEach(f=>{try{f()}catch(e){}});this.off=[];save()}
};

/* ---------- ÁREA DO PROFESSOR ---------- */
const SQL_SETUP="-- Detetives do Saber \u2014 Sala online (rode uma vez no SQL Editor do Supabase)\ncreate table if not exists da_users (id text primary key, room text not null, name text not null, animal text, cls text, pin text, created bigint);\ncreate table if not exists da_mail  (id text primary key, room text not null, to_id text not null, from_id text, from_name text, from_animal text, subj text, body text, ts bigint);\ncreate table if not exists da_prog  (id text primary key, room text not null, user_id text, user_name text, cls text, mid text, data jsonb, ts bigint);\ncreate table if not exists da_books (id text primary key, room text not null, data jsonb, ts bigint);\ncreate index if not exists da_mail_idx on da_mail (room, to_id, ts);\ncreate index if not exists da_prog_idx on da_prog (room);\n\ndo $$\ndeclare t text;\nbegin\n  foreach t in array array['da_users','da_mail','da_prog','da_books'] loop\n    execute format('alter table %I enable row level security', t);\n    execute format('drop policy if exists %I on %I', t||'_sel', t);\n    execute format('drop policy if exists %I on %I', t||'_ins', t);\n    execute format('drop policy if exists %I on %I', t||'_upd', t);\n    execute format('create policy %I on %I for select to anon using (true)', t||'_sel', t);\n    execute format('create policy %I on %I for insert to anon with check (true)', t||'_ins', t);\n    execute format('create policy %I on %I for update to anon using (true) with check (true)', t||'_upd', t);\n  end loop;\nend $$;\n";
const TEST_ID='professor-teste';
function download(name,text,type){const a=E('a',{href:URL.createObjectURL(new Blob([text],{type:type||'application/json'})),download:name});document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function realUsers(){return Object.values(DB.users).filter(x=>x.id!==TEST_ID)}
function testAs(mid){if(!DB.users[TEST_ID]){DB.users[TEST_ID]={id:TEST_ID,name:'Professor (teste)',cls:'',animal:'🦉',pin:'',created:now()};DB.mail[TEST_ID]=[];DB.prog[TEST_ID]={};seedMail(DB.users[TEST_ID])}
 DB.session=TEST_ID;save();S.mid=mid;toast('Modo teste: você é o "Professor (teste)". Use Sair para voltar.','🧪');go('book',{mid})}
function exportBooks(){const hid=Object.keys(DB.hidden).filter(k=>DB.hidden[k]).map(id=>({id,deleted:true}));return allBooks().map(b=>Object.assign({},b)).concat(hid,(DB.notes||[]).map(n=>Object.assign({},n)))}

Views.teacher={
 mount(root){
  let tab='books',ed=null,prog=[];
  const head=()=>`<div class="tc"><div class="tc-bar"><div><b>🔐 Área do professor</b><small>Detetives do Saber</small></div><button class="bt ghost sm" id="tcExit">← Sair</button></div>
   <div class="tc-tabs">${[['books','📚 Livros'],['notes','📝 Notas e ditados'],['stu','🧑‍🎓 Alunos e resultados'],['net','🌐 Sala online'],['set','⚙️ Ajustes']].map(t=>`<button data-t="${t[0]}" class="${tab===t[0]?'on':''}">${t[1]}</button>`).join('')}</div><div id="tcBody" class="tc-body"></div></div>`;
  const draw=()=>{root.innerHTML=head();$('#tcExit',root).onclick=()=>go(DB.session?'lib':'login');$$('.tc-tabs button',root).forEach(b=>b.onclick=()=>{tab=b.dataset.t;ed=null;nEd=null;draw()});
   const body=$('#tcBody',root);({books:tBooks,notes:tNotes,stu:tStu,net:tNet,set:tSet})[tab](body)};

  /* ===== livros ===== */
  function tBooks(body){
   if(ed)return editor(body);
   const bs=allBooks();
   body.innerHTML=`<div class="tc-row"><button class="bt" id="nb">＋ Novo livro</button><label class="bt ghost">⬆ Importar livros.json<input type="file" id="imp" accept=".json,application/json" hidden></label><button class="bt ghost" id="exp">⬇ Baixar livros.json (para o GitHub)</button>${Net.on()?'<button class="bt ghost" id="pub">☁ Publicar na sala online</button>':''}</div>
   <p class="tc-note">Os livros que você cria ficam <b>neste navegador</b>. Para os alunos de outros aparelhos verem, baixe o <b>livros.json</b> e coloque na raiz do repositório do GitHub (ou use a Sala online). Veja o README.</p>
   <div class="tc-list">${bs.map(b=>{const info=parseBook(b),sj=SUBJ[b.subject]||SUBJ.historia,src=DB.books[b.id]?'seu':isSample(b.id)?'exemplo':'publicado';
    return`<div class="tc-item ${b.active===false?'off':''}"><span class="dy-ic" style="background:${bookColor(b)}">${esc(b.icon||sj.i)}</span><div class="tc-tx"><b>${esc(b.title)}</b><small>${esc(sj.n)} · ${info.pages.length} pág. · ${info.order.length} pistas · ${info.rels.length} ligações · <i class="src">${src}</i> ${b.active===false?'· <i class="src off">oculto aos alunos</i>':''}</small></div>
     <div class="tc-ac"><button class="bt sm" data-ed="${esc(b.id)}">Editar</button><button class="bt ghost sm" data-test="${esc(b.id)}">Testar</button><button class="bt ghost sm" data-tg="${esc(b.id)}">${b.active===false?'Mostrar':'Ocultar'}</button><button class="bt ghost sm" data-dup="${esc(b.id)}">Duplicar</button><button class="bt ghost sm danger" data-rm="${esc(b.id)}">Excluir</button></div></div>`}).join('')||'<p class="tc-note">Nenhum livro. Crie o primeiro!</p>'}</div>`;
   $('#nb',body).onclick=()=>{ed={};draw()};
   $('#exp',body).onclick=()=>{download('livros.json',JSON.stringify(exportBooks(),null,1));toast('livros.json baixado. Envie para a raiz do GitHub.','⬇')};
   $('#imp',body).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const arr=JSON.parse(await f.text());if(!Array.isArray(arr))throw 0;let n=0;arr.forEach(b=>{if(b&&b.id&&b.type==='note'){DB.notes=(DB.notes||[]).filter(x=>x.id!==b.id).concat([b]);return}if(b&&b.id){if(b.deleted){DB.hidden[b.id]=1}else{DB.books[b.id]=b;delete DB.hidden[b.id];n++}}});save();toast(n+' livro(s) importado(s).','📚');draw()}catch(er){toast('Arquivo inválido.','⚠️')}};
   if($('#pub',body))$('#pub',body).onclick=async()=>{try{await Net.publish(exportBooks().filter(b=>!b.deleted));toast('Livros publicados na sala '+Net.room()+'!','☁')}catch(e){toast('Falhou: '+String(e.message||e).slice(0,80),'⚠️')}};
   body.onclick=async e=>{const t=e.target.closest('button[data-ed],button[data-test],button[data-tg],button[data-dup],button[data-rm]');if(!t)return;const id=t.dataset.ed||t.dataset.test||t.dataset.tg||t.dataset.dup||t.dataset.rm,b=getBook(id);
    if(t.dataset.ed){ed=JSON.parse(JSON.stringify(b));draw()}
    else if(t.dataset.test)testAs(id);
    else if(t.dataset.tg){DB.books[id]=Object.assign({},b,{active:b.active===false});save();draw()}
    else if(t.dataset.dup){const c=JSON.parse(JSON.stringify(b));c.id='livro-'+uid();c.title+=' (cópia)';DB.books[c.id]=c;save();draw()}
    else if(t.dataset.rm){if(await Dlg.confirm(`Excluir o livro «${esc(b.title)}» deste navegador? (Os alunos já cadastrados guardam o progresso, mas o livro some da biblioteca.)`,'Excluir')){delete DB.books[id];if(isSample(id)||REPO.some(x=>x.id===id)||(DB.cloud.books||[]).some(x=>x.id===id))DB.hidden[id]=1;save();draw()}}}}

  /* ===== notas autoriais / ditados ===== */
  let nEd=null;
  function tNotes(body){
   const all=[].concat(REPO,DB.cloud.books||[],DB.notes||[]).filter(n=>n&&n.type==='note');const m=new Map();all.forEach(n=>{if(n.deleted)m.delete(n.id);else m.set(n.id,n)});const list=Array.from(m.values()).sort((a,b)=>(b.ts||0)-(a.ts||0));
   if(nEd){const n=nEd;body.innerHTML=`<div class="tc-row"><button class="bt ghost sm" id="nBack">← Voltar</button><b class="tc-h">${n.title?'Editar nota':'Nova nota'}</b></div><div class="tc-form"><label class="fl">Título<input class="in" id="nT" maxlength="80" value="${esc(n.title||'')}" placeholder="Ex.: Ditado: os Tupis"></label>
    <label class="fl">Texto a ditar <small>(o aluno lê e escreve a sua versão no Diário)</small><textarea class="in" id="nX" rows="10">${esc(n.text||'')}</textarea></label><label class="fl chk"><input type="checkbox" id="nA" ${n.active!==false?'checked':''}> Visível para os alunos</label>
    <div class="tc-row"><button class="bt" id="nS">💾 Salvar nota</button></div></div>`;
    $('#nBack',body).onclick=()=>{nEd=null;draw()};
    $('#nS',body).onclick=()=>{const t=$('#nT',body).value.trim(),x=$('#nX',body).value.trim();if(!t||!x){toast('Preencha título e texto.','⚠️');return}
     const o={id:n.id||'nota-'+uid(),type:'note',title:t,text:x,active:$('#nA',body).checked,ts:now()};DB.notes=(DB.notes||[]).filter(y=>y.id!==o.id).concat([o]);save();nEd=null;toast('Nota salva.','📝');draw()};return}
   body.innerHTML=`<div class="tc-row"><button class="bt" id="nN">＋ Nova nota ou ditado</button></div><p class="tc-note">Textos que você dita aparecem no <b>Diário</b> de cada aluno (aba Cadernos), onde eles escrevem, salvam e baixam em PDF. Para publicar a todos, baixe o <b>livros.json</b> (aba Livros): as notas vão junto.</p>
   <div class="tc-list">${list.map(n=>`<div class="tc-item ${n.active===false?'off':''}"><span class="dy-ic" style="background:#8a3324">📝</span><div class="tc-tx"><b>${esc(n.title)}</b><small>${esc((n.text||'').slice(0,90))}…</small></div><div class="tc-ac"><button class="bt sm" data-ne="${esc(n.id)}">Editar</button><button class="bt ghost sm danger" data-nd="${esc(n.id)}">Excluir</button></div></div>`).join('')||'<p class="tc-note">Nenhuma nota ainda.</p>'}</div>`;
   $('#nN',body).onclick=()=>{nEd={};draw()};
   body.onclick=async e=>{const ed=e.target.closest('[data-ne]'),de=e.target.closest('[data-nd]');if(ed){nEd=JSON.parse(JSON.stringify(m.get(ed.dataset.ne)));draw()}
    if(de&&await Dlg.confirm('Excluir esta nota?','Excluir')){DB.notes=(DB.notes||[]).filter(y=>y.id!==de.dataset.nd).concat([{id:de.dataset.nd,type:'note',deleted:true}]);save();draw()}}}

  function editor(body){
   const b=ed.id?ed:normBook({id:'livro-'+uid(),title:'',subject:'historia',grade:'4º ano',icon:'📖',text:'',rels:[],extras:''}),isNew=!ed.id;
   body.innerHTML=`<div class="tc-row"><button class="bt ghost sm" id="back">← Voltar à lista</button><b class="tc-h">${isNew?'Novo livro':'Editar livro'}</b></div>
   <div class="tc-form"><div class="row3"><label class="fl">Título<input class="in" id="fT" maxlength="70" value="${esc(b.title)}"></label>
    <label class="fl">Disciplina<select class="in" id="fS">${Object.keys(SUBJ).map(k=>`<option value="${k}" ${b.subject===k?'selected':''}>${SUBJ[k].n}</option>`).join('')}</select></label>
    <label class="fl">Ano / turma<input class="in" id="fG" maxlength="14" value="${esc(b.grade)}"></label></div>
   <div class="row3"><label class="fl">Ícone (emoji)<input class="in" id="fI" maxlength="4" value="${esc(b.icon)}"></label><label class="fl">Cor da capa<input class="in col" type="color" id="fC" value="${esc(b.color||bookColor(b))}"></label>
    <label class="fl chk"><input type="checkbox" id="fA" ${b.active!==false?'checked':''}> Visível para os alunos</label></div>
   <label class="fl">Briefing do caso <small>(aparece no índice do livro)</small><textarea class="in" id="fN" rows="2">${esc(b.intro)}</textarea></label>
   <label class="fl">Texto do livro <small>(a matéria que o aluno vai ler)</small><textarea class="in mono" id="fX" rows="16" spellcheck="true">${esc(b.text)}</textarea></label>
   <div class="tc-help"><b>Como escrever:</b> marque as <b>pistas</b> com colchetes duplos: <code>[[Tupis]]</code> ou, para dar um nome curto ao cartão do quadro, <code>[[povos indígenas do litoral|Tupis]]</code>.
   Comece uma página com <code># Título</code>. Separe páginas com uma linha <code>---</code> (se não usar, o livro é dividido sozinho). Use <code>**negrito**</code> se quiser.</div>
   <div class="tc-sum" id="sum"></div>
   <div class="tc-sec"><h3>🧵 Ligações (as perguntas do caso)</h3><p class="tc-note">Cada ligação liga <b>duas pistas</b>. O aluno só descobre o que as une lendo a <b>carta do Animail</b> que você escrever aqui. Dica: cite as duas pistas na carta.</p><div id="rels"></div><button class="bt ghost" id="addRel">＋ Adicionar ligação</button></div>
   <label class="fl">Curiosidades dos Amigos do Saber <small>(uma por linha: <code>Título | Texto</code>) — chegam no Animail e ficam nos Anexos do Diário do aluno</small><textarea class="in mono" id="fE" rows="3">${esc(b.extras||'')}</textarea></label>
   <div class="tc-row"><button class="bt" id="save">💾 Salvar livro</button><button class="bt ghost" id="test">🧪 Salvar e testar como aluno</button><button class="bt ghost" id="cancel">Cancelar</button></div></div>`;
   const $b=s=>$(s,body);let clueKeys=[];
   const npcOpts=sel=>`<option value="">(automático pela disciplina)</option>`+Object.keys(NPC).map(k=>`<option value="${k}" ${sel===k?'selected':''}>${NPC[k].a} ${NPC[k].n}</option>`).join('');
   const relRow=(r,i)=>`<div class="rrow" data-i="${i}"><div class="rr-top"><b>Ligação ${i+1}</b><button type="button" class="bt ghost sm danger" data-del>remover</button></div>
    <div class="row2"><label class="fl">Pista A<select class="in" data-f="a"></select></label><label class="fl">Pista B<select class="in" data-f="b"></select></label></div>
    <label class="fl">Pergunta <small>(opcional; se vazio: "Qual é a relação entre A e B?")</small><input class="in" data-f="q" value="${esc(r.q||'')}"></label>
    <label class="fl">Conclusão correta <small>(vira uma das alternativas no quadro)</small><input class="in" data-f="label" maxlength="140" value="${esc(r.label||'')}"></label>
    <label class="fl">Carta do Animail <small>(o que o aluno vai encontrar procurando nas cartas)</small><textarea class="in" data-f="exp" rows="3">${esc(r.exp||'')}</textarea></label>
    <div class="row2"><label class="fl">Remetente<select class="in" data-f="from">${npcOpts(r.from)}</select></label><label class="fl">Alternativas erradas <small>(uma por linha, opcional)</small><textarea class="in" data-f="dis" rows="2">${esc(Array.isArray(r.dis)?r.dis.join('\n'):r.dis||'')}</textarea></label></div></div>`;
   const relsEl=$b('#rels');let rels=(b.rels||[]).map(r=>Object.assign({},r));
   const readRels=()=>$$('.rrow',relsEl).map(row=>{const g=f=>$(`[data-f="${f}"]`,row).value;return{a:g('a'),b:g('b'),q:g('q').trim(),label:g('label').trim(),exp:g('exp').trim(),from:g('from'),dis:g('dis').split('\n').map(s=>s.trim()).filter(Boolean)}});
   const drawRels=()=>{relsEl.innerHTML=rels.map(relRow).join('')||'<p class="tc-note">Nenhuma ligação ainda.</p>';fillSel()};
   const fillSel=()=>{$$('.rrow',relsEl).forEach((row,i)=>{['a','b'].forEach(f=>{const s=$(`[data-f="${f}"]`,row),cur=rels[i][f];s.innerHTML=`<option value="">— escolha —</option>`+clueKeys.map(k=>`<option value="${esc(k)}" ${k===cur?'selected':''}>${esc(tmpInfo.clues[k].label)}</option>`).join('')+(cur&&clueKeys.indexOf(cur)<0?`<option value="${esc(cur)}" selected>(pista não encontrada no texto: ${esc(cur)})</option>`:'')})})};
   let tmpInfo={clues:{}};
   const parseNow=()=>{tmpInfo=parseBook({id:'__tmp',text:$b('#fX').value,rels:[],extras:''});clueKeys=tmpInfo.order;
    $b('#sum').innerHTML=`<b>${tmpInfo.pages.length}</b> página(s) · <b>${clueKeys.length}</b> pista(s): ${clueKeys.map(k=>`<span class="tg">${esc(tmpInfo.clues[k].label)}</span>`).join(' ')||'<i>nenhuma ainda — use [[ ]]</i>'}`;
    rels=readRels();fillSel()};
   let tm;$b('#fX').addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(parseNow,300)});
   rels=(b.rels||[]).map(r=>Object.assign({},r));drawRels();parseNow();
   $b('#addRel').onclick=()=>{rels=readRels();rels.push({a:'',b:'',label:'',exp:''});drawRels()};
   relsEl.onclick=e=>{const d=e.target.closest('[data-del]');if(d){rels=readRels();rels.splice(+d.closest('.rrow').dataset.i,1);drawRels()}};
   const collect=()=>{const title=$b('#fT').value.trim();if(!title)throw new Error('Dê um título ao livro.');
    const text=$b('#fX').value;if(!text.trim())throw new Error('Escreva o texto do livro.');
    const info=parseBook({id:'__tmp',text,rels:[],extras:''});if(!info.order.length)throw new Error('Marque pelo menos uma pista com [[ ]] no texto.');
    const rl=readRels().filter(r=>r.a||r.b||r.label||r.exp);for(const r of rl){if(!r.a||!r.b||r.a===r.b)throw new Error('Cada ligação precisa de duas pistas diferentes.');if(!r.label)throw new Error('Escreva a "conclusão correta" de cada ligação.')}
    const col=$b('#fC').value;return{id:b.id,title,subject:$b('#fS').value,grade:$b('#fG').value.trim(),icon:$b('#fI').value.trim(),color:col===bookColor(Object.assign({},b,{subject:$b('#fS').value,color:''}))?'':col,active:$b('#fA').checked,intro:$b('#fN').value.trim(),text,rels:rl,extras:$b('#fE').value,ts:now()}};
   const doSave=()=>{try{const nb=collect();DB.books[nb.id]=nb;delete DB.hidden[nb.id];save();return nb}catch(e){toast(e.message,'⚠️');return null}};
   $b('#back').onclick=$b('#cancel').onclick=()=>{ed=null;draw()};
   $b('#save').onclick=()=>{const nb=doSave();if(nb){toast('Livro salvo!','💾');ed=null;draw()}};
   $b('#test').onclick=()=>{const nb=doSave();if(nb)testAs(nb.id)}}

  /* ===== alunos e resultados ===== */
  async function loadProg(){const local=[];realUsers().forEach(u=>Object.keys(DB.prog[u.id]||{}).forEach(mid=>{const p=DB.prog[u.id][mid];local.push({uid:u.id,name:u.name,cls:u.cls,mid,clues:p.clues.length,links:p.links.length,errs:p.errs,pts:p.pts,done:!!p.done,opened:p.opened,src:'aparelho'})}));
   let on=[];if(Net.on()){const r=await Net.allProg();on=r.map(x=>({uid:x.user_id,name:x.user_name,cls:x.cls,mid:x.mid,clues:(x.data.clues||[]).length,links:(x.data.links||[]).length,errs:x.data.errs||0,pts:x.data.pts||0,done:!!x.data.done,opened:x.data.opened,src:'sala'}))}
   const m=new Map();local.concat(on).forEach(r=>{const k=r.uid+'|'+r.mid,o=m.get(k);if(!o||r.pts>=o.pts)m.set(k,r)});return Array.from(m.values())}
  function tStu(body){
   const us=realUsers();
   body.innerHTML=`<div class="tc-row"><button class="bt ghost" id="csv">⬇ Resultados em CSV</button>${Net.on()?'<button class="bt ghost" id="rf">↻ Atualizar da sala online</button>':''}</div>
   <h3 class="tc-h2">Detetives neste aparelho (${us.length})</h3><div class="tc-table"><table><thead><tr><th>Detetive</th><th>Turma</th><th>PIN</th><th></th></tr></thead><tbody>${us.map(u=>`<tr><td>${u.animal} ${esc(u.name)}</td><td>${esc(u.cls||'—')}</td><td>${u.pin?'<code>'+esc(u.pin)+'</code>':'sem PIN'}</td><td class="r"><button class="bt ghost sm" data-pin="${esc(u.id)}">Zerar PIN</button> <button class="bt ghost sm danger" data-rm="${esc(u.id)}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="4">Nenhum aluno cadastrado.</td></tr>'}</tbody></table></div>
   <h3 class="tc-h2">Resultados por caso</h3><div id="res" class="tc-table"><p class="tc-note">Carregando…</p></div>`;
   const showRes=async()=>{prog=await loadProg();prog.sort((a,b)=>String(a.name).localeCompare(b.name));
    $('#res',body).innerHTML=`<table><thead><tr><th>Aluno</th><th>Turma</th><th>Caso</th><th>Pistas</th><th>Ligações</th><th>Erros</th><th>Pontos</th><th>Situação</th><th>Fonte</th></tr></thead><tbody>${prog.map(r=>{const b=getBook(r.mid),nr=b?parseBook(b).rels.length:'?',nc=b?parseBook(b).order.length:'?';
     return`<tr><td>${esc(r.name)}</td><td>${esc(r.cls||'—')}</td><td>${esc(b?b.title:r.mid)}</td><td>${r.clues}/${nc}</td><td>${r.links}/${nr}</td><td>${r.errs}</td><td>${r.pts}</td><td>${r.done?'<span class="ok">resolvido</span>':'em andamento'}</td><td><small>${r.src}</small></td></tr>`}).join('')||'<tr><td colspan="9">Ainda sem resultados.</td></tr>'}</tbody></table>`};
   showRes();
   $('#csv',body).onclick=()=>{const rows=[['Aluno','Turma','Caso','Pistas','Ligações','Erros','Pontos','Situação']].concat(prog.map(r=>{const b=getBook(r.mid);return[r.name,r.cls,b?b.title:r.mid,r.clues,r.links,r.errs,r.pts,r.done?'resolvido':'em andamento']}));
    download('resultados-detetives.csv','﻿'+rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(';')).join('\n'),'text/csv')};
   if($('#rf',body))$('#rf',body).onclick=()=>{$('#res',body).innerHTML='<p class="tc-note">Carregando…</p>';showRes()};
   body.onclick=async e=>{const p=e.target.closest('[data-pin]'),r=e.target.closest('[data-rm]');
    if(p){DB.users[p.dataset.pin].pin='';save();Net.saveUser(DB.users[p.dataset.pin]);toast('PIN zerado.','🔑');draw()}
    if(r&&await Dlg.confirm('Excluir esta conta e todo o progresso dela neste aparelho?','Excluir')){const id=r.dataset.rm;delete DB.users[id];delete DB.mail[id];delete DB.prog[id];if(DB.session===id)DB.session=null;save();draw()}}}

  /* ===== sala online ===== */
  function tNet(body){
   body.innerHTML=`<div class="tc-card"><h3>🌐 Sala online (opcional)</h3>
   <p class="tc-note">O GitHub Pages não guarda dados. Sem a sala online, <b>contas, cartas e progresso ficam salvos em cada aparelho</b> (ótimo para o laboratório de informática: todos no mesmo computador). Para que os alunos conversem pelo Animail em <b>aparelhos diferentes</b> (celular, casa), crie um projeto gratuito no <b>Supabase</b>, rode o SQL abaixo e cole aqui a URL e a chave <i>anon public</i>.</p>
   <div class="row3"><label class="fl">URL do projeto<input class="in" id="nU" placeholder="https://xxxx.supabase.co" value="${esc(DB.set.sbUrl)}"></label><label class="fl">Chave anon (public)<input class="in" id="nK" value="${esc(DB.set.sbKey)}"></label><label class="fl">Código da sala<input class="in" id="nR" maxlength="14" placeholder="Ex.: T401" value="${esc(DB.set.room)}"></label></div>
   <div class="tc-row"><button class="bt" id="nS">💾 Salvar</button><button class="bt ghost" id="nT">🔌 Testar conexão</button><button class="bt ghost" id="nL">🔗 Copiar link da sala</button><button class="bt ghost" id="nC">⬇ Baixar config.json</button></div>
   <p class="tc-note" id="nMsg"></p>
   <details><summary>📋 SQL para rodar no Supabase (SQL Editor)</summary><textarea class="in mono" rows="12" readonly id="nSql">${esc(SQL_SETUP)}</textarea><button class="bt ghost sm" id="nQ">Copiar SQL</button></details>
   <p class="tc-note"><b>Como os alunos entram na sala:</b> envie o <b>link da sala</b> (ele guarda URL, chave e código no aparelho do aluno na primeira abertura) ou coloque o <b>config.json</b> na raiz do repositório.</p></div>`;
   const msg=t=>{$('#nMsg',body).textContent=t};
   const read=()=>{DB.set.sbUrl=$('#nU',body).value.trim();DB.set.sbKey=$('#nK',body).value.trim();DB.set.room=$('#nR',body).value.trim().toUpperCase();save()};
   $('#nS',body).onclick=()=>{read();toast('Configuração salva.','💾')};
   $('#nT',body).onclick=async()=>{read();msg('Testando…');try{await Net.test();msg('✅ Conexão OK! As tabelas foram encontradas.')}catch(e){msg('❌ Não conectou: '+String(e.message||e).slice(0,160)+' — confira URL, chave e se rodou o SQL.')}};
   $('#nL',body).onclick=async()=>{read();if(!Net.on()){msg('Preencha URL, chave e código da sala.');return}try{await navigator.clipboard.writeText(roomLink());msg('Link copiado! Envie aos alunos.')}catch(e){$('#nMsg',body).innerHTML='Copie: <input class="in" readonly value="'+esc(roomLink())+'">'}};
   $('#nC',body).onclick=()=>{read();download('config.json',JSON.stringify({sbUrl:DB.set.sbUrl,sbKey:DB.set.sbKey,room:DB.set.room},null,1))};
   $('#nQ',body).onclick=async()=>{try{await navigator.clipboard.writeText(SQL_SETUP);toast('SQL copiado!','📋')}catch(e){$('#nSql',body).select()}}}

  /* ===== ajustes ===== */
  function tSet(body){
   body.innerHTML=`<div class="tc-card"><h3>⚙️ Ajustes</h3><label class="fl">Senha do professor<input class="in" id="sP" value="${esc(DB.set.pass)}"></label>
   <label class="fl chk"><input type="checkbox" id="sH" ${DB.set.hard?'checked':''}> Modo desafio: as pistas do texto não ficam grifadas (o aluno precisa descobrir por onde clicar)</label>
   <label class="fl chk"><input type="checkbox" id="sS" ${DB.set.sound!==false?'checked':''}> Efeitos sonoros</label>
   <div class="tc-row"><button class="bt" id="sV">💾 Salvar ajustes</button><button class="bt ghost" id="sR">Restaurar livros de exemplo</button><button class="bt ghost danger" id="sX">Apagar TODOS os dados deste aparelho</button></div></div>`;
   $('#sV',body).onclick=()=>{DB.set.pass=$('#sP',body).value.trim()||'prof123';DB.set.hard=$('#sH',body).checked;DB.set.sound=$('#sS',body).checked;save();toast('Ajustes salvos.','💾')};
   $('#sR',body).onclick=()=>{SAMPLES.forEach(s=>{delete DB.hidden[s.id];delete DB.books[s.id]});save();toast('Exemplos restaurados.','📚')};
   $('#sX',body).onclick=async()=>{if(await Dlg.confirm('Isto apaga contas, cartas, progresso e livros criados neste aparelho. Tem certeza?','Apagar tudo')){localStorage.removeItem(KEY);location.reload()}}}
  draw()}
};

/* ---------- CONFIGURAÇÕES, BACKUP ---------- */
const fsOn=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){const d=document,r=d.documentElement;try{if(fsOn()){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{(r.requestFullscreen||r.webkitRequestFullscreen).call(r)}}catch(e){toast('Este navegador não permite tela cheia aqui.','⚠️')}}
function backupData(){return{app:'detetives-do-saber',v:1,ts:now(),data:JSON.parse(JSON.stringify(DB))}}
function downloadBackup(){const d=new Date(),n=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 download('detetives-backup-'+n+'.json',JSON.stringify(backupData()));toast('Backup baixado! Guarde o arquivo em local seguro.','💾')}
function restoreBackup(file){return file.text().then(t=>{let j;try{j=JSON.parse(t)}catch(e){throw new Error('Arquivo inválido.')}
 const d=j&&j.app==='detetives-do-saber'?j.data:null;if(!d||!d.users)throw new Error('Este arquivo não é um backup do Detetives do Saber.');
 return Dlg.confirm('Carregar este backup? Os dados deste aparelho serão <b>substituídos</b> pelos do arquivo ('+Object.keys(d.users).length+' conta(s)).','Carregar').then(ok=>{if(!ok)return false;
  const keep=DB.set;Object.keys(DB).forEach(k=>delete DB[k]);Object.assign(DB,{users:{},session:null,books:{},hidden:{},mail:{},prog:{},cloud:{books:[]},sync:{},diary:{},notes:[]},d);DB.set=Object.assign({pass:'prof123',hard:false,sound:true,room:'',sbUrl:'',sbKey:''},keep,d.set||{});DB.session=null;save();S.mid=null;Dlg.close();toast('Backup carregado! Escolha sua conta.','✅');go('login');return true})})}
function pickBackup(){const i=E('input',{type:'file',accept:'.json,application/json',hidden:true});document.body.append(i);i.onchange=()=>{const f=i.files[0];i.remove();if(f)restoreBackup(f).catch(e=>toast(e.message||'Falhou.','⚠️'))};i.click()}
function saveProgress(){const u=me();save();if(u){Object.keys(DB.prog[u.id]||{}).forEach(m=>Net.pushProg(u.id,m));Net.saveUser(u)}toast(Net.on()?'Progresso salvo neste aparelho e enviado à sala online.':'Progresso salvo neste aparelho.','💾')}
function openSettings(){
 const u=me();const row=(id,ico,t,sub)=>`<button class="st-row" id="${id}" type="button"><span class="st-ic">${ico}</span><span class="st-tx"><b>${t}</b><small>${sub}</small></span><span class="st-v" data-v="${id}"></span></button>`;
 const box=Dlg.open(`<div class="st-list">${row('stFs','⛶','Tela cheia','Leia o livro sem distrações')}${row('stSnd','🔊','Sons','Efeitos ao coletar pistas e virar páginas')}${row('stHard','🧩','Modo desafio','Esconde o destaque das pistas no texto')}
  ${row('stSave','💾','Salvar progresso','Grava agora neste aparelho (e na sala online, se houver)')}${row('stDl','⬇️','Baixar backup','Arquivo com contas, cartas, progresso e diário')}${row('stUp','⬆️','Carregar backup','Restaura um arquivo baixado antes')}
  ${u?row('stOut','🚪','Sair da conta','Voltar para a tela de entrada'):''}</div>`,{title:'⚙️ Configurações',cls:'st',actions:[{t:'Fechar',cls:'ghost'}]});
 const upd=()=>{$('[data-v=stFs]',box).textContent=fsOn()?'ligada':'desligada';$('[data-v=stSnd]',box).textContent=DB.set.sound===false?'desligados':'ligados';$('[data-v=stHard]',box).textContent=DB.set.hard?'ligado':'desligado';$('#stSnd',box).classList.toggle('on',DB.set.sound!==false);$('#stFs',box).classList.toggle('on',fsOn());$('#stHard',box).classList.toggle('on',!!DB.set.hard)};
 upd();
 $('#stFs',box).onclick=()=>{toggleFS();setTimeout(upd,350)};
 $('#stSnd',box).onclick=()=>{DB.set.sound=DB.set.sound===false;save();upd();Snd.play('ok')};
 $('#stHard',box).onclick=()=>{DB.set.hard=!DB.set.hard;save();upd();const v=$('#view');if(v)v.classList.toggle('hard',!!DB.set.hard)};
 $('#stSave',box).onclick=saveProgress;$('#stDl',box).onclick=downloadBackup;$('#stUp',box).onclick=pickBackup;
 if($('#stOut',box))$('#stOut',box).onclick=()=>{Dlg.close();logout();S.mid=null;go('login')};
}
document.addEventListener('click',e=>{if(e.target.closest('[data-act="loadbk"]'))pickBackup()});
document.addEventListener('fullscreenchange',()=>{});

/* ---------- DIÁRIO ---------- */
const DY=u=>DB.diary[u]||(DB.diary[u]={notes:{},free:[]});
function diaryClues(u){const out=[];visibleBooks().forEach(b=>{const info=parseBook(b),p=P(u,b.id);const items=p.clues.filter(k=>info.clues[k]).map(k=>{const c=info.clues[k];
  const ex=info.rels.filter(r=>(r.a===k||r.b===k)&&p.links.indexOf(r.id)>=0).map(r=>({label:r.label,exp:r.exp||'',other:info.clues[r.a===k?r.b:r.a].label}));
  const pend=info.rels.some(r=>(r.a===k||r.b===k)&&p.links.indexOf(r.id)<0);return{k,label:c.label,ctx:String(c.ctx||'').replace(/[\u0001\u0002]/g,''),ex,pend}});
  if(items.length)out.push({b,items,total:info.order.length})});return out}
function diaryCurios(u){return(DB.mail[u]||[]).filter(m=>m.curio&&!m.del&&m.box!=='sent').sort((a,b)=>a.ts-b.ts)}
function bookById(id){return getBook(id)}
async function diaryPdf(u,which){
 const T=[];const us=DB.users[u],rank=rankOf(totals(u).pts);
 const clues=diaryClues(u),cur=diaryCurios(u),notes=allNotes(),d=DY(u);
 const sec=(w)=>which==='all'||which===w;
 if(sec('all')||sec('cases')){T.push({k:'h1',t:'Meus casos'});visibleBooks().forEach(b=>{const s=stat(u,b),sj=SUBJ[b.subject]||SUBJ.historia;
   T.push({k:'p',t:b.title,b:1});T.push({k:'fade',t:`${sj.n} · ${s.clues}/${s.nClues} pistas · ${s.links}/${s.nRels} ligações · ${s.done?'caso resolvido':s.state==='doing'?'em andamento':'ainda não começado'}`,i:20})})}
 if(sec('all')||sec('clues')){T.push({k:'h1',t:'Pistas anotadas'});if(!clues.length)T.push({k:'fade',t:'Nenhuma pista guardada ainda.'});
  clues.forEach(g=>{T.push({k:'h2',t:g.b.title});g.items.forEach(c=>{T.push({k:'lbl',t:'📌 '.replace('📌 ','')+c.label});if(c.ctx)T.push({k:'fade',t:'“'+c.ctx+'”',i:20});
    if(c.ex.length)c.ex.forEach(e=>T.push({k:'p',t:'Ligação com '+e.other+': '+(e.exp||e.label),i:20}));else T.push({k:'fade',t:c.pend?'(ligue esta pista no Quadro para anotar a explicação)':'(sem ligação neste caso)',i:20})})})}
 if(sec('all')||sec('anexos')){T.push({k:'h1',t:'Anexos dos Amigos do Saber'});if(!cur.length)T.push({k:'fade',t:'Nenhuma curiosidade recebida ainda.'});
  cur.forEach(m=>{T.push({k:'lbl',t:(m.title||m.subj)+'  —  '+m.fromName,c:'#5f6238'});(m.body||[]).filter((x,i)=>i>0||!/^(Olá|Oi|Salve)/.test(x)).forEach(x=>T.push({k:'p',t:x,i:20}));T.push({k:'sp'})})}
 if(sec('all')||sec('notes')){T.push({k:'h1',t:'Cadernos'});
  const one=which&&which.startsWith('note:')?which.slice(5):null;
  notes.filter(n=>!one||n.id===one).forEach(n=>{T.push({k:'h2',t:n.title||'Ditado do professor'});T.push({k:'lbl',t:'Ditado do professor:'});T.push({k:'tch',t:n.text||''});T.push({k:'lbl',t:'Minha escrita:',c:'#1f3f7a'});T.push({k:'pen',t:(d.notes[n.id]||{}).text||''})});
  if(!one)(d.free||[]).forEach(f=>{T.push({k:'h2',t:f.title||'Anotação'});T.push({k:'pen',t:f.text||''})})}
 if(which&&which.startsWith('free:')){}
 const sub=which==='all'?'Diário completo':which&&which.startsWith('note:')?'Nota do caderno':'';
 return DiaryPDF.build(us,T,{sub});
}
Views.diary={
 mount(root){
  const u=me(),uid_=u.id;let tab=localStorage.getItem('dds.dtab')||'cases';
  const tot=totals(uid_),rank=rankOf(tot.pts),next=RANKS.find(r=>r[0]>tot.pts),books=visibleBooks();
  const TABS=[['cases','📚 Casos'],['clues','📌 Pistas'],['anexos','🐾 Anexos dos Amigos'],['notes','✍️ Cadernos']];
  const badges=()=>[['🔎','Primeira pista',books.some(b=>stat(uid_,b).clues>0)],['🧵','Primeira ligação',books.some(b=>stat(uid_,b).links>0)],['📖','Caso resolvido',tot.done>=1],['🏆','3 casos resolvidos',tot.done>=3],['⭐','Mestre sem erros',books.some(b=>{const s=stat(uid_,b);return s.done&&s.p.errs===0})],['✉️','Correspondente',(DB.mail[uid_]||[]).some(m=>m.box==='sent')]];
  const head=()=>`<div class="diary"><div class="dy-card dy-top"><div><p class="eyebrow">Diário do Detetive</p><h1>${u.animal} ${esc(u.name)}</h1><p class="lead">${esc(rank)} · ${tot.pts} pontos${next?` · faltam ${next[0]-tot.pts} para ${esc(next[1])}`:''}</p></div>
    <div class="dy-acts"><button class="bt" id="pdfAll">📄 Baixar diário em PDF</button></div></div>
   <div class="badges2 dy-bd">${badges().map(b=>`<div class="bd ${b[2]?'on':''}"><span>${b[0]}</span><small>${b[1]}</small></div>`).join('')}</div>
   <div class="dy-tabs">${TABS.map(t=>`<button data-t="${t[0]}" class="${tab===t[0]?'on':''}">${t[1]}</button>`).join('')}</div><div class="dy-page" id="dyBody"></div></div>`;
  const cases=()=>`<h2 class="dy-h">Livros para ler</h2><div class="dy-list">${books.map(b=>{const s=stat(uid_,b),sj=SUBJ[b.subject]||SUBJ.historia;const stars=s.done?'★'.repeat(s.p.errs<=1?3:s.p.errs<=4?2:1):'';
    return`<button class="dy-row" data-open="${esc(b.id)}"><span class="dy-ic" style="background:${bookColor(b)}">${esc(b.icon||sj.i)}</span><span class="dy-tx"><b>${esc(b.title)}</b><small>${esc(sj.n)} · 📌 ${s.clues}/${s.nClues} pistas · 🧵 ${s.links}/${s.nRels} ligações · ✖ ${s.p.errs} erros</small></span><span class="dy-pt">${s.done?`<i>${stars}</i>`:s.state==='new'?'novo':'em andamento'}<b>★ ${s.p.pts}</b></span></button>`}).join('')||'<p class="dy-e">Nenhum livro ainda.</p>'}</div>`;
  const clues=()=>{const g=diaryClues(uid_);return`<h2 class="dy-h">Pistas anotadas e explicadas</h2><p class="dy-sub">Cada pista que você guardou aparece aqui. A explicação surge quando você liga a pista no Quadro de Evidências.</p>`+(g.map(x=>`<section class="dy-blk"><h3>${esc(x.b.icon||'📖')} ${esc(x.b.title)} <small>${x.items.length}/${x.total} pistas</small></h3>${x.items.map(c=>`<div class="dy-clue"><b>📌 ${esc(c.label)}</b>${c.ctx?`<p class="dy-q">“${esc(c.ctx)}”</p>`:''}${c.ex.length?c.ex.map(e=>`<p class="dy-ex"><span>🧵 com ${esc(e.other)}</span> ${esc(e.exp||e.label)}</p>`).join(''):`<p class="dy-pend">${c.pend?'Ainda sem explicação: ligue esta pista no Quadro.':'Sem ligação neste caso.'}</p>`}</div>`).join('')}</section>`).join('')||'<p class="dy-e">Você ainda não guardou pistas. Abra um livro e clique nas frases marcadas!</p>')};
  const anexos=()=>{const c=diaryCurios(uid_);return`<h2 class="dy-h">Anexos dos Amigos do Saber</h2><p class="dy-sub">Curiosidades que os bichos da fauna brasileira mandaram pelo Animail.</p>`+(c.map(m=>`<article class="dy-an"><span class="dy-av">${m.fromAnimal}</span><div><b>${esc(m.title||m.subj)}</b><small>${esc(m.fromName)}</small>${(m.body||[]).filter((x,i)=>i>0||!/^(Olá|Oi|Salve)/.test(x)).map(x=>`<p>${esc(x)}</p>`).join('')}</div></article>`).join('')||'<p class="dy-e">Nada por aqui ainda. Abra livros e leia as cartas do Animail.</p>')};
  const notes=()=>{const ns=allNotes(),d=DY(uid_);return`<h2 class="dy-h">Cadernos</h2><p class="dy-sub">O professor pode ditar textos para você escrever aqui. Salve e baixe em PDF, no estilo do diário.</p>
   ${ns.map(n=>`<section class="dy-note" data-n="${esc(n.id)}"><h3>📝 ${esc(n.title||'Ditado')}</h3><p class="dy-dict">${esc(n.text||'').replace(/\n/g,'<br>')}</p><label>Minha escrita<textarea class="in dy-ta" rows="5" placeholder="Escreva aqui o que o professor ditou…">${esc((d.notes[n.id]||{}).text||'')}</textarea></label><div class="dy-nacts"><button class="bt sm" data-save="${esc(n.id)}">💾 Salvar</button><button class="bt ghost sm" data-pdf="note:${esc(n.id)}">📄 PDF</button></div></section>`).join('')||'<p class="dy-e">Nenhum ditado do professor por enquanto.</p>'}
   <h3 class="dy-h2">Minhas anotações</h3>${(d.free||[]).map(f=>`<section class="dy-note" data-f="${esc(f.id)}"><input class="in dy-ti" value="${esc(f.title||'')}" placeholder="Título"><textarea class="in dy-ta" rows="4">${esc(f.text||'')}</textarea><div class="dy-nacts"><button class="bt sm" data-fsave="${esc(f.id)}">💾 Salvar</button><button class="bt ghost sm danger" data-fdel="${esc(f.id)}">Excluir</button></div></section>`).join('')}
   <button class="bt ghost" id="addFree">＋ Nova anotação</button>`};
  const draw=()=>{root.innerHTML=head();const body=$('#dyBody',root);body.innerHTML=({cases,clues,anexos,notes})[tab]();$$('.dy-tabs button',root).forEach(b=>b.onclick=()=>{tab=b.dataset.t;localStorage.setItem('dds.dtab',tab);draw()});$('#pdfAll',root).onclick=()=>mk('all')};
  async function mk(which){toast('Montando o PDF do diário…','📄');try{const blob=await diaryPdf(uid_,which);const a=E('a',{href:URL.createObjectURL(blob),download:'diario-'+slug(u.name)+(which==='all'?'':'-'+slug(which.replace(':','-')))+'.pdf'});document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('PDF baixado!','✅')}catch(e){toast('Não consegui criar o PDF.','⚠️');console.error(e)}}
  root.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){go('book',{mid:o.dataset.open});return}
   const sv=e.target.closest('[data-save]');if(sv){const sec=sv.closest('.dy-note');DY(uid_).notes[sv.dataset.save]={text:$('textarea',sec).value,ts:now()};save();toast('Nota salva no seu diário.','💾');return}
   const pf=e.target.closest('[data-pdf]');if(pf){const sec=pf.closest('.dy-note');if(sec&&sec.dataset.n){DY(uid_).notes[sec.dataset.n]={text:$('textarea',sec).value,ts:now()};save()}mk(pf.dataset.pdf);return}
   if(e.target.closest('#addFree')){DY(uid_).free.unshift({id:uid(),title:'',text:'',ts:now()});save();draw();return}
   const fs=e.target.closest('[data-fsave]');if(fs){const sec=fs.closest('.dy-note'),f=DY(uid_).free.find(x=>x.id===fs.dataset.fsave);if(f){f.title=$('.dy-ti',sec).value;f.text=$('textarea',sec).value;f.ts=now();save();toast('Anotação salva.','💾')}return}
   const fd=e.target.closest('[data-fdel]');if(fd){Dlg.confirm('Excluir esta anotação?','Excluir').then(ok=>{if(ok){const d=DY(uid_);d.free=d.free.filter(x=>x.id!==fd.dataset.fdel);save();draw()}})}});
  draw()}
};

/* ---------- PDF do Diário (páginas desenhadas em canvas → JPEG → PDF) ---------- */
const DiaryPDF={
 W:1240,H:1754,LH:40,TOP:216,BOT:1632,XL:196,XR:1150,
 async build(u,items,opt){opt=opt||{};const W=this.W,H=this.H,pages=[];let cv,cx,n,L=Math.floor((this.BOT-this.TOP)/this.LH),pg=0;const self=this;
  try{await Promise.all(['400 34px Caveat','700 34px Caveat','400 34px "Special Elite"','700 30px Georgia'].map(f=>document.fonts.load(f)))}catch(e){}
  const rule=i=>self.TOP+i*self.LH;
  function newPage(){cv=document.createElement('canvas');cv.width=W;cv.height=H;cx=cv.getContext('2d');pages.push(cv);pg++;n=0;
   const g=cx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f4ead0');g.addColorStop(.5,'#efe2bf');g.addColorStop(1,'#e6d5a9');cx.fillStyle=g;cx.fillRect(0,0,W,H);
   for(let i=0;i<900;i++){cx.fillStyle='rgba(120,90,40,'+(Math.random()*.035)+')';cx.fillRect(Math.random()*W,Math.random()*H,1+Math.random()*2,1+Math.random()*2)}
   const v=cx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(90,60,20,.22)');cx.fillStyle=v;cx.fillRect(0,0,W,H);
   cx.strokeStyle='rgba(70,110,150,.32)';cx.lineWidth=1.6;for(let i=0;i<=L;i++){cx.beginPath();cx.moveTo(100,rule(i));cx.lineTo(W-80,rule(i));cx.stroke()}
   cx.strokeStyle='rgba(190,60,50,.55)';cx.lineWidth=2;cx.beginPath();cx.moveTo(168,0);cx.lineTo(168,H);cx.stroke();cx.beginPath();cx.moveTo(176,0);cx.lineTo(176,H);cx.stroke();
   for(let y=110;y<H;y+=150){cx.fillStyle='rgba(60,40,20,.75)';cx.beginPath();cx.arc(62,y,17,0,7);cx.fill();cx.strokeStyle='rgba(255,255,255,.35)';cx.lineWidth=3;cx.stroke();cx.fillStyle='#b8b3a6';cx.fillRect(40,y-3,64,6)}
   cx.font='400 24px "Special Elite"';cx.fillStyle='rgba(110,70,30,.8)';cx.textAlign='left';cx.fillText('DIÁRIO DO DETETIVE · '+(u.name||'').toUpperCase(),self.XL,120);
   cx.textAlign='center';cx.fillText('— '+pg+' —',W/2,H-60);cx.textAlign='right';cx.font='400 20px "Special Elite"';cx.fillText('Detetives do Saber · A.R.S.',self.XR+30,H-60);cx.textAlign='left';
   cx.strokeStyle='rgba(110,70,30,.5)';cx.lineWidth=2;cx.beginPath();cx.moveTo(self.XL,138);cx.lineTo(self.XR+30,138);cx.stroke()}
  const wrap=(t,font,max)=>{cx.font=font;const out=[];String(t).split('\n').forEach(par=>{const w=par.split(/\s+/).filter(Boolean);let cur='';if(!w.length){out.push('');return}w.forEach(x=>{const tr=cur?cur+' '+x:x;if(cx.measureText(tr).width>max&&cur){out.push(cur);cur=x}else cur=tr});if(cur)out.push(cur)});return out};
  const put=(text,font,color,indent,bullet)=>{if(n>=L)newPage();const y=rule(n+1)-9;cx.font=font;cx.fillStyle=color;if(bullet){cx.fillText('•',self.XL+indent-24,y)}cx.fillText(text,self.XL+indent,y);n++};
  const para=(t,font,color,indent,bullet)=>{const ls=wrap(t,font,self.XR-self.XL-indent);ls.forEach((l,i)=>put(l,font,color,indent,bullet&&i===0))};
  /* capa */
  (function cover(){cv=document.createElement('canvas');cv.width=W;cv.height=H;cx=cv.getContext('2d');pages.push(cv);pg++;
   const g=cx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#7a3a2a');g.addColorStop(1,'#3a170f');cx.fillStyle=g;cx.fillRect(0,0,W,H);
   for(let i=0;i<5000;i++){cx.fillStyle='rgba(0,0,0,'+Math.random()*.06+')';cx.fillRect(Math.random()*W,Math.random()*H,2,2)}
   cx.strokeStyle='#d8b36a';cx.lineWidth=6;cx.strokeRect(90,90,W-180,H-180);cx.lineWidth=2;cx.strokeRect(116,116,W-232,H-232);
   cx.textAlign='center';cx.fillStyle='#d8b36a';cx.font='400 38px "Special Elite"';cx.fillText('DETETIVES DO SABER',W/2,300);
   cx.font='700 130px Georgia';cx.fillText('Diário',W/2,640);cx.fillText('do Detetive',W/2,790);cx.font='400 56px Georgia';cx.fillText('❦ ❦ ❦',W/2,900);
   cx.font='140px serif';cx.fillText(u.animal||'🔎',W/2,1130);
   cx.font='700 78px Caveat';cx.fillText(u.name||'',W/2,1290);cx.font='400 46px Caveat';cx.fillStyle='#ecd9a6';
   if(opt.sub)cx.fillText(opt.sub,W/2,1370);cx.fillText(new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'}),W/2,1440);
   cx.font='400 26px "Special Elite"';cx.fillStyle='#d8b36a';cx.fillText('A.R.S. HTML APPS e GAMES',W/2,1580);cx.textAlign='left'})();
  newPage();
  const BODY='400 36px Caveat',BOLD='700 36px Caveat',H1='400 50px "Special Elite"',H2='400 34px "Special Elite"',INK='#2a2a3a',PEN='#1f3f7a',TCH='#7a2418',FADE='#6a5638';
  for(const it of items){
   if(it.k==='break'){newPage();continue}
   if(it.k==='sp'){n+=1;continue}
   if(it.k==='h1'){if(n>0&&n>L-5)newPage();else if(n>0)n++;if(n+2>L)newPage();put(it.t,H1,'#7a2418',0);put('',BODY,INK,0);continue}
   if(it.k==='h2'){if(n>L-4)newPage();if(n>0)n++;para(it.t,H2,'#5f6238',0);continue}
   if(it.k==='lbl'){if(n>L-3)newPage();put(it.t,'700 32px Caveat',it.c||TCH,0);continue}
   if(it.k==='p'){para(it.t,it.b?BOLD:BODY,it.c||INK,it.i||0);continue}
   if(it.k==='li'){para(it.t,BODY,INK,34,true);continue}
   if(it.k==='pen'){para(it.t||'(em branco)',BODY,PEN,it.i||0);continue}
   if(it.k==='tch'){para(it.t,BODY,TCH,it.i||0);continue}
   if(it.k==='fade'){para(it.t,'400 30px Caveat',FADE,it.i||0);continue}
  }
  /* PDF */
  const blobs=await Promise.all(pages.map(c=>new Promise(r=>c.toBlob(r,'image/jpeg',.86))));
  const bufs=await Promise.all(blobs.map(b=>b.arrayBuffer()));
  return DiaryPDF._assemble(pages.length,bufs,W,H);
 },
 _assemble(N,bufs,W,H){
  const enc=new TextEncoder(),chunks=[],offs={};let len=0;const add=x=>{const b=typeof x==='string'?enc.encode(x):x;chunks.push(b);len+=b.length};
  const obj=(i,head,stream)=>{offs[i]=len;add(i+' 0 obj\n'+head+(stream?'\nstream\n':'\n'));if(stream){add(stream);add('\nendstream\n')}add('endobj\n')};
  add('%PDF-1.4\n');
  const pgIds=[];for(let i=0;i<N;i++)pgIds.push(4+i*3+2);
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids ['+pgIds.map(x=>x+' 0 R').join(' ')+'] /Count '+N+' >>');obj(3,'<< /Title (Diario do Detetive) /Producer (Detetives do Saber) >>');
  for(let i=0;i<N;i++){const im=4+i*3,ct=im+1,pg=im+2,data=new Uint8Array(bufs[i]);
   obj(im,'<< /Type /XObject /Subtype /Image /Width '+W+' /Height '+H+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+data.length+' >>',data);
   const c='q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';obj(ct,'<< /Length '+c.length+' >>',c);
   obj(pg,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 '+im+' 0 R >> >> /Contents '+ct+' 0 R >>')}
  const tot=4+N*3,xr=len;let x='xref\n0 '+tot+'\n0000000000 65535 f \n';for(let i=1;i<tot;i++)x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
  add(x+'trailer\n<< /Size '+tot+' /Root 1 0 R /Info 3 0 R >>\nstartxref\n'+xr+'\n%%EOF');
  return new Blob(chunks,{type:'application/pdf'})}
};

/* ---------- ARARA TAGARELA: assistente interna (sem servidor), baseada nos livros cadastrados ---------- */
const Arara={
 open:false,hist:[],bid:null,quiz:null,hl:{},
 STOP:new Set('a o as os um uma de do da dos das em no na nos nas por para com sem que e ou se ao aos como mais menos qual quais quem onde quando foi era sao ser tem ter ha eu voce me te meu minha sobre isso isto esse essa este esta pode fale falar diga explique explica conte quero queria preciso sobre'.split(' ')),
 book(){const u=me();let id=this.bid&&getBook(this.bid)?this.bid:(S.mid&&getBook(S.mid)?S.mid:lastBookId());return id?getBook(id):null},
 plain(src){return String(src||'').replace(MK,(m,t)=>t).replace(/\*\*(.+?)\*\*/g,'$1').replace(/\s+/g,' ').trim()},
 sents(b){const out=[];paginate(b.text).forEach((pg,pi)=>String(pg.src).split(/\n{2,}/).forEach(par=>sentences(par).forEach(sn=>out.push({t:this.plain(sn),pg:pi+1,pt:pg.title||'',b}))));return out},
 words(q){return norm(q).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!this.STOP.has(w))},
 say(html,opt){this.hist.push(Object.assign({who:'bot',html},opt||{}));this.paint()},
 me_(t){this.hist.push({who:'me',html:esc(t)});this.paint()},
 ensure(){if(document.getElementById('ara'))return;const d=E('div',{id:'ara',hidden:true});d.innerHTML=`<button id="araFab" class="ara-fab" aria-label="Falar com a Arara Tagarela" title="Arara Tagarela"><span>🦜</span><i>Arara Tagarela</i></button>
  <section class="ara-box" id="araBox" hidden aria-label="Arara Tagarela"><header><span class="ara-av">🦜</span><div><b>Arara Tagarela</b><small id="araCtx"></small></div><button id="araX" aria-label="Fechar">✕</button></header>
  <div class="ara-msgs" id="araMsgs" aria-live="polite"></div><div class="ara-chips" id="araChips"></div>
  <form class="ara-in" id="araForm"><input id="araQ" autocomplete="off" maxlength="160" placeholder="Pergunte à Arara…"><button class="bt sm" type="submit">Enviar</button></form></section>`;document.body.append(d);
  $('#araFab').onclick=()=>this.toggle();$('#araX').onclick=()=>this.toggle(false);
  $('#araForm').onsubmit=e=>{e.preventDefault();const i=$('#araQ'),t=i.value.trim();if(!t)return;i.value='';this.ask(t)};
  $('#araBox').addEventListener('click',e=>{const c=e.target.closest('[data-ac]');if(c){this.ask(c.dataset.ac,c.dataset.show);return}const o=e.target.closest('[data-qo]');if(o)this.answerQuiz(+o.dataset.qo,o)})},
 sync(){this.ensure();const cu=me()?me().id:null;if(this.uid!==cu){this.uid=cu;this.hist=[];this.bid=null;this.quiz=null;this.hl={}}const on=!!me()&&!['login','teacher'].includes(CUR);$('#ara').hidden=!on;if(!on)this.toggle(false)},
 toggle(f){this.ensure();this.open=f===undefined?!this.open:f;$('#araBox').hidden=!this.open;$('#araFab').classList.toggle('on',this.open);
  if(this.open){if(!this.hist.length)this.greet();this.paint();setTimeout(()=>$('#araQ').focus(),50)}},
 greet(){const u=me(),b=this.book();this.say(`Squawk! Oi, ${esc(u.name)}! Eu sou a <b>Arara Tagarela</b> 🦜 e adoro conversar sobre os livros!<br>${b?`Estamos no caso <b>${esc(b.title)}</b>.`:'Abra um livro na Biblioteca ou escolha um aqui embaixo.'} Posso <b>resumir</b>, dar <b>dicas</b>, explicar <b>pistas</b> e <b>missões</b> e fazer um <b>estudo dirigido</b> com você.`)},
 chips(){const b=this.book();const base=[['Resumo do livro','resumo'],['Uma dica','dica'],['Minhas pistas','pistas'],['Minhas missões','missoes'],['Estudo dirigido','estudo'],['Curiosidade','curiosidade']];
  return (b?base:[]).concat([['Trocar de livro','livros']]).map(c=>`<button data-ac="${c[1]}" data-show="${esc(c[0])}" type="button">${c[0]}</button>`).join('')},
 paint(){if(!document.getElementById('araMsgs'))return;const b=this.book();$('#araCtx').textContent=b?b.title:'Escolha um livro';
  $('#araMsgs').innerHTML=this.hist.slice(-40).map(m=>`<div class="ara-m ${m.who}">${m.who==='bot'?'<span class="ara-mav">🦜</span>':''}<div class="ara-b">${m.html}</div></div>`).join('');
  $('#araChips').innerHTML=this.chips();const el=$('#araMsgs');el.scrollTop=el.scrollHeight},
 ask(q,show){this.me_(show||q);const t=this.chips&&0;setTimeout(()=>{try{this.reply(q)}catch(e){console.error(e);this.say('Ops, minhas penas embaralharam! Tente perguntar de outro jeito.')}},320)},
 /* ---- inteligência ---- */
 reply(q){const n=norm(q),b=this.book(),has=(...a)=>a.some(x=>n.indexOf(x)>=0);
  if(this.quiz&&this.quiz.wait&&has('parar','sair','chega','encerrar')){this.quiz=null;return this.say('Combinado! Quando quiser voltar ao estudo dirigido, é só pedir. 🦜')}
  if(/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hello)\b/.test(n))return this.greet();
  if(has('obrigad','valeu','legal'))return this.say('De nada! Squawk! Investigar é muito mais divertido em dupla. 🦜');
  if(n==='livros'||has('trocar de livro','outro livro','quais livros','que livros','o que posso estudar'))return this.pick();
  const named=this.findBook(n);if(named&&named.id!==(b&&b.id)){this.bid=named.id;this.say(`Certo! Agora vamos falar de <b>${esc(named.title)}</b>.`);return this.reply(q.replace(/.*/,'resumo'))}
  if(has('resumo','resumir','resuma','resumao'))return b?this.resumo(b):this.pick();
  if(has('estudo','quiz','questionario','exercicio','treinar','praticar','perguntas para mim','me teste','me pergunte'))return b?this.estudo(b):this.pick();
  if(has('curiosidade','curioso','sabia'))return this.curio(b);
  if(has('missao','missoes','ligacao','ligacoes','quadro','progresso','como estou'))return b?this.missoes(b):this.pick();
  if(has('resposta','me diga a resposta','gabarito','entregar'))return this.say('Squawk! Entregar a resposta de mão beijada tira a graça da investigação. 😉 Mas eu dou <b>dicas</b>: peça uma dica ou use a lupa do Animail!');
  if(has('dica','ajuda','ajudar','nao sei','travei','socorro'))return b?this.dica(b):this.pick();
  if(has('pista','pistas'))return b?this.pistas(b,n):this.pick();
  /* pista citada pelo nome */
  if(b){const info=parseBook(b),pr=P(me().id,b.id),k=info.order.find(k=>n.indexOf(norm(info.clues[k].label))>=0&&norm(info.clues[k].label).length>2);if(k&&pr.clues.indexOf(k)>=0)return this.explainClue(b,k)}
  return this.search(q,b)},
 findBook(n){return visibleBooks().find(x=>{const t=norm(x.title).replace(/[^a-z0-9 ]/g,'');return t.length>5&&n.indexOf(t)>=0})},
 pick(){const bs=visibleBooks();this.say('Sobre qual livro vamos conversar?'+`<div class="ara-opts">${bs.map(x=>`<button data-ac="${esc(x.title)}" data-show="${esc(x.title)}" type="button">${esc(x.icon||(SUBJ[x.subject]||{}).i||'📖')} ${esc(x.title)}</button>`).join('')}</div>`)},
 resumo(b){const info=parseBook(b),pg=paginate(b.text),sj=SUBJ[b.subject]||SUBJ.historia;
  const lines=pg.map((p,i)=>{const s=sentences(this.plain(p.src)).filter(x=>x.length>20);const k=(s[0]||'')+(s[1]&&(s[0]||'').length<90?' '+s[1]:'');return`<li><b>${esc(p.title||'Página '+(i+1))}:</b> ${esc(k)}</li>`}).join('');
  const ks=info.order.map(k=>info.clues[k].label);
  this.say(`<b>Resumo de «${esc(b.title)}»</b> (${esc(sj.n)})<br>${esc(b.intro||'')}<ul>${lines}</ul><b>Palavras-chave do caso:</b> ${ks.map(esc).join(', ')}.<br>Quer um <b>estudo dirigido</b> sobre isso?`)},
 pistas(b,n){const info=parseBook(b),p=P(me().id,b.id),got=p.clues.filter(k=>info.clues[k]);
  if(!got.length)return this.say(`Você ainda não guardou pistas em «${esc(b.title)}». O livro tem <b>${info.order.length}</b> frases marcadas: leia e clique nelas! 📌`);
  this.say(`Você tem <b>${got.length}/${info.order.length}</b> pistas. Toque em uma para eu explicar:<div class="ara-opts">${got.map(k=>`<button data-ac="${esc(info.clues[k].label)}" data-show="${esc(info.clues[k].label)}" type="button">📌 ${esc(info.clues[k].label)}</button>`).join('')}</div>`)},
 explainClue(b,k){const info=parseBook(b),c=info.clues[k],p=P(me().id,b.id),ex=info.rels.filter(r=>(r.a===k||r.b===k));const sol=ex.filter(r=>p.links.indexOf(r.id)>=0);
  let h=`<b>📌 ${esc(c.label)}</b> (página ${c.page+1})<br>“${ctxHtml(c.ctx)}”`;
  if(sol.length)h+='<br><br>'+sol.map(r=>`🧵 Ligada a <b>${esc(info.clues[r.a===k?r.b:r.a].label)}</b>: ${esc(r.exp||r.label)}`).join('<br>');
  else if(ex.length)h+=`<br><br>Essa pista tem uma ligação escondida com outra pista do livro. Procure nas cartas do Animail a palavra «${esc(c.label)}»!`;
  this.say(h)},
 missoes(b){const info=parseBook(b),p=P(me().id,b.id),done=info.rels.filter(r=>p.links.indexOf(r.id)>=0),open=info.rels.filter(r=>p.links.indexOf(r.id)<0);
  if(!info.rels.length)return this.say('Este livro ainda não tem missões cadastradas pelo professor.');
  let h=`<b>Missões de «${esc(b.title)}»</b>: ${done.length}/${info.rels.length} resolvidas.`;
  if(done.length)h+='<ul>'+done.map(r=>`<li>✅ ${esc(r.label)}</li>`).join('')+'</ul>';
  if(open.length)h+=`<br>Faltam estas perguntas:<ul>${open.map(r=>`<li>❓ ${esc(r.q)}</li>`).join('')}</ul>Quer uma <b>dica</b>?`;else h+='<br>Caso resolvido! Parabéns, detetive! 🎉';
  this.say(h)},
 dica(b){const info=parseBook(b),p=P(me().id,b.id),open=info.rels.filter(r=>p.links.indexOf(r.id)<0);
  if(!open.length)return this.say('Você já resolveu todas as ligações deste caso! Que tal um <b>estudo dirigido</b> para revisar?');
  const key='ara:'+b.id;const lv=(this.hl[key]=(this.hl[key]||0)+1);const r=open[0],A=info.clues[r.a],B=info.clues[r.b];
  const hints=[`Comece por aqui: a pergunta é «${esc(r.q)}». As duas pistas envolvidas estão no livro, e uma delas é <b>${esc(A.label)}</b>.`,`Procure no Animail a palavra «${esc(A.label)}». A carta certa fala também da outra pista.`,`A outra pista é da página ${B.page+1}: <b>${esc(info.pages[B.page].title||'Página '+(B.page+1))}</b>. Leia essa página com calma!`,`Ligue <b>${esc(A.label)}</b> e <b>${esc(B.label)}</b> no Quadro e escolha a frase que combina com o que a carta diz. Você consegue! 💪`];
  this.say(hints[Math.min(lv-1,hints.length-1)]+(lv>=hints.length?'':'<br><small>Peça outra dica se precisar.</small>'))},
 curio(b){const u=me().id,cur=(DB.mail[u]||[]).filter(m=>m.curio&&!m.del);let pool=cur;if(b){const bm=cur.filter(m=>m.mid===b.id);if(bm.length)pool=bm}
  if(!pool.length)return this.say('Ainda não recebi curiosidades para você. Abra um livro: meus amigos do Animail vão mandar algumas!');
  const m=pool[rnd(0,pool.length-1)];this.say(`🐾 <b>${esc(m.title||m.subj)}</b> (conta ${esc(m.fromName)})<br>${(m.body||[]).filter((x,i)=>i>0).map(esc).join(' ')}`)},
 search(q,b){const ws=this.words(q);if(!ws.length)return this.help();
  const books=b?[b].concat(visibleBooks().filter(x=>x.id!==b.id)):visibleBooks();let best=[];
  books.forEach(bk=>this.sents(bk).forEach(s=>{const nt=norm(s.t);let sc=0;ws.forEach(w=>{if(nt.indexOf(w)>=0)sc+=w.length>4?2:1});if(sc)best.push({s,sc:sc+(b&&bk.id===b.id?.5:0)})}));
  const cur=(DB.mail[me().id]||[]).filter(m=>m.curio);cur.forEach(m=>{const t=(m.body||[]).join(' ');const nt=norm(t+' '+(m.title||''));let sc=0;ws.forEach(w=>{if(nt.indexOf(w)>=0)sc+=2});if(sc)best.push({s:{t:t.replace(/^Olá[^!]*!\s*/,''),pg:0,pt:'',b:null,from:m},sc})});
  best.sort((x,y)=>y.sc-x.sc);const top=best.slice(0,2);
  if(!top.length)return this.help(`Hmm, não achei nada sobre «${esc(q)}» nos livros. `);
  this.say('Olha o que encontrei:<br>'+top.map(x=>x.s.from?`🐾 <b>${esc(x.s.from.title||x.s.from.subj)}</b> (${esc(x.s.from.fromName)}): ${esc(x.s.t)}`:`📖 Em <b>${esc(x.s.b.title)}</b>, página ${x.s.pg}${x.s.pt?' («'+esc(x.s.pt)+'»)':''}: “${esc(x.s.t)}”`).join('<br><br>'))},
 help(pre){this.say((pre||'')+'Eu sei <b>resumir</b> o livro, dar <b>dicas</b>, explicar suas <b>pistas</b> e <b>missões</b>, contar <b>curiosidades</b> e fazer <b>estudo dirigido</b>. Também respondo perguntas sobre o que está nos livros, como “quem eram os Tupis?”.')},
 /* ---- estudo dirigido ---- */
 estudo(b){const info=parseBook(b);const pool=info.order.map(k=>info.clues[k]).filter(c=>c.ctx&&c.ctx.indexOf('\u0001')>=0);
  if(pool.length<3)return this.say('Este livro tem poucas pistas para montar um estudo. Leia um pouco mais ou peça um resumo!');
  const qs=shuffle(pool).slice(0,Math.min(5,pool.length)).map(c=>{const opts=shuffle([c].concat(shuffle(pool.filter(x=>x.key!==c.key)).slice(0,3)));
   return{kind:'blank',ctx:(()=>{let d=false;return c.ctx.replace(/\u0001(.+?)\u0002/g,(m,t)=>{if(!d&&t.trim()===c.text){d=true;return'_____'}return t})})(),ans:opts.findIndex(o=>o.key===c.key),opts:opts.map(o=>o.text),page:c.page+1,label:c.label}});
  this.quiz={b:b.id,qs,i:0,ok:0,wait:false};this.say(`<b>Estudo dirigido</b> de «${esc(b.title)}»: ${qs.length} perguntas. Complete as frases do livro! Para parar, digite “parar”.`);this.nextQ()},
 nextQ(){const z=this.quiz;if(!z)return;if(z.i>=z.qs.length){const pct=Math.round(100*z.ok/z.qs.length);const msg=pct===100?'Perfeito! Você é um detetive de primeira! 🏆':pct>=60?'Muito bem! Mais uma leitura e fica perfeito. 📚':'Vamos reler o livro? Peça um resumo para revisar. 💪';this.say(`<b>Resultado:</b> ${z.ok}/${z.qs.length}. ${msg}`);this.quiz=null;return}
  const q=z.qs[z.i];z.wait=true;this.say(`<b>${z.i+1}/${z.qs.length}</b> — Complete a frase:<br>“${esc(q.ctx)}”<div class="ara-opts q">${q.opts.map((o,j)=>`<button data-qo="${j}" type="button">${esc(o)}</button>`).join('')}</div>`)},
 answerQuiz(j,btn){const z=this.quiz;if(!z||!z.wait)return;const q=z.qs[z.i];z.wait=false;const ok=j===q.ans;if(ok){z.ok++;Snd.play('ok')}else Snd.play('bad');
  this.me_(q.opts[j]);this.say((ok?'✅ Isso mesmo! ':`❌ Quase! A resposta era <b>${esc(q.opts[q.ans])}</b>. `)+`<small>(página ${q.page} do livro)</small>`);z.i++;setTimeout(()=>this.nextQ(),500)}
};

/* ---------- início ---------- */
(function boot(){
 applyRoomHash();
 if(DB.session===TEST_ID){DB.session=null;save()}
 if(DB.session&&DB.users[DB.session]){afterLogin();go('lib')}else go('login');
 loadRepoConfig().then(()=>{if(CUR==='lib')go('lib');if(CUR==='login')go('login');if(me())afterLogin()});
 if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();

