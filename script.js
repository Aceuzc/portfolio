document.addEventListener("DOMContentLoaded", () => {

    // ── 1. Navbar shadow on scroll ──────────────────────────────────────
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 0);
    }, { passive: true });


    // ── 2. Hamburger menu toggle ────────────────────────────────────────
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.getElementById("nav-menu");

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
        hamburger.classList.add("active");
        navMenu.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
    }

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.contains("active") ? closeMenu() : openMenu();
    });

    // Close when a nav link is clicked
    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });


    // ── 3. Active nav link on scroll ────────────────────────────────────
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;

    function setActiveLink() {
        let current = "";

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - navHeight - 20) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink(); // run on load


    // ── 4. Scroll-reveal with IntersectionObserver ──────────────────────
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // animate once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show everything
        revealEls.forEach(el => el.classList.add("visible"));
    }

});