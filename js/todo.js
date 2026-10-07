// Adds, completes, and removes to-do items in the list
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const input = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('todoDueDate');
    const list = document.getElementById('todoList');
    const emptyMessage = document.getElementById('emptyMessage');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedButton = document.getElementById('clearCompleted');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = input.value.trim();
        if (!taskText) return;

        addTask(taskText, dueDateInput.value);
        input.value = '';
        dueDateInput.value = '';
        input.focus();
    });

    clearCompletedButton.addEventListener('click', () => {
        list.querySelectorAll('li.completed').forEach((item) => item.remove());
        updateStatus();
    });

    function addTask(text, dueDate) {
        const item = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', () => {
            item.classList.toggle('completed', checkbox.checked);
            updateStatus();
        });

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        span.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            item.classList.toggle('completed', checkbox.checked);
            updateStatus();
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            item.remove();
            updateStatus();
        });

        item.appendChild(checkbox);
        item.appendChild(span);

        if (dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'task-due-date';
            dueDateSpan.textContent = `Due: ${dueDate}`;
            item.appendChild(dueDateSpan);
        }

        item.appendChild(deleteButton);
        list.appendChild(item);
        updateStatus();
    }

    function updateStatus() {
        const items = list.querySelectorAll('li');
        const remaining = list.querySelectorAll('li:not(.completed)').length;

        emptyMessage.style.display = items.length === 0 ? 'block' : 'none';
        taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
    }
});
