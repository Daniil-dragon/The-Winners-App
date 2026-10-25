
'use strict';
let explored=0,toneAnswer=null,tonePlayed=false;
const semanticParts={'清':'氵 — вода','请':'讠 — речь','情':'忄 — сердце, чувства','晴':'日 — солнце','妈':'女 — женщина','吗':'口 — рот','码':'石 — камень','骂':'口 — рот','河':'氵 — вода','湖':'氵 — вода','抱':'扌 — рука','跑':'足 — нога','泡':'氵 — вода','炮':'火 — огонь','抄':'扌 — рука','秒':'禾 — злак','钞':'钅 — металл','烧':'火 — огонь','绕':'纟 — нить'};
const toneExamples=DB.families.flatMap(f=>[{hanzi:f.root,pinyin:f.pinyin},...f.examples.map(x=>({hanzi:x.hanzi,pinyin:x.pinyin}))]).filter(x=>getReading(x.hanzi)&&toneFile(x.pinyin));
function toneOf(p){const m=toneFile(p)?.match(/[1-5]$/);return m?+m[0]:5}
function toneBase(p){return toneFile(p)?.replace(/[1-5]$/,'')||''}
function renderToneEdu(){
 const t=edu.tone,q=toneExamples[t.index%toneExamples.length],answer=toneOf(q.pinyin);
 eduPart().innerHTML='<div class="panel study"><h2>Тренировка тонов</h2><p class="hint">Прослушай слог, затем выбери услышанный тон. Мы тренируем отдельные слоги, а не тоновые изменения в предложениях.</p><p class="muted">Верных ответов: '+t.correct+' из '+t.total+'</p><button class="btn" id="eduPlay">▶ Слушать</button><div class="quiz-options">'+['1-й — высокий ровный','2-й — восходящий','3-й — низкий','4-й — нисходящий','Нейтральный'].map((label,i)=>'<button data-edu-tone="'+(i+1)+'" '+(toneAnswer!==null?'disabled':'')+'>'+label+'</button>').join('')+'</div>'+(toneAnswer!==null?'<p><b>Ответ: '+escapeHtml(q.pinyin)+'</b>. '+(toneAnswer===answer?'Правильно!':'Не совпало. Попробуй следующую запись.')+'</p><button class="btn good" id="eduToneNext">Дальше →</button>':'')+'<p class="hint">Если запись не воспроизводится, не оценивай ответ: выбери следующий слог.</p><button class="btn alt" id="eduToneSkip">Пропустить запись</button></div>';
 eduBtn('eduPlay',()=>{tonePlayed=true;speak(q.hanzi,'syllable')});
 document.querySelectorAll('[data-edu-tone]').forEach(b=>b.onclick=()=>{if(toneAnswer!==null)return;if(!tonePlayed){alert('Сначала нажми «Слушать». Если запись не работает, используй «Пропустить».');return}toneAnswer=+b.dataset.eduTone;t.total++;if(toneAnswer===answer)t.correct++;scoreSkill(q.hanzi,'tone',toneAnswer===answer);eduSave();renderToneEdu()});
 const next=()=>{t.index++;toneAnswer=null;tonePlayed=false;eduSave();renderToneEdu()};
 eduBtn('eduToneNext',next);eduBtn('eduToneSkip',next);
}
function renderFamilyEdu(){
 const f=DB.families[explored],base=toneBase(f.pinyin);
 const cards=f.examples.map(x=>{const same=toneBase(x.pinyin)===base,match=toneOf(x.pinyin)===toneOf(f.pinyin);
 return '<div style="border:1px solid #dce2ed;border-radius:16px;padding:12px"><div class="flex"><span class="char">'+x.hanzi+'</span><b>'+escapeHtml(x.pinyin)+'</b></div><p>'+escapeHtml(x.meaning)+'</p>'+(semanticParts[x.hanzi]?'<p class="hint">Смысловой компонент: '+escapeHtml(semanticParts[x.hanzi])+'</p>':'')+'<p class="hint">'+(same?(match?'Тот же слог и тон':'Тот же слог, другой тон'):'Произношение отличается')+'</p><button class="btn alt" data-family-hear="'+x.hanzi+'">▶ Слушать</button><button class="btn alt" data-family-write="'+x.hanzi+'">✍ Прописи</button></div>'}).join('');
 eduPart().innerHTML='<div class="panel"><h2>Фонетические семейства: сравнение</h2><p class="hint">Фонетик подсказывает приблизительное звучание, но не всегда тон. Сравни произношение, значения и написание знаков.</p><select id="eduFamily">'+DB.families.map((x,i)=>'<option value="'+i+'" '+(i===explored?'selected':'')+'>'+x.root+' · '+x.pinyin+'</option>').join('')+'</select><div class="panel study"><div class="herochar">'+f.root+'</div><h3>'+escapeHtml(f.pinyin)+' — '+escapeHtml(f.meaning)+'</h3><button class="btn alt" id="eduRootSound">▶ Основной слог</button></div><div class="grid">'+cards+'</div><p class="hint">Фонетическая часть помогает со звучанием, а значение обычно уточняют другие компоненты и контекст. Для части примеров обозначен смысловой компонент; остальные требуют отдельного разбора.</p></div>';
 document.getElementById('eduFamily').onchange=e=>{explored=+e.target.value;renderFamilyEdu()};
 eduBtn('eduRootSound',()=>speak(f.root,'syllable'));
 document.querySelectorAll('[data-family-hear]').forEach(b=>b.onclick=()=>speak(b.dataset.familyHear,'character'));
 document.querySelectorAll('[data-family-write]').forEach(b=>b.onclick=()=>goWrite(b.dataset.familyWrite));
}
const newTabs=[['course','🎓 Курс'],['tones','🎵 Тоны'],['explore','Семейства+'],['skills','Навыки']];
const nav=document.getElementById('tabs');
nav.addEventListener('click',event=>{const tab=event.target.closest('[data-tab]');if(tab?.dataset.tab==='course'&&state.tab==='radicals'&&[1,2,3].includes(Number(state.group))){chooseCourseGroup(Number(state.group))}},true);
for(const [tab,label] of newTabs){const b=document.createElement('button');b.className='tab';b.dataset.tab=tab;b.textContent=label;nav.appendChild(b)}

