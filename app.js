const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY="finalExamClass28";
let saved=JSON.parse(localStorage.getItem(KEY)||"{}");
function norm(s){return (s||"").toLowerCase().trim().replace(/[’‘]/g,"'").replace(/[.,!?;:“”"]/g,"").replace(/\s+/g," ")}
function save(){localStorage.setItem(KEY,JSON.stringify(saved));updateProgress();updateFinalScore();}
function qid(q){return "q"+$$(".q").indexOf(q)}
function markDone(q,ok,value){saved[qid(q)]={done:true,ok,value};save();}
function restore(){
  $$(".q").forEach(q=>{
    const s=saved[qid(q)]; if(!s)return;
    if(q.dataset.type==="text"){
      const input=q.querySelector(".answer-input");input.value=s.value||"";showTextFeedback(q,s.ok);
    }else{
      const b=q.querySelector('[data-value="'+s.value+'"]');if(b){b.classList.add("selected");showChoiceFeedback(q,b,s.ok);}
    }
  });
}
function showTextFeedback(q,ok){
  const fb=q.querySelector(".feedback"),ans=q.dataset.answer;
  fb.className="feedback show "+(ok?"good":"bad");
  fb.textContent=ok?"✓ 맞았어요!":"정답: "+ans;
}
function showChoiceFeedback(q,btn,ok){
  const fb=q.querySelector(".feedback"),ans=q.dataset.answer;
  q.querySelectorAll(".choices button").forEach(b=>{b.disabled=true;if(b.dataset.value===ans)b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  fb.className="feedback show "+(ok?"good":"bad");
  const ex=fb.dataset.explain||""; fb.textContent=(ok?"✓ 맞았어요! ":"정답을 확인해보세요. ")+ex;
}
$$(".nav-btn").forEach(b=>b.onclick=()=>{
  $$(".nav-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  $$(".lesson-section").forEach(s=>s.classList.add("hidden"));$("#"+b.dataset.target).classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});
$$(".q[data-type=choice] .choices button").forEach(btn=>btn.onclick=()=>{
  const q=btn.closest(".q"); if(saved[qid(q)]?.done)return;
  q.querySelectorAll(".choices button").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");
  const ok=btn.dataset.value===q.dataset.answer;showChoiceFeedback(q,btn,ok);markDone(q,ok,btn.dataset.value);
});
$$(".q[data-type=text] .check-btn").forEach(btn=>btn.onclick=()=>{
  const q=btn.closest(".q"),input=q.querySelector(".answer-input"),v=input.value;if(!v.trim())return;
  const ok=norm(v)===norm(q.dataset.answer);showTextFeedback(q,ok);markDone(q,ok,v);
});
$$(".answer-input").forEach(input=>input.addEventListener("keydown",e=>{if(e.key==="Enter")input.closest(".q").querySelector(".check-btn").click()}));
function updateProgress(){
  const total=$$(".q").length,done=Object.values(saved).filter(x=>x.done).length,p=Math.round(done/total*100);
  $("#progressText").textContent=p+"%";$("#progressBar").style.width=p+"%";
}
function updateFinalScore(){
  const qs=$$("#final .q"),done=qs.filter(q=>saved[qid(q)]?.done),score=done.filter(q=>saved[qid(q)]?.ok).length;
  $("#finalScore").textContent=done.length?score+" / "+qs.length+(done.length<qs.length?" (진행 중)":""):"아직 채점 전";
}
$("#resetBtn").onclick=()=>{if(confirm("이 브라우저에 저장된 28강 답안을 모두 초기화할까요?")){localStorage.removeItem(KEY);location.reload()}};
restore();updateProgress();updateFinalScore();