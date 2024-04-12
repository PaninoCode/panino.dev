// document.addEventListener('scroll', toggleMenu, false);
// document.addEventListener('DOMContentLoaded', toggleMenu, false);
// window.addEventListener('contentsLoaded', toggleMenu, false);

// function toggleMenu() {
//     let heroHeight = null;
//     let primaryNavigationHeight = document.querySelector('.primary-navigation').offsetHeight;
//     let secondaryNavigationHeight = document.querySelector('.secondary-navigation').offsetHeight;
//     let secondaryNavigation = document.querySelector('.secondary-navigation');
//     let brandingTitle = document.querySelector('.branding-title');
//     let headerMargin = document.querySelector('#header_margin');

//     try{
//         heroHeight = document.querySelector('.welcome-hero').offsetHeight;
//         headerMargin.style.height = '0px';
//     }catch(e){
//         secondaryNavigation.style.top = primaryNavigationHeight + 'px';
//         brandingTitle.style.left = '0px';
//         headerMargin.style.height = secondaryNavigationHeight + 10 + 'px';
//     }

//     let triggerHeight = heroHeight;

//     if (window.scrollY >= triggerHeight - 10){
//         secondaryNavigation.style.top = primaryNavigationHeight + 'px';
//         brandingTitle.style.left = '0px';
//     }

//     if (window.scrollY < triggerHeight - 10){
//         secondaryNavigation.style.top = '-2rem';
//         brandingTitle.style.left = '-30rem';
//     }
// }

document.addEventListener('contentsLoaded', e => {
    toggleSecondaryNavbar();
});

document.addEventListener('scroll', toggleSecondaryNavbar, false);

let headerNavbar = document.querySelectorAll('.header-navbar')[0];
let backTopTopBtn = document.querySelector('#back_to_top_btn');

let startScrollY = null;
let headerNavbarForcedOpen = false;

function toggleSecondaryNavbar() {

    if(startScrollY == null) startScrollY = window.scrollY;

    let primaryNavbar = document.querySelectorAll('.primary-navbar')[0];
    let secondaryNavbar = document.querySelectorAll('.secondary-navbar')[0];
    let welcomeHero = document.querySelector('#welcome_hero');
    let triggerHeight = 0;

    if(welcomeHero != null){
        triggerHeight = welcomeHero.offsetHeight - 10;
    }

    // console.log(triggerHeight);

    if(window.scrollY < 1000){
        backTopTopBtn.classList.add('hide-back-to-top-btn');
    }

    if(window.scrollY > 1000){
        backTopTopBtn.classList.remove('hide-back-to-top-btn');
    }

    if (window.scrollY >= triggerHeight) {
        secondaryNavbar.style.top = primaryNavbar.offsetHeight + "px";
        headerNavbar.style.height = primaryNavbar.offsetHeight + secondaryNavbar.offsetHeight + "px";
    }

    if (window.scrollY < triggerHeight) {
        secondaryNavbar.style.top = "0px";
        headerNavbar.style.height = "auto";
    }

    let scrollDifference = window.scrollY - startScrollY;
    // console.log(scrollDifference);

    headerNavbarForcedOpen = false;

    if(window.scrollY > 1000 && (scrollDifference > 0 || headerNavbarForcedOpen)){
        headerNavbar.style.position = "fixed";
        headerNavbar.style.top = (-1 * headerNavbar.offsetHeight) + "px";
        startScrollY = null;
    }

    if(window.scrollY < 1000 || scrollDifference < 0){
        headerNavbar.style.position = "sticky";
        headerNavbar.style.top = "0px";
        startScrollY = null;
    }

}

document.querySelector('#header_pulldown_btn').addEventListener('click', e => {
    headerNavbar.style.position = "sticky";
    headerNavbar.style.top = "0px";
    startScrollY = null;
    headerNavbarForcedOpen = true;
})

backTopTopBtn.addEventListener('click', e => {
    window.scrollTo(0,0);
});