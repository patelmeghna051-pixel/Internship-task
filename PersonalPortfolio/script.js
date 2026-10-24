
document.getElementById("year").textContent =
    new Date().getFullYear();

// Highlight the selected navigation link
const navLinks = document.querySelectorAll(".sidebar nav a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});
