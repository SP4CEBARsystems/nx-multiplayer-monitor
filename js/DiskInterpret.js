import DataLoading from "./DataLoading.js";
import HttpError from "./HttpError.js";

export default class DiskInterpreter {
    /** @type {string} */
    name

    /** @type {string} */
    cdnUrl

    /** @type {HTMLElement|null} */
    parentElement

    /** @type {string | undefined} */
    data;
    
    /** @type {number | undefined} */
    statusCode;

    /**
     * 
     * @param {string} name 
     * @param {string} cdnUrl 
     */
    constructor(name, cdnUrl) {
        this.name = name;
        this.cdnUrl = cdnUrl;
        this.parentElement = document.getElementById('disk-data-section');
    }

    async load() {
        try {
            this.data = await DataLoading.getString(this.cdnUrl) ?? undefined;
        } catch (err) {
            if (err instanceof HttpError) {
                this.statusCode = err.status;
                this.errorName = err.statusText;
                console.warn(err.status, err.statusText);      // 404 Not Found
            } else {
                console.error('Network error', err);
            }
        }
    }

    interpret() {
        if (!this.data) {
            return
        }
        const parsedData = DiskInterpreter.parse(this.data);
        this.playerCount = DiskInterpreter.extractProperty(parsedData, 0);
        this.round = DiskInterpreter.extractProperty(parsedData, 1);
        this.playerResponses = DiskInterpreter.extractProperties(parsedData, 2);
    }

    /**
     * 
     * @param {{ index: number, data: string }[]} parsedData 
     * @param {number} targetIndex 
     * @returns {number|undefined}
     */
    static extractProperty(parsedData, targetIndex) {
        const data = parsedData.find(v => v.index === targetIndex)?.data;
        if (data === undefined) {
            return undefined;
        }
        return parseInt(data);
    }

    /**
     * 
     * @param {{ index: number, data: string }[]} parsedData 
     * @param {number} minTargetIndex 
     * @param {number} maxTargetIndex 
     * @returns {number[]}
     */
    static extractProperties(parsedData, minTargetIndex = 0, maxTargetIndex = 15) {
        const found = parsedData.filter(v => v.index >= minTargetIndex && v.index <= maxTargetIndex);
        return found.map((e) => parseInt(e.data));
    }

    /**
     * Parse the text into structured segments.
     *
     * @param {string} text
     * @returns {{ index: number, data: string }[]}
     */
    static parse(text) {
        // Matches #0: through #15:, capturing the number (0–15)
        const markerRegex = /#([0-9]|1[0-5]):(.*)(?:\r\n|\r|\n)(\d*)/g;

        /** @type {{ index: number, name:string, data: string }[]} */
        const result = [];

        const matches = [...text.matchAll(markerRegex)];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const index = Number(match[1]);
            const name = match[2];
            const data = match[3];

            // const start = match.index + match[0].length;
            // const end = i + 1 < matches.length
            //     ? matches[i + 1].index
            //     : text.length;

            // const data = text
            //     .slice(start, end)
            //     .trim();

            result.push({ index, name, data });
        }

        return result;
    }

    async renderRaw() {
        if (!this.parentElement) {
            console.error('no "disk-data-section" element');
            return;
        }
        if (this.data === undefined) {
            await this.load();
        }
        if (this.data === undefined) {
            console.error('no disk data');
            return;
        }
        this.renderRawPart();
    }

    async render() {
        console.log('render')
        if (!this.parentElement) {
            console.error('no "disk-data-section" element');
            return;
        }
        if (this.data === undefined) {
            console.log('render loading')
            await this.load();
        }
        if (this.statusCode !== undefined) {
            console.log('render error')
            return this.renderError();
        }
        if (this.data === undefined) {
            console.log('render nothing')
            console.error('no disk data');
            return;
        }
        if (this.data === '') {
            this.renderMessage(`${this.name} is empty`);
        }
        this.interpret();
        if (
            this.playerCount === undefined ||
            this.round === undefined ||
            this.playerResponses === undefined
        ) {
            console.log('render raw')
            return this.renderRawPart();
        }
        console.log('render interpreted')
        this.renderInterpretedPart();
    }

    renderError() {
        if (this.statusCode === undefined) {
            return;
        }
        let errorName = '';
        switch (this.statusCode) {
            case 400: case 410:
                errorName = 'is unavailable';
                break;
                
            default:
                errorName = this.errorName ?? this.statusCode.toString();
                break;
        }
        this.renderMessage(`${this.name} ${errorName}`)
    }

    /**
     * 
     * @param {string} message 
     * @returns 
     */
    renderMessage(message) {
        if (!this.parentElement || this.statusCode === undefined) {
            return;
        }
        const wrapper = document.createElement('div');
        const titleElement = document.createElement('h2');
        titleElement.textContent = message;
        wrapper.appendChild(titleElement);
        this.parentElement.appendChild(wrapper);
    }

    renderInterpretedPart() {
        if (
            this.playerCount === undefined ||
            this.round === undefined ||
            this.playerResponses === undefined ||
            !this.parentElement
        ) return;
        const wrapper = document.createElement('div');
        const titleElement = document.createElement('h2');
        titleElement.textContent = this.name;
        const codeElement = document.createElement('ul');
        console.log('vals, ', this.playerCount, this.round, this.playerResponses);
        const playerCountElement = document.createElement('li');
        const roundElement = document.createElement('li');
        playerCountElement.textContent = `player count: ${this.playerCount}`;
        roundElement.textContent = `round: ${this.round}`;
        codeElement.appendChild(playerCountElement);
        codeElement.appendChild(roundElement);
        this.playerResponses.forEach((v, i) => {
            const el = document.createElement('li');
            el.textContent = `layer ${i}'s move: ${v}`;
            codeElement.appendChild(el);
        });
        wrapper.appendChild(titleElement);
        wrapper.appendChild(codeElement);
        this.parentElement.appendChild(wrapper);
    }

    renderRawPart() {
        if (!this.parentElement) {
            return;
        }
        const wrapper = document.createElement('div');
        const titleElement = document.createElement('h2');
        titleElement.textContent = this.name;
        const codeElement = document.createElement('pre');
        codeElement.textContent = this.data ?? null;
        wrapper.appendChild(titleElement);
        wrapper.appendChild(codeElement);
        this.parentElement.appendChild(wrapper);
    }
}