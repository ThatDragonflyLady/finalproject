
let habits = JSON.parse(localStorage.getItem('habitData')) || [];
let currentFilter = 'all';


const trackerForm = document.getElementById('tracker-form');
const trackerInput = document.getElementById('tracker-input');
const habitList = document.getElementById('habit-list');
const progressFill = document.getElementById('progress-fill');
const errorMsg = document.getElementById('error-msg');
const filterBtns = document.querySelectorAll('.filter-btn');

function saveAndRender() {
    localStorage.setItem('habitData', JSON.stringify(habits));
    renderUI();
}

function handleAddHabit(e) {
    e.preventDefault();
    const text = trackerInput.value.trim();
    if (text === '') return;


    const isDuplicate = habits.some(h => h.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        errorMsg.textContent = "You're already tracking this habit!";
        return;
    }

    const newHabit = { id: Date.now(), text: text, completed: false };
    habits.push(newHabit);
    trackerInput.value = '';
    errorMsg.textContent = '';
    saveAndRender();
}


const toggleHabit = (id) => {
    habits = habits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    saveAndRender();
};

const deleteHabit = (id) => {
    habits = habits.filter(habit => habit.id !== id);
    saveAndRender();
};

function renderUI() {
    habitList.innerHTML = '';
    
    const filtered = habits.filter(habit => {
        if (currentFilter === 'active') return !habit.completed;
        if (currentFilter === 'complete') return habit.completed;
        return true;
    });

    filtered.forEach(habit => {
        const li = document.createElement('li');
        li.className = `tracker-item ${habit.completed ? 'completed' : ''}`;

        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = habit.completed;
        checkbox.addEventListener('change', () => toggleHabit(habit.id));

        
        const span = document.createElement('span');
        span.textContent = habit.text;

        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));

        
        li.append(checkbox, span, deleteBtn);
        habitList.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const total = habits.length;
    if (total === 0) {
        progressFill.style.width = '0%';
        return;
    }
    const completed = habits.filter(h => h.completed).length;
    const percentage = (completed / total) * 100;
    progressFill.style.width = `${percentage}%`;
}


trackerForm.addEventListener('submit', handleAddHabit);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelector('.filter-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderUI();
    });
});


renderUI();
