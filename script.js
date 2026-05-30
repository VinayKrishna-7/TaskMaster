// ==========================================
// TASKMASTER PRO V2
// STATE
// ==========================================

let tasks =
JSON.parse(
localStorage.getItem("tm_tasks")
) || [];

let currentView =
"dashboard";

let currentFilter =
"all";

let currentCategory =
"all";

let currentSearch =
"";

let streak =
Number(
localStorage.getItem(
"tm_streak"
)
) || 0;

// ==========================================
// DOM
// ==========================================

const taskModal =
document.getElementById(
"taskModal"
);

const taskForm =
document.getElementById(
"taskForm"
);

const fab =
document.getElementById(
"fab"
);

const searchInput =
document.getElementById(
"searchInput"
);

const themeToggle =
document.getElementById(
"themeToggle"
);

const taskList =
document.getElementById(
"taskList"
);

const totalTasks =
document.getElementById(
"totalTasks"
);

const completedTasks =
document.getElementById(
"completedTasks"
);

const pendingTasks =
document.getElementById(
"pendingTasks"
);

const streakCount =
document.getElementById(
"streakCount"
);

const productivityScore =
document.getElementById(
"productivityScore"
);

const progressFill =
document.getElementById(
"progressFill"
);

const progressPercent =
document.getElementById(
"progressPercent"
);

// ==========================================
// SAVE
// ==========================================

function saveTasks(){

localStorage.setItem(
"tm_tasks",
JSON.stringify(tasks)
);

}

function saveStreak(){

localStorage.setItem(
"tm_streak",
streak
);

}

// ==========================================
// HELPERS
// ==========================================

function generateId(){

return Date.now() +
Math.floor(
Math.random() * 9999
);

}

function today(){

return new Date()
.toISOString()
.split("T")[0];

}

function isOverdue(task){

if(task.completed)
return false;

if(!task.dueDate)
return false;

return (
new Date(task.dueDate)
<
new Date()
);

}

function completionRate(){

if(tasks.length === 0)
return 0;

const completed =
tasks.filter(
task =>
task.completed
).length;

return Math.round(
(completed /
tasks.length) * 100
);

}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const menuButtons =
document.querySelectorAll(
".menu-btn"
);

menuButtons.forEach(
btn => {

btn.addEventListener(
"click",
() => {

menuButtons.forEach(
button =>
button.classList.remove(
"active"
)
);

btn.classList.add(
"active"
);

currentView =
btn.dataset.view;

showView();

}
);

}
);

function showView(){

document
.getElementById(
"dashboardView"
)
.classList.add(
"hidden"
);

document
.getElementById(
"tasksView"
)
.classList.add(
"hidden"
);

document
.getElementById(
"calendarView"
)
.classList.add(
"hidden"
);

document
.getElementById(
"analyticsView"
)
.classList.add(
"hidden"
);

document
.getElementById(
"settingsView"
)
.classList.add(
"hidden"
);

if(
currentView ===
"dashboard"
){

document
.getElementById(
"dashboardView"
)
.classList.remove(
"hidden"
);

}

if(
currentView ===
"tasks"
){

document
.getElementById(
"tasksView"
)
.classList.remove(
"hidden"
);

}

if(
currentView ===
"calendar"
){

document
.getElementById(
"calendarView"
)
.classList.remove(
"hidden"
);

}

if(
currentView ===
"analytics"
){

document
.getElementById(
"analyticsView"
)
.classList.remove(
"hidden"
);

}

if(
currentView ===
"settings"
){

document
.getElementById(
"settingsView"
)
.classList.remove(
"hidden"
);

}

}

// ==========================================
// MODAL
// ==========================================

fab.addEventListener(
"click",
() => {

taskModal.classList.add(
"show"
);

}
);

window.addEventListener(
"click",
e => {

if(
e.target ===
taskModal
){

taskModal.classList.remove(
"show"
);

}

}
);

// ==========================================
// DARK MODE
// ==========================================

const savedTheme =
localStorage.getItem(
"tm_theme"
);

if(
savedTheme ===
"dark"
){

document.body.classList.add(
"dark"
);

}

