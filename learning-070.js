
'use strict';
const EDU_KEY='hanzi_edu_v1';
let edu={skills:{},lesson:{index:0,step:0},tone:{index:0,correct:0,total:0}};
try{edu={...edu,...JSON.parse(localStorage.getItem(EDU_KEY)||'{}')}}catch(e){}
edu.skills||={};edu.lesson||={index:0,step:0};edu.tone||={index:0,correct:0,total:0};
const eduSave=()=>localStorage.setItem(EDU_KEY,JSON.stringify(edu));
const days=[1,3,7,14,30,60];
const sessionSkipped=new Set();
function scoreSkill(c,k,ok){
 const id=c+'|'+k,old=edu.skills[id]||{streak:0,tries:0};
 const streak=ok?old.streak+1:0;
 edu.skills[id]={streak,tries:old.tries+1,due:ok?Date.now()+days[Math.min(streak-1,5)]*86400000:Date.now()};
 eduSave();
}
const skillTitle={meaning:'Значение',writing:'Написание',tone:'Произношение'};
const eduPart=()=>document.getElementById('app');
const eduBtn=(id,fn)=>{const b=document.getElementById(id);if(b)b.onclick=fn};

function groupRadicals(g){return DB.radicals.filter(r=>r.group===Number(g))}
function initCourseGroups(){
 const l=edu.lesson;
 if(!l.positions||typeof l.positions!=='object')l.positions={};
 if(![1,2,3].includes(Number(l.group))){
   l.group=DB.radicals[l.index]?.group||1;
 }
 if(!l.positions[l.group])l.positions[l.group]={index:l.index||0,step:l.step||0,completed:false};
 for(const g of [1,2,3]){
   const pool=groupRadicals(g);
   const pos=l.positions[g];
   if(!pos||!pool.some(r=>r.id-1===pos.index))l.positions[g]={index:pool[0].id-1,step:0,completed:false};
 }
 let p=l.positions[l.group];
 l.index=p.index;l.step=p.step;
}
function saveGroupCourse(){
 const l=edu.lesson;
 l.positions[l.group]={index:l.index,step:l.step,completed:!!l.completed};
 eduSave();
}
function chooseCourseGroup(g){
 g=Number(g);if(![1,2,3].includes(g))return;
 saveGroupCourse();
 const l=edu.lesson;l.group=g;
 const p=l.positions[g]||{index:groupRadicals(g)[0].id-1,step:0,completed:false};
 l.index=p.index;l.step=p.step;l.completed=!!p.completed;
 saveGroupCourse();renderLesson();
}
function nextLesson(){
 const l=edu.lesson,r=DB.radicals[l.index],pool=groupRadicals(l.group);
 l.step++;
 if(l.step===3&&r.group===1)l.step++;
 if(l.step>=6){
  const idx=pool.findIndex(x=>x.id-1===l.index);
  if(idx>=pool.length-1){l.step=5;l.completed=true}
  else {l.step=0;l.index=pool[idx+1].id-1;l.completed=false}
 }
 saveGroupCourse();renderLesson();
}
function renderLesson(){
 initCourseGroups();
 const l=edu.lesson,pool=groupRadicals(l.group),r=DB.radicals[l.index],position=pool.findIndex(x=>x.id===r.id)+1;
 const stages=['Форма','Значение','Написание','Произношение','Проверка','Закрепление'];
 const selection='<div class="filters"><label for="courseGroup">Учебная группа</label><select id="courseGroup">'+[1,2,3].map(g=>'<option value="'+g+'" '+(l.group===g?'selected':'')+'>'+G[g]+' · '+groupRadicals(g).length+' ключей</option>').join('')+'</select></div>';
 if(l.completed){
  eduPart().innerHTML='<div class="panel study"><h2>Последовательный курс</h2>'+selection+'<h3>Группа '+l.group+' пройдена!</h3><p class="hint">Ты дошла до последнего ключа этой группы. Можешь перейти к другой группе или повторить эту с начала.</p><button class="btn alt" id="courseRestartGroup">↻ Начать группу заново</button></div>';
  eduBtn('courseRestartGroup',()=>{l.index=pool[0].id-1;l.step=0;l.completed=false;saveGroupCourse();renderLesson()});
 }else{
  eduPart().innerHTML='<div class="panel study"><h2>Последовательный курс</h2>'+selection+'<p class="muted">Группа '+l.group+' · ключ '+position+' из '+pool.length+' (Канси № '+r.id+') · этап '+(l.step+1)+' из 6</p><h3>'+stages[l.step]+'</h3><div class="herochar">'+r.display+'</div><p class="hint">'+(l.step===1||l.step===4?'Вспомни значение до открытия ответа.':l.step===2?'Напиши знак пальцем, следуя порядку черт.':l.step===3?'Слушай запись и обращай внимание на тон.':l.step===5?'Закрепи результат и переходи к следующему знаку.':'Рассмотри форму знака.')+'</p><p id="eduAnswer" hidden>'+escapeHtml(r.meaning)+'</p><div class="flex" style="justify-content:center"><button class="btn alt" id="eduAction">'+(l.step===2?'✍ Прописи':l.step===3?'▶ Слушать':'Показать значение')+'</button><button class="btn alt" id="eduBack">← Назад</button><button class="btn good" id="eduForward">Дальше →</button></div><div class="flex" style="justify-content:center"><button class="btn bad" id="eduHard">Нужно повторить</button><button class="btn good" id="eduGood">Запомнила</button></div><p class="hint">Каждая группа запоминает собственное место остановки. Можно свободно переключаться.</p></div>';
  eduBtn('eduAction',()=>{if(l.step===2)goWrite(r.display);else if(l.step===3)speak(r.display,'syllable');else document.getElementById('eduAnswer').hidden=false});
  eduBtn('eduBack',()=>{l.step=Math.max(0,l.step-1);saveGroupCourse();renderLesson()});
  eduBtn('eduForward',nextLesson);
  eduBtn('eduHard',()=>{scoreSkill(r.display,l.step===2?'writing':l.step===3?'tone':'meaning',false);nextLesson()});
  eduBtn('eduGood',()=>{scoreSkill(r.display,l.step===2?'writing':l.step===3?'tone':'meaning',true);nextLesson()});
 }
 document.getElementById('courseGroup').onchange=e=>chooseCourseGroup(e.target.value);
}
initCourseGroups();
function dueQueue(){return DB.radicals.flatMap(r=>['meaning','writing','tone'].filter(k=>k!=='tone'||r.group!==1).filter(k=>edu.skills[r.display+'|'+k]&&edu.skills[r.display+'|'+k].due<=Date.now()&&!sessionSkipped.has(r.display+'|'+k)).map(k=>({r,k})))}
function renderReviewEdu(){
 const q=dueQueue(),v=q[0];
 eduPart().innerHTML='<div class="panel study"><h2>Умное повторение</h2><p class="hint">Пора повторить: '+q.length+' навыков. Интервалы после успешных ответов: 1, 3, 7, 14, 30, 60 дней.</p>'+(v?'<h3>'+skillTitle[v.k]+'</h3><div class="herochar">'+v.r.display+'</div><button class="btn alt" id="eduReveal">Показать ответ</button><p id="eduSolution" hidden>'+escapeHtml(v.k==='meaning'?v.r.meaning:v.k==='tone'?(v.r.pinyin||getReading(v.r.display)||'Чтение не указано'):'Напиши знак по памяти')+'</p><div class="flex"><button class="btn bad" id="eduFail">Не получилось</button><button class="btn good" id="eduPass">Получилось</button></div>':'<p>Запланированных повторений на сегодня нет.</p>')+'</div>';
 if(v){eduBtn('eduReveal',()=>document.getElementById('eduSolution').hidden=false);eduBtn('eduFail',()=>{scoreSkill(v.r.display,v.k,false);sessionSkipped.add(v.r.display+'|'+v.k);renderReviewEdu()});eduBtn('eduPass',()=>{scoreSkill(v.r.display,v.k,true);renderReviewEdu()})}
}
function renderEduStats(){
 const counts=Object.fromEntries(['meaning','writing','tone'].map(k=>[k,DB.radicals.filter(r=>(edu.skills[r.display+'|'+k]?.streak||0)>=2).length]));
 eduPart().innerHTML='<div class="panel"><h2>Навыки</h2><p>Значения: <b>'+counts.meaning+' / 214</b></p><p>Написание: <b>'+counts.writing+' / 214</b></p><p>Произношение: <b>'+counts.tone+'</b> знаков</p><p>К повторению: <b>'+dueQueue().length+'</b> навыков</p><p>Сделано прописей: <b>'+Object.keys(writeProgress).length+'</b> знаков</p><p class="hint">Навык отмечается закреплённым после двух успешных проверок. Прежние отметки «Знаю» не меняются.</p></div>';
}
