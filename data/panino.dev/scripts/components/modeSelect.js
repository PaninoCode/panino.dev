document.querySelectorAll('.language-select-btn').forEach(elem => {

    if(elem.getAttribute('data-lang-id') == document.body.getAttribute('data-selected-lang')){
        elem.disabled = true;
        return;
    }

    elem.addEventListener('click', function (e) {
        let id = elem.getAttribute('data-lang-id');

        hideSidebar();

        let pathNameS = window.location.pathname.substring(1).split("/");

        console.log(pathNameS)
        

        if (pathNameS[0] != id && (pathNameS[0] == "" || pathNameS[0] == "it")) {
            pathNameS[0] = id;
            setTimeout(function () { location.href = window.location.origin + pathNameS.join("/") }, 300);   
        } else if (pathNameS[0] != id) {
            pathNameS.unshift(id);
            setTimeout(function () { location.href = window.location.origin + "/" + pathNameS.join("/") }, 300);
        }
    });
});

const colorModes = ['system', 'light', 'dark'];

document.querySelectorAll('.colormode-select-btn').forEach(elem => {

    elem.addEventListener('click', function (e) {
        let name = elem.getAttribute('data-mode');
        hideSidebar();
        setColorMode(name);
    });
});

if(localStorage.getItem('colormode-name') == null || localStorage.getItem('colormode-name') == undefined){
    setColorMode('system');
}

document.addEventListener('contentsLoaded', e => {
    setColorMode();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    //const newColorScheme = event.matches ? "dark" : "light";
    setColorMode();
});


function setColorMode(name = null){

    if(name != null){
        localStorage.setItem('colormode-name', name);
    }

    let colorName = localStorage.getItem('colormode-name');

    colorModes.forEach(colorMode => {
        document.querySelectorAll('[data-mode="' + colorMode + '"]')[0].disabled = (colorMode == colorName);
    });

    if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && colorName == 'system') || colorName == 'dark') {
        document.body.classList.remove("page-mode-light");
        document.body.classList.add("page-mode-dark");
    }else{
        document.body.classList.remove("page-mode-dark");
        document.body.classList.add("page-mode-light");
    }

}