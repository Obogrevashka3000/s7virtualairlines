
function toggleMenu(){const n=document.getElementById('mobileNav');if(n)n.classList.toggle('open')}
document.addEventListener('click',e=>{const n=document.getElementById('mobileNav'),b=document.querySelector('.menu-btn');if(n&&n.classList.contains('open')&&!n.contains(e.target)&&!b.contains(e.target))n.classList.remove('open')});
