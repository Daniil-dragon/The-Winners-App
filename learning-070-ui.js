
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
const newTabs=[['course','🎓 Курс'],['review','Повторение'],['tones','🎵 Тоны'],['explore','Семейства+'],['skills','Навыки']];
const nav=document.getElementById('tabs');
nav.addEventListener('click',event=>{const tab=event.target.closest('[data-tab]');if(tab?.dataset.tab==='course'&&state.tab==='radicals'&&[1,2,3].includes(Number(state.group))){chooseCourseGroup(Number(state.group))}},true);
for(const [tab,label] of newTabs){const b=document.createElement('button');b.className='tab';b.dataset.tab=tab;b.textContent=label;nav.appendChild(b)}
const originalRender=render;
render=function(){
 if(['course','review','tones','explore','skills'].includes(state.tab)){
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===state.tab));stats();
  if(state.tab==='course')renderLesson();
  if(state.tab==='review')renderReviewEdu();
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
