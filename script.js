// Smooth scroll with navbar offset
document.addEventListener("click", e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
        top: target.offsetTop - navH - 8,
        behavior: reduceMotion ? "auto" : "smooth"
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Navbar shadow on scroll
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 0);
    }, { passive: true });


    // 2. Hamburger menu toggle
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

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


    // 3. Active nav link on scroll
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


    // 4. Role word cycler, typewriter
    const roleWord = document.getElementById("role-word");

    if (roleWord && !reduceMotion) {
        const roles = ["Frontend", "UI-Focused", "JavaScript"];
        let roleIdx = 0, charIdx = 0, deleting = false;

        function tick() {
            const word = roles[roleIdx];

            if (!deleting) {
                roleWord.textContent = word.slice(0, ++charIdx);
                if (charIdx === word.length) {
                    deleting = true;
                    setTimeout(tick, 1600);
                    return;
                }
            } else {
                roleWord.textContent = word.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                    setTimeout(tick, 220);
                    return;
                }
            }

            setTimeout(tick, deleting ? 52 : 88);
        }

        tick();
    }


    // 5. Scroll-reveal with IntersectionObserver
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


    // 6. Magnetic buttons
    if (!reduceMotion) {
        document.querySelectorAll(".btn-primary, .nav-cta").forEach(btn => {
            btn.addEventListener("mousemove", e => {
                const r = btn.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
                const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
                btn.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
            });
        });
    }


    // 7. Hero cursor glow
    const heroCursorGlow = document.getElementById("hero-cursor-glow");
    const heroSection = document.getElementById("hero");

    if (heroCursorGlow && heroSection && !reduceMotion) {
        let glowRaf;

        heroSection.addEventListener("mouseenter", () => {
            heroCursorGlow.style.opacity = "1";
        });

        heroSection.addEventListener("mouseleave", () => {
            heroCursorGlow.style.opacity = "0";
        });

        heroSection.addEventListener("mousemove", e => {
            cancelAnimationFrame(glowRaf);
            glowRaf = requestAnimationFrame(() => {
                const r = heroSection.getBoundingClientRect();
                heroCursorGlow.style.left = (e.clientX - r.left) + "px";
                heroCursorGlow.style.top = (e.clientY - r.top) + "px";
            });
        });
    }


    // 8. Count-up stats
    function animateCountUp(el, target, duration) {
        const start = performance.now();
        const isNumber = !isNaN(parseInt(target));
        const suffix = target.replace(/[0-9]/g, "");

        if (!isNumber) return;

        const to = parseInt(target);

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(to * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    const statNums = document.querySelectorAll(".stat-num");

    if (reduceMotion) {
        statNums.forEach(el => {
            el.textContent = el.dataset.target || el.textContent;
        });
    } else if ("IntersectionObserver" in window) {
        const statObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    animateCountUp(el, el.dataset.target, 900);
                    statObserver.unobserve(el);
                }
            });
        }, { threshold: 0.6 });

        statNums.forEach(el => statObserver.observe(el));
    }


    // 9. Scroll progress bar
    const scrollProgress = document.getElementById("scroll-progress");

    if (scrollProgress) {
        function updateScrollProgress() {
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
        }

        window.addEventListener("scroll", updateScrollProgress, { passive: true });
        updateScrollProgress();
    }


    // 10. Featured case study pointer motion
    const featuredCase = document.querySelector(".featured-case-study");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (featuredCase && !reduceMotion && finePointer) {
        let caseRaf;

        featuredCase.addEventListener("pointermove", e => {
            cancelAnimationFrame(caseRaf);
            caseRaf = requestAnimationFrame(() => {
                const r = featuredCase.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                const tiltY = (x - 0.5) * 7;
                const tiltX = (0.5 - y) * 5;

                featuredCase.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
                featuredCase.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
                featuredCase.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
                featuredCase.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
            });
        });

        featuredCase.addEventListener("pointerleave", () => {
            cancelAnimationFrame(caseRaf);
            featuredCase.style.setProperty("--tilt-x", "0deg");
            featuredCase.style.setProperty("--tilt-y", "0deg");
            featuredCase.style.setProperty("--glare-x", "50%");
            featuredCase.style.setProperty("--glare-y", "35%");
        });
    }


    // 11. 3D card tilt
    if (!reduceMotion) {
        document.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("mousemove", e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
                card.style.transition = "transform 0.5s ease";
                setTimeout(() => { card.style.transition = ""; }, 500);
            });
        });
    }


    // 12. Copy email
    const copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn) {
        const toast = document.createElement("div");
        toast.className = "copy-toast";
        toast.textContent = "Email copied!";
        document.body.appendChild(toast);

        copyBtn.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();

            const showToast = () => {
                toast.classList.add("show");
                setTimeout(() => toast.classList.remove("show"), 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText("aceeufracio23@gmail.com").then(showToast).catch(showToast);
            } else {
                showToast();
            }
        });
    }


    // 13. Case study modal
    const caseStudyModal = document.getElementById("weather-case-study");
    const openCaseStudy = document.getElementById("open-case-study");
    const closeCaseStudy = document.getElementById("close-case-study");
    let lastCaseStudyTrigger = null;

    function openCaseStudyModal() {
        if (!caseStudyModal) return;

        lastCaseStudyTrigger = document.activeElement;

        if (typeof caseStudyModal.showModal === "function") {
            caseStudyModal.showModal();
        } else {
            caseStudyModal.setAttribute("open", "");
        }

        document.body.classList.add("modal-open");
    }

    function closeCaseStudyModal() {
        if (!caseStudyModal || !caseStudyModal.open) return;
        caseStudyModal.close();
    }

    if (caseStudyModal && openCaseStudy && closeCaseStudy) {
        openCaseStudy.addEventListener("click", openCaseStudyModal);
        closeCaseStudy.addEventListener("click", closeCaseStudyModal);

        caseStudyModal.addEventListener("click", e => {
            if (e.target === caseStudyModal) {
                closeCaseStudyModal();
            }
        });

        caseStudyModal.addEventListener("close", () => {
            document.body.classList.remove("modal-open");

            if (lastCaseStudyTrigger && typeof lastCaseStudyTrigger.focus === "function") {
                lastCaseStudyTrigger.focus({ preventScroll: true });
            }
        });
    }


    // 14. Back to top
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    }

});
