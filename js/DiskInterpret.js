import DataLoading from "./DataLoading.js";

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
        } catch (error) {
            console.warn(error);
        }
    }

    async render() {
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
        const wrapper = document.createElement('div');
        const titleElement = document.createElement('h2');
        titleElement.textContent = this.name;
        const codeElement = document.createElement('pre');
        codeElement.textContent = this.data;
        wrapper.appendChild(titleElement);
        wrapper.appendChild(codeElement);
        this.parentElement.appendChild(wrapper);
    }
}