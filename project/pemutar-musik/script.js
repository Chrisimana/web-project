(function() {
    // Playlist Data
    const playlist = [
        {
            id: 1,
            title: "Neon Dreams",
            artist: "Electric Universe",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: "3:45"
        },
        {
            id: 2,
            title: "Midnight Echo",
            artist: "Luna Wave",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            duration: "4:12"
        },
        {
            id: 3,
            title: "Purple Skyline",
            artist: "Neon Pulse",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            duration: "3:28"
        },
        {
            id: 4,
            title: "Electric Soul",
            artist: "Synth Paradise",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            duration: "5:01"
        },
        {
            id: 5,
            title: "Starlight Drive",
            artist: "Cyber Dreamer",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            duration: "3:55"
        },
        {
            id: 6,
            title: "Velvet Nights",
            artist: "Midnight City",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            duration: "4:30"
        },
        {
            id: 7,
            title: "Digital Love",
            artist: "Neon Heart",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            duration: "3:42"
        },
        {
            id: 8,
            title: "Infinity Pulse",
            artist: "Galactic Echo",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            duration: "4:18"
        }
    ];
    
    // DOM Elements
    const audio = new Audio();
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumePercent = document.getElementById('volumePercent');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const songTitleEl = document.getElementById('songTitle');
    const songArtistEl = document.getElementById('songArtist');
    const albumArtEl = document.getElementById('albumArt');
    const playlistEl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('togglePlaylistBtn');
    
    // State
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let isPlaylistCollapsed = false;
    
    // Warna berbeda untuk album art (gradasi ungu/pink)
    const colorGradients = [
        "linear-gradient(135deg, #ec4899, #a855f7)",
        "linear-gradient(135deg, #f472b6, #c084fc)",
        "linear-gradient(135deg, #db2777, #8b5cf6)",
        "linear-gradient(135deg, #be185d, #7c3aed)",
        "linear-gradient(135deg, #f59e0b, #ec4899)",
        "linear-gradient(135deg, #d946ef, #6366f1)",
        "linear-gradient(135deg, #e879f9, #c026d3)",
        "linear-gradient(135deg, #f43f5e, #a855f7)"
    ];
    
    // Load lagu
    function loadSong(index) {
        const song = playlist[index];
        if (!song) return;
        
        audio.src = song.url;
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        
        // Update album art dengan warna berbeda
        const gradient = colorGradients[index % colorGradients.length];
        albumArtEl.src = `https://placehold.co/400x400/1a1a2e/${gradient.replace('linear-gradient(135deg, ', '').replace(')', '').replace('#', '').split(',')[0]}?text=${encodeURIComponent(song.title.substring(0, 3))}`;
        albumArtEl.onerror = () => {
            albumArtEl.src = `https://placehold.co/400x400/1a1a2e/ec4899?text=🎵`;
        };
        
        // Update active di playlist
        const playlistItems = document.querySelectorAll('.playlist li');
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Reset progress
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Load duration saat metadata loaded
        audio.load();
    }
    
    // Format waktu (detik ke mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }
    
    // Update progress bar
    function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }
    
    // Set duration saat metadata loaded
    function setDuration() {
        if (audio.duration && !isNaN(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
            const song = playlist[currentSongIndex];
            if (song) {
                const playlistItem = document.querySelectorAll('.playlist li')[currentSongIndex];
                if (playlistItem) {
                    const durationSpan = playlistItem.querySelector('.song-duration');
                    if (durationSpan && durationSpan.textContent === '0:00') {
                        durationSpan.textContent = formatTime(audio.duration);
                    }
                }
            }
        }
    }
    
    // Play lagu
    function playSong() {
        audio.play();
        isPlaying = true;
        const playIcon = playPauseBtn.querySelector('i');
        playIcon.className = 'fas fa-pause';  // Icon pause (garis 2)
        document.querySelector('.album-art').style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.6)';
    }

    // Pause lagu
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        const playIcon = playPauseBtn.querySelector('i');
        playIcon.className = 'fas fa-play';  // Icon play (segitiga)
        document.querySelector('.album-art').style.boxShadow = '0 15px 35px rgba(236, 72, 153, 0.3)';
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
    
    // Next lagu
    function nextSong() {
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (playlist.length > 1 && newIndex === currentSongIndex);
            currentSongIndex = newIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Previous lagu
    function prevSong() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
        } else {
            if (isShuffle) {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * playlist.length);
                } while (playlist.length > 1 && newIndex === currentSongIndex);
                currentSongIndex = newIndex;
            } else {
                currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            }
            loadSong(currentSongIndex);
            if (isPlaying) {
                playSong();
            }
        }
    }
    
    // Handle lagu selesai
    function onSongEnd() {
        if (isRepeat) {
            audio.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    }
    
    // Set volume
    function setVolume() {
        const volume = volumeSlider.value / 100;
        audio.volume = volume;
        volumePercent.textContent = `${volumeSlider.value}%`;
        
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
    
    // Seek progress
    function seek(e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audio.duration && !isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
        }
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.style.background = isShuffle ? '#ec4899' : '#2d2d44';
        shuffleBtn.style.boxShadow = isShuffle ? '0 0 12px #ec4899' : 'none';
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.style.background = isRepeat ? '#ec4899' : '#2d2d44';
        repeatBtn.style.boxShadow = isRepeat ? '0 0 12px #ec4899' : 'none';
    }
    
    // Render playlist
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="song-name">${song.title} - ${song.artist}</span>
                <span class="song-duration">${song.duration}</span>
            `;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (isPlaying) {
                    playSong();
                } else {
                    playSong();
                }
            });
            playlistEl.appendChild(li);
        });
        
        // Set active
        const items = document.querySelectorAll('.playlist li');
        if (items[currentSongIndex]) {
            items[currentSongIndex].classList.add('active');
        }
    }
    
    // Toggle playlist
    function togglePlaylist() {
        isPlaylistCollapsed = !isPlaylistCollapsed;
        if (isPlaylistCollapsed) {
            playlistEl.classList.add('collapsed');
            togglePlaylistBtn.textContent = '▶';
        } else {
            playlistEl.classList.remove('collapsed');
            togglePlaylistBtn.textContent = '▼';
        }
    }
    
    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeSlider.addEventListener('input', setVolume);
    progressBar.addEventListener('click', seek);
    togglePlaylistBtn.addEventListener('click', togglePlaylist);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('ended', onSongEnd);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            prevSong();
        } else if (e.code === 'ArrowUp') {
            volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
            setVolume();
        } else if (e.code === 'ArrowDown') {
            volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
            setVolume();
        }
    });
    
    // Inisialisasi
    renderPlaylist();
    loadSong(0);
    setVolume();
    
    console.log('🎵 Music Player siap | Warna Neon Pink/Purple | Keyboard support');
})();