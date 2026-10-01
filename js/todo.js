// Adds, completes, and removes to-do items in the list
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const input = document.getElementById('todoInput');
    const list = document.getElementById('todoList');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = input.value.trim();
        if (!taskText) return;

        addTask(taskText);
        input.value = '';
        input.focus();
    });

    function addTask(text) {
        const item = document.createElement('li');

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        span.addEventListener('click', () => {
            item.classList.toggle('completed');
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            item.remove();
        });

        item.appendChild(span);
        item.appendChild(deleteButton);
        list.appendChild(item);
    }
});
