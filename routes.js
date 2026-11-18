
(function(){
 if(!document.getElementById('route-map')||!window.S7_NETWORK)return;
 const map=L.map('route-map',{worldCopyJump:true,scrollWheelZoom:false}).setView([48,65],3);
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OpenStreetMap &copy; CARTO',subdomains:'abcd',maxZoom:18}).addTo(map);
 const airports=window.S7_NETWORK.airports, routes=window.S7_NETWORK.routes;
 const byCode=Object.fromEntries(airports.map(a=>[a.icao,a]));
 const layer=L.layerGroup().addTo(map), markerLayer=L.layerGroup().addTo(map);
 let mode='all';
 function greatCircle(a,b,steps=48){
  const rad=Math.PI/180, toV=p=>[Math.cos(p[0]*rad)*Math.cos(p[1]*rad),Math.cos(p[0]*rad)*Math.sin(p[1]*rad),Math.sin(p[0]*rad)];
  const A=toV([a.lat,a.lon]),B=toV([b.lat,b.lon]),dot=Math.max(-1,Math.min(1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2])),omega=Math.acos(dot),sin=Math.sin(omega),pts=[];
  for(let i=0;i<=steps;i++){let t=i/steps,x,y,z;if(sin<1e-6){x=A[0]*(1-t)+B[0]*t;y=A[1]*(1-t)+B[1]*t;z=A[2]*(1-t)+B[2]*t}else{x=Math.sin((1-t)*omega)/sin*A[0]+Math.sin(t*omega)/sin*B[0];y=Math.sin((1-t)*omega)/sin*A[1]+Math.sin(t*omega)/sin*B[1];z=Math.sin((1-t)*omega)/sin*A[2]+Math.sin(t*omega)/sin*B[2]}pts.push([Math.atan2(z,Math.hypot(x,y))/rad,Math.atan2(y,x)/rad])}
  return pts;
 }
 function color(kind){return kind==='hub'?'#90c241':kind==='base'?'#2678bd':kind==='city'?'#f0b323':'#d56a55'}
 function draw(){
  layer.clearLayers();markerLayer.clearLayers();
  routes.forEach(r=>{const a=byCode[r.from],b=byCode[r.to];if(!a||!b)return;const europe=['United Kingdom','France','Germany','Italy','Austria','Czechia','Hungary','Finland','Sweden','Greece','Spain','Montenegro','Serbia','Moldova','Romania','Poland','Türkiye','Georgia','Armenia','Azerbaijan'];
  const asia=['China','Japan','South Korea','Thailand','India','Vietnam','Malaysia','Singapore','Sri Lanka','Maldives','Kazakhstan','Uzbekistan','Kyrgyzstan','Tajikistan','Mongolia','UAE','Qatar','Oman','Pakistan'];
  if(mode==='europe'&&!europe.includes(a.country)&&!europe.includes(b.country))return;
  if(mode==='asia'&&!asia.includes(a.country)&&!asia.includes(b.country))return;
   L.polyline(greatCircle(a,b),{color:r.type==='main'?'#5d91c8':'#8baed1',weight:r.type==='main'?1.55:1.1,opacity:r.type==='main'?.48:.32,interactive:false}).addTo(layer);
  });
  airports.forEach(a=>{const radius=a.kind==='hub'?7:a.kind==='base'?5.5:3.8;const m=L.circleMarker([a.lat,a.lon],{radius,weight:1.4,color:'#fff',fillColor:color(a.kind),fillOpacity:1}).bindPopup(`<b>${a.icao} · ${a.name}</b><br>${a.country}<br><small>${a.kind==='hub'?'Основной виртуальный хаб':a.kind==='base'?'Виртуальная база':'Аэропорт маршрутной сети'}</small>`);m.addTo(markerLayer)});
 }
 draw();
 document.querySelectorAll('[data-map-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-map-filter]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');mode=btn.dataset.mapFilter;draw()}));
 const list=document.querySelector('.route-rows'),search=document.querySelector('#route-search');
 function renderList(q=''){if(!list)return;list.innerHTML='';routes.filter(r=>{const a=byCode[r.from],b=byCode[r.to];return (r.from+' '+r.to+' '+a.name+' '+b.name).toLowerCase().includes(q.toLowerCase())}).forEach(r=>{const a=byCode[r.from],b=byCode[r.to],el=document.createElement('div');el.className='route-row';el.innerHTML=`<strong>${r.from} <span style="color:#90c241">→</span> ${r.to}</strong><span>${a.name.split(' · ').pop()} — ${b.name.split(' · ').pop()}</span>`;list.appendChild(el)})}
 renderList();if(search)search.addEventListener('input',()=>renderList(search.value));
 setTimeout(()=>map.invalidateSize(),250);
})();
