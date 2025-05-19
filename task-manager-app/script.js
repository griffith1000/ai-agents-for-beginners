const startBtn = document.getElementById('start');
const tasksDiv = document.getElementById('tasks');
const totalDisplay = document.getElementById('total');
const template = document.getElementById('task-template');
const audioStart = document.getElementById('audio-start');
const audioComplete = document.getElementById('audio-complete');
const audioAllComplete = document.getElementById('audio-all-complete');

let totalOwed = 0;
let tasks = [];

function createTasks() {
    for (let i = 0; i < 3; i++) {
        const clone = template.content.cloneNode(true);
        const taskEl = clone.querySelector('.task');
        tasksDiv.appendChild(clone);
        const description = taskEl.querySelector('.description');
        const duration = taskEl.querySelector('.duration');
        const penalty = taskEl.querySelector('.penalty');
        const timer = taskEl.querySelector('.timer');
        const status = taskEl.querySelector('.status');
        const completeBtn = taskEl.querySelector('.complete-btn');
        tasks.push({ description, duration, penalty, timer, status, completeBtn, timeLeft: 0, completed: false, interval: null });
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function startTimers() {
    audioStart.play();
    tasks.forEach(task => {
        task.timeLeft = parseInt(task.duration.value) * 60;
        task.timer.textContent = formatTime(task.timeLeft);
        task.completeBtn.disabled = false;
        task.status.textContent = '';
        task.completed = false;
        task.interval = setInterval(() => {
            task.timeLeft--;
            task.timer.textContent = formatTime(task.timeLeft);
            if (task.timeLeft <= 0) {
                clearInterval(task.interval);
                if (!task.completed) {
                    task.status.textContent = `Time's up! Owe $${task.penalty.value}`;
                    totalOwed += parseInt(task.penalty.value);
                    totalDisplay.textContent = `Total Owed: $${totalOwed}`;
                    checkAllCompleted();
                }
            }
        }, 1000);
    });
}

function checkAllCompleted() {
    if (tasks.every(t => t.completed || t.timeLeft <= 0)) {
        audioAllComplete.play();
    }
}

startBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        createTasks();
    }
    startTimers();
});

tasksDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-btn')) {
        const taskEl = e.target.closest('.task');
        const task = tasks.find(t => t.completeBtn === e.target);
        if (task && !task.completed) {
            task.completed = true;
            clearInterval(task.interval);
            task.status.textContent = 'Completed!';
            e.target.disabled = true;
            audioComplete.play();
            checkAllCompleted();
        }
    }
});
