const inputForm = document.querySelector('form');
const textInput = document.getElementById('textInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const addTask = document.getElementById('addTask');
const dueTasks = document.getElementById('dueTasks');
const upcomingTasks = document.getElementById('upcomingTasks');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const overlay = document.getElementById('overlay');

const showDialog = () => {
    overlay.style.display = 'flex';
};

document.getElementById('closeDialog').addEventListener('click', () => {
    overlay.style.display = 'none';
});

document.getElementById('okButton').addEventListener('click', () => {
    overlay.style.display = 'none';
});

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!textInput.value.trim() || !dateInput.value || !timeInput.value) {
        showDialog();
        return;
    }

    const text = textInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    const task = { id: Date.now(), text, date, time };
    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    inputForm.reset();
    displayTasks();
})

const displayTasks = () => {
    tasks.sort((a, b) => {
        if (a.date === b.date) return a.time.localeCompare(b.time);
        return a.date.localeCompare(b.date);
    });

    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchInput.value.toLowerCase()));

    dueTasks.innerHTML = '';
    upcomingTasks.innerHTML = '';

    filteredTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('todo');
        taskDiv.id = task.id;

        const date = document.createElement('h3');
        date.innerText = new Date(task.date).toLocaleDateString('en-GB');

        const text = document.createElement('p');
        text.textContent = `${task.text} ${task.time}`;

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.classList.add('editBtn');

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.classList.add('deleteBtn');

        taskDiv.appendChild(date);
        taskDiv.appendChild(text);
        taskDiv.appendChild(editBtn);
        taskDiv.appendChild(deleteBtn);

        if (new Date(task.date) < new Date()) {
            if (dueTasks.children.length === 0) {
                const heading = document.createElement('h2');
                heading.innerText = 'Due Tasks';
                dueTasks.appendChild(heading);
            }
            dueTasks.appendChild(taskDiv);
        }
        else {
            if (upcomingTasks.children.length === 0) {
                const heading = document.createElement('h2');
                heading.innerText = 'Upcoming Tasks';
                upcomingTasks.appendChild(heading);
            }
            upcomingTasks.appendChild(taskDiv);
        }
    });
}

taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const taskDiv = event.target.parentElement;
        const taskId = Number(taskDiv.id);

        const task = tasks.find(task => task.id === taskId);
        const index = tasks.indexOf(task);

        if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            displayTasks();
        }
    }
});

searchInput.addEventListener('input', displayTasks);

displayTasks();
