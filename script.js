const box=document.getElementById('results');
function tilt(){document.querySelectorAll('.tilt').forEach(c=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`};
 c.onmouseleave=()=>c.style.transform='';});}
function card(i){return `<article class="card tilt"><img src="${i.imageUrl}" alt="${i.name}"><div class="body"><h3>${i.name}</h3><p>${i.description}</p></div></article>`}
async function search(term){
 const t=term.trim().toLowerCase();if(!t){box.innerHTML='';return}
 try{const d=await (await fetch('travel_recommendation_api.json')).json();let out=[];
 if(/^beach(es)?$/.test(t))out=d.beaches;
 else if(/^temple(s)?$/.test(t))out=d.temples;
 else if(/^countr(y|ies)$/.test(t))out=d.countries.flatMap(c=>c.cities);
 else{const c=d.countries.find(c=>c.name.toLowerCase().includes(t));
  if(c)out=c.cities;else{out=[...d.beaches,...d.temples,...d.countries.flatMap(c=>c.cities)].filter(i=>i.name.toLowerCase().includes(t))}}
 box.innerHTML=out.length?out.map(card).join(''):'<p class="msg">No matches. Try beach, temple, country, or a country name like Japan.</p>';tilt();
 box.scrollIntoView({behavior:'smooth'});}catch(e){box.innerHTML='<p class="msg">Could not load recommendations. Run the site from a web server or GitHub Pages.</p>'}}
const sf=document.getElementById('sf');
if(sf){sf.onsubmit=e=>{e.preventDefault();search(document.getElementById('q').value)};
 document.getElementById('reset').onclick=()=>{document.getElementById('q').value='';box.innerHTML=''}}
tilt();

const cf=document.getElementById('cf');
if(cf){cf.onsubmit=e=>{e.preventDefault();const f=new FormData(cf);
 const body=`Name: ${f.get('name')}\nEmail: ${f.get('email')}\n\n${f.get('message')}`;
 location.href=`mailto:${cf.dataset.to}?subject=${encodeURIComponent('Message from '+f.get('name'))}&body=${encodeURIComponent(body)}`;
 document.getElementById('ok').hidden=false}}
