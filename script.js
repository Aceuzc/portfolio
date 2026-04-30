
// Navbar Shadow on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close menu when a link is clicked
const navLinks = navMenu.querySelectorAll("a");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    });
});

// Contact button click handlers
document.getElementById("gmail").addEventListener("click", () => {
    window.open("https://mail.google.com/", "_blank");
});

document.getElementById("github").addEventListener("click", () => {
    window.open("https://github.com/Aceuzc", "_blank");
});

document.getElementById("facebook").addEventListener("click", () => {
    window.open("https://www.facebook.com/share/18c7AZoUZk/", "_blank");
});