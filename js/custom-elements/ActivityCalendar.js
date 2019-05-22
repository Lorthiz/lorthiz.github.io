import CalendarService from '../services/CalendarService'

export default class ActivityCalendar extends HTMLElement {
    constructor() {
        super();
        this.calendarService = new CalendarService();
        const shadowTemplate = this.attachShadow({mode: 'open'});
        shadowTemplate.innerHTML = this.fetchShadowDOMTemplate();
        this.createEmptyCalendar();
    }

    connectedCallback() {
        const GitLabPromise = this.calendarService.fetchGitLabActivity('Lorthiz');
        const GitHubPromise = this.calendarService.fetchGitHubActivity('Lorthiz');
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
        let allCommits = 0;
        Object.entries(this.calendarValues).forEach(value => {
            let activity;
            const commits = value[1].sum;
            allCommits += commits;
            if (commits < 3) {
                activity = 'low';
            } else if (commits < 6) {
                activity = 'moderate';
            } else if (commits < 9) {
                activity = 'active';
            } else {
                activity = 'very-active'
            }

            const element = this.shadowRoot.getElementById(value[0]);
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
        this.shadowRoot.getElementById('allCommits').innerHTML = `${allCommits} contributions in the last year`;

    }

    fetchShadowDOMTemplate() {
        return `
            <style>
                :host {
                    width: 100%;
                    font-size: 0;
                    display: block;
                    margin: auto;
                }
        
                .ac-day {
                    box-sizing: border-box;
                    width: calc(100% / 53 - 2px);
                    background-color: #808080;
                    margin: 1px;
                    display: inline-block;
                    border-radius: 1px;
                    padding-top: calc(100% / 53 - 2px);
                    height: 0px;
                }
        
                .ac-day:hover {
                    --border: solid white 1px;
                    cursor: pointer;
                }
        
                .low {
                    background-color: #E0F6F0;
                }
        
                .moderate {
                    background-color: #C1ECE1;
                }
        
                .active {
                    background-color: #A2E3D1;
                }
        
                .very-active {
                    background-color: #83DAC2;
                }
        
                .rounded-top {
                    background-color: #808080;
                    border-radius: 10px 10px 0px 0px;
                    height: 10px;
                    margin: 0px 1px 1px 1px;
                }
        
                .ac-tooltip {
                    position: relative;
                }
        
                .ac-tooltip-text {
                    visibility: hidden;
                    background-color: #404040;
                    color: #fff;
                    text-align: center;
                    padding: 5px;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 1;
                    font-size: 12px;
                    font-family: 'Philosopher', sans-serif;
                    bottom: 100%;
                    margin-bottom: 5px;
                    left: 50%;
                    transform: translate(-50%);
                    width: max-content;
                }
        
                .ac-tooltip:hover .ac-tooltip-text {
                    visibility: visible;
                }
        
                .ac-tooltip-line {
                    display: block;
                }
        
                .text-paragraph {
                    color: white;
                    font-size: 12px;
                    line-height: 10px;
                    background-color: #404040;
                    padding: 4px;
                    font-family: 'Philosopher', sans-serif;
                    margin: 2px 1px 1px 1px;
                }
        
                .rounded-bottom {
                    background-color: #808080;
                    border-radius: 0px 0px 10px 10px;
                    height: 10px;
                    margin: 1px 1px 0px 1px;
                }
            </style>
            ${this.fetchTemplate()}
        `
    }

    fetchTemplate() {
        return `
              <div class="rounded-top"></div>
              <p class="text-paragraph" id="allCommits"></p>
              <div id="calendar"></div>
              <div class="rounded-bottom"></div>
`
    }

    createEmptyCalendar() {
        const cal = this.shadowRoot.getElementById('calendar');
        this.shadowRoot.getElementById('allCommits').innerHTML = "Loading...";
        for (let i = 0; i < 7; ++i) {
            const date = new Date();
            date.setDate(date.getDate() - 370 + i);
            for (let j = 0; j < 53; ++j) {
                const rect = ActivityCalendar.createCell(date);
                cal.appendChild(rect);
                date.setDate(date.getDate() + 7);
            }
        }
    }

    static createCell(date) {
        const rect = document.createElement('div');
        rect.classList.add('ac-day');
        rect.id = date.toISOString().substring(0, 10);
        return rect;
    }
}

window.customElements.define('activity-calendar', ActivityCalendar);