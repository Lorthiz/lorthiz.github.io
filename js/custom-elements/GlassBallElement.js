import UUIDGenerator from '../utils/UUIDGenerator';

export default class GlassBallElement extends HTMLElement {
    constructor(config) {
        super();
        let conf = config || {};

        this.id = this.id || UUIDGenerator.generateId();
        this.effectColor = this.getAttribute('effect-color') || '#000000';
        this.fillColor = this.getAttribute('fill-color') || '#FFFFFF';
        this.radius = window.getComputedStyle(this).width !== 'auto' ? window.getComputedStyle(this).width : 200;
        this.fillLevel = conf.fillLevel || 1.0;
        const shadowTemplate = this.attachShadow({mode: 'open'});
        shadowTemplate.innerHTML = this.fetchShadowDOMTemplate();
    }

    startAnimation(level) {
        if (this.intervalId) this.stopAnimation();
        this.intervalId = setInterval(this.changeFillOnTimeout.bind(this), 10, level);
    }

    stopAnimation() {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    changeFillOnTimeout(level) {
        let levelFilter = this.shadowRoot.getElementById(this.id + '-fillLevel');
        if (level > this.fillLevel) {
            this.fillLevel += 0.01;
            this.fillLevel = Math.round(this.fillLevel * 100) / 100;
            levelFilter.setAttribute('height', (1.0 - this.fillLevel) * this.radius);
        } else if (level < this.fillLevel) {
            this.fillLevel -= 0.01;
            this.fillLevel = Math.round(this.fillLevel * 100) / 100;
            levelFilter.setAttribute('height', (1.0 - this.fillLevel) * this.radius);
        } else {
            this.stopAnimation();
        }
    }

    changeFillLevel(level) {
        this.startAnimation(Math.round(level * 100) / 100);
    }

    fetchShadowDOMTemplate() {
        return `
            <style>
                :host {
                    width: inherit;
                    height: inherit;
                }
                .svg {
                    width: inherit;
                    height: inherit;
                }
                .glass-ball-part {
                    position: absolute;
                    height: 100%;
                }
                particle-radial-animation {
                    width: inherit;
                    height: inherit;
                    color: ${this.effectColor || this.fillColor};
                }
            </style>
            ${this.fetchTemplate()}`
    }

    fetchTemplate() {
        const filter = () => {
            return `filter="url(#${this.id}-filt)"`;
        };

        const clip = () => {
            return `clip-path="url(#${this.id}-clip)"`;
        };

        const fetchEllipseAttributes = (cx, cy, rx, ry) => {
            return `cx="${this.radius * cx}" cy="${this.radius * cy}" rx="${this.radius * rx}" ry="${this.radius * ry}"`;
        };

        const fetchEllipseAttributesDefault = (rot) => {
            let posX = this.radius * 0.5;
            let posY = this.radius * 0.5;
            return `cx="${posX}" cy="${posY}" rx="${this.radius * 0.275}" ry="${this.radius * 0.475}" fill="${this.fillColor}" opacity="0.1" transform="rotate(${rot} ${posX} ${posY})"`;
        };
        return `
              <div style="width:${this.radius}px; height:${this.radius}px">
               <svg class="glass-ball-part svg">
                  <defs>
                     <radialGradient id="${this.id}-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:${this.fillColor};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${this.fillColor};stop-opacity:0" />
                     </radialGradient>
                     <filter id="${this.id}-filt" width="300%" height="300%" x="-50%" y="-50%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
                     </filter>
                     <clipPath id="${this.id}-clip">
                        <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius * 0.45}"/>
                     </clipPath>
                     <mask id="${this.id}-mask">
                        <rect width="${this.radius * 3}" height="${this.radius * 1.25}" fill="white"/>
                        <circle cx="${this.radius * 0.55}" cy="${this.radius * 0.4}" r="${this.radius * 0.4}" fill="black"/>
                     </mask>
                     <mask id="${this.id}-fillLevelMask">
                        <rect width="${this.radius}" height="${this.radius}" fill="white"/>
                        <rect id="${this.id}-fillLevel" width="${this.radius}" height="${(1.0 - this.fillLevel) * this.radius}" fill="black"/>
                     </mask>
                  </defs>
                  <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius / 2}" fill="#ACACAC" opacity="0.1"></circle>
                  <g mask="url(#${this.id}-fillLevelMask)" ${clip()}>
                    <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius * 0.475}" fill="#000000"></circle>
                    <ellipse ${fetchEllipseAttributesDefault(0)} ${clip()}/>
                    <ellipse ${fetchEllipseAttributesDefault(45)}" ${clip()}/>
                    <ellipse ${fetchEllipseAttributesDefault(90)}" ${clip()}/>
                    <ellipse ${fetchEllipseAttributesDefault(135)}" ${clip()}/>
                  </g>
                  <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius * 0.475}" fill="url(#${this.id}-grad)"></circle>
                  <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius * 0.475}" fill="#000" mask="url(#${this.id}-mask)" opacity="0.2"></circle>
               </svg>
               <particle-radial-animation class="glass-ball-part"></particle-radial-animation>
               <canvas height="${this.radius}" width="${this.radius}" id="${this.id}-canvas" class="glass-ball-part"></canvas>
               <svg class="glass-ball-part">
                  <circle cx="${this.radius / 2}" cy="${this.radius / 2}" r="${this.radius / 2}" fill="#ACACAC" opacity="0.1"/>
                  <g ${clip()}">0
                     <ellipse ${fetchEllipseAttributes(0.6, 0.35, 0.25, 0.2)} fill="#FFFFFF" opacity="1" ${filter()} transform="rotate(30 ${this.radius * 0.6} ${this.radius * 0.35})"/>
                     <ellipse ${fetchEllipseAttributes(0.6, 0.35, 0.2, 0.15)} fill="#FFFFFF" opacity="1" ${filter()} transform="rotate(30 ${this.radius * 0.6} ${this.radius * 0.35})"/>
                  </g>
               </svg>
            </div>
        `;
    }
}


window.customElements.define('glass-ball-element', GlassBallElement);