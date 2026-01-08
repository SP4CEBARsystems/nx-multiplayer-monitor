import DiskInterpreter from "./DiskInterpreter.js";

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
     * @param {DiskInterpreter} interpreter
     * @returns 
     */
    interpretedCode(interpreter) {
        this.codeElement = document.createElement('ul');
        if (!this.codeElement) {
            return;
        }
        const codeElement = this.codeElement
        const playerCountElement = document.createElement('li');
        const maxPlayersElement = document.createElement('li');
        const roundElement = document.createElement('li');
        const gameSettingsElement = document.createElement('li');
        playerCountElement.textContent = `player count: ${interpreter.playerCount}`;
        maxPlayersElement.textContent = `max players: ${interpreter.maxClients}`;
        roundElement.textContent = `round: ${interpreter.round}`;
        gameSettingsElement.textContent = `game settings: ${interpreter.gameSettings}`;
        codeElement.appendChild(playerCountElement);
        codeElement.appendChild(maxPlayersElement);
        codeElement.appendChild(roundElement);
        codeElement.appendChild(gameSettingsElement);
        interpreter.playerResponses.forEach((v, i) => {
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