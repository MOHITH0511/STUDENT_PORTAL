const subjects = [
  {name:"Discrete Mathematics", short:"Discrete Math", attendance:78, marks:76, grade:"B+", color:"blue"},
  {name:"Java Programming", short:"Java Programming", attendance:92, marks:91, grade:"A+", color:"purple"},
  {name:"Computer Networks", short:"Computer Networks", attendance:84, marks:80, grade:"A", color:"green"},
  {name:"Machine Learning", short:"Machine Learning", attendance:88, marks:85, grade:"A", color:"orange"},
  {name:"Operating Systems", short:"Operating Systems", attendance:70, marks:78, grade:"B+", color:"blue"}
];
const schedule = {
  Monday:[
    ["09:00 AM","Discrete Mathematics","Room B-204","Lecture"],
    ["10:00 AM","Java Programming","Lab 3","Practical"],
    ["11:30 AM","Computer Networks","Room A-105","Lecture"],
    ["02:00 PM","Machine Learning","Room C-101","Lecture"]
  ],
  Tuesday:[
    ["09:00 AM","Operating Systems","Room A-202","Lecture"],
    ["10:30 AM","Machine Learning","Lab 2","Practical"],
    ["12:00 PM","Discrete Mathematics","Room B-204","Tutorial"],
    ["02:00 PM","Java Programming","Room C-105","Lecture"]
  ],
  Wednesday:[
    ["09:30 AM","Computer Networks","Room A-105","Lecture"],
    ["11:00 AM","Java Programming","Lab 3","Practical"],
    ["01:00 PM","Operating Systems","Room A-202","Lecture"]
  ],
  Thursday:[
    ["09:00 AM","Machine Learning","Room C-101","Lecture"],
    ["10:30 AM","Discrete Mathematics","Room B-204","Lecture"],
    ["12:00 PM","Computer Networks","Lab 1","Practical"],
    ["02:00 PM","Java Programming","Room C-105","Tutorial"]
  ],
  Friday:[
    ["09:00 AM","Java Programming","Room C-105","Lecture"],
    ["10:30 AM","Operating Systems","Room A-202","Practical"],
    ["12:00 PM","Machine Learning","Room C-101","Tutorial"],
    ["02:00 PM","Computer Networks","Room A-105","Lecture"]
  ],
  Saturday:[
    ["09:30 AM","Weekly Revision","Library","Self-study"],
    ["11:00 AM","Doubt Clearing","Room B-204","Tutorial"]
  ]
};
const initialTasks = [
  {id:1,title:"Revise graph theory basics",subject:"Discrete Mathematics",date:"",done:true},
  {id:2,title:"Practice Java loops and arrays",subject:"Java Programming",date:"",done:true},
  {id:3,title:"Review OS process scheduling",subject:"Operating Systems",date:"",done:true},
  {id:4,title:"Complete computer networks notes",subject:"Computer Networks",date:"",done:false},
  {id:5,title:"Solve ML classification questions",subject:"Machine Learning",date:"",done:false}
];
let tasks = loadTasks();
let currentSuggestion = null;
let toastTimer;

function loadTasks(){
  try { const stored=localStorage.getItem("campuslyTasks"); return stored ? JSON.parse(stored) : initialTasks.map(t=>({...t})); }
  catch(e){ return initialTasks.map(t=>({...t})); }
}
function saveTasks(){ localStorage.setItem("campuslyTasks",JSON.stringify(tasks)); }
function showToast(message){
  const toast=document.getElementById("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function goToSection(name){
  const target=document.getElementById("section-"+name); if(!target)return;
  document.querySelectorAll(".page-section").forEach(s=>s.classList.remove("active"));
  target.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.section===name));
  const labels={dashboard:"Dashboard",attendance:"Attendance",marks:"Marks & Grades",timetable:"Timetable",planner:"Study Planner",assistant:"AI Study Assistant"};
  document.getElementById("breadcrumbCurrent").textContent=labels[name]||"Dashboard";
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>goToSection(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goToSection(b.dataset.go)));
document.getElementById("helpButton").addEventListener("click",()=>goToSection("assistant"));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("dismissNotice").addEventListener("click",()=>document.getElementById("dismissNotice").parentElement.remove());
document.getElementById("resetButton").addEventListener("click",()=>{
  if(confirm("Reset the study planner to the original demo tasks?")){tasks=initialTasks.map(t=>({...t}));saveTasks();renderTasks();showToast("Demo tasks have been reset.");}
});

