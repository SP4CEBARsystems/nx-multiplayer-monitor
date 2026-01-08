import DataLoading from "./DataLoading.js";
import HttpError from "./HttpError.js";
import UiBuilder from "./UiBuilder.js";

export default class DiskInterpreter {
    /** @type {string} */
    name

    /** @type {string} */
    cdnUrl

    /** @type {string} */
    shareUrl

    /** @type {HTMLElement|null} */
    parentElement

    /** @type {string | undefined} */
    data;
    
    /** @type {number | undefined} */
    statusCode;
    
    /** @type {UiBuilder} */
    builder

    
    /** @type {number|undefined} */
    playerCount
    
    /** @type {number|undefined} */
    round
    
    /** @type {number[]} */
    playerResponses = []

    /**
     * 
     * @param {string} name 
     * @param {string} cdnUrl 
     * @param {string} shareUrl 
     */
    constructor(name, cdnUrl, shareUrl) {
        this.name = name;
        this.cdnUrl = cdnUrl;
        this.shareUrl = shareUrl;
        this.parentElement = document.getElementById('disk-data-section');
        this.builder = new UiBuilder();
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

    async render() {
        if (!this.parentElement) {
            console.error('no "disk-data-section" element');
            return;
        }
        if (this.data === undefined && this.statusCode === undefined) {
            await this.load();
        }
        if (this.statusCode !== undefined) {
            return this.renderError();
        }
        if (this.data === undefined) {
            console.error('no disk data');
            return;
        }
        if (this.data === '') {
            this.renderMessage();
        }
        this.interpret();
        if (
            this.playerCount === undefined ||
            this.round === undefined
        ) {
            this.renderRaw();
        }
        this.renderInterpretedPart();
    }

    renderMessage() {
        if (!this.parentElement) {
            return;
        }
        this.builder.reset();
        this.builder.title(`${this.name} is empty`);
        this.builder.link(this.shareUrl);
        this.parentElement.appendChild(this.builder.get());
    }

    renderError() {
        if (this.statusCode === undefined || !this.parentElement) {
            return;
        }
        let errorName = '';
        switch (this.statusCode) {
            case 400: case 410:
                errorName = 'is empty or unavailable';
                break;
                
            default:
                errorName = this.errorName ?? this.statusCode.toString();
                break;
        }
        this.builder.reset();
        this.builder.title(`${this.name} ${errorName}`);
        this.builder.link(this.shareUrl);
        this.parentElement.appendChild(this.builder.get());
    }

    renderRaw() {
        if (!this.parentElement) {
            console.error('no "disk-data-section" element');
            return;
        }
        this.builder.reset();
        this.builder.title(this.name);
        this.builder.rawCode(this.data);
        this.builder.link(this.shareUrl);
        this.parentElement.appendChild(this.builder.get());
    }

    renderInterpretedPart() {
        if (
            this.playerCount === undefined ||
            this.round === undefined ||
            !this.parentElement
        ) return;
        this.builder.reset();
        this.builder.title(this.name);
        this.builder.interpretedCode(this.playerCount, this.round, this.playerResponses);
        this.builder.link(this.shareUrl);
        this.parentElement.appendChild(this.builder.get());
    }
}