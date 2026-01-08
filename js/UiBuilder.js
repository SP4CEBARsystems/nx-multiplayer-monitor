export default class UiBuilder {
    /** @type {HTMLHeadingElement | undefined} */
    titleElement
    
    /** @type {HTMLPreElement | HTMLUListElement | undefined} */
    codeElement
    
    /** @type {HTMLAnchorElement  | undefined} */
    linkElement
    
    constructor() {
    }

    /**
     * 
     * @param {string} name 
     */
    title(name) {
        this.titleElement = document.createElement('h2');
        this.titleElement.textContent = name;
    }

    /**
     * 
     * @param {string|undefined} data 
     * @returns 
     */
    rawCode(data) {
        this.codeElement = document.createElement('pre');
        this.codeElement.textContent = data ?? '';
    }

    /**
     * 
     * @param {number | undefined} playerCount 
     * @param {number | undefined} round 
     * @param {number[]} playerResponses 
     * @returns 
     */
    interpretedCode(playerCount, round, playerResponses) {
        this.codeElement = document.createElement('ul');
        if (!this.codeElement) {
            return;
        }
        const codeElement = this.codeElement
        const playerCountElement = document.createElement('li');
        const roundElement = document.createElement('li');
        playerCountElement.textContent = `player count: ${playerCount}`;
        roundElement.textContent = `round: ${round}`;
        codeElement.appendChild(playerCountElement);
        codeElement.appendChild(roundElement);
        playerResponses.forEach((v, i) => {
            const el = document.createElement('li');
            el.textContent = `layer ${i}'s move: ${v}`;
            codeElement.appendChild(el);
        });
    }

    /**
     * 
     * @param {string} shareUrl 
     */
    link(shareUrl) {
        this.linkElement = document.createElement('a');
        this.linkElement.href = shareUrl;
        this.linkElement.textContent = 'Join Game';
        this.linkElement.target = '_blank'
        this.linkElement.rel = 'noopener noreferrer';
    }

    get() {
        const wrapper = document.createElement('div');
        if (this.titleElement) wrapper.appendChild(this.titleElement);
        if (this.codeElement) wrapper.appendChild(this.codeElement);
        if (this.linkElement) wrapper.appendChild(this.linkElement);
        return wrapper;
    }

    reset() {
        this.titleElement = undefined;
        this.codeElement = undefined;
        this.linkElement = undefined;
    }
}