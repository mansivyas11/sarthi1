// Main frontend script for Saarthi (tasks, timetable, discussion, chatbot, credits)
document.addEventListener('DOMContentLoaded', () => {
  // credits shared across pages (in-memory)
  window.saarthiCredits = window.saarthiCredits || 0;
  updateCreditsDisplay();

  // Credit button on dashboard
  const creditBtn = document.getElementById('creditBtn');
  if (creditBtn){
    creditBtn.addEventListener('click', ()=>{
      window.saarthiCredits += 10;
      updateCreditsDisplay();
      alert('You earned 10 credits!');
    });
  }

  // Update credits in any visible sidebar/element
  function updateCreditsDisplay(){
    const ids = ['credits-sidebar','credits-sidebar-tt','credits-sidebar-tasks','credits-sidebar-disc','credits-sidebar-chat','credits-sidebar'];
    ids.forEach(id=>{
      const el = document.getElementById(id);
      if (el) el.textContent = window.saarthiCredits;
    });
    const mainCredit = document.getElementById('creditDisplay');
    if (mainCredit) mainCredit.textContent = 'Credits: ' + window.saarthiCredits;
    const side = document.getElementById('credits-sidebar');
    if (side) side.textContent = window.saarthiCredits;
  }

  // --------- Tasks & Reminders ----------
  const addTaskBtn = document.getElementById('addTask');
  const taskInput = document.getElementById('taskInput');
  const reminderTime = document.getElementById('reminderTime');
  const taskList = document.getElementById('taskList');

  if (addTaskBtn && taskInput && taskList){
    addTaskBtn.addEventListener('click', ()=>{
      const text = taskInput.value.trim();
      const time = reminderTime.value;
      if (!text) { alert('Enter a task'); return; }
      const li = document.createElement('li');
      li.className = 'task';
      const left = document.createElement('div');
      left.textContent = text + (time ? (' — ' + new Date(time).toLocaleString()) : '');
      li.appendChild(left);
      const right = document.createElement('div');
      const doneBtn = document.createElement('button');
      doneBtn.textContent = 'Done';
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      right.appendChild(doneBtn);
      right.appendChild(delBtn);
      li.appendChild(right);
      taskList.prepend(li);
      taskInput.value = ''; if (reminderTime) reminderTime.value='';

      // mark done
      doneBtn.addEventListener('click', ()=>{
        if (!li.classList.contains('completed')){
          li.classList.add('completed');
          li.style.textDecoration = 'line-through';
          window.saarthiCredits += 5;
          updateCreditsDisplay();
        }
      });
      // delete
      delBtn.addEventListener('click', ()=> li.remove());

      // schedule reminder
      if (time){
        const delta = new Date(time).getTime() - Date.now();
        if (delta > 0){
          setTimeout(()=> {
            alert('Reminder: ' + text);
          }, delta);
        }
      }
    });
  }

  // --------- Timetable add ----------
  const addTt = document.getElementById('add-tt');
  if (addTt){
    addTt.addEventListener('click', ()=>{
      const d = document.getElementById('tt-day').value.trim();
      const s = document.getElementById('tt-sub').value.trim();
      const t = document.getElementById('tt-time').value.trim();
      if (!d || !s || !t){ alert('Enter day, subject and time'); return; }
      const tbody = document.getElementById('tt-body');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${d}</td><td>${s}</td><td>${t}</td>`;
      tbody.appendChild(tr);
      document.getElementById('tt-day').value='';document.getElementById('tt-sub').value='';document.getElementById('tt-time').value='';
    });
  }

  // --------- Discussion ----------
  const postBtn = document.getElementById('postBtn');
  const messageInput = document.getElementById('message');
  const discussionBoard = document.getElementById('discussion-board');
  if (postBtn && messageInput && discussionBoard){
    postBtn.addEventListener('click', ()=>{
      const v = messageInput.value.trim();
      if (!v) return;
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom='8px';
      card.innerHTML = `<p>${v}</p>`;
      discussionBoard.prepend(card);
      messageInput.value='';
    });
  }

  // --------- Simple chatbot (demo) ----------
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const chatArea = document.getElementById('chatArea');
  if (sendBtn && userInput && chatArea){
    sendBtn.addEventListener('click', sendChat);
    userInput.addEventListener('keydown', (e)=> { if (e.key==='Enter') sendChat(); });

    function sendChat(){
      const q = userInput.value.trim();
      if (!q) return;
      const pUser = document.createElement('p'); pUser.className='user'; pUser.textContent = q;
      chatArea.appendChild(pUser);
      userInput.value='';
      // very small rule-based demo replies
      const pBot = document.createElement('p'); pBot.className='bot';
      const ql = q.toLowerCase();
      if (ql.includes('hello')||ql.includes('hi')) pBot.textContent = 'Hello! How can I help you today?';
      else if (ql.includes('timetable')) pBot.textContent = 'Open the Timetable page to view or add your schedule.';
      else if (ql.includes('task')) pBot.textContent = 'Go to Tasks and add a new task with a reminder.';
      else if (ql.includes('credit')) pBot.textContent = 'You earn credits by completing tasks. Check the Dashboard.';
      else pBot.textContent = "I'm Saarthi (demo). I can help with simple guidance. This is a placeholder chatbot.";
      chatArea.appendChild(pBot);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

});