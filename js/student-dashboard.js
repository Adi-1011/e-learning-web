// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
    });
    
    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
});