export default class RadialParticleAnimationElement extends HTMLElement {
    constructor(config) {
        super();
        config = config || {};
        this.points = config.points || 100;
        this.radius = config.radius || 2;
        this.interval = config.interval || 10;
        this.color = {};
        this.parseValuesFromCurrentStyle();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.fetchShadowDOMTemplate();
    }


    connectedCallback() {
        this.ctx = this.shadowRoot.querySelector('canvas').getContext('2d');
        this.init();
        this.start();
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(this.setBackground.bind(this), this.interval);
    }

    stop() {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    init() {
        this.snow = [];
        for (let i = 0; i < this.points; i++) {
            const snowFlake = {
                posX: this.width * Math.random(),
                posY: this.height * Math.random(),
                radius: Math.random() * this.radius,
                opacity: Math.random(),
                initialOpacity: 1
            };
            snowFlake.initialRadius = snowFlake.radius;
            snowFlake.initialX = snowFlake.posX;
            snowFlake.initialY = snowFlake.posY;
            let distance = this.distanceFromCenter(snowFlake.posX, snowFlake.posY);
            if (distance < this.width / 2 - 30) {
                this.snow.push(snowFlake);
            } else {
                --i;
            }
        }
    }

    createSnow(snowID) {
        const snowFlake = this.snow[snowID];
        this.ctx.beginPath();

        this.ctx.arc(snowFlake.posX, snowFlake.posY, snowFlake.radius, 0, 2 * Math.PI, false);

        this.ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${snowFlake.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();

        snowFlake.posX = snowFlake.posX - (this.width / 2 - snowFlake.posX) / 200;
        snowFlake.posY = snowFlake.posY - (this.height / 2 - snowFlake.posY) / 200;
        snowFlake.radius += .02;

        let distance = this.distanceFromCenter(snowFlake.posX, snowFlake.posY);
        if (distance > (this.width / 2 - snowFlake.radius) * 0.9) {
            snowFlake.posX = this.width * Math.random();
            snowFlake.posY = this.height * Math.random();
            snowFlake.radius = 0;
            snowFlake.opacity = snowFlake.initialOpacity;
        }

        if (snowFlake.radius > 3 && snowFlake.opacity >= 0) {
            snowFlake.opacity -= .05;
        }

    }

    distanceFromCenter(posX, posY) {
        const deltaX = Math.pow(posX - this.width / 2, 2);
        const deltaY = Math.pow(posY - this.height / 2, 2);
        return Math.sqrt(deltaX + deltaY, 2);
    }

    parseValuesFromCurrentStyle() {
        const style = window.getComputedStyle(this);
        this.width = new RegExp('\\d+', 'g').exec(style.width);
        this.height = new RegExp('\\d+').exec(style.height);

        const regExp = new RegExp('\\d+', 'g');
        this.color.r = regExp.exec(style.color);
        this.color.g = regExp.exec(style.color);
        this.color.b = regExp.exec(style.color);
    }

    setBackground() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.points; i++) {
            this.createSnow(i);
        }
    }

    fetchShadowDOMTemplate() {
        return `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            </style>
            <canvas width="${this.width || 100}px" height="${this.height || 100}px"></canvas>`;
    }
}
window.customElements.define('particle-radial-animation', RadialParticleAnimationElement);