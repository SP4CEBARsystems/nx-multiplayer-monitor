export default class HttpError extends Error {
    /**
     * @param {number} status
     * @param {string} statusText
     * @param {string} url
     */
    constructor(status, statusText, url) {
        super(`HTTP ${status}: ${statusText}`);
        this.name = 'HttpError';
        this.status = status;
        this.statusText = statusText;
        this.url = url;
    }
}
