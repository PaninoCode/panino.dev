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