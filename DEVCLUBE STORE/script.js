const items = Array.from(document.querySelectorAll(".item"));
const dots = Array.from(document.querySelectorAll(".dot"));
const number = document.querySelector(".numbers");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const container = document.querySelector(".container");

let currentIndex = items.findIndex((item) => item.classList.contains("active"));
let autoPlayId = null;

if (currentIndex < 0) {
    currentIndex = 0;
}

function formatNumber(value) {
    return String(value + 1).padStart(2, "0");
}

function updateCarousel(nextIndex) {
    items.forEach((item, index) => {
        const isActive = index === nextIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
        const isActive = index === nextIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (number) {
        number.textContent = formatNumber(nextIndex);
    }

    currentIndex = nextIndex;
}

function showNext() {
    const nextIndex = (currentIndex + 1) % items.length;
    updateCarousel(nextIndex);
}

function showPrevious() {
    const nextIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel(nextIndex);
}

function restartAutoPlay() {
    window.clearInterval(autoPlayId);
    autoPlayId = window.setInterval(showNext, 5000);
}

prevButton?.addEventListener("click", () => {
    showPrevious();
    restartAutoPlay();
});

nextButton?.addEventListener("click", () => {
    showNext();
    restartAutoPlay();
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        updateCarousel(index);
        restartAutoPlay();
    });
});

container?.addEventListener("mouseenter", () => {
    window.clearInterval(autoPlayId);
});

container?.addEventListener("mouseleave", restartAutoPlay);

container?.addEventListener("focusin", () => {
    window.clearInterval(autoPlayId);
});

container?.addEventListener("focusout", restartAutoPlay);

updateCarousel(currentIndex);
restartAutoPlay();
