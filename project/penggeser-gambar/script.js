(function() {
    // DOM Elements
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    const slideCounter = document.getElementById('slideCounter');
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    
    // State
    let currentIndex = 0;
    let totalSlides = slides.length;
    let autoPlayInterval = null;
    let isAutoPlaying = true;
    let autoPlayDelay = 3000; // 3 detik
    
    // Buat dots
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots active
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update counter
    function updateCounter() {
        slideCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        currentIndex = index;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        updateDots();
        updateCounter();
        
        // Reset auto play timer
        if (isAutoPlaying) {
            resetAutoPlay();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex + 1 >= totalSlides) {
            goToSlide(0);
        } else {
            goToSlide(currentIndex + 1);
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex - 1 < 0) {
            goToSlide(totalSlides - 1);
        } else {
            goToSlide(currentIndex - 1);
        }
    }
    
    // Start auto play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, autoPlayDelay);
        isAutoPlaying = true;
        autoPlayBtn.innerHTML = '⏸️ Auto';
        autoPlayBtn.style.opacity = '1';
    }
    
    // Stop auto play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        isAutoPlaying = false;
        autoPlayBtn.innerHTML = '▶️ Auto';
    }
    
    // Reset auto play (stop lalu start)
    function resetAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
            startAutoPlay();
        }
    }
    
    // Toggle auto play
    function toggleAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
    
    // Keyboard navigation
    function handleKeydown(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === ' ' || e.key === 'Space') {
            e.preventDefault();
            toggleAutoPlay();
        }
    }
    
    // Touch support untuk mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }
    
    // Hover pause untuk auto play
    let hoverTimeout = null;
    function handleMouseEnter() {
        if (isAutoPlaying) {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }
    }
    
    function handleMouseLeave() {
        if (isAutoPlaying) {
            if (!autoPlayInterval) {
                autoPlayInterval = setInterval(() => {
                    nextSlide();
                }, autoPlayDelay);
            }
        }
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    document.addEventListener('keydown', handleKeydown);
    
    // Touch events
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('touchstart', handleTouchStart);
    sliderContainer.addEventListener('touchend', handleTouchEnd);
    
    // Hover pause (opsional)
    sliderContainer.addEventListener('mouseenter', handleMouseEnter);
    sliderContainer.addEventListener('mouseleave', handleMouseLeave);
    
    // Inisialisasi
    function init() {
        createDots();
        goToSlide(0);
        startAutoPlay();
    }
    
    init();
    
    console.log('🖼️ Image Slider siap | Tema Ocean Breeze | Auto-slide setiap 3 detik');
})();