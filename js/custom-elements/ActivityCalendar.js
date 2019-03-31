import CalendarService from '../services/CalendarService'

class ActivityCalendar extends HTMLElement {
    constructor() {
        super();
        this.calendarService = new CalendarService();
    }

    connectedCallback() {
        this.innerHTML = `
      <div class="rounded-top"></div>
      <p class="text-paragraph" id="allCommits"></p>
      <div id="calendar"></div>
      <div class="rounded-bottom"></div>
    `;
        this.createEmptyCalendar();
        const GitLabPromise = this.calendarService.fetchGitLabActivity("Lorthiz");
        const GitHubPromise = this.calendarService.fetchGitHubActivity("Lorthiz");
        Promise.all([GitLabPromise, GitHubPromise]).then(values => {
            this.calendarValues = {};

            values.forEach(calendar => {
                Object.entries(calendar.data).forEach(entry => {
                    if (this.calendarValues.hasOwnProperty(entry[0])) {
                        this.calendarValues[entry[0]].sum += entry[1];
                        this.calendarValues[entry[0]].Sources.push(
                            `${calendar.Service}: ${entry[1]}`);
                    } else {
                        this.calendarValues[entry[0]] = {
                            sum: entry[1],
                            Sources: [`${calendar.Service}: ${entry[1]}`]
                        };
                    }
                })
            });
            this.fillCalendar();
        })



    }

    fillCalendar() {
        console.log(this.calendarValues);
        let allCommits = 0;
        Object.entries(this.calendarValues).forEach(value => {
            let activity;
            const commits = value[1].sum;
            allCommits += commits;
            if (commits < 3) {
                activity = "low";
            } else if (commits < 6) {
                activity = "moderate";
            } else if (commits < 9) {
                activity = "active";
            } else {
                activity = "very-active"
            }

            const element = document.getElementById(value[0]);
            if (element === null) {
                console.log(value[0]);
                return;
            }
            element.classList.add(activity);
            element.classList.add('ac-tooltip');
            element.innerHTML = `
      <div class="ac-tooltip-text">
        <span class="ac-tooltip-line">${value[0]}</span>
        ${value[1].Sources.map(item => `<span class="ac-tooltip-line">${item}</span>`).join('')}
      </div>
      `
        });
        document.getElementById('allCommits').innerHTML = `${allCommits} contributions in the last year`;

    }

    createEmptyCalendar() {
        const cal = document.getElementById('calendar');
        for (let i = 0; i < 7; ++i) {
            const date = new Date();
            date.setDate(date.getDate() - 370 + i);
            for (let j = 0; j < 53; ++j) {
                const rect = this.createCell(date);
                cal.appendChild(rect);
                date.setDate(date.getDate() + 7);
            }
        }
    }

    createCell(date) {
        const rect = document.createElement('div');
        rect.classList.add("ac-day");
        rect.id = date.toISOString().substring(0, 10);
        return rect;
    }
}
window.customElements.define('activity-calendar', ActivityCalendar);