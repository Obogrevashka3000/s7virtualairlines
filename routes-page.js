
(function(){
 const routes=window.S7_ROUTES||[];
 const search=document.getElementById('routeSearch'),origin=document.getElementById('routeOrigin'),region=document.getElementById('routeRegion'),groups=document.getElementById('routeGroups'),count=document.getElementById('routeCount');
 if(!groups)return;
 const origins=[...new Set(routes.map(r=>r.split(' — ')[0]))].sort((a,b)=>a.localeCompare(b,'ru'));
 origins.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;origin.appendChild(op)});
 const hubs=['Москва','Новосибирск','Иркутск','Владивосток'];
 function isRussia(city){return !/(Берлин|Мюнхен|Дюссельдорф|Ганновер|Кёльн|Франкфурт|Рим|Милан|Верона|Генуя|Кальяри|Катания|Неаполь|Ольбия|Пиза|Бари|Болонья|Аликанте|Барселона|Ибица|Малага|Тенерифе|Париж|Ницца|Дубровник|Пула|Вена|Зальцбург|Инсбрук|Родос|Салоники|Ираклион|Бургас|Варна|Ларнака|Дублин|Рейкьявик|Стамбул|Анталья|Даламан|Бодрум|Тбилиси|Батуми|Баку|Ереван|Алматы|Астана|Усть-Каменогорск|Караганда|Бишкек|Ош|Ташкент|Самарканд|Фергана|Бухара|Андижан|Душанбе|Худжанд|Пекин|Шанхай|Гуанчжоу|Осака|Тайбэй|Бангкок|Пхукет|Рас-эль-Хайма|Дубай|Хургада|Шарм-эш-Шейх)/i.test(city)}
 function render(){
  const q=search.value.trim().toLocaleLowerCase('ru'),o=origin.value,reg=region.value;
  const filtered=routes.filter(r=>{const [a,b]=r.split(' — ');return (!q||r.toLocaleLowerCase('ru').includes(q))&&(!o||a===o)&&(!reg||(reg==='Россия'?(isRussia(a)&&isRussia(b)):(!isRussia(a)||!isRussia(b))))});
  count.textContent=filtered.length;
  if(!filtered.length){groups.innerHTML='<div class="empty">По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</div>';return}
  let buckets={};
  filtered.forEach(r=>{const a=r.split(' — ')[0];(buckets[a]??=[]).push(r)});
  const order=[...hubs.filter(h=>buckets[h]),...Object.keys(buckets).filter(k=>!hubs.includes(k)).sort((a,b)=>a.localeCompare(b,'ru'))];
  groups.innerHTML=order.map((a,i)=>`<details class="route-group" ${i<4?'open':''}><summary><span>${a}</span><span style="color:#7b8875;font-size:11px;font-weight:600">${buckets[a].length} направлений</span></summary><div class="route-list">${buckets[a].map(r=>`<div class="route-item">${r}</div>`).join('')}</div></details>`).join('');
 }
 [search,origin,region].forEach(el=>el.addEventListener('input',render));render();
})();
