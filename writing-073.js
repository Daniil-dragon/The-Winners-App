
'use strict';
// Separate writing aid: only the upcoming stroke is highlighted, in its real direction.
function writingOverlay(type) {
 const parent=document.querySelector('.writerbox'),canvas=document.getElementById('writingCanvas');
 if(!parent||!canvas||!writeData)return null;
 parent.querySelectorAll('.writing-help-overlay.'+type).forEach(x=>x.remove());
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 1024 1024');
 svg.setAttribute('class','writing-help-overlay '+type);
 svg.setAttribute('aria-hidden','true');
 const size=Math.min(340,Math.floor(canvas.getBoundingClientRect().width)||300);
 svg.style.width=size+'px';svg.style.height=size+'px';svg.style.left='0px';svg.style.top='0px';svg.style.right='auto';svg.style.bottom='auto';
 const g=document.createElementNS(ns,'g');g.setAttribute('transform','translate(0 900) scale(1 -1)');
 svg.appendChild(g);parent.appendChild(svg);
 return {svg,g,ns};
}
function showWritingGuideDots(){
 if(state.writeLevel!==2||!writeData)return;
 const o=writingOverlay('guide');if(!o)return;
 for(let i=0;i<writeData.medians.length;i++){
  const xy=writeData.medians[i]?.[0];if(!xy)continue;
  const dot=document.createElementNS(o.ns,'circle');
  dot.setAttribute('cx',xy[0]);dot.setAttribute('cy',xy[1]);dot.setAttribute('r',16);
  dot.setAttribute('fill','#b4c5ce');dot.setAttribute('opacity','0.75');
  o.g.appendChild(dot);
 }
}
function showDirectedWritingHint(){
 if(!writeData||!writer||writingDone){writingMessage('Знак уже написан. Можно очистить поле и попробовать снова.');return}
 const index=Math.min(writingNextStroke,writeData.strokes.length-1);
 const points=writeData.medians?.[index],outline=writeData.strokes?.[index];
 if(!points?.length||!outline){writingMessage('Для этой черты пока нет данных подсказки.');return}
 const o=writingOverlay('hint');if(!o)return;
 const shape=document.createElementNS(o.ns,'path');shape.setAttribute('d',outline);
 shape.setAttribute('fill','#a5d6c4');
 shape.setAttribute('opacity','0.9');
 const id='hintmask'+writingSession+'_'+index;
 const mask=document.createElementNS(o.ns,'mask');mask.setAttribute('id',id);
 const line=document.createElementNS(o.ns,'path');
 line.setAttribute('d','M'+points.map(p=>p.join(' ')).join(' L'));
 line.setAttribute('stroke','white');line.setAttribute('stroke-width','125');line.setAttribute('stroke-linecap','round');line.setAttribute('stroke-linejoin','round');
 line.setAttribute('fill','none');mask.appendChild(line);o.svg.insertBefore(mask,o.g);
 shape.setAttribute('mask','url(#'+id+')');o.g.appendChild(shape);
 const length=line.getTotalLength();
 line.style.strokeDasharray=String(length+2);
 const start=length+2;
 line.animate([{strokeDashoffset:start,opacity:0.35},{strokeDashoffset:0,opacity:1},{strokeDashoffset:0,opacity:0.25}],{duration:1550,iterations:3,easing:'ease-in-out',fill:'forwards'});
 writingHelpUsed++;
 writingMessage('Подсказка: '+(index+1)+'-я черта. Свет проходит от её начала к концу. Затем продолжай писать самостоятельно.');
 setTimeout(()=>{if(o.svg.isConnected)o.svg.remove()},4700);
}
function markWritingKnownNext(){
 if(!writingDone){writingMessage('Сначала заверши написание знака.');return}
 const ch=state.writeChar,r=DB.radicals.find(x=>x.display===ch||x.hanzi===ch);
 if(!r){writingMessage('Написание сохранено. Отметка «Знаю» доступна для ключей из словаря.');return}
 progress['r'+r.id]=2;save();
 const next=DB.radicals.find(x=>x.group===r.group&&x.id!==r.id&&stat('r'+x.id)!==2);
 if(next){state.writeChar=next.display;state.writeMode='practice';state.writeLevel=1;renderWriting();writingMessage('✓ '+ch+' отмечен как изученный. Следующий неизученный ключ этой группы.')}
 else{const b=document.getElementById('writingKnow');if(b){b.disabled=true;b.textContent='✓ Изучено'}writingMessage('✓ '+ch+' отмечен как изученный. В этой группе больше нет неизученных ключей.')}
}
