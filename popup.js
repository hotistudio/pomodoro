const CIRC = 490;
let CFG = { focus:25, short:5, long:15, sessions:4, growSteps:2 };
let mode='focus', timeLeft=CFG.focus*60, totalTime=CFG.focus*60;
let running=false, iv=null;
let completedSessions=0, todaySessions=0, todayFocus=0;
let coins=20, growProgress=0, selectedPlantId='oak', colFilter='all';
let forestPlants=[];
let audioCtx=null;

let tags=[{name:'공부',sessions:22},{name:'업무',sessions:12},{name:'독서',sessions:4}];

const PLANTS=[
  {id:'oak',name:'참나무',type:'tree',rarity:'common',cost:0,stages:['seed','sprout','sapling','tree'],unlocked:true},
  {id:'cherry',name:'벚나무',type:'tree',rarity:'rare',cost:30,stages:['seed','sprout','sapling','tree'],unlocked:false},
  {id:'pine',name:'소나무',type:'tree',rarity:'common',cost:15,stages:['seed','sprout','sapling','tree'],unlocked:false},
  {id:'maple',name:'단풍나무',type:'tree',rarity:'rare',cost:40,stages:['seed','sprout','sapling','tree'],unlocked:false},
  {id:'rose',name:'장미',type:'flower',rarity:'common',cost:10,stages:['seed','bud','bloom','fullbloom'],unlocked:false},
  {id:'sunflower',name:'해바라기',type:'flower',rarity:'common',cost:12,stages:['seed','bud','bloom','fullbloom'],unlocked:false},
  {id:'lotus',name:'연꽃',type:'flower',rarity:'legend',cost:80,stages:['seed','bud','bloom','fullbloom'],unlocked:false},
  {id:'lavender',name:'라벤더',type:'flower',rarity:'rare',cost:35,stages:['seed','bud','bloom','fullbloom'],unlocked:false},
  {id:'cosmos',name:'코스모스',type:'flower',rarity:'common',cost:8,stages:['seed','bud','bloom','fullbloom'],unlocked:false},
];
const PC={
  oak:{trunk:'#854f0b',leaf:'#3b6d11',leaf2:'#639922'},
  cherry:{trunk:'#712b13',leaf:'#d4537e',leaf2:'#ed93b1'},
  pine:{trunk:'#633806',leaf:'#085041',leaf2:'#0f6e56'},
  maple:{trunk:'#854f0b',leaf:'#d85a30',leaf2:'#ef9f27'},
  rose:{stem:'#3b6d11',petal:'#d4537e',petal2:'#f4c0d1',center:'#ef9f27'},
  sunflower:{stem:'#3b6d11',petal:'#ef9f27',petal2:'#ba7517',center:'#633806'},
  lotus:{stem:'#0f6e56',petal:'#ed93b1',petal2:'#f4c0d1',center:'#ef9f27'},
  lavender:{stem:'#3b6d11',petal:'#afa9ec',petal2:'#7f77dd',center:'#534ab7'},
  cosmos:{stem:'#3b6d11',petal:'#f0997b',petal2:'#d85a30',center:'#ef9f27'},
};
function pdata(id){return PLANTS.find(p=>p.id===id);}
const ns='http://www.w3.org/2000/svg';
function se(tag,attrs){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}