const reviewModeSets=['due','all','1','2','3','families'];
let reviewSeen=new Set();
function recallPool(){
 if(state.studySet==='families')return DB.families.map((f,i)=>({key:'f'+i,char:f.root,meaning:f.meaning,reading:f.pinyin,info:f.examples.map(x=>x.hanzi).join(' · '),family:true}));
 let candidates=DB.radicals.filter(r=>stat('r'+r.id)>0||edu.skills[r.display+'|meaning']);
 if(['1','2','3'].includes(state.studySet))candidates=candidates.filter(r=>r.group===Number(state.studySet));
 if(state.studySet==='due'||state.studySet==='review'||state.studySet==='all'){
  candidates=candidates.filter(r=>{const e=edu.skills[r.display+'|meaning'];return state.studySet==='all'||!e||e.due<=Date.now()});
 }
 return candidates.filter(r=>!reviewSeen.has('r'+r.id)).map(r=>({key:'r'+r.id,char:r.display,meaning:r.meaning,reading:r.group!==1?(r.pinyin||getReading(r.display)||''):'',info:'Ключ № '+r.id+' · '+G[r.group],family:false}));
}
renderStudy=function(){
 const pool=recallPool();
 if(state.current>=pool.length)state.current=0;
 const x=pool[state.current];
 const options=[['due','Пора повторить'],['all','Все начатые'],['1','Группа 1'],['2','Группа 2'],['3','Группа 3'],['families','Фонетические семейства']];
 $('#app').innerHTML='<div class="panel study"><h2>Карточки и повторение</h2>'+styleControl()+
 '<p class="hint">Здесь вспоминаем ранее изученные графемы. Карточка не является экзаменом: оценка «Вспомнила» или «Пока трудно» планирует следующее повторение. Для проверки без подсказок используй раздел «Проверка».</p>'+
 '<div class="filters"><select id="studyset">'+options.map(([v,t])=>'<option value="'+v+'" '+(state.studySet===v?'selected':'')+'>'+t+'</option>').join('')+'</select></div>'+
 '<p class="muted">Карточек в наборе: '+pool.length+'</p>'+
 (x?'<p class="muted">Карточка '+(state.current+1)+' из '+pool.length+'</p><div class="herochar">'+x.char+'</div>'+
 (state.revealed?'<h2>'+escapeHtml(x.meaning)+'</h2><p class="hint">'+escapeHtml(x.info)+(x.reading?' · '+escapeHtml(x.reading):'')+'</p>':'<p class="hint">Вспомни значение. Ответ скрыт до твоего решения.</p>')+
 '<div class="flex" style="justify-content:center"><button class="btn alt" id="studySound">▶ Слушать</button><button class="btn" id="studyFlip">'+(state.revealed?'Скрыть ответ':'Показать ответ')+'</button></div>'+
 (state.revealed?'<div class="flex" style="justify-content:center;margin-top:14px"><button class="btn bad" id="studyAgain">Пока трудно</button><button class="btn good" id="studyRemember">Вспомнила</button></div>':'')+
 '<div class="flex" style="justify-content:center"><button class="btn alt" id="studyPrev">← Назад</button><button class="btn alt" id="studyNext">Дальше →</button></div>':
 '<div class="empty">В этом наборе пока нет карточек. Начни изучать графемы в «Курсе» или выбери другой набор.</div>')+
 '<button class="btn alt" id="studyGoCourse">🎓 К изучению новых графем</button></div>';
 initStyleControl();
 document.getElementById('studyset').onchange=e=>{state.studySet=e.target.value;state.current=0;state.revealed=false;reviewSeen.clear();renderStudy()};
 document.getElementById('studyGoCourse').onclick=()=>{state.tab='course';render()};
 if(!x)return;
 const next=()=>{state.current++;state.revealed=false;renderStudy()};
 document.getElementById('studyFlip').onclick=()=>{state.revealed=!state.revealed;renderStudy()};
 document.getElementById('studyNext').onclick=next;
 document.getElementById('studyPrev').onclick=()=>{state.current=Math.max(0,state.current-1);state.revealed=false;renderStudy()};
 document.getElementById('studySound').onclick=()=>speak(x.char);
 if(state.revealed){
  const score=correct=>{
   if(!x.family)scoreSkill(x.char,'meaning',correct);
   else{progress[x.key]=correct?2:1;save()}
   reviewSeen.add(x.key);next();
  };
  document.getElementById('studyAgain').onclick=()=>score(false);
  document.getElementById('studyRemember').onclick=()=>score(true);
 }
};

const originalRender=render;
render=function(){
 if(state.tab==='review')state.tab='study';
 if(['course','tones','explore','skills'].includes(state.tab)){
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===state.tab));stats();
  if(state.tab==='course')renderLesson();
  if(state.tab==='tones')renderToneEdu();
  if(state.tab==='explore')renderFamilyEdu();
  if(state.tab==='skills')renderEduStats();
  return;
 }
 originalRender();
};
const originalSaveWriting=saveWriteProgress;
saveWriteProgress=function(){
 originalSaveWriting();
 const ch=state.writeChar,record=writeProgress[ch];
 if(record&&record.count>0)scoreSkill(ch,'writing',record.last<=2);
};
