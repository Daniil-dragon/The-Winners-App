
'use strict';
let quizMode='meaning',quizItem=null,quizAnswered=false,quizWriter=null,quizToken=0,quizWins073=0,quizAttempts073=0;
let quizStroke=0,quizHints=0,quizStrokeData=null,quizHintNumber=0;
const knownPool=()=>DB.radicals.filter(r=>stat('r'+r.id)===2);
const quizReading=r=>r.id===27?'hǎn':(r.pinyin||getReading(r.display)||'');
function quizOptions(r){
 const distractors=knownPool().filter(x=>x.id!==r.id&&x.meaning!==r.meaning);
 const choices=[r];
 for(let i=0;i<3&&distractors.length;i++){const n=Math.floor(Math.random()*distractors.length);choices.push(distractors.splice(n,1)[0])}
 return choices.sort(()=>Math.random()-0.5);
}
function normalizedBase(str){return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ü/g,'v').replace(/[^a-zv]/g,'')}
function knownQuizNext(){
 quizToken++;quizAnswered=false;quizWriter=null;quizStroke=0;quizHints=0;quizStrokeData=null;
 const pool=knownPool().filter(r=>quizMode!=='sound'||(r.group!==1&&quizReading(r)&&toneFile(quizReading(r))));
 const previously=quizItem?.id;
 quizItem=pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
 if(pool.length>1&&quizItem?.id===previously)quizItem=pool[(pool.findIndex(x=>x.id===previously)+1)%pool.length];
 renderKnownQuiz();
}
function quizGrade(ok,skill){
 if(quizAnswered)return;
 quizAnswered=true;quizAttempts073++;if(ok)quizWins073++;
 if(typeof scoreSkill==='function')scoreSkill(quizItem.display,skill,ok);
}
function renderKnownQuiz(){
 const pool=knownPool(),r=quizItem;
 const modes='<div class="flex" style="justify-content:center;margin:10px 0"><button class="btn '+(quizMode==='meaning'?'good':'alt')+'" data-quiz-mode="meaning">Значение</button><button class="btn '+(quizMode==='writing'?'good':'alt')+'" data-quiz-mode="writing">Написание</button><button class="btn '+(quizMode==='sound'?'good':'alt')+'" data-quiz-mode="sound">Пиньинь и тон</button></div>';
 eduPart().innerHTML='<div class="panel study"><h2>Проверка изученных графем</h2><p class="hint">В задания попадают только ключи, отмеченные «Знаю». Ошибки не стирают эту отметку.</p>'+modes+
 '<p class="muted">Изучено: '+pool.length+' из 214 · верно: '+quizWins073+' из '+quizAttempts073+'</p>'+
 (!r?'<p class="hint">Нет подходящих изученных графем для этого режима. Отметь ключи «Знаю» в словаре или выбери другой режим.</p>':
 quizMode==='meaning'?'<div class="herochar">'+r.display+'</div><p>Какое значение у этой графемы?</p><div class="quiz-options" id="knownChoices"></div><div id="quizFeedback"></div>':
 quizMode==='writing'?'<p>Напиши знак по памяти: <b>'+escapeHtml(r.meaning)+'</b>'+(quizReading(r)?' · '+escapeHtml(quizReading(r)):'')+'</p><div class="writerbox" style="margin:0 auto;max-width:330px"><div id="knownWritingCanvas"></div></div><div class="flex" style="justify-content:center;margin-top:12px"><button class="btn alt" id="quizStrokeHint" disabled>✦ Подсказать следующую черту</button></div><p id="quizFeedback" class="hint">Напиши пальцем; образец намеренно скрыт.</p><button class="btn alt" id="quizReveal">Показать ответ</button>':
 '<div class="herochar">'+r.display+'</div><p>Введи чтение ключа в значении «'+escapeHtml(r.meaning)+'» латинскими буквами без тона, затем выбери тон.</p><input id="quizPinyin" type="text" placeholder="Например, ren" autocapitalize="none" autocomplete="off" spellcheck="false" style="max-width:260px;width:100%;padding:12px"><div class="flex" style="justify-content:center;margin:12px 0">'+[1,2,3,4,5].map(n=>'<button class="btn alt" data-quiz-tone="'+n+'">'+(n===5?'0':n)+'</button>').join('')+'</div><div id="quizFeedback"></div>')+
 '<div class="flex" style="justify-content:center;margin:16px 0"><button class="btn alt" id="quizNext073">Следующий вопрос →</button></div></div>';
 document.querySelectorAll('[data-quiz-mode]').forEach(b=>b.onclick=()=>{quizMode=b.dataset.quizMode;quizItem=null;knownQuizNext()});
 eduBtn('quizNext073',knownQuizNext);
 if(!r)return;
 if(quizMode==='meaning'){
  const options=quizOptions(r);document.getElementById('knownChoices').innerHTML=options.map(x=>'<button data-quiz-choice="'+x.id+'">'+escapeHtml(x.meaning)+'</button>').join('');
  document.querySelectorAll('[data-quiz-choice]').forEach(b=>b.onclick=()=>{if(quizAnswered)return;const ok=Number(b.dataset.quizChoice)===r.id;quizGrade(ok,'meaning');document.getElementById('quizFeedback').textContent=ok?'✓ Верно!':'Правильный ответ: '+r.meaning;document.querySelectorAll('[data-quiz-choice]').forEach(x=>x.disabled=true)});
 }
 if(quizMode==='sound'){
  document.querySelectorAll('[data-quiz-tone]').forEach(b=>b.onclick=()=>{
   if(quizAnswered)return;
   const answer=quizReading(r),base=normalizedBase(answer),tone=Number(toneFile(answer)?.slice(-1)||5);
   const typed=normalizedBase(document.getElementById('quizPinyin').value);
   if(!typed){document.getElementById('quizFeedback').textContent='Сначала введи слог латинскими буквами.';return}
   const ok=typed===base&&Number(b.dataset.quizTone)===tone;quizGrade(ok,'tone');
   document.getElementById('quizFeedback').textContent=(ok?'✓ Верно! ':'Пока неверно. ')+'Чтение ключа: '+answer+(r.id===27?' (обрыв, скала). В современном значении «завод, фабрика» знак читается chǎng.':'');
   document.querySelectorAll('[data-quiz-tone]').forEach(x=>x.disabled=true);
   document.getElementById('quizPinyin').disabled=true;
  });
 }
 if(quizMode==='writing')runKnownWritingQuiz(r);
}
function quizDirectedStrokeHint(){
 const data=quizStrokeData,el=document.getElementById('knownWritingCanvas');
 if(quizAnswered||!data||!el||!quizWriter)return;
 const index=Math.min(quizStroke,data.strokes.length-1);
 const median=data.medians?.[index],outline=data.strokes[index];
 if(!Array.isArray(median)||median.length<2||!outline){document.getElementById('quizFeedback').textContent='Для этой черты подсказка недоступна.';return}
 const wrapper=el.closest('.writerbox');if(!wrapper)return;
 wrapper.querySelectorAll('.writing-help-overlay.hint').forEach(x=>x.remove());
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('class','writing-help-overlay hint');svg.setAttribute('viewBox','0 0 1024 1024');svg.setAttribute('aria-hidden','true');
 const rect=el.getBoundingClientRect(),wr=wrapper.getBoundingClientRect();
 svg.style.width=rect.width+'px';svg.style.height=rect.height+'px';svg.style.left=(rect.left-wr.left)+'px';svg.style.top=(rect.top-wr.top)+'px';svg.style.right='auto';svg.style.bottom='auto';
 const group=document.createElementNS(ns,'g');group.setAttribute('transform','translate(0 900) scale(1 -1)');
 const mask=document.createElementNS(ns,'mask'),maskId='quizHint'+(++quizHintNumber);
 mask.setAttribute('id',maskId);mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('maskContentUnits','userSpaceOnUse');
 const trace=document.createElementNS(ns,'path');trace.setAttribute('d','M'+median.map(p=>p.join(' ')).join(' L'));trace.setAttribute('fill','none');trace.setAttribute('stroke','white');trace.setAttribute('stroke-width','125');trace.setAttribute('stroke-linecap','round');trace.setAttribute('stroke-linejoin','round');
 mask.appendChild(trace);svg.appendChild(mask);
 const shape=document.createElementNS(ns,'path');shape.setAttribute('d',outline);shape.setAttribute('fill','#a5d6c4');shape.setAttribute('opacity','0.9');shape.setAttribute('mask','url(#'+maskId+')');group.appendChild(shape);svg.appendChild(group);wrapper.appendChild(svg);
 const length=trace.getTotalLength();trace.style.strokeDasharray=String(length+2);
 const anim=trace.animate([{strokeDashoffset:length+2,opacity:0.3},{strokeDashoffset:0,opacity:1},{strokeDashoffset:0,opacity:0.2}],{duration:1500,iterations:3,easing:'ease-in-out',fill:'forwards'});
 anim.onfinish=()=>svg.remove();quizHints++;
 document.getElementById('quizFeedback').textContent='Подсказка: '+(index+1)+'-я черта. Подсвечивается в направлении написания. Ответ будет отмечен как выполненный с помощью.';
}
async function runKnownWritingQuiz(r){
 const token=++quizToken,el=document.getElementById('knownWritingCanvas');if(!el)return;
 try{
  if(!window.HanziWriter)throw Error('Библиотека написания ещё не загрузилась.');
  const data=await HanziWriter.loadCharacterData(r.display);
  if(token!==quizToken||state.tab!=='quiz'||quizMode!=='writing')return;
  if(!data?.strokes?.length)throw Error('Контуры этого знака пока недоступны.');
  quizStrokeData=data;quizStroke=0;quizHints=0;
  const size=Math.min(300,el.clientWidth||300);
  quizWriter=HanziWriter.create(el,r.display,{width:size,height:size,padding:18,showCharacter:false,showOutline:false,
   strokeColor:'#22875a',drawingColor:'#d68035',showHintAfterMisses:999,acceptBackwardsStrokes:false,
   charDataLoader:(char,onLoad)=>onLoad(data)});
  const hintButton=document.getElementById('quizStrokeHint');if(hintButton){hintButton.disabled=false;hintButton.onclick=quizDirectedStrokeHint}
  quizWriter.quiz({showHintAfterMisses:999,highlightOnComplete:false,leniency:1.05,
    onCorrectStroke:d=>{quizStroke=d.strokeNum+1;document.querySelectorAll('.writing-help-overlay.hint').forEach(x=>x.remove())},
    onMistake:d=>{quizStroke=d.strokeNum;document.getElementById('quizFeedback').textContent='Ошибок: '+d.totalMistakes+'. Попробуй продолжить.'},
    onComplete:d=>{
     if(quizAnswered)return;
     const good=d.totalMistakes<=2&&quizHints===0;quizAnswered=true;quizAttempts073++;if(good)quizWins073++;
     const helpButton=document.getElementById('quizStrokeHint');if(helpButton)helpButton.disabled=true;
     const old=writeProgress[r.display]||{count:0,best:999};
     writeProgress[r.display]={count:old.count+1,best:Math.min(old.best,d.totalMistakes),last:d.totalMistakes,level:3,hints:quizHints,updated:new Date().toISOString()};
     if(typeof originalSaveWriting==='function')originalSaveWriting();else saveWriteProgress();
     if(typeof scoreSkill==='function')scoreSkill(r.display,'writing',good);
     document.getElementById('quizFeedback').textContent=(good?'✓ Отлично, самостоятельно! ':quizHints?'Знак дописан с подсказкой. ':'Знак дописан, но ошибок было много. ')+'Ошибок: '+d.totalMistakes+', подсказок: '+quizHints+'. Ответ: '+r.display;
    }
  });
 }catch(e){if(token===quizToken){document.getElementById('quizFeedback').textContent='Не удалось открыть прописи: '+e.message}}
 eduBtn('quizReveal',()=>{
  if(quizAnswered)return;quizToken++;
  const hintButton=document.getElementById('quizStrokeHint');if(hintButton)hintButton.disabled=true;
  document.querySelectorAll('.writing-help-overlay.hint').forEach(x=>x.remove());
  quizAnswered=true;quizAttempts073++;if(typeof scoreSkill==='function')scoreSkill(r.display,'writing',false);
  document.getElementById('quizFeedback').textContent='Ответ: '+r.display+' — '+r.meaning+'. Попробуй написать его в прописях.';
  const b=document.getElementById('quizReveal');if(b)b.disabled=true;
  if(quizWriter)quizWriter.cancelQuiz();
 });
}
nextQuestion=knownQuizNext;
renderQuiz=function(){
 if(!quizItem||!knownPool().some(x=>x.id===quizItem.id)){knownQuizNext();return}
 renderKnownQuiz();
};
