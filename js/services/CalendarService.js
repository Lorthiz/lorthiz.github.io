export default class CalendarService {
    constructor() {
        this.corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
        this.GitLabUrl = 'https://gitlab.com/users/{0}/calendar.json';
        this.GitHubUrl = 'https://github.com/{0}';
    }

    fetchGitLabActivity(username) {
        return fetch(this.corsAnywhere + this.GitLabUrl.replace('{0}', username), CalendarService.fetchHeaders())
            .then(resolve => resolve.json())
            .then(data => Promise.resolve(CalendarService.createJsonData('GitLab', data)))
            .catch(() => Promise.resolve(CalendarService.createJsonData('GitLab', {})));
    }

    fetchGitHubActivity(username) {
        return fetch(this.corsAnywhere + this.GitHubUrl.replace('{0}', username), CalendarService.fetchHeaders())
            .then(resolve => resolve.text())
            .then(data => CalendarService.parseGitHubCalendar(data))
            .then(data => Promise.resolve(CalendarService.createJsonData('GitHub', data)))
            .catch(() => Promise.resolve(CalendarService.createJsonData('GitHub', {})));
    }

    fetchCustom(customSourceName, customSourceLink) {
        return fetch(this.corsAnywhere + customSourceLink, CalendarService.fetchHeaders())
            .then(resolve => resolve.json())
            .then(data => Promise.resolve(CalendarService.createJsonData(customSourceName, data)))
            .catch(() => Promise.resolve(CalendarService.createJsonData(customSourceName, {})));
    }
    static fetchHeaders() {
        return {
        };
    }
    static createJsonData(name, data) {
        return {
            'Service': name,
            'data': data
        }
    }

    static parseGitHubCalendar(data) {
        const regex = /data-count="(\d+)" data-date="(\S+)"/gm;
        const allOfThem = {};
        let match;
        while (match = regex.exec(data)) {
            const commits = parseInt(match[1]);
            const day = match[2];
            if (commits > 0) allOfThem[day] = commits;
        }
        return Promise.resolve(allOfThem);
    }
}
