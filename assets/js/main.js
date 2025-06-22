/*
    Dimension by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var	$window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    // Breakpoints.
    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ]
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Fix: Flexbox min-height bug on IE.
    if (browser.name == 'ie') {
        var flexboxFixTimeoutId;

        $window.on('resize.flexbox-fix', function() {
            clearTimeout(flexboxFixTimeoutId);

            flexboxFixTimeoutId = setTimeout(function() {
                if ($wrapper.prop('scrollHeight') > $window.height())
                    $wrapper.css('height', 'auto');
                else
                    $wrapper.css('height', '100vh');
            }, 250);
        }).triggerHandler('resize.flexbox-fix');
    }

    // Nav.
    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');

    // Add "middle" alignment classes if we're dealing with an even number of items.
    if ($nav_li.length % 2 == 0) {
        $nav.addClass('use-middle');
        $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
    }

    // Main.
    var delay = 325,
        locked = false;

    // Methods.
    $main._show = function(id, initial) {
        var $article = $main_articles.filter('#' + id);

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.
        if (locked || (typeof initial != 'undefined' && initial === true)) {
            $body.addClass('is-switching');
            $body.addClass('is-article-visible');
            $main_articles.removeClass('active');
            $header.hide();
            $footer.hide();
            $main.show();
            $article.show();
            $article.addClass('active');
            locked = false;
            setTimeout(function() {
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));
            return;
        }

        locked = true;

        if ($body.hasClass('is-article-visible')) {
            var $currentArticle = $main_articles.filter('.active');
            $currentArticle.removeClass('active');

            setTimeout(function() {
                $currentArticle.hide();
                $article.show();
                setTimeout(function() {
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function() {
                        locked = false;
                    }, delay);
                }, 25);
            }, delay);
        } else {
            $body.addClass('is-article-visible');
            setTimeout(function() {
                $header.hide();
                $footer.hide();
                $main.show();
                $article.show();
                setTimeout(function() {
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function() {
                        locked = false;
                    }, delay);
                }, 25);
            }, delay);
        }
    };

    $main._hide = function(addState) {
        var $article = $main_articles.filter('.active');

        if (!$body.hasClass('is-article-visible'))
            return;

        if (typeof addState != 'undefined' && addState === true)
            history.pushState(null, null, '#');

        if (locked) {
            $body.addClass('is-switching');
            $article.removeClass('active');
            $article.hide();
            $main.hide();
            $footer.show();
            $header.show();
            $body.removeClass('is-article-visible');
            locked = false;
            $body.removeClass('is-switching');
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            return;
        }

        locked = true;
        $article.removeClass('active');

        setTimeout(function() {
            $article.hide();
            $main.hide();
            $footer.show();
            $header.show();
            setTimeout(function() {
                $body.removeClass('is-article-visible');
                $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                setTimeout(function() {
                    locked = false;
                }, delay);
            }, 25);
        }, delay);
    };

    // Articles.
    $main_articles.each(function() {
        var $this = $(this);

        $('<div class="close">Close</div>')
            .appendTo($this)
            .on('click', function() {
                location.hash = '';
            });

        $this.on('click', function(event) {
            event.stopPropagation();
        });
    });

    // Events.
    $body.on('click', function(event) {
        if ($body.hasClass('is-article-visible'))
            $main._hide(true);
    });

    $window.on('keyup', function(event) {
        switch (event.keyCode) {
            case 27:
                if ($body.hasClass('is-article-visible'))
                    $main._hide(true);
                break;
            default:
                break;
        }
    });

    $window.on('hashchange', function(event) {
        if (location.hash == '' || location.hash == '#') {
            event.preventDefault();
            event.stopPropagation();
            $main._hide();
        } else if ($main_articles.filter(location.hash).length > 0) {
            event.preventDefault();
            event.stopPropagation();
            $main._show(location.hash.substr(1));
        }
    });

    // Scroll restoration.
    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    else {
        var oldScrollPos = 0,
            scrollPos = 0,
            $htmlbody = $('html,body');

        $window
            .on('scroll', function() {
                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop();
            })
            .on('hashchange', function() {
                $window.scrollTop(oldScrollPos);
            });
    }

    // Initialize.
    $main.hide();
    $main_articles.hide();

    if (location.hash != '' && location.hash != '#')
        $window.on('load', function() {
            $main._show(location.hash.substr(1), true);
        });

    // Lightbox functionality
    $(document).ready(function() {
        const images = $('.gallery img');
        const lightbox = $('#lightbox');
        const lightboxImg = $('.lightbox-image');
        const closeBtn = $('.lightbox-close');
        const prevBtn = $('.lightbox-prev');
        const nextBtn = $('.lightbox-next');
        let currentIndex = 0;
        let currentGallery = [];

        // Group images by gallery section
        const galleries = $('.gallery-section');
        const imageGroups = Array.from(galleries).map(gallery =>
            Array.from(gallery.querySelectorAll('img')).map(img => img.src)
        );

        function showLightbox(index, galleryIndex) {
            currentGallery = imageGroups[galleryIndex];
            currentIndex = index;
            lightboxImg.attr('src', currentGallery[currentIndex]);
            lightbox.css('display', 'flex');
            $body.addClass('lightbox-open'); // Prevent background scrolling
        }

        function closeLightbox() {
            lightbox.css('display', 'none');
            $body.removeClass('lightbox-open');
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            lightboxImg.attr('src', currentGallery[currentIndex]);
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            lightboxImg.attr('src', currentGallery[currentIndex]);
        }

        // Add click event to each image
        images.each(function(index) {
            $(this).on('click', function(event) {
                event.stopPropagation();
                const gallerySection = $(this).closest('.gallery-section');
                const galleryIndex = galleries.index(gallerySection);
                const localIndex = Array.from(gallerySection.find('img')).indexOf(this);
                showLightbox(localIndex, galleryIndex);
            });
        });

        // Close button
        closeBtn.on('click', function(event) {
            event.stopPropagation();
            closeLightbox();
        });

        // Navigation buttons
        nextBtn.on('click', function(event) {
            event.stopPropagation();
            showNext();
        });

        prevBtn.on('click', function(event) {
            event.stopPropagation();
            showPrev();
        });

        // Keyboard navigation
        $window.on('keydown', function(event) {
            if (lightbox.css('display') === 'flex') {
                switch (event.key) {
                    case 'ArrowRight':
                        showNext();
                        break;
                    case 'ArrowLeft':
                        showPrev();
                        break;
                    case 'Escape':
                        closeLightbox();
                        break;
                    default:
                        break;
                }
                event.stopPropagation();
            }
        });

        // Close when clicking outside image
        lightbox.on('click', function(event) {
            if (event.target === this) {
                closeLightbox();
            }
        });
    });

    // Back to top button
    $(document).ready(function() {
        const backToTopButton = $('#back-to-top');

        $window.on('scroll', function() {
            if ($body.scrollTop() > 20 || document.documentElement.scrollTop > 20) {
                backToTopButton.css('display', 'block');
            } else {
                backToTopButton.css('display', 'none');
            }
        });

        backToTopButton.on('click', function() {
            $body.scrollTop(0);
            document.documentElement.scrollTop = 0;
        });
    });

    // Back to Top Button
document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('back-to-top');

    // Show/hide button on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) { // Show after scrolling 300px
            backToTopButton.style.display = 'block';
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(() => {
                backToTopButton.style.display = 'none';
            }, 200); // Match CSS transition duration
        }
    });

    // Smooth scroll to top on click
    backToTopButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

})(jQuery);