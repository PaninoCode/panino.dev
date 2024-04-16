let dropdowns = document.querySelectorAll('.navigation-dropdown');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', e => {
        dropdown.querySelectorAll('.navigation-dropdown-menu')[0].classList.toggle('navigation-dropdown-menu-show');
    });
});