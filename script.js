document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    select: info => addTask(info.startStr),
    events: JSON.parse(localStorage.getItem('tasks') || '[]')
  });
  calendar.render();
  const alertCard = document.getElementById('alertCard');
  const alertText = document.getElementById('alertText');
  const alertSound = document.getElementById('alertSound');
  function addTask(dateStr) {
    const title = prompt('Task title:');
    if (!title) return;
    const newTask = { title, start: dateStr };
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    calendar.addEvent(newTask);
  }
  const tips = [
    'Break study sessions into 25-minute Pomodoro blocks.',
    'Review notes right after class to boost retention.',
    'Teach a concept to someone—it proves you understand it.',
    'Sleep 7-8 hours; it’s essential for memory.',
  ];
  document.getElementById('aiTip').innerText =
    '💡 ' + tips[Math.floor(Math.random() * tips.length)];
  function updateCountdown() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (!tasks.length) return;
    const next = new Date(tasks[0].start);
    const diff = next - new Date();
    if (diff > 0) {
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      document.getElementById('countdown').innerText =
        `⏳ Next task in ${hrs} h ${mins} m`;
    }
  }
  setInterval(updateCountdown, 60000);
  updateCountdown();
  setInterval(() => {
    const now = new Date().toISOString().slice(0,10);
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(t => {
      if (t.start === now) {
        alertText.textContent = `Time’s up for: ${t.title}`;
        alertCard.classList.remove('hidden');
        alertSound.play();
      }
    });
  }, 60000);
  document.getElementById('dismissAlert').onclick =
    () => alertCard.classList.add('hidden');
  document.getElementById('snoozeAlert').onclick =
    () => setTimeout(() => alertCard.classList.remove('hidden'), 300000);
  document.getElementById('themeToggle').onclick = () =>
    document.body.classList.toggle('dark');
  const ctx = document.getElementById('weeklyChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Tasks Completed',
        data: [1,2,1,3,2,0,1],
        backgroundColor: '#ffffff66'
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
  document.getElementById('exportBtn').onclick = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let csv = 'Title,Date\n';
    tasks.forEach(t => csv += `${t.title},${t.start}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tasks.csv';
    a.click();
  };
});