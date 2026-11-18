
const navToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
if(navToggle&&nav){navToggle.addEventListener('click',()=>{nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false')})}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll('[data-email]').forEach(el=>{if(el.textContent.includes('REPLACE'))el.textContent='Укажите почту поддержки в assets/js/config.js'});
