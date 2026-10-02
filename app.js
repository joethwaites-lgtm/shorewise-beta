const spots={
  brighton:{name:'Brighton West Pier',wind:14,gust:21,dir:'SW',angle:'Cross-offshore',alt:'Ardingly Reservoir',meta:'19 miles away · 32 min drive',bearing:'west'},
  poole:{name:'Poole Harbour',wind:10,gust:15,dir:'W',angle:'Cross-shore',alt:'Hamworthy Park',meta:'4 miles away · 12 min drive',bearing:'west'},
  hayling:{name:'Hayling Island',wind:18,gust:27,dir:'SW',angle:'Cross-onshore',alt:'Emsworth Channel',meta:'7 miles away · 16 min drive',bearing:'south-west'},
  camber:{name:'Camber Sands',wind:16,gust:24,dir:'S',angle:'Onshore',alt:'Bewl Water',meta:'28 miles away · 44 min drive',bearing:'south'}
};
const sportNames={sup:'SUP',wing:'Wing foil',windsurf:'Windsurf',kite:'Kite'};
const state={sport:'sup',skill:'beginner',spot:'brighton',checks:[false,false,false,false],kit:{leash:true,pfd:false}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const checklist=['I have a leash and buoyancy aid','Someone knows my route and return time','I’m not going out alone','I’ve checked local notices and the sky'];

function classify(){
  const d=spots[state.spot];
  let score=0;
  if(d.angle.includes('offshore')) score+=state.sport==='sup'?3:state.sport==='kite'?3:1;
  if(d.wind>15) score+=state.skill==='beginner'?2:1;
  if(d.gust-d.wind>=8) score+=1;
  if(state.sport==='wing'&&d.wind<12) score+=1;
  if(state.skill==='intermediate') score=Math.max(0,score-1);
  return score>=3?'red':score>=1?'amber':'green';
}
function verdictText(level){
  const d=spots[state.spot],beginner=state.skill==='beginner';
  if(level==='green') return {label:'Good to go',title:beginner?'A good window to build confidence':'Conditions look promising',copy:`${d.dir} ${d.wind} mph, with a manageable gust spread and a ${d.angle.toLowerCase()} direction.`,advice:`Start by heading ${d.bearing} into the wind, so it helps bring you home when you’re tired.`};
  if(level==='red') return {label:'Choose another spot',title:beginner?'Not safe for your setup':'High-risk conditions',copy:d.angle.includes('offshore')?'The wind will push you away from shore. Choose sheltered water or wait for it to change.':`Gusts up to ${d.gust} mph could make control and returning to shore difficult.`,advice:`Don’t launch here. ${d.alt} is the safer choice in today’s wind.`};
  return {label:'Take care',title:beginner?'Not ideal for a beginner':'Possible, with extra care',copy:`The ${d.dir} wind and gusts need confident control. Stay close to your launch and reassess before going out.`,advice:`Head ${d.bearing} into the wind first, so it helps bring you home when you’re tired.`};
}
function render(){
  const d=spots[state.spot],level=classify(),copy=verdictText(level),card=$('#verdictCard');
  card.className=`verdict-card ${level}`;$('#verdictLabel').textContent=copy.label;$('#verdictTitle').textContent=copy.title;$('#verdictCopy').textContent=copy.copy;$('#adviceText').innerHTML=`<strong>${level==='red'?'Our advice:':'If you do launch:'}</strong> ${copy.advice}`;
  $('#windSpeed').textContent=d.wind;$('#windDir').textContent=d.dir;$('#gustText').textContent=`gusts ${d.gust}`;$('#angleDetail').textContent=d.angle;$('#altName').textContent=d.alt;$('#altMeta').textContent=d.meta;$('#skillQuick').textContent=state.skill[0].toUpperCase()+state.skill.slice(1);
  $$('.segmented button').forEach(b=>b.classList.toggle('active',b.dataset.sport===state.sport));
  const hours=[9,10,11,12,13,14];$('#hourStrip').innerHTML=hours.map((h,i)=>{const speed=Math.max(5,d.wind+[-3,-1,0,1,-1,-4][i]);return `<div class="hour ${i===1?'now':''} ${speed<12?'best':''}"><span>${h===12?'12pm':h>12?(h-12)+'pm':h+'am'}</span><i>${d.dir==='S'?'↑':'↗'}</i><b>${speed}</b><small>mph</small></div>`}).join('');
  const reasons=[
    {tone:d.angle.includes('offshore')?'bad':'good',name:'Wind direction',status:d.angle,desc:d.angle.includes('offshore')?'Can carry a beginner away from shore.':'Helps keep you connected to shore.'},
    {tone:d.wind>15?'warn':'good',name:'Wind strength',status:`${d.wind} mph`,desc:d.wind>15?'Demanding for a beginner.':'Within your chosen skill range.'},
    {tone:d.gust-d.wind>=8?'warn':'good',name:'Gust spread',status:`+${d.gust-d.wind} mph`,desc:d.gust-d.wind>=8?'Sudden surges may affect control.':'Relatively steady wind.'}
  ];
  $('#reasonList').innerHTML=reasons.map(r=>`<div class="reason ${r.tone}"><div class="reason-top"><strong>${r.name}</strong><span>${r.status}</span></div><p>${r.desc}</p></div>`).join('');
  renderChecklist();
}
function renderChecklist(){
  $('#checklistItems').innerHTML=checklist.map((x,i)=>`<label class="check-row"><input type="checkbox" data-check="${i}" ${state.checks[i]?'checked':''}><span class="fake-check"></span><span>${x}</span></label>`).join('');
  const done=state.checks.filter(Boolean).length;$('#progress').textContent=`${done} / 4`;$('#checkNote').textContent=done===4?'All checked. Pause once more at the water’s edge.':'Tick every item before you get on the water.';$('#checkNote').classList.toggle('complete',done===4);
}
function saveSetup(){
  state.sport=new FormData($('#setupForm')).get('sport');state.skill=new FormData($('#setupForm')).get('skill');state.kit.leash=$('[name="leash"]').checked;state.kit.pfd=$('[name="pfd"]').checked;
  try{localStorage.setItem('shorewise-profile',JSON.stringify({sport:state.sport,skill:state.skill,kit:state.kit}))}catch(e){}
  render();showToast(`Forecast tuned for ${state.skill} ${sportNames[state.sport]}`);
}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
$('#spotSelect').addEventListener('change',e=>{state.spot=e.target.value;state.checks.fill(false);render()});
$$('.segmented button').forEach(b=>b.addEventListener('click',()=>{state.sport=b.dataset.sport;render()}));
$('#skillQuick').addEventListener('click',()=>{$(`[name="skill"][value="${state.skill}"]`).checked=true;$('#setupDialog').showModal()});
$('#profileButton').addEventListener('click',()=>$('#setupDialog').showModal());
$('#setupForm').addEventListener('submit',saveSetup);
$('#checklistItems').addEventListener('change',e=>{if(e.target.dataset.check!==undefined){state.checks[+e.target.dataset.check]=e.target.checked;renderChecklist()}});
$('#detailToggle').addEventListener('click',()=>{const grid=$('#detailGrid'),open=grid.hidden;grid.hidden=!open;$('#detailToggle').innerHTML=`${open?'Hide':'Show'} detail <span>${open?'⌃':'⌄'}</span>`});
$('#routeButton').addEventListener('click',()=>{const match=Object.entries(spots).find(([,s])=>s.name===spots[state.spot].alt);if(match){state.spot=match[0];$('#spotSelect').value=match[0];render();scrollTo({top:0,behavior:'smooth'})}else showToast(`${spots[state.spot].alt} detail is next on the v1 spot list`)});
try{const saved=JSON.parse(localStorage.getItem('shorewise-profile'));if(saved){Object.assign(state,saved)}else setTimeout(()=>$('#setupDialog').showModal(),350)}catch(e){setTimeout(()=>$('#setupDialog').showModal(),350)}
render();

if(document.modelContext?.registerTool){
  const fail=m=>{throw new Error(m)};
  Promise.resolve(document.modelContext.registerTool({name:'check_conditions',title:'Check watersports conditions',description:'Select a supported spot, sport and skill level and show the matching safety verdict.',inputSchema:{type:'object',properties:{spot:{type:'string',enum:Object.keys(spots)},sport:{type:'string',enum:Object.keys(sportNames)},skill:{type:'string',enum:['beginner','intermediate']}},required:['spot','sport','skill'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!spots[input.spot]||!sportNames[input.sport]||!['beginner','intermediate'].includes(input.skill))fail('Unsupported forecast selection');Object.assign(state,input);$('#spotSelect').value=state.spot;render();return {spot:spots[state.spot].name,sport:sportNames[state.sport],skill:state.skill,verdict:classify(),summary:verdictText(classify()).title}}})).catch(()=>{});
}
