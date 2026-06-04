
let s=JSON.parse(localStorage.getItem('kkv2'))||{love:60,food:50,energy:70};
const kk=document.getElementById('kk'),cg=document.getElementById('cg'),log=document.getElementById('log');
function save(){localStorage.setItem('kkv2',JSON.stringify(s));love.textContent=s.love;food.textContent=s.food;energy.textContent=s.energy;}
function act(t){
if(t==='feed'){s.food+=10;kk.src='kk_happy.png';cg.src='cg_feed.jpg';log.textContent='泠泠喂了KK。'}
if(t==='hug'){s.love+=15;kk.src='kk_happy.png';cg.src='cg_hug.jpg';log.textContent='KK被抱抱了。'}
if(t==='kiss'){s.love+=20;kk.src='kk_shy.png';cg.src='cg_kiss.jpg';log.textContent='KK脸红了。'}
if(t==='sleep'){s.energy+=20;kk.src='kk_sleepy.png';log.textContent='KK睡着了。'}
save();
}
save();
