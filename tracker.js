
const trackerForm = document.getElementById('tracker-form');
const trackerInput = document.getElementById('tracker-input');
const habitList = document.getElementById('habit-list');
const progressFill = document.getElementById('progress-fill');
const errorMsg = document.getElementById('error-msg');
const filterBtns = document.querySelectorAll('.filter-btn');


let habits = [];

// 3. Add Habit
trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = trackerInput.value.trim();

    if (text === '') return;

    const newHabit = {
        id: Date.now(),
        text: text,
        completed: false
    };

    habits.push(newHabit);
    trackerInput.value = '';
    renderHabits();
});


function renderHabits(filter = 'all') {
    habitList.innerHTML = '';
    
    const filteredHabits = habits.filter(habit => {
        if (filter === 'active') return !habit.completed;
        if (filter === 'complete') return habit.completed;
        return true;
    });

    filteredHabits.forEach(habit => {
        const li = document.createElement('li');
        li.className = `tracker-item ${habit.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${habit.completed ? 'checked' : ''} onclick="toggleHabit(${habit.id})">
            <span>${habit.text}</span>
            <button class="delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
        `;
        habitList.appendChild(li);
    });

    updateProgress();
}


window.toggleHabit = (id) => {
    habits = habits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    renderHabits();
};


window.deleteHabit = (id) => {
    habits = habits.filter(habit => habit.id !== id);
    renderHabits();
};


function updateProgress() {
    if (habits.length === 0) {
        progressFill.style.width = '0%';
        return;
    }

    const completedCount = habits.filter(h => h.completed).length;
    const percentage = (completedCount / habits.length) * 100;
    progressFill.style.width = `${percentage}%`;
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderHabits(btn.dataset.filter);
    });
});
