 document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize the app
    function init() {
        renderTasks();
        setupEventListeners();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTasks();
            });
        });
    }
    
    // Add a new task
    function addTask() {
        const text = taskInput.value.trim();
        const datetime = taskDatetime.value;
        
        if (text === '') {
            alert('Please enter a task description');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            datetime: datetime || null,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        // Reset input fields
        taskInput.value = '';
        taskDatetime.value = '';
        taskInput.focus();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        let filteredTasks = tasks;
        if (activeFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (activeFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
            
            const taskText = document.createElement('span');
            taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
            taskText.textContent = task.text;
            
            const taskDatetime = document.createElement('span');
            taskDatetime.className = 'task-datetime';
            if (task.datetime) {
                const dateObj = new Date(task.datetime);
                taskDatetime.textContent = formatDateTime(dateObj);
            }
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'task-btn edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => editTask(task.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(taskDatetime);
            taskItem.appendChild(actionsDiv);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // Toggle task completion status
    function toggleTaskComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
    
    // Edit a task
    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            
            const newDatetime = prompt('Edit date/time (leave empty to remove):', task.datetime || '');
            task.datetime = newDatetime || null;
            
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete a task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Format date and time for display
    function formatDateTime(dateObj) {
        const options = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return dateObj.toLocaleDateString('en-US', options);
    }
    
    // Initialize the application
    init();
});