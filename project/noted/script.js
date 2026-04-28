(function() {
    // DOM Elements
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentInput = document.getElementById('noteContent');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const searchInput = document.getElementById('searchInput');
    const notesListEl = document.getElementById('notesList');
    const noteCountEl = document.getElementById('noteCount');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // State
    let notes = [];
    let currentFilter = 'all'; // all, recent, oldest
    let editMode = false;
    let editId = null;
    
    // Load data dari localStorage
    function loadNotes() {
        const storedNotes = localStorage.getItem('notesWeb');
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
        } else {
            // Data contoh untuk demo
            notes = [
                {
                    id: Date.now() + 1,
                    title: 'Selamat Datang!',
                    content: 'Selamat datang di Notes Web! Kamu bisa menambah, mengedit, menghapus, dan mencari catatan. Semua catatan tersimpan otomatis di browser-mu.',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            saveNotes();
        }
        renderNotes();
    }
    
    // Simpan ke localStorage
    function saveNotes() {
        localStorage.setItem('notesWeb', JSON.stringify(notes));
        updateNoteCount();
    }
    
    // Update jumlah catatan
    function updateNoteCount() {
        const count = notes.length;
        noteCountEl.textContent = `${count} ${count === 1 ? 'catatan' : 'catatan'}`;
    }
    
    // Format tanggal
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    // Filter catatan berdasarkan pencarian
    function filterNotesBySearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return notes;
        
        return notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    // Urutkan catatan berdasarkan filter
    function sortNotes(filteredNotes) {
        const sorted = [...filteredNotes];
        
        switch(currentFilter) {
            case 'recent':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            default: // 'all' - terbaru di atas
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }
    
    // Render catatan ke UI
    function renderNotes() {
        let filteredNotes = filterNotesBySearch();
        filteredNotes = sortNotes(filteredNotes);
        
        if (filteredNotes.length === 0) {
            const searchTerm = searchInput.value.trim();
            if (searchTerm && notes.length > 0) {
                notesListEl.innerHTML = `
                    <div class="empty-state">
                        <span>🔍</span>
                        <p>Tidak ditemukan catatan untuk "${escapeHtml(searchTerm)}"</p>
                        <small>Coba kata kunci lain</small>
                    </div>
                `;
            } else {
                notesListEl.innerHTML = `
                    <div class="empty-state">
                        <span>📭</span>
                        <p>Belum ada catatan</p>
                        <small>Tambahkan catatan pertamamu!</small>
                    </div>
                `;
            }
            return;
        }
        
        notesListEl.innerHTML = filteredNotes.map(note => `
            <div class="note-card" data-id="${note.id}">
                <div class="note-title">${escapeHtml(note.title) || '(Tanpa judul)'}</div>
                <div class="note-content">${escapeHtml(note.content) || '(Kosong)'}</div>
                <div class="note-date">
                    <span>🕐 ${formatDate(note.updatedAt || note.createdAt)}</span>
                    <div class="note-actions">
                        <button class="edit-btn" onclick="window.editNote(${note.id})">✏️ Edit</button>
                        <button class="delete-btn" onclick="window.deleteNote(${note.id})">🗑️ Hapus</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Escape HTML untuk keamanan
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Tambah atau update catatan
    function addOrUpdateNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        
        if (!title && !content) {
            alert('Judul atau isi catatan tidak boleh kosong!');
            return;
        }
        
        const now = new Date().toISOString();
        
        if (editMode && editId !== null) {
            // Update catatan yang sudah ada
            const noteIndex = notes.findIndex(n => n.id === editId);
            if (noteIndex !== -1) {
                notes[noteIndex] = {
                    ...notes[noteIndex],
                    title: title || '(Tanpa judul)',
                    content: content || '',
                    updatedAt: now
                };
            }
            editMode = false;
            editId = null;
            addNoteBtn.textContent = '➕ Tambah Catatan';
            addNoteBtn.style.background = '';
        } else {
            // Tambah catatan baru
            const newNote = {
                id: Date.now(),
                title: title || '(Tanpa judul)',
                content: content || '',
                createdAt: now,
                updatedAt: now
            };
            notes.unshift(newNote);
        }
        
        // Reset form
        noteTitleInput.value = '';
        noteContentInput.value = '';
        
        saveNotes();
        renderNotes();
    }
    
    // Edit catatan
    function editNote(id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        
        noteTitleInput.value = note.title === '(Tanpa judul)' ? '' : note.title;
        noteContentInput.value = note.content;
        
        editMode = true;
        editId = id;
        addNoteBtn.textContent = '✏️ Update Catatan';
        
        // Scroll ke form
        document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Hapus catatan
    function deleteNote(id) {
        if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            notes = notes.filter(n => n.id !== id);
            saveNotes();
            renderNotes();
            
            // Jika sedang edit catatan yang dihapus, reset form
            if (editMode && editId === id) {
                editMode = false;
                editId = null;
                noteTitleInput.value = '';
                noteContentInput.value = '';
                addNoteBtn.textContent = '➕ Tambah Catatan';
            }
        }
    }
    
    // Hapus semua catatan
    function deleteAllNotes() {
        if (notes.length === 0) return;
        
        if (confirm('⚠️ PERINGATAN: Semua catatan akan dihapus permanen! Lanjutkan?')) {
            notes = [];
            saveNotes();
            renderNotes();
            
            // Reset form jika sedang edit
            if (editMode) {
                editMode = false;
                editId = null;
                noteTitleInput.value = '';
                noteContentInput.value = '';
                addNoteBtn.textContent = '➕ Tambah Catatan';
            }
        }
    }
    
    // Set filter
    function setFilter(filter) {
        currentFilter = filter;
        
        filterBtns.forEach(btn => {
            const btnFilter = btn.getAttribute('data-filter');
            if (btnFilter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderNotes();
    }
    
    // Event Listeners
    addNoteBtn.addEventListener('click', addOrUpdateNote);
    deleteAllBtn.addEventListener('click', deleteAllNotes);
    searchInput.addEventListener('input', () => renderNotes());
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    // Keyboard shortcut: Ctrl+Enter untuk menyimpan
    noteContentInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            addOrUpdateNote();
        }
    });
    
    noteTitleInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            addOrUpdateNote();
        }
    });
    
    // Expose fungsi ke global untuk onclick
    window.editNote = editNote;
    window.deleteNote = deleteNote;
    
    // Inisialisasi
    loadNotes();
    
    console.log('Notes Web siap | Data tersimpan di localStorage');
})();