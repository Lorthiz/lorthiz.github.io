import Particle from './custom-elements/Particles';
import GlassBallElement from './custom-elements/GlassBallElement';
import ActivityCalendar from './custom-elements/ActivityCalendar';

function change(event, bar) {
    document.getElementById(bar).changeFillLevel(event.srcElement.valueAsNumber / 100)
}

window.change = change;