function renderSubjectBars(){
  document.getElementById("dashboardAttendance").innerHTML=subjects.map(s=>`
    <div class="subject-row"><span class="subject-name">${s.short}</span><div class="bar-track"><i class="${s.attendance<75?"low":""}" style="width:${s.attendance}%"></i></div><span class="subject-percent">${s.attendance}%</span></div>`).join("");
  document.getElementById("attendanceDetails").innerHTML=subjects.map(s=>`
    <div class="attendance-entry"><div class="entry-name"><strong>${s.name}</strong><small>Attendance record • Demo</small></div><div class="bar-track"><i class="${s.attendance<75?"low":""}" style="width:${s.attendance}%"></i></div><div class="entry-status ${s.attendance<75?"low-status":""}">${s.attendance<75?"Below target":"On track"}</div></div>`).join("");
}
function renderMarks(){
  document.getElementById("marksTable").innerHTML=subjects.map(s=>`
    <div class="marks-entry"><div class="entry-name"><strong>${s.name}</strong><small>Internal assessment • Demo</small></div><div class="bar-track"><i style="width:${s.marks}%;background:${s.marks>=90?"#20ad7b":s.marks>=80?"#5369ef":"#a38be6"}"></i></div><div class="entry-score">${s.marks}/100 <span class="task-tag">${s.grade}</span></div></div>`).join("");
}
function renderSchedule(day="Monday",limit=0){
  const entries=schedule[day]||[];
  const html=entries.slice(0,limit||entries.length).map(item=>`<div class="${limit?"schedule-item":"timetable-entry"}"><div class="${limit?"schedule-time":"timetable-time"}">${item[0]}</div><div class="${limit?"schedule-line":"timetable-line"}"></div><div class="${limit?"schedule-info":"timetable-subject"}"><strong>${item[1]}</strong><small>${item[3]}</small></div>${limit?"":`<span class="room-tag">${item[2]}</span>`}</div>`).join("");
  return html||'<div class="empty-state">No classes scheduled. Use this time for revision!</div>';
}
document.getElementById("todaySchedule").innerHTML=renderSchedule("Monday",3);
function setDay(day){
  document.querySelectorAll(".day-tab").forEach(b=>b.classList.toggle("active",b.dataset.day===day));
  document.getElementById("timetableDayTitle").textContent=day+"'s classes";
  document.getElementById("timetableList").innerHTML=renderSchedule(day);
}
document.querySelectorAll(".day-tab").forEach(b=>b.addEventListener("click",()=>setDay(b.dataset.day)));
setDay("Monday");

