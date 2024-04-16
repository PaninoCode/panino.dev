let sidebar = document.querySelectorAll('.sidebar')[0];
let sidebarOverlay = document.querySelectorAll('.sidebar-overlay')[0];

function showSidebar(section = undefined) {

    sidebar.style.right = "-360px";
    sidebar.classList.add('sidebar-show');
    setTimeout(function () {
        sidebar.style.right = "0px";
    }, 100);

    sidebarOverlay.style.opacity = 0;
    sidebarOverlay.classList.add('sidebar-overlay-show');

    fadeIn(sidebarOverlay, 300);

    if(section != undefined){

        let sidebarSection = document.querySelector('#sidebar_section_' + section);
        if(!sidebarSection.classList.contains('accordion-open')){
            sidebarSection.querySelectorAll('.accordion-header')[0].click();
        }
    }

}

function hideSidebar() {

    sidebar.style.right = "-360px";
    fadeOut(sidebarOverlay, 300);

    setTimeout(function () {
        sidebar.classList.remove('sidebar-show');
        sidebarOverlay.classList.remove('sidebar-overlay-show');
    }, 470);

}

document.addEventListener('contentsLoaded', function(){
    hideSidebar();
});

function fadeIn(el, time) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function () {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

function fadeOut(el, time) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function () {
        el.style.opacity = +el.style.opacity - (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}