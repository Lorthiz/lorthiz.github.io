// noinspection ES6UnusedImports
import Particle from './custom-elements/Particles';
// noinspection ES6UnusedImports
import GlassBallElement from './custom-elements/GlassBallElement';
// noinspection ES6UnusedImports
import ActivityCalendar from './custom-elements/ActivityCalendar';
import SubpageService from './services/SubpageService';

window.addEventListener('hashchange', changePage, false);

function change(event, bar) {
    document.getElementById(bar).changeFillLevel(event.srcElement.valueAsNumber / 100)
}

function changeBarTo(bar, value) {
    document.getElementById(bar).changeFillLevel(value)
}

function goToSubpage(event) {
    window.location = '#' + event.target.id;
    changeBarTo('hp', Math.random());
    changeBarTo('mana', Math.random());
}

function changePage() {
    let path = window.location.hash.substr(1);
    path = path === "" ? "overview" : path;
    new SubpageService().fetchSubpage(window.location.hash.substr(1))
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
        }).catch(() => "");
    refreshNavigation(document.getElementById(path));
}

function refreshNavigation(newSelectedButton) {
    [...document.getElementById('navigation').children].forEach(item => {
        item.classList.add('list-item-font');
        item.classList.remove('list-item-selected');
    });
    if (newSelectedButton) {
        newSelectedButton.classList.remove('list-item-font');
        newSelectedButton.classList.add('list-item-selected');
    }

}

window.change = change;
window.changeBarTo = changeBarTo;
window.selectMenuItem = goToSubpage;

if (window.location.hash === "" || window.location.hash === "#") {
    let button = document.getElementById('overview');
    goToSubpage({target: button});
    changePage();
} else {
    let button = document.getElementById(window.location.hash.substr(1)) || {id: window.location.hash.substr(1)};
    goToSubpage({target: button});
    changePage();
}




