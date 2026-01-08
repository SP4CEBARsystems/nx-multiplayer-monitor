import DataLoading from "./DataLoading.js";
import DiskContentInterpret from "./DiskContentInterpret.js";
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
    
    /** @type {DiskContentInterpret} */
    interpreter

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
        this.interpreter = new DiskContentInterpret();
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
        this.interpreter.interpret(this.data);
        if (!this.interpreter.isDefined()) {
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
        if (!this.interpreter.isDefined() || !this.parentElement) return;
        this.builder.reset();
        this.builder.title(this.name);
        this.builder.interpretedCode(this.interpreter);
        this.builder.link(this.shareUrl);
        this.parentElement.appendChild(this.builder.get());
    }
}