document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const caption = document.getElementById('caption');
    const close = document.getElementById('close');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const images = document.querySelectorAll('.gallery .image');
    let currentIndex = 0;

    // Function to show image
    function showImage(index) {
        if (index >= 0 && index < images.length) {
            const img = images[index].querySelector('img');
            lightboxContent.src = img.src;
            caption.textContent = img.alt;
            currentIndex = index;
            lightbox.style.display = 'flex';
            document.getElementById('work').scrollIntoView({ behavior: 'smooth' }); // Ensure visibility
        }
    }

    // Open lightbox on image click
    images.forEach((image, index) => {
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(index);
        });
    });

    // Close lightbox
    close.addEventListener('click', (e) => {
        e.stopPropagation();
        lightbox.style.display = 'none';
    });

    // Previous image
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Next image
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
            }
            e.stopPropagation();
        }
    });
});

// Keep your back-to-top logic separate
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    };
    backToTopButton.addEventListener('click', function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
});