themeToggle.addEventListener(
"click",
() => {

document.body.classList.toggle(
"dark"
);

localStorage.setItem(

"tm_theme",

document.body.classList.contains(
"dark"
)
?
"dark"
:
"light"

);

}
);

// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
"input",
e => {

currentSearch =
e.target.value
.toLowerCase();

renderTasks();

}
);

// ==========================================
// CREATE TASK
// ==========================================

taskForm.addEventListener(
"submit",
e => {

e.preventDefault();

const title =
document
.getElementById(
"taskTitle"
)
.value
.trim();

if(!title)
return;

const task = {

id:generateId(),

title,

description:
document
.getElementById(
"taskDescription"
)
.value,

category:
document
.getElementById(
"taskCategory"
)
.value,

priority:
document
.getElementById(
"taskPriority"
)
.value,

dueDate:
document
.getElementById(
"taskDate"
)
.value,

completed:false,

createdAt:
Date.now()

};

tasks.unshift(
task
);

saveTasks();

taskForm.reset();

taskModal.classList.remove(
"show"
);

updateDashboard();

renderTasks();

}
);
// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks(){

if(!taskList)
return;

let filtered =
[...tasks];

// SEARCH

if(currentSearch){

filtered =
filtered.filter(
task =>

task.title
.toLowerCase()
.includes(
currentSearch
)

||

task.description
.toLowerCase()
.includes(
currentSearch
)

);

}

// FILTER STATUS

const statusFilter =
document.getElementById(
"filterStatus"
);

if(statusFilter){

const value =
statusFilter.value;

if(value === "active"){

filtered =
filtered.filter(
task =>
!task.completed
);

}

if(value === "completed"){

filtered =
filtered.filter(
task =>
task.completed
);

}

if(value === "high"){

filtered =
filtered.filter(
task =>
task.priority ===
"high"
);

}

}

// CATEGORY

const categoryFilter =
document.getElementById(
"filterCategory"
);

if(
categoryFilter &&
categoryFilter.value !==
"all"
){

filtered =
filtered.filter(
task =>
task.category ===
categoryFilter.value
);

}

// SORT

filtered.sort(
(a,b)=>
b.createdAt -
a.createdAt
);

taskList.innerHTML = "";

// EMPTY

if(filtered.length === 0){

taskList.innerHTML =

`
<li class="task-card">

<div>

<h3>
No tasks found
</h3>

<p>
Create a task to get started
</p>

</div>

</li>
`;

return;

}

// TASK CARD

filtered.forEach(task => {

const li =
document.createElement(
"li"
);

li.className =
"task-card";

const priorityColor =

task.priority === "high"
?
"#ef4444"

:

task.priority === "medium"
?
"#f59e0b"

:

"#10b981";

li.innerHTML = `

<div
style="
display:flex;
gap:15px;
width:100%;
justify-content:space-between;
">

<div>

<div
style="
display:flex;
align-items:center;
gap:10px;
margin-bottom:10px;
">

<input
type="checkbox"
class="task-check"
${task.completed
? "checked"
: ""}
>

<h3
style="
${task.completed
?
'text-decoration:line-through;opacity:.6;'
:
''
}
">

${task.title}

</h3>

</div>

<p
style="
opacity:.8;
margin-bottom:12px;
">

${task.description}

</p>

<div
style="
display:flex;
gap:8px;
flex-wrap:wrap;
">

<span
class="badge"
style="
background:${priorityColor};
color:white;
">

${task.priority}

</span>

<span
class="badge">

${task.category}

</span>

${
task.dueDate
?
`
<span
class="badge">

📅 ${task.dueDate}

</span>
`
:
""
}

${
isOverdue(task)
?
`
<span
class="badge"
style="
background:#ef4444;
color:white;
">

Overdue

</span>
`
:
""
}

</div>

</div>

<div
style="
display:flex;
gap:10px;
">

<button
class="edit-task"
data-id="${task.id}">

✏️

</button>

<button
class="delete-task"
data-id="${task.id}">

🗑️

</button>

</div>

</div>

`;

taskList.appendChild(
li
);

});

