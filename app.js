let timer, timeLeft = 1500; // 25 minutes
let users = JSON.parse(localStorage.getItem('users') || '{}');
let currentUser = null;

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function backToMenu() {
  showPage('menu-page');
}

function googleLogin() {
  alert("Google login demo. (Real login requires Firebase/Google API)");
  showPage('menu-page');
}

// Signup
document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  if (users[username]) {
    alert('Username already exists!');
  } else {
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created! Please log in.');
    showPage('login-page');
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  if (users[username] && users[username] === password) {
    currentUser = username;
    showPage('menu-page');
  } else {
    alert('Invalid username or password.');
  }
});

function forgotPassword() {
  alert("Forgot password demo. In real app, send email reset link.");
}

function logout() {
  currentUser = null;
  showPage('login-page');
}

// Tasks
document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const date = document.getElementById('task-date').value;
  const time = document.getElementById('task-time').value;
  const li = document.createElement('li');
  li.textContent = `${title} - ${date} ${time}`;
  document.getElementById('task-list').appendChild(li);
  scheduleNotification(title, date, time);
});

function scheduleNotification(task, date, time) {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
  const taskTime = new Date(`${date}T${time}`);
  const delay = taskTime - new Date();
  if (delay > 0) {
    setTimeout(() => {
      new Notification('Task Reminder', { body: `Reminder: ${task}` });
    }, delay);
  }
}

// Pomodoro
function updateDisplay() {
  let mins = Math.floor(timeLeft / 60);
  let secs = timeLeft % 60;
  document.getElementById('timer-display').textContent =
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startPomodoro() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      let choice = confirm("Time's up! Add 5 more minutes? Press Cancel to end.");
      if (choice) {
        timeLeft = 300;
        startPomodoro();
      } else {
        alert('Pomodoro ended.');
        timeLeft = 1500;
        updateDisplay();
      }
    }
  }, 1000);
}
function pausePomodoro(){ clearInterval(timer); }
function resetPomodoro(){ clearInterval(timer); timeLeft=1500; updateDisplay(); }

updateDisplay();