function taskMarkup(task){
  return `<div class="task-item ${task.done?"done":""}"><input class="task-check" type="checkbox" data-task-check="${task.id}" ${task.done?"checked":""} aria-label="Mark ${escapeHtml(task.title)} complete"><div class="task-text"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.subject)}${task.date?" • Due "+escapeHtml(task.date):""}</small></div><span class="task-tag">${task.done?"Completed":"Pending"}</span><button class="delete-task" data-delete-task="${task.id}" aria-label="Delete task">×</button></div>`;
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderTasks(){
  saveTasks();
  const all=tasks.map(taskMarkup).join("")||'<div class="empty-state">No tasks yet. Add your first study task above.</div>';
  document.getElementById("plannerTasks").innerHTML=all;
  document.getElementById("dashboardTasks").innerHTML=tasks.slice(0,4).map(taskMarkup).join("")||'<div class="empty-state">No study tasks yet.</div>';
  const done=tasks.filter(t=>t.done).length,total=tasks.length,pending=total-done;
  document.getElementById("taskStat").innerHTML=`${done}<span>/${total}</span>`;
  document.getElementById("taskProgress").style.width=(total?done/total*100:0)+"%";
  document.getElementById("plannerTotal").textContent=total;
  document.getElementById("plannerCompleted").textContent=done;
  document.getElementById("plannerPending").textContent=pending;
  document.querySelectorAll("[data-task-check]").forEach(input=>input.addEventListener("change",()=>{
    const task=tasks.find(t=>t.id===Number(input.dataset.taskCheck)); if(task){task.done=input.checked;renderTasks();}
  }));
  document.querySelectorAll("[data-delete-task]").forEach(button=>button.addEventListener("click",()=>{
    tasks=tasks.filter(t=>t.id!==Number(button.dataset.deleteTask));renderTasks();showToast("Task deleted.");
  }));
}
document.getElementById("taskForm").addEventListener("submit",event=>{
  event.preventDefault();
  const title=document.getElementById("taskName").value.trim();
  if(!title){showToast("Please enter a task name.");return;}
  tasks.unshift({id:Date.now(),title,subject:document.getElementById("taskSubject").value,date:document.getElementById("taskDate").value,done:false});
  renderTasks();event.target.reset();showToast("Study task added.");goToSection("planner");
});
document.getElementById("clearCompleted").addEventListener("click",()=>{
  const before=tasks.length;tasks=tasks.filter(t=>!t.done);renderTasks();showToast(before===tasks.length?"No completed tasks to clear.":"Completed tasks cleared.");
});

const studyTips={
  "Discrete Mathematics":{
    low:["Start with one definition at a time, then work through a simple example.","Draw a small graph or set diagram and explain each step aloud.","Solve two easy problems before attempting a harder one."],
    medium:["Review the key definitions, then solve three practice questions without notes.","Compare two similar concepts and write one example of each.","Work through one solved problem, cover the solution, and recreate it."],
    high:["Try a mixed set of problems without notes.","Explain a theorem in your own words and test it with an example.","Challenge yourself with one exam-style question, then check your reasoning."]
  },
  "Java Programming":{
    low:["Review one syntax concept, then type a tiny example yourself.","Trace a short loop line by line and write down each variable's value.","Practice one small program, such as checking whether a number is even."],
    medium:["Write a small program using arrays or loops without copying a solution.","Predict the output of three short code snippets, then run them.","Review a previous error and write down how you fixed it."],
    high:["Solve one coding challenge with a time limit.","Refactor a working program into smaller methods.","Explain the time and space complexity of a simple solution."]
  },
  "Computer Networks":{
    low:["Sketch the OSI layers and add one example for each layer.","Learn three networking terms and create a real-world analogy for each.","Draw how a browser request travels from a device to a server."],
    medium:["Compare TCP and UDP in a two-column table.","Explain the steps of DNS lookup from memory.","Answer five short questions on routing, addressing, or protocols."],
    high:["Solve a subnetting exercise and verify every step.","Trace a packet through the layers and identify each header's role.","Answer an exam-style question, then summarize the answer in five lines."]
  },
  "Machine Learning":{
    low:["Write simple definitions for data, features, labels, and model.","Use a small example to distinguish supervised and unsupervised learning.","Review one algorithm's purpose and explain it in everyday language."],
    medium:["Compare two algorithms and note when each might be useful.","Sketch a basic ML workflow from data collection to evaluation.","Review accuracy, precision, and recall with a small example."],
    high:["Choose a model and explain why it suits a given dataset.","Compare two evaluation metrics and describe their limitations.","Work through a small example of overfitting and how to reduce it."]
  },
  "Operating Systems":{
    low:["Draw the process states and explain each transition.","Learn the difference between a process and a thread using an example.","Trace a simple scheduling example with two or three processes."],
    medium:["Compare FCFS, SJF, and Round Robin scheduling.","Review deadlock conditions and create a short example.","Explain paging and virtual memory with a simple diagram."],
    high:["Calculate waiting and turnaround times for a scheduling problem.","Compare two page-replacement algorithms on a sample reference string.","Answer an exam-style question on synchronization or deadlocks."]
  }
};
function generateSuggestion(){
  const subject=document.getElementById("assistantSubject").value;
  const confidence=document.getElementById("confidence").value;
  const minutes=Number(document.getElementById("studyTime").value);
  const tips=studyTips[subject][confidence];
  const parts=minutes<=15?[{t:"Focus (3 min)",d:"Recall the key ideas you already know and list one question."},{t:"Practice (9 min)",d:tips[0]},{t:"Wrap up (3 min)",d:"Write one takeaway and one thing to revisit."}]:
    minutes<=30?[{t:"Warm up (5 min)",d:"Review your notes and list the two most important concepts."},{t:"Focused practice (20 min)",d:tips[0]+" "+tips[1]},{t:"Quick recap (5 min)",d:"Summarize what you learned without looking at your notes."}]:
    [{t:"Review (10 min)",d:"Recall key definitions or formulas from memory."},{t:"Focused practice ("+(minutes-20)+" min)",d:tips[0]+" "+tips[1]},{t:"Self-check (10 min)",d:tips[2]},{t:"Wrap up (5 min)",d:"Record what went well and choose the next topic to revise."}];
  currentSuggestion={subject,title:`${minutes}-minute ${subject} plan`,steps:parts};
  document.getElementById("suggestionTitle").textContent=currentSuggestion.title;
  document.getElementById("suggestionIntro").textContent=confidence==="low"?"We'll start small and build confidence with clear, manageable steps.":confidence==="high"?"Let's use your confidence to practise recall and tackle a more challenging task.":"This plan mixes review, practice, and a short recap.";
  document.getElementById("suggestionSteps").innerHTML=parts.map((p,i)=>`<div class="suggestion-step"><span>${String(i+1).padStart(2,"0")}</span><p><strong>${p.t}</strong>${escapeHtml(p.d)}</p></div>`).join("");
  document.getElementById("addSuggestionTask").disabled=false;
}
document.getElementById("assistantForm").addEventListener("submit",event=>{event.preventDefault();generateSuggestion();showToast("Your study suggestion is ready.");});
document.getElementById("addSuggestionTask").addEventListener("click",()=>{
  if(!currentSuggestion)return;
  tasks.unshift({id:Date.now(),title:currentSuggestion.title,subject:currentSuggestion.subject,date:"",done:false});
  renderTasks();showToast("Study plan added to your planner.");goToSection("planner");
});
renderSubjectBars();renderMarks();renderTasks();
