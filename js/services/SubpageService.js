export default class SubpageService {
    constructor() {
        // this.subpages = 'https://lorthiz.github.io/subpages/{0}.html';
        this.subpages = 'subpages/{0}.html';
    }

    fetchSubpage(page) {
        return fetch(this.subpages.replace('{0}', page))
            .then(resolve => {
                if (resolve.status !== 200) {
                    return '<p class=\'legendary\'>404 sub page not found</p>';
                }
                return resolve.text()
            })
            .catch(() => '');
    }
}