function drawPlant(root,plantId,stage,size){
  root.innerHTML='';
  const s=size||60,cx=s/2,by=s,c=PC[plantId]||PC.oak,p=pdata(plantId),isFlower=p&&p.type==='flower';
  if(stage==='seed'){root.appendChild(se('ellipse',{cx,cy:by-6,rx:6,ry:4,fill:c.trunk||c.stem}));return;}
  if(!isFlower){
    const h={sprout:10,sapling:22,tree:38}[stage]||38,tw=stage==='sprout'?2:stage==='sapling'?3:5;
    root.appendChild(se('rect',{x:cx-tw/2,y:by-h,width:tw,height:h,rx:2,fill:c.trunk}));
    if(stage==='sprout') root.appendChild(se('ellipse',{cx,cy:by-h-5,rx:7,ry:6,fill:c.leaf}));
    else if(stage==='sapling') [[cx,by-h-8,9,7],[cx-6,by-h,6,5],[cx+6,by-h,6,5]].forEach(([ex,ey,rx,ry])=>root.appendChild(se('ellipse',{cx:ex,cy:ey,rx,ry,fill:c.leaf})));
    else [[cx,by-h-11,14,11,0],[cx-10,by-h-2,10,8,1],[cx+10,by-h-2,10,8,0],[cx-5,by-h+6,8,6,1],[cx+5,by-h+6,8,6,0]].forEach(([ex,ey,rx,ry,alt])=>root.appendChild(se('ellipse',{cx:ex,cy:ey,rx,ry,fill:alt?c.leaf2:c.leaf})));
  }else{
    const h={bud:14,bloom:26,fullbloom:38}[stage]||26;
    root.appendChild(se('rect',{x:cx-2,y:by-h,width:3,height:h,rx:1,fill:c.stem}));
    if(stage==='bud') root.appendChild(se('ellipse',{cx,cy:by-h,rx:5,ry:8,fill:c.petal}));
    else{
      const pc=stage==='bloom'?5:8,pr=stage==='bloom'?6:9,dist=stage==='bloom'?5:8;
      for(let i=0;i<pc;i++){
        const a=(i/pc)*Math.PI*2,pe=se('ellipse',{cx:cx+Math.cos(a)*dist,cy:(by-h)+Math.sin(a)*dist,rx:pr,ry:Math.round(pr*0.55),fill:i%2===0?c.petal:c.petal2});
        pe.setAttribute('transform',`rotate(${a*180/Math.PI+90},${cx+Math.cos(a)*dist},${(by-h)+Math.sin(a)*dist})`);
        root.appendChild(pe);
      }
      root.appendChild(se('circle',{cx,cy:by-h,r:stage==='bloom'?3:5,fill:c.center}));
    }
  }
}

function currentStage(){
  const p=pdata(selectedPlantId);
  return p.stages[Math.min(Math.floor(growProgress/(100/CFG.growSteps)),p.stages.length-1)];
}
function updateLivePlant(){
  drawPlant(document.getElementById('live-plant'),selectedPlantId,currentStage(),60);
  const p=pdata(selectedPlantId);
  document.getElementById('live-plant-name').textContent=p.name;
  const sn={seed:'씨앗 단계',sprout:'새싹 단계',sapling:'묘목 단계',tree:'완성 단계',bud:'봉오리 단계',bloom:'개화 단계',fullbloom:'만개 단계'};
  document.getElementById('live-stage').textContent=sn[currentStage()]||'';
  document.getElementById('grow-bar').style.width=growProgress+'%';
  const left=CFG.growSteps-Math.floor(growProgress/(100/CFG.growSteps));
  document.getElementById('grow-hint').textContent=growProgress>=100?'완성! 숲에 심어졌어요':`완성까지 ${left}번 더!`;
}

function playSound(type){
  if(!document.getElementById('toggle-sound').classList.contains('on'))return;
  try{
    if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    const notes=type==='focus'?[523,659,784,1047]:type==='short'?[784,659]:[523,659,523];
    notes.forEach((freq,i)=>{
      const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
      osc.connect(gain);gain.connect(audioCtx.destination);osc.type='sine';osc.frequency.value=freq;
      const t=audioCtx.currentTime+i*0.18;
      gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(0.18,t+0.04);gain.gain.exponentialRampToValueAtTime(0.001,t+0.38);
      osc.start(t);osc.stop(t+0.4);
    });
  }catch(e){}
}

