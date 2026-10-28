'use strict';
const items=window.ARCHIVE||[], $=id=>document.getElementById(id);
let type='all',filtered=[],limit=48,current=0,lastTrigger=null;
const dateLabel=d=>d.replaceAll('-','.');
$('all-count').textContent=items.length;
$('photo-count').textContent=items.filter(x=>x.type==='photo').length;
$('video-count').textContent=items.filter(x=>x.type==='video').length;
$('totals').textContent=`${$('photo-count').textContent} PHOTOS / ${$('video-count').textContent} VIDEOS`;
[...new Set(items.map(x=>x.month))].sort().reverse().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m.replace('-','년 ')+'월';$('month').append(o)});
function render(reset=true){
 if(reset)limit=48;
 filtered=items.filter(x=>(type==='all'||x.type===type)&&($('month').value==='all'||x.month===$('month').value)).sort((a,b)=>{const c=(a.date+a.time+a.id).localeCompare(b.date+b.time+b.id);return $('sort').value==='desc'?-c:c});
 $('grid').replaceChildren();filtered.slice(0,limit).forEach((item,index)=>{
 const card=document.createElement('figure');card.className='card';const b=document.createElement('button');b.className='media-button';b.setAttribute('aria-label',`${dateLabel(item.date)} ${item.time} ${item.type==='video'?'동영상 재생':'사진 확대'}`);
 const img=document.createElement('img');img.src=item.thumb;img.alt=`시우 · ${dateLabel(item.date)} ${item.time}`;img.loading=index<8?'eager':'lazy';img.decoding='async';img.width=item.width;img.height=item.height;b.append(img);
 if(item.type==='video'){const badge=document.createElement('span');badge.className='badge';badge.textContent='VIDEO';const play=document.createElement('span');play.className='play';play.textContent='▶';play.setAttribute('aria-hidden','true');b.append(badge,play)}
 b.addEventListener('click',()=>{lastTrigger=b;openItem(index)});const cap=document.createElement('figcaption');cap.className='caption';const t=document.createElement('time');t.dateTime=item.date+'T'+item.time+':00+09:00';const d=document.createElement('span');d.textContent=dateLabel(item.date);const h=document.createElement('span');h.className='time';h.textContent=item.time;t.append(d,h);cap.append(t);card.append(b,cap);$('grid').append(card);
 });
 $('result').textContent=`${filtered.length} MOMENTS`;$('empty').hidden=filtered.length>0;$('more').hidden=filtered.length<=limit;
 const dates=filtered.map(x=>x.date).sort();$('range').textContent=dates.length?`${dateLabel(dates[0])} — ${dateLabel(dates.at(-1))}`:'';
}
document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.type;document.querySelectorAll('[data-type]').forEach(v=>{v.classList.toggle('active',v===b);v.setAttribute('aria-pressed',String(v===b))});render()}));
$('month').addEventListener('change',()=>render());$('sort').addEventListener('change',()=>render());$('more').addEventListener('click',()=>{const firstNew=limit;limit+=48;render(false);$('grid').children[firstNew]?.querySelector('button').focus({preventScroll:true})});
function clearMedia(){const v=$('viewer-media').querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load()}$('viewer-media').replaceChildren()}
function openItem(i){current=i;const item=filtered[i];clearMedia();const el=document.createElement(item.type==='video'?'video':'img');el.src=item.src;if(item.type==='video'){el.controls=true;el.playsInline=true;el.preload='metadata';el.poster=item.thumb}else{el.alt=`시우 ${dateLabel(item.date)} ${item.time}`}$('viewer-media').append(el);$('viewer-kind').textContent=item.type.toUpperCase();$('viewer-date').textContent=`${dateLabel(item.date)} · ${item.time}`;$('viewer-position').textContent=`${i+1} / ${filtered.length}`;$('prev').disabled=i===0;$('next').disabled=i===filtered.length-1;if(!$('viewer').open){$('viewer').showModal();document.body.classList.add('modal-open');$('close').focus()}}
$('close').addEventListener('click',()=>$('viewer').close());$('viewer').addEventListener('close',()=>{clearMedia();document.body.classList.remove('modal-open');lastTrigger?.focus({preventScroll:true})});$('viewer').addEventListener('click',e=>{if(e.target===$('viewer')){const r=$('viewer').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('viewer').close()}});$('prev').addEventListener('click',()=>{if(current>0)openItem(current-1)});$('next').addEventListener('click',()=>{if(current<filtered.length-1)openItem(current+1)});$('viewer').addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowLeft'&&current>0){e.preventDefault();openItem(current-1)}if(e.key==='ArrowRight'&&current<filtered.length-1){e.preventDefault();openItem(current+1)}});render();
