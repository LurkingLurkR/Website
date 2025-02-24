window.onclick = (event) => {
    if (event.target === lightbox) {
        lightbox.style.display = "none";
        event.preventDefault();
        event.stopPropagation();
    }
}