function switchTab(name){
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',['timer','stats','collection','forest','settings'][i]===name));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  if(name==='collection')renderCollection();
  if(name==='forest')renderForest();
  if(name==='stats'){renderTagList();renderHeatmap();}
}
function setMode(m,btn){
  if(running)return; mode=m;
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const mins=m==='focus'?CFG.focus:m==='short'?CFG.short:CFG.long;
  timeLeft=mins*60;totalTime=mins*60;updateDisplay();
  document.getElementById('timer-label').textContent={focus:'집중 시간',short:'짧은 휴식',long:'긴 휴식'}[m];
  updateRing(1);
  saveState();
}
function toggleTimer(){
  running=!running;document.getElementById('start-btn').textContent=running?'일시정지':'시작';
  if(running) iv=setInterval(tick,1000); else clearInterval(iv);
}
function resetTimer(){
  running=false;clearInterval(iv);document.getElementById('start-btn').textContent='시작';
  const mins=mode==='focus'?CFG.focus:mode==='short'?CFG.short:CFG.long;
  timeLeft=mins*60;totalTime=mins*60;updateDisplay();updateRing(1);
}
function tick(){
  timeLeft--;updateDisplay();updateRing(timeLeft/totalTime);
  if(timeLeft<=0){
    clearInterval(iv);running=false;document.getElementById('start-btn').textContent='시작';
    playSound(mode);
    if(mode==='focus'){
      completedSessions++;todaySessions++;todayFocus+=CFG.focus;coins+=5;
      growProgress=Math.min(100,growProgress+100/CFG.growSteps);
      updateSummary();updateDots();updateLivePlant();
      if(growProgress>=100){
        forestPlants.push({plantId:selectedPlantId,x:Math.round(10+Math.random()*316),y:Math.round(40+Math.random()*100)});
        growProgress=0;showToast('식물이 숲에 심어졌어요!');
      }else showToast('+5 코인 획득!');
      saveState();
      const auto=document.getElementById('toggle-auto').classList.contains('on'),isLong=completedSessions%CFG.sessions===0;
      setTimeout(()=>{
        setMode(isLong?'long':'short',document.querySelectorAll('.mode-btn')[isLong?2:1]);
        if(auto){running=true;document.getElementById('start-btn').textContent='일시정지';iv=setInterval(tick,1000);}
      },300);
    }else{
      const auto=document.getElementById('toggle-auto').classList.contains('on');
      setTimeout(()=>{
        setMode('focus',document.querySelectorAll('.mode-btn')[0]);
        if(auto){running=true;document.getElementById('start-btn').textContent='일시정지';iv=setInterval(tick,1000);}
      },300);
    }
  }
}
function updateDisplay(){const m=Math.floor(timeLeft/60),s=timeLeft%60;document.getElementById('timer-display').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
function updateRing(r){document.getElementById('ring').style.strokeDashoffset=CIRC*(1-r);}
function updateSummary(){
  document.getElementById('today-sessions').textContent=todaySessions;
  document.getElementById('today-focus').textContent=todayFocus+'분';
  document.getElementById('coins-display').textContent=coins;
}
function updateDots(){
  const el=document.getElementById('dots');el.innerHTML='';
  const pos=completedSessions%CFG.sessions;
  for(let i=0;i<CFG.sessions;i++){
    const d=document.createElement('div');d.className='dot';
    if(i<pos)d.classList.add('done');
    else if(i===pos&&mode==='focus')d.classList.add('current');
    el.appendChild(d);
  }
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function applySettings(){
  CFG.focus=Math.max(1,parseInt(document.getElementById('set-focus').value)||25);
  CFG.short=Math.max(1,parseInt(document.getElementById('set-short').value)||5);
  CFG.long=Math.max(1,parseInt(document.getElementById('set-long').value)||15);
  CFG.sessions=Math.max(2,parseInt(document.getElementById('set-sessions').value)||4);
  CFG.growSteps=Math.max(1,parseInt(document.getElementById('set-grow').value)||2);
  document.getElementById('grow-sub').textContent=`현재: ${CFG.growSteps}번 = 나무 1그루`;
  resetTimer();updateDots();updateLivePlant();saveState();
}

/* Stats */
let barChart=null;
function initStats(){
  const isDark=matchMedia('(prefers-color-scheme: dark)').matches;
  const tc=isDark?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.4)',gc=isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.06)';
  barChart=new Chart(document.getElementById('barChart'),{
    type:'bar',data:{labels:['월','화','수','목','금','토','일'],datasets:[{label:'집중',data:[125,100,150,75,200,50,175],backgroundColor:'#e24b4a',borderRadius:3}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:tc,font:{size:10}},grid:{color:gc},border:{display:false}},y:{ticks:{color:tc,font:{size:10},maxTicksLimit:4},grid:{color:gc},border:{display:false}}}}
  });
  renderTagList();renderHeatmap();
}
function renderTagList(){
  const tl=document.getElementById('tag-list');tl.innerHTML='';
  const total=tags.reduce((s,t)=>s+t.sessions,0)||1;
  tags.forEach((tag,idx)=>{
    const pct=Math.round(tag.sessions/total*100);
    const row=document.createElement('div');row.className='tag-row';
    row.innerHTML=`<span class="tag-name">${tag.name}</span><div class="tag-bar-wrap"><div class="tag-bar" style="width:${pct}%"></div></div><span class="tag-pct">${pct}%</span><button class="tag-del" onclick="deleteTag(${idx})">×</button>`;
    tl.appendChild(row);
  });
}
function addTag(){
  const input=document.getElementById('tag-input'),name=input.value.trim();
  if(!name)return;
  if(tags.find(t=>t.name===name)){showToast('이미 있는 태그예요');return;}
  tags.push({name,sessions:0});input.value='';renderTagList();showToast('"'+name+'" 추가!');saveState();
}
function deleteTag(idx){const n=tags[idx].name;tags.splice(idx,1);renderTagList();showToast('"'+n+'" 삭제');saveState();}
function renderHeatmap(){
  const hm=document.getElementById('heatmap');hm.innerHTML='';
  const levels=['var(--bg2)','#f7c1c199','#f7c1c1bb','#f09595dd','#e24b4a'];
  for(let i=0;i<28;i++){const v=Math.floor(Math.random()*5);const cell=document.createElement('div');cell.className='heat-cell';cell.style.background=levels[v];hm.appendChild(cell);}
}
function setPeriod(p,btn){
  document.querySelectorAll('.period-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  barChart.data.labels=p==='week'?['월','화','수','목','금','토','일']:['1주','2주','3주','4주'];
  barChart.data.datasets[0].data=p==='week'?[125,100,150,75,200,50,175]:[520,680,430,750];barChart.update();
}

/* Collection */
function renderCollection(){
  document.getElementById('coins-col').textContent=coins;
  const grid=document.getElementById('col-grid');grid.innerHTML='';
  (colFilter==='all'?PLANTS:PLANTS.filter(p=>p.type===colFilter)).forEach(p=>{
    const card=document.createElement('div');
    card.className='plant-card'+(p.unlocked?'':' locked')+(p.id===selectedPlantId?' selected':'');
    const svg=document.createElementNS(ns,'svg');svg.setAttribute('width','48');svg.setAttribute('height','48');svg.setAttribute('viewBox','0 0 48 48');
    drawPlant(svg,p.id,p.unlocked?p.stages[3]:'seed',48);
    const rc={common:'r-common',rare:'r-rare',legend:'r-legend'}[p.rarity],rl={common:'일반',rare:'희귀',legend:'전설'}[p.rarity];
    card.innerHTML=`<span class="rarity-badge ${rc}">${rl}</span>`;
    card.appendChild(svg);
    card.innerHTML+=`<div class="plant-card-name">${p.name}</div>`;
    if(!p.unlocked)card.innerHTML+=`<div class="unlock-cost">${p.cost}코인</div>`;
    else if(p.id===selectedPlantId)card.innerHTML+=`<div class="selected-hint">선택됨</div>`;
    card.onclick=()=>{
      if(!p.unlocked){
        if(coins>=p.cost){coins-=p.cost;p.unlocked=true;selectedPlantId=p.id;growProgress=0;showToast(p.name+' 해금!');renderCollection();updateLivePlant();updateSummary();saveState();}
        else showToast('코인이 부족해요');
      }else{selectedPlantId=p.id;growProgress=0;renderCollection();updateLivePlant();saveState();}
    };
    grid.appendChild(card);
  });
}
function filterCol(f,btn){colFilter=f;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderCollection();}

/* Forest */
function renderForest(){
  const svg=document.getElementById('forest-svg'),empty=document.getElementById('forest-empty');
  document.getElementById('forest-sub').textContent=forestPlants.length?forestPlants.length+'그루의 식물이 자라고 있어요':'완료한 세션이 식물이 됩니다';
  if(!forestPlants.length){svg.style.display='none';empty.style.display='block';return;}
  svg.style.display='block';empty.style.display='none';svg.innerHTML='';
  const W=336,H=180,groundY=H-25;
  svg.appendChild(se('rect',{x:0,y:0,width:W,height:groundY,fill:'#fbeaf0'}));
  svg.appendChild(se('rect',{x:0,y:groundY,width:W,height:H-groundY,fill:'#c0dd97'}));
  svg.appendChild(se('ellipse',{cx:W/2,cy:groundY,rx:W/2+10,ry:8,fill:'#97c459'}));
  [...forestPlants].sort((a,b)=>a.y-b.y).forEach(fp=>{
    const scale=0.5+((fp.y-40)/100)*0.5,sz=Math.round(48*scale);
    const g=document.createElementNS(ns,'svg');
    g.setAttribute('x',Math.round(fp.x-sz/2));g.setAttribute('y',Math.round(groundY-sz));
    g.setAttribute('width',sz);g.setAttribute('height',sz);g.setAttribute('viewBox',`0 0 ${sz} ${sz}`);
    drawPlant(g,fp.plantId,pdata(fp.plantId).stages[3],sz);svg.appendChild(g);
  });
}

/* Persistence — chrome.storage.local */
function saveState(){
  const state={CFG,coins,growProgress,selectedPlantId,forestPlants,tags,todaySessions,todayFocus,completedSessions,
    unlockedPlants:PLANTS.filter(p=>p.unlocked).map(p=>p.id)};
  if(typeof chrome!=='undefined'&&chrome.storage)chrome.storage.local.set({pomodoroState:state});
  else localStorage.setItem('pomodoroState',JSON.stringify(state));
}
function loadState(){
  function apply(state){
    if(!state)return;
    if(state.CFG)Object.assign(CFG,state.CFG);
    if(state.coins!=null)coins=state.coins;
    if(state.growProgress!=null)growProgress=state.growProgress;
    if(state.selectedPlantId)selectedPlantId=state.selectedPlantId;
    if(state.forestPlants)forestPlants=state.forestPlants;
    if(state.tags)tags=state.tags;
    if(state.todaySessions)todaySessions=state.todaySessions;
    if(state.todayFocus)todayFocus=state.todayFocus;
    if(state.completedSessions)completedSessions=state.completedSessions;
    if(state.unlockedPlants)state.unlockedPlants.forEach(id=>{const p=pdata(id);if(p)p.unlocked=true;});
    document.getElementById('set-focus').value=CFG.focus;
    document.getElementById('set-short').value=CFG.short;
    document.getElementById('set-long').value=CFG.long;
    document.getElementById('set-sessions').value=CFG.sessions;
    document.getElementById('set-grow').value=CFG.growSteps;
    document.getElementById('grow-sub').textContent=`현재: ${CFG.growSteps}번 = 나무 1그루`;
    const mins=mode==='focus'?CFG.focus:mode==='short'?CFG.short:CFG.long;
    timeLeft=mins*60;totalTime=mins*60;
    updateDisplay();updateRing(1);updateDots();updateSummary();updateLivePlant();
  }
  if(typeof chrome!=='undefined'&&chrome.storage){
    chrome.storage.local.get(['pomodoroState'],res=>apply(res.pomodoroState));
  }else{
    try{apply(JSON.parse(localStorage.getItem('pomodoroState')));}catch(e){}
  }
}

document.getElementById('tag-input').addEventListener('keydown',e=>{if(e.key==='Enter')addTag();});

/* Init */
loadState();
setTimeout(initStats,80);
</script>
