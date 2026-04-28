// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const totalTodosSpan = document.getElementById('totalTodos');
const completedTodosSpan = document.getElementById('completedTodos');

// Array untuk menyimpan todos
let todos = [];

// Load todos dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// Event listener untuk tombol tambah
addBtn.addEventListener('click', addTodo);

// Event listener untuk Enter key di input
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Fungsi untuk menambah todo baru
function addTodo() {
    const text = todoInput.value.trim();
    
    // Validasi input tidak kosong
    if (text === '') {
        alert('Silakan masukkan tugas!');
        return;
    }

    // Buat object todo baru
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('id-ID')
    };

    // Tambahkan ke array
    todos.unshift(todo);

    // Bersihkan input
    todoInput.value = '';
    todoInput.focus();

    // Simpan dan render ulang
    saveTodos();
    renderTodos();
}

// Fungsi untuk menghapus todo
function deleteTodo(id) {
    if (confirm('Yakin ingin menghapus tugas ini?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk toggle completed status
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk render semua todos
function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                Hapus
            </button>
        `;
        todoList.appendChild(li);
    });

    updateStats();
}

// Fungsi untuk update statistik
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;

    totalTodosSpan.textContent = total;
    completedTodosSpan.textContent = completed;
}

// Fungsi untuk escape HTML (untuk keamanan)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Fungsi untuk simpan todos ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Fungsi untuk load todos dari localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}
