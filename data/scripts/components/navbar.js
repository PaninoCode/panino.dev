// let menuLinks = document.querySelectorAll('.navigation-dropdown');
// let tertiaryNavbar = document.querySelectorAll('.tertiary-navbar')[0];
// let dropdownContainer = document.querySelectorAll('.dropdown-container')[0];
// let isOverMenuLink = false;

// menuLinks.forEach(menuLink => {
//     menuLink.addEventListener('mouseover', e => {

//         isOverMenuLink = true;
//         e.preventDefault();
//         let selectedDropdown = e.target.getAttribute('data-dropdown-id');

//         let dropdownIds = ['dropdown_projects', 'dropdown_about'];

//         dropdownContainer.style.maxHeight = "0px";

//         setTimeout(function(){

//             dropdownIds.forEach(dropdownId => {
//                 let dropdown = document.querySelector('#' + dropdownId);
//                 if(dropdownId == selectedDropdown){
//                     dropdown.classList.remove('dropdown-section-hidden');
//                 }else{
//                     dropdown.classList.add('dropdown-section-hidden');
//                 }
//             });
    
//             dropdownContainer.style.maxHeight = dropdownContainer.scrollHeight + 30 + 'px';
//         }, 350);

//         let primaryNavbar = document.querySelectorAll('.primary-navbar')[0];

//         tertiaryNavbar.style.top = primaryNavbar.offsetHeight + "px";
//     });
    
//     menuLink.addEventListener('mouseout', e => {
//         isOverMenuLink = false;
//         e.preventDefault();

//         setTimeout(function(){
//             if (tertiaryNavbar.parentNode.querySelector(":hover") != tertiaryNavbar && isOverMenuLink == false) {
//                 tertiaryNavbar.style.top = "0px";
//             }
//         }, 100);

//     })
// });

// tertiaryNavbar.addEventListener('mouseout', e => {
//     setTimeout(function(){
//         if (tertiaryNavbar.parentNode.querySelector(":hover") != tertiaryNavbar) {
//             tertiaryNavbar.style.top = "0px";
//         }
//     }, 50);
// });

let dropdowns = document.querySelectorAll('.navigation-dropdown');
// let dropdownItems = document.querySelectorAll('.dropdown-item');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', e => {
        // console.log(e.target.offsetParent);
        // e.preventDefault();
        dropdown.querySelectorAll('.navigation-dropdown-menu')[0].classList.toggle('navigation-dropdown-menu-show');
    });
});

// dropdownItems.forEach(dropdownItem => {
//     dropdownItem.addEventListener('click', e => {
//         console.log(dropdownItem.parentElement);
//         // dropdownItem.parentElement.querySelectorAll('.navigation-dropdown-menu')[0].classList.toggle('navigation-dropdown-menu-show');
//     });
// });