attachTaskEvents();

renderCalendar();

}

// ==========================================
// TASK EVENTS
// ==========================================

function attachTaskEvents(){

// COMPLETE

document
.querySelectorAll(
".task-check"
)
.forEach(
(check,index)=>{

check.addEventListener(
"change",
() => {

toggleTask(
tasks[index].id
);

}
);

}
);

// DELETE

document
.querySelectorAll(
".delete-task"
)
.forEach(
button => {

button.addEventListener(
"click",
() => {

const id =
Number(
button.dataset.id
);

deleteTask(
id
);

}
);

}
);

// EDIT

document
.querySelectorAll(
".edit-task"
)
.forEach(
button => {

button.addEventListener(
"click",
() => {

const id =
Number(
button.dataset.id
);

editTask(
id
);

}
);

}
);

}

// ==========================================
// COMPLETE TASK
// ==========================================

function toggleTask(id){

const task =
tasks.find(
task =>
task.id === id
);

if(!task)
return;

task.completed =
!task.completed;

if(task.completed){

streak++;

saveStreak();

}

saveTasks();

updateDashboard();

renderTasks();

}

// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id){

const confirmDelete =
confirm(
"Delete task?"
);

if(!confirmDelete)
return;

tasks =
tasks.filter(
task =>
task.id !== id
);

saveTasks();

updateDashboard();

renderTasks();

}

// ==========================================
// EDIT TASK
// ==========================================

function editTask(id){

const task =
tasks.find(
task =>
task.id === id
);

if(!task)
return;

const title =
prompt(
"Edit title",
task.title
);

if(title === null)
return;

const description =
prompt(
"Edit description",
task.description
);

task.title = title;
task.description =
description || "";

saveTasks();

updateDashboard();

renderTasks();

}

// ==========================================
// FILTERS
// ==========================================

const filterStatus =
document.getElementById(
"filterStatus"
);

if(filterStatus){

filterStatus.addEventListener(
"change",
renderTasks
);

}

const filterCategory =
document.getElementById(
"filterCategory"
);

if(filterCategory){

filterCategory.addEventListener(
"change",
renderTasks
);

}

// ==========================================
// CALENDAR VIEW
// ==========================================

function renderCalendar(){

const calendar =
document.getElementById(
"calendarTasks"
);

if(!calendar)
return;

const upcoming =
tasks
.filter(
task =>
task.dueDate
)
.sort(
(a,b)=>
new Date(
a.dueDate
) -
new Date(
b.dueDate
)
);

if(upcoming.length === 0){

calendar.innerHTML =

`
<p>
No upcoming deadlines
</p>
`;

return;

}

calendar.innerHTML =
upcoming.map(task =>

`
<div
class="task-card"
style="
margin-bottom:10px;
">

<strong>

${task.title}

</strong>

<br>

📅 ${task.dueDate}

</div>
`

).join("");

}

// ==========================================
// DASHBOARD FOCUS
// ==========================================

function renderFocusTasks(){

const focus =
document.getElementById(
"focusTasks"
);

if(!focus)
return;

const highPriority =
tasks.filter(
task =>

task.priority ===
"high"

&&

!task.completed

);

if(
highPriority.length === 0
){

focus.innerHTML =

`
<p>
No high priority tasks
</p>
`;

return;

}

focus.innerHTML =
highPriority
.slice(0,5)
.map(
task =>

`
<div
style="
padding:10px 0;
border-bottom:
1px solid rgba(0,0,0,.08);
">

🔥 ${task.title}

</div>
`

)
.join("");

}
// ==========================================
// DASHBOARD STATS
// ==========================================

