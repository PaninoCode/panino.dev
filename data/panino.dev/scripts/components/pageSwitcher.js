const contentsLoadedEvent = new Event("contentsLoaded");

let pageContentsElement = document.querySelector('#page_main');
let pagePathName = window.location.pathname;
let pathNamePollingInt;

document.addEventListener('DOMContentLoaded', function () {
    document.dispatchEvent(contentsLoadedEvent);
})

document.addEventListener('contentsLoaded', function () {
    pathNamePollingInt = window.setInterval(pathNamePolling, 50);
    CheckAllLinks('nav');
    CheckAllLinks('.sidebar');
    CheckAllLinks('main');
    CheckAllLinks('.footer');
});

function CheckAllLinks(selector) {
    let links = document.querySelector(selector).querySelectorAll('a');

    links.forEach(link => {
        //link.setAttribute('data-managed-link', true);
        link.addEventListener('click', function (eve) {
            let url = new URL(eve.currentTarget);
            if (url != null) {
                if (url.origin == window.origin && eve.target.getAttribute("target") != "_blank") {
                    eve.preventDefault();
                    const stateObj = {};

                    let newPathName = url.pathname
                    if(document.body.getAttribute('data-replace-file-extension') == "true"){
                        newPathName = newPathName.replace('.html', '');
                    }

                    if(newPathName != window.location.pathname){
                        history.pushState(stateObj, "", newPathName);
                    }
                }
            }
        });
    });
}

function pathNamePolling() { //checking if the pathname changes
    if (pagePathName != window.location.pathname) {
        pagePathName = window.location.pathname;

        if (window.navigator.onLine == false) {
            alert("You are offline!");
            return;
        }

        Switcher();
    }
}

function Switcher() {

    pageContentsElement.style.opacity = "0.45";

    var newPathName = pagePathName
    if (pagePathName == "/") newPathName = "/index.html"

    HttpRequest(newPathName.replace(".html", "") + ".json", true, function (data, error) {
        if (error != null) {

            window.clearInterval(pathNamePollingInt);
            location.href = newPathName
            return;
        }
        let dataObj = JSON.parse(data.responseText)
        document.title = dataObj.title
        pageContentsElement.innerHTML = dataObj.html

        if (dataObj.scripts != null) {
            dataObj.scripts.forEach(script => {
                let scriptEl = document.createElement("script");
                scriptEl.src = script;
                scriptEl.type = "text/javascript";
                pageContentsElement.appendChild(scriptEl);
            });
        }

        document.dispatchEvent(contentsLoadedEvent);
        pageContentsElement.style.opacity = "1";
        window.scrollTo(0, 0);

    });

}

function HttpRequest(src, disableCaching, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", src, true);
    if (disableCaching) {
        httpRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0'); // No caching
        httpRequest.setRequestHeader('Pragma', 'no-cache'); // No caching
        httpRequest.setRequestHeader('Expires', 'Fri, 01 Jan 1990 00:00:00 GMT'); // Cache instantly expires
    }
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            callback(httpRequest, null);
        } else if (httpRequest.readyState == 4 && httpRequest.status != 200) {
            callback(httpRequest.status, true);
        }
    };
    window.setTimeout(function () { httpRequest.send() }, 0)
}