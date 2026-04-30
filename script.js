
document.getElementById("homeBtn").addEventListener("click", () => {
    document.getElementById("hero").scrollIntoView({
        behavior: "smooth"
    });
});


document.getElementById("projectsBtn").addEventListener("click", () => {
    document.getElementById("projects").scrollIntoView({
        behavior: "smooth"
    });
});


document.getElementById("skillsBtn").addEventListener("click", () => {
    document.getElementById("skills").scrollIntoView({
        behavior: "smooth"
    });
});


document.getElementById("contactBtn").addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
    });
});


document.getElementById("gmail").addEventListener("click", () => {
    window.location.href = "https://mail.google.com/";
});

document.getElementById("github").addEventListener("click", () => {
    window.open("https://github.com/Aceuzc", "_blank");
});