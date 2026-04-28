(function() {
    // ==================== DATABASE QUOTES ====================
    const quotesDatabase = [
        // Motivasi
        { text: "Jangan menyerah. Penderitaanmu hari ini adalah kekuatanmu untuk hari esok.", author: "Unknown", category: "motivation" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "motivation" },
        { text: "Jangan bandingkan dirimu dengan orang lain. Bandingkan dirimu dengan dirimu yang kemarin.", author: "Jordan Peterson", category: "motivation" },
        { text: "Tidak ada yang tidak mungkin bagi mereka yang mau berusaha dan berdoa.", author: "Unknown", category: "motivation" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
        
        // Kehidupan
        { text: "Hidup adalah 10% apa yang terjadi padamu dan 90% bagaimana kamu meresponnya.", author: "Charles R. Swindoll", category: "life" },
        { text: "Jadilah seperti pohon yang tumbuh kokoh meski diterpa badai.", author: "Unknown", category: "life" },
        { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
        { text: "Hidup bukan tentang menunggu badai berlalu, tapi belajar menari di tengah hujan.", author: "Unknown", category: "life" },
        { text: "Setiap hari adalah awal yang baru. Ambil napas dalam-dalam dan mulai lagi.", author: "Unknown", category: "life" },
        
        // Sukses
        { text: "Kesuksesan tidak datang dari apa yang kamu lakukan kadang-kadang, tapi dari apa yang kamu lakukan secara konsisten.", author: "Unknown", category: "success" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
        { text: "Mulailah dari mana kau berada. Gunakan apa yang kau punya. Lakukan apa yang kau bisa.", author: "Arthur Ashe", category: "success" },
        { text: "Jangan takut gagal. Gagal adalah batu loncatan menuju sukses.", author: "Unknown", category: "success" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "success" },
        
        // Cinta
        { text: "Cinta bukan tentang menemukan orang yang sempurna, tapi belajar melihat ketidaksempurnaan dengan sempurna.", author: "Unknown", category: "love" },
        { text: "Where there is love, there is life.", author: "Mahatma Gandhi", category: "love" },
        { text: "Cinta adalah ketika kebahagiaan orang lain lebih penting daripada kebahagiaanmu sendiri.", author: "Unknown", category: "love" },
        { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu", category: "love" },
        { text: "Cinta tidak pernah meminta, ia selalu memberi.", author: "Unknown", category: "love" },
        
        // Kebijaksanaan
        { text: "Kebijaksanaan bukan tentang mengetahui segalanya, tapi tentang mengetahui apa yang paling penting.", author: "Unknown", category: "wisdom" },
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
        { text: "Diam adalah emas ketika kamu tidak tahu jawaban yang benar.", author: "Unknown", category: "wisdom" },
        { text: "Know thyself.", author: "Socrates", category: "wisdom" },
        { text: "Kebijaksanaan dimulai dengan rasa ingin tahu.", author: "Unknown", category: "wisdom" }
    ];
    
    // Tambah beberapa quote ekstra
    const extraQuotes = [
        // Motivasi ekstra
        { text: "Your limitation—it's only your imagination.", author: "Unknown", category: "motivation" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivation" },
        { text: "Great things never come from comfort zones.", author: "Unknown", category: "motivation" },
        
        // Kehidupan ekstra
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
        { text: "Hiduplah seperti air, mengalir namun tetap utuh.", author: "Unknown", category: "life" },
        
        // Sukses ekstra
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "success" },
        { text: "The secret of success is to start before you are ready.", author: "Unknown", category: "success" },
        
        // Cinta ekstra
        { text: "Love all, trust a few, do wrong to none.", author: "William Shakespeare", category: "love" },
        { text: "Where there is love, there is no darkness.", author: "Unknown", category: "love" },
        
        // Kebijaksanaan ekstra
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "wisdom" },
        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "wisdom" }
    ];
    
    // Gabungkan semua quotes
    const allQuotes = [...quotesDatabase, ...extraQuotes];
    
    // DOM Elements
    const quoteTextEl = document.getElementById('quoteText');
    const quoteAuthorEl = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    const tweetBtn = document.getElementById('tweetBtn');
    const totalQuotesEl = document.getElementById('totalQuotes');
    const currentCategoryEl = document.getElementById('currentCategory');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // State
    let currentCategory = 'all';
    let currentQuote = null;
    let lastQuoteIndex = -1;
    
    // Update total quotes display
    totalQuotesEl.textContent = allQuotes.length;
    
    // Filter quotes berdasarkan kategori
    function getFilteredQuotes() {
        if (currentCategory === 'all') {
            return allQuotes;
        }
        return allQuotes.filter(quote => quote.category === currentCategory);
    }
    
    // Mendapatkan quote random 
    function getRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        
        if (filteredQuotes.length === 0) {
            return {
                text: "Tidak ada kutipan dalam kategori ini. Silakan pilih kategori lain.",
                author: "System",
                category: "info"
            };
        }
        
        // Jika hanya 1 quote, kembalikan saja
        if (filteredQuotes.length === 1) {
            return filteredQuotes[0];
        }
        
        // Hindari quote yang sama berturut-turut
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        } while (filteredQuotes.length > 1 && randomIndex === lastQuoteIndex);
        
        lastQuoteIndex = randomIndex;
        return filteredQuotes[randomIndex];
    }
    
    // Animasi saat quote berganti
    function animateQuote() {
        quoteDisplay.style.animation = 'none';
        quoteDisplay.offsetHeight; // trigger reflow
        quoteDisplay.style.animation = 'fadeInScale 0.4s ease forwards';
    }
    
    // Update tampilan quote
    function updateQuoteDisplay(quote) {
        quoteTextEl.textContent = `"${quote.text}"`;
        quoteAuthorEl.textContent = `- ${quote.author} -`;
        currentQuote = quote;
        animateQuote();
    }
    
    // Generate dan tampilkan quote baru
    function generateNewQuote() {
        const newQuote = getRandomQuote();
        updateQuoteDisplay(newQuote);
    }
    
    // Set kategori aktif
    function setCategory(category) {
        currentCategory = category;
        
        // Update UI tombol kategori
        categoryBtns.forEach(btn => {
            const btnCategory = btn.getAttribute('data-category');
            if (btnCategory === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update teks kategori di stats
        const categoryNames = {
            all: 'Semua',
            motivation: 'Motivasi',
            life: 'Kehidupan',
            success: 'Sukses',
            love: 'Cinta',
            wisdom: 'Kebijaksanaan'
        };
        currentCategoryEl.textContent = categoryNames[category] || category;
        
        // Reset last quote index untuk kategori baru
        lastQuoteIndex = -1;
        
        // Generate quote baru dari kategori yang dipilih
        generateNewQuote();
    }
    
    // Bagikan ke Twitter
    function shareToTwitter() {
        if (!currentQuote) {
            generateNewQuote();
        }
        
        const tweetText = `"${currentQuote.text}" - ${currentQuote.author}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=quote,inspirasi`;
        
        window.open(tweetUrl, '_blank', 'width=550,height=420');
    }
    
    // Event Listeners
    newQuoteBtn.addEventListener('click', generateNewQuote);
    tweetBtn.addEventListener('click', shareToTwitter);
    
    // Kategori button listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            setCategory(category);
        });
    });
    
    // Keyboard support: Spasi untuk quote baru
    document.addEventListener('keydown', (e) => {
        // Hanya jika spasi ditekan dan tidak sedang fokus di input/button
        if (e.code === 'Space' && document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            generateNewQuote();
        }
        
        // Tombol 'C' untuk mengubah kategori (cycle)
        if (e.code === 'KeyC') {
            e.preventDefault();
            const categories = ['all', 'motivation', 'life', 'success', 'love', 'wisdom'];
            const currentIndex = categories.indexOf(currentCategory);
            const nextIndex = (currentIndex + 1) % categories.length;
            setCategory(categories[nextIndex]);
        }
    });
    
    // Animasi hover pada tombol
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.96)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 120);
        });
    });
    
    // Generate quote pertama kali
    generateNewQuote();
    
    // Optional: Ubah background gradient sedikit setiap quote baru (efek segar)
    function subtleBackgroundChange() {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6b8cae 100%)',
            'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #a8e6cf 100%)',
            'linear-gradient(135deg, #c33764 0%, #b06ab3 50%, #e2b0ff 100%)',
            'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #8e9eab 100%)'
        ];
        
        let colorIndex = 0;
        const oldGenerate = generateNewQuote;
        window.generateNewQuote = function() {
            oldGenerate();
            document.body.style.background = colors[colorIndex % colors.length];
            colorIndex++;
        };
        generateNewQuote = window.generateNewQuote;
    }
    
    subtleBackgroundChange();
    
    console.log('Random Quote Generator siap | ' + allQuotes.length + ' kutipan tersedia | Tekan spasi untuk quote baru, C untuk ganti kategori');
})();