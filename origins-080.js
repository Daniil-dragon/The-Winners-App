'use strict';
const ORIGIN_ENTRIES=[["廾","Две руки, поднятые вместе, как будто поддерживают или преподносят предмет.","Две руки, поднимающие меч.","Меч — учебная ассоциация, не утверждение о древнем предмете."],["人","Ранние изображения передают фигуру человека сбоку.","Человек стоит в профиль.","Современная форма более условна."],["又","Древнее изображение руки; значение «снова» развилось позднее.","Протянутая кисть руки.","Это исторический образ, не современное значение слова."],["彡","Штрихи связывают с волосами, щетиной и декоративным узором.","Три пряди волос.","Изначальный смысл и употребления в сложных знаках различаются."],["癶","Расходящиеся ступни; графема связана с движением ног.","Две ступни, направленные в стороны.","Схема — помощь в понимании формы."],["舛","Противопоставленные направления ступней связаны с расхождением.","Две ноги шагают в разные стороны.","Основное значение — «расходиться, противоречить»."],["攴","Рука с предметом, которым можно нанести удар.","Рука с палочкой.","Это образ элемента; современная форма часто 攵."],["爻","Два пересечения; знак употребляется для линий гадательных триграмм и гексаграмм.","Перекрещённые гадательные палочки.","Детальное происхождение обсуждается; палочки — мнемоника."],["夂","Древний образ связан со ступнёй или следованием за чем-либо.","Нога делает шаг вниз.","Конкретная интерпретация начертания неоднозначна."],["匚","Условное изображение ёмкости или короба.","Прямоугольный короб без передней стороны.","Современное сходство с рамкой — описание формы, не отдельный перевод."],["大","Фигура человека с широко разведёнными руками.","Человек широко раскинул руки.","Образ помогает связать форму со значением «большой»."],["女","Древняя форма изображает коленопреклонённую фигуру женщины.","Женщина со сложенными руками.","Современная форма сильно стилизована."],["子","В ранней форме видны голова и руки ребёнка.","Малыш с раскинутыми ручками.","Иллюстрация схематична."],["木","Условное изображение дерева со стволом, ветвями и корнями.","Дерево с ветвями и корнями.","Одна из наглядных пиктограмм."],["山","Древний образ горных вершин.","Три горных пика.","Схема отражает общий образ."],["巛","Извилистые линии текущей реки.","Три водных потока.","Связана с 川 — рекой."],["日","Первоначально изображение солнечного диска.","Солнце в виде круга с точкой внутри.","Позднее круг приобрёл прямоугольное начертание."],["月","Раннее начертание напоминает серп луны.","Узкий лунный серп.","Не смешивать с компонентом ⺼ «мясо» в других знаках."],["口","Изображение рта или открытого отверстия.","Открытый рот.","Это графический образ, не всякий квадрат в иероглифе означает рот."],["門","Двустворчатые ворота или дверь.","Две створки ворот.","Упрощённая современная форма — 门."],["手","Кисть с различимыми пальцами.","Раскрытая ладонь.","Слева в сложных знаках часто 扌."],["目","Человеческий глаз, изначально горизонтальный.","Глаз со зрачком.","Современное написание повёрнуто и выпрямлено."],["耳","Контур ушной раковины.","Человеческое ухо в профиль.","Очертанья постепенно стали прямолинейными."],["足","Изображение ноги со ступнёй.","Ступня и голень.","Слева в сложных знаках часто ⻊."],["心","Образ внутреннего органа — сердца.","Схема настоящего сердца.","Как компонент может обозначать чувства или мысли."],["火","Языки огня, поднимающиеся вверх.","Пламя костра.","Снизу в некоторых иероглифах пишется 灬."],["水","Главный водный поток с боковыми струями.","Текущий ручей.","Слева в сложных знаках часто 氵."],["雨","Дождевые капли под небом.","Облако и падающие капли.","Упрощённое изображение, не копия надписи."],["田","Обрабатываемое поле, разделённое межами.","Поле с четырьмя участками.","Межи объясняют пересекающиеся линии."],["石","Камень под выступом скалы — традиционное объяснение.","Камень у скального выступа.","Реконструкция древней формы может уточняться."],["牛","Голова рогатого животного.","Морда быка с рогами.","Рога выделяются в образе."],["羊","Голова овцы или барана с рогами.","Баран с двумя рогами.","В сложных знаках значение зависит от контекста."],["魚","Силуэт рыбы с головой, телом и хвостом.","Рыба вертикально.","Упрощённая форма — 鱼."],["鳥","Птица с клювом, крылом и хвостом.","Птица в профиль.","Упрощённая форма — 鸟."],["馬","Силуэт лошади.","Лошадь с гривой и хвостом.","Упрощённая форма — 马."],["竹","Бамбуковые стебли и листья.","Два бамбуковых побега.","Сверху часто пишется ⺮."],["米","Зёрна, отделённые от стебля.","Рассыпанные рисовые зёрна.","Схематичная ассоциация."],["貝","Раковина каури, бывшая предметом ценности и обмена.","Раковина каури.","Упрощённая форма — 贝."],["車","Колесница или повозка, вид сверху.","Двухколёсная телега.","Упрощённая форма — 车."],["艸","Два пучка растущей травы.","Два кустика травы.","Часто используется сокращённое 艹."]];
const originData=new Map(ORIGIN_ENTRIES.map(([ch,history,memory,note])=>[ch,{history,memory,note}]));
let originReturn=null,originSelected='廾',originFilter='';
function originRadical(ch){return DB.radicals.find(r=>r.display===ch||r.hanzi===ch)||null}
function originEscape(s){return escapeHtml(String(s??''))}
function originLamp(ch){
 const r=originRadical(ch);if(!r)return;
 const app=document.getElementById('app');if(!app||document.getElementById('originLamp'))return;
 const anchor=state.tab==='writing'?app.querySelector('.writer-side'):app.querySelector('.herochar');
 if(!anchor)return;
 const b=document.createElement('button');b.id='originLamp';b.type='button';b.className='btn alt';b.style.margin='8px auto 14px';b.style.display='block';
 b.textContent='💡 Происхождение формы';b.setAttribute('aria-label','Открыть словарь происхождения формы для '+ch);
 anchor.insertAdjacentElement('afterend',b);
 b.onclick=()=>openOrigins(ch);
}
function originCurrentChar(){
 const app=document.getElementById('app');
 if(state.tab==='writing')return state.writeChar;
 if(state.tab==='course'&&typeof edu!=='undefined')return DB.radicals[edu.lesson.index]?.display;
 if(state.tab==='radicals'&&originOpenedRadical)return DB.radicals[originOpenedRadical-1]?.display;
 return app?.querySelector('.herochar')?.textContent.trim();
}
let originOpenedRadical=null;
const oldOriginOpenRadical=openRadical;
openRadical=function(id){originOpenedRadical=id;oldOriginOpenRadical(id);queueOriginLamp()};
function queueOriginLamp(){
 if(state.tab==='origins')return;
 const ch=originCurrentChar();if(ch)originLamp(ch);
}
function openOrigins(ch){
 if(state.tab!=='origins'){
  originReturn={tab:state.tab,radicalId:state.tab==='radicals'?originOpenedRadical:null,scroll:window.scrollY};
 }
 originSelected=ch||originSelected;originFilter='';state.tab='origins';renderOrigins();window.scrollTo(0,0);
}
function returnFromOrigins(){
 const ret=originReturn||{tab:'radicals',radicalId:null,scroll:0};
 state.tab=ret.tab;originReturn=null;render();
 if(ret.tab==='radicals'&&ret.radicalId)openRadical(ret.radicalId);
 requestAnimationFrame(()=>window.scrollTo(0,ret.scroll||0));
}
function originIllustration(ch){
 if(ch!=='廾')return '<div class="hint">🖼️ Образ для иллюстрации: '+originEscape(originData.get(ch)?.memory||'')+'</div>';
 return '<svg viewBox="0 0 260 164" style="width:100%;max-width:300px;height:auto;display:block;margin:auto" role="img" aria-label="Условная схема: две руки поднимают меч"><path d="M130 8 L130 85" stroke="#778597" stroke-width="8" stroke-linecap="round"/><path d="M118 80 L142 80 M124 90 L136 90" stroke="#9b7951" stroke-width="9" stroke-linecap="round"/><path d="M130 92 L130 111" stroke="#876a4d" stroke-width="8" stroke-linecap="round"/><path d="M25 152 Q48 114 86 119 Q101 123 110 105 L122 95" stroke="#c9a17b" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M235 152 Q212 114 174 119 Q159 123 150 105 L138 95" stroke="#c9a17b" stroke-width="17" fill="none" stroke-linecap="round"/></svg><p class="hint">Это ассоциация с мечом, а не научная реконструкция древней формы.</p>';
}
function renderOrigins(){
 state.tab='origins';
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',false));
 const app=document.getElementById('app'),r=originRadical(originSelected),item=originData.get(r?.hanzi)||originData.get(originSelected);
 const list=DB.radicals.filter(x=>originData.has(x.hanzi)).filter(x=>!originFilter||x.hanzi.includes(originFilter)||x.display.includes(originFilter)||x.meaning.toLowerCase().includes(originFilter.toLowerCase()));
 const options=list.map(x=>'<button class="btn alt" data-origin="'+originEscape(x.hanzi)+'" style="min-width:54px">'+originEscape(x.display)+'</button>').join('');
 app.innerHTML='<div class="panel study"><button class="btn alt" id="originBack">← Вернуться к изучению</button><h2>💡 Происхождение формы</h2><p class="hint">Словарь происхождения графем. Картинки и ассоциации служат для запоминания; они не заменяют исторические изображения из научных источников.</p>'+
 '<label for="originSearch">Поиск по знаку или значению</label><input id="originSearch" placeholder="Например: человек, рука, 木" value="'+originEscape(originFilter)+'" style="width:100%;padding:10px;margin:8px 0"/>'+
 '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0;max-height:155px;overflow:auto">'+(options||'<p class="hint">Справок по этому запросу пока нет.</p>')+'</div>'+
 (r&&item?'<div class="panel" style="margin-top:15px"><div class="herochar">'+originEscape(r.display)+'</div><h3>'+originEscape(r.meaning)+'</h3><p><b>Исторический образ:</b> '+originEscape(item.history)+'</p><p><b>Как запомнить:</b> '+originEscape(item.memory)+'</p>'+originIllustration(r.hanzi)+'<p class="hint">'+originEscape(item.note)+'</p></div>':'<p class="hint">Для выбранного знака отдельная справка ещё не подготовлена. Можно выбрать одну из опубликованных выше.</p>')+
 '<button class="btn good" id="originBackBottom">← Продолжить обучение</button></div>';
 document.getElementById('originBack').onclick=returnFromOrigins;
 document.getElementById('originBackBottom').onclick=returnFromOrigins;
 document.getElementById('originSearch').oninput=e=>{
  const val=e.target.value;originFilter=val;const sel=originSelected;renderOrigins();
  const input=document.getElementById('originSearch');input.focus();input.setSelectionRange(val.length,val.length);originSelected=sel;
 };
 document.querySelectorAll('[data-origin]').forEach(b=>b.onclick=()=>{originSelected=b.dataset.origin;renderOrigins()});
}
const originFormerRender=render;
render=function(){
 if(state.tab==='origins'){renderOrigins();return}
 if(state.tab==='radicals')originOpenedRadical=null;
 originFormerRender();queueOriginLamp();
};
const observer=new MutationObserver(()=>{if(state.tab==='origins')return;queueOriginLamp()});
observer.observe(document.getElementById('app'),{childList:true,subtree:false});
queueOriginLamp();
