import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase,ref,onValue,set,update,off } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
const $=id=>document.getElementById(id);
const requiredConfig=['apiKey','authDomain','databaseURL','projectId','storageBucket','messagingSenderId','appId'];
let firebaseConfig;
try {
  ({firebaseConfig}=await import('./firebase-config.js'));
} catch {
  firebaseConfig=null;
}
const isConfigured=firebaseConfig&&requiredConfig.every(key=>{const value=firebaseConfig[key];return typeof value==='string'&&value.trim()&&!value.includes('YOUR_')});
if(!isConfigured){
  $('firebaseConfigMessage').hidden=false;
  throw new Error('Firebase is not configured. Copy firebase-config.example.js to firebase-config.js and add your own Firebase web configuration.');
}
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app);let user=null,listener=null,chart=null;
const money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(v)||0),when=v=>v?new Date(v).toLocaleString():'—';
const show=(id,on)=>$(id).style.display=on?'flex':'none';$('showSignupBtn').onclick=()=>{show('authSection',false);show('signupSection',true)};$('showLoginBtn').onclick=()=>{show('signupSection',false);show('authSection',true)};
$('loginForm').onsubmit=async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,$('email').value,$('password').value)}catch(x){alert(x.message)}};
$('signupForm').onsubmit=async e=>{e.preventDefault();try{const c=await createUserWithEmailAndPassword(auth,$('signupEmail').value,$('signupPassword').value);await set(ref(db,`users/${c.user.uid}`),{targetAmount:1000,depositHistory:{},history:{},device:{status:'not_configured'},sensor:{status:'not_configured'}})}catch(x){alert(x.message)}};$('logoutBtn').onclick=()=>signOut(auth);
onAuthStateChanged(auth,u=>{user=u;show('authSection',!u);show('signupSection',false);show('dashboardSection',!!u);$('logoutBtn').style.display=u?'block':'none';if(u)init(u.uid);else if(listener)off(listener)});
function init(uid){listener=onValue(ref(db,`users/${uid}`),s=>render(s.val()||{}))}
function render(d){$('totalSavingsVal').textContent=money(d.totalSavings);$('targetAmountVal').textContent=money(d.targetAmount);$('remainingAmountVal').textContent=money(Math.max(0,(d.targetAmount||0)-(d.totalSavings||0)));const p=d.targetAmount?Math.min(100,d.totalSavings/d.targetAmount*100):0;$('progressPercentage').textContent=p.toFixed(1)+'%';$('progressBarFill').style.width=p+'%';$('goalAlert').classList.toggle('hidden',p<100);$('lastUpdatedVal').textContent=when(d.lastUpdatedTime||d.sensor?.lastSuccessfulSync);const sim=d.mode==='simulation';if($('simulationBanner'))$('simulationBanner').hidden=!sim;$('weightVal').textContent=Number.isFinite(Number(d.sensor?.weightGrams))?Number(d.sensor.weightGrams).toFixed(1)+' g':'— g';$('sensorStatusVal').textContent=d.sensor?.status||'Unavailable';$('deviceStatusVal').textContent=d.device?.status||'Unavailable';const a=Object.values(d.depositHistory||{}).sort((x,y)=>(y.timestamp||0)-(x.timestamp||0)),l=a[0];$('latestCoinVal').textContent=l?money(l.coinDenomination):'—';$('verificationVal').textContent=l?`${l.verificationStatus||'unverified'} · ${when(l.timestamp)}`:'No deposit recorded';$('depositCountVal').textContent=d.verifiedDepositCount||a.filter(x=>x.verificationStatus==='verified').length;$('sensorErrors').textContent=d.sensor?.error||d.device?.lastError||'';renderHistory(a);renderChart(d.history||{})}
function renderHistory(a){const body=$('depositHistoryBody');body.innerHTML='';$('emptyHistory').hidden=a.length>0;a.slice(0,50).forEach(x=>{const r=document.createElement('tr');r.innerHTML=`<td>${when(x.timestamp)}</td><td>${money(x.coinDenomination)}</td><td>${x.measuredWeightChangeGrams??'—'} g</td><td>${x.verificationStatus||'unverified'}</td>`;body.appendChild(r)})}
function renderChart(h){const k=Object.keys(h).sort(),v=k.map(x=>h[x]),ctx=$('historyChart').getContext('2d');if(chart){chart.data.labels=k.length?k:['No data'];chart.data.datasets[0].data=v.length?v:[0];chart.update();return}chart=new Chart(ctx,{type:'line',data:{labels:k.length?k:['No data'],datasets:[{label:'Verified savings (₹)',data:v.length?v:[0],borderColor:'#4f46e5',backgroundColor:'rgba(79,70,229,.1)',fill:true,tension:.3}]},options:{responsive:true,maintainAspectRatio:false}})}
$('openTargetModalBtn').onclick=()=>$('targetModal').classList.add('active');$('targetModal').onclick=e=>{if(e.target===$('targetModal'))$('targetModal').classList.remove('active')};$('targetForm').onsubmit=async e=>{e.preventDefault();const v=Number($('newTargetAmount').value);if(user&&v>0){await update(ref(db,`users/${user.uid}`),{targetAmount:v,lastUpdatedTime:Date.now()});$('targetModal').classList.remove('active')}};$('resetSavingsBtn').onclick=async()=>{if(user&&confirm('Reset savings to ₹0?'))await update(ref(db,`users/${user.uid}`),{totalSavings:0,verifiedDepositCount:0,history:{},lastUpdatedTime:Date.now()})};