function updateDashboard(){

const total =
tasks.length;

const completed =
tasks.filter(
task => task.completed
).length;

const pending =
total - completed;

const overdue =
tasks.filter(
task => isOverdue(task)
).length;

const rate =
completionRate();

// CARDS

if(totalTasks)
totalTasks.textContent =
total;

if(completedTasks)
completedTasks.textContent =
completed;

if(pendingTasks)
pendingTasks.textContent =
pending;

const overdueElement =
document.getElementById(
"overdueCount"
);

if(overdueElement)
overdueElement.textContent =
overdue;

// STREAK

if(streakCount)
streakCount.textContent =
streak;

// PRODUCTIVITY

if(productivityScore)
productivityScore.textContent =
rate + "%";

if(progressPercent)
progressPercent.textContent =
rate + "%";

if(progressFill)
progressFill.style.width =
rate + "%";

// ANALYTICS

const completionRateElement =
document.getElementById(
"completionRate"
);

if(completionRateElement)
completionRateElement.textContent =
rate + "%";

const categoryCount =
document.getElementById(
"categoryCount"
);

if(categoryCount){

const unique =
new Set(
tasks.map(
task => task.category
)
);

categoryCount.textContent =
unique.size;

}

renderFocusTasks();

}

// ==========================================
// EXPORT
// ==========================================

const exportTasksBtn =
document.getElementById(
"exportTasks"
);

if(exportTasksBtn){

exportTasksBtn.addEventListener(
"click",
() => {

const data =
JSON.stringify(
tasks,
null,
2
);

const blob =
new Blob(
[data],
{
type:
"application/json"
}
);

const url =
URL.createObjectURL(
blob
);

const link =
document.createElement(
"a"
);

link.href = url;

link.download =
"taskmaster-backup.json";

link.click();

URL.revokeObjectURL(
url
);

}
);

}

// ==========================================
// CLEAR COMPLETED
// ==========================================

const clearCompletedBtn =
document.getElementById(
"clearCompleted"
);

if(clearCompletedBtn){

clearCompletedBtn.addEventListener(
"click",
() => {

const ok =
confirm(
"Delete completed tasks?"
);

if(!ok)
return;

tasks =
tasks.filter(
task =>
!task.completed
);

saveTasks();

updateDashboard();

renderTasks();

}
);

}

// ==========================================
// DELETE ALL
// ==========================================

const clearAllBtn =
document.getElementById(
"clearAllTasks"
);

if(clearAllBtn){

clearAllBtn.addEventListener(
"click",
() => {

const ok =
confirm(
"Delete ALL tasks?"
);

if(!ok)
return;

tasks = [];

saveTasks();

updateDashboard();

renderTasks();

}
);

}

// ==========================================
// GREETING
// ==========================================

function updateGreeting(){

const greeting =
document.getElementById(
"greeting"
);

if(!greeting)
return;

const hour =
new Date().getHours();

if(hour < 12){

greeting.innerHTML =
"Good Morning 👋";

}
else if(hour < 18){

greeting.innerHTML =
"Good Afternoon ☀️";

}
else{

greeting.innerHTML =
"Good Evening 🌙";

}

}

// ==========================================
// DEMO DATA
// REMOVE IF YOU DON'T WANT IT
// ==========================================

function loadDemoData(){

if(tasks.length > 0)
return;

tasks.push({

id:generateId(),

title:
"Design Landing Page",

description:
"Finish homepage redesign",

category:"Work",

priority:"high",

dueDate:today(),

completed:false,

createdAt:Date.now()

});

tasks.push({

id:generateId(),

title:
"Study JavaScript",

description:
"Complete ES6 modules section",

category:"Study",

priority:"medium",

dueDate:"",

completed:false,

createdAt:Date.now()

});

tasks.push({

id:generateId(),

title:
"Buy Groceries",

description:
"Milk, Bread, Eggs",

category:"Shopping",

priority:"low",

dueDate:"",

completed:false,

createdAt:Date.now()

});

saveTasks();

}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener(
"keydown",
e => {

if(
e.ctrlKey &&
e.key === "k"
){

e.preventDefault();

searchInput.focus();

}

if(
e.key === "Escape"
){

taskModal.classList.remove(
"show"
);

}

}
);

// ==========================================
// AUTO SAVE
// ==========================================

window.addEventListener(
"beforeunload",
() => {

saveTasks();

saveStreak();

}
);

// ==========================================
// APP INIT
// ==========================================

function init(){

loadDemoData();

updateGreeting();

showView();

updateDashboard();

renderTasks();

renderCalendar();

}

init();