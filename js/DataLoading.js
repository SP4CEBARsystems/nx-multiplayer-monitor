import HttpError from './HttpError.js';

export default class DataLoading {
    /**
     * @param {string} url
     * @returns {Promise<string>}
     * @throws {HttpError}
     */
    static async getString(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new HttpError(
                res.status,
                res.statusText,
                url
            );
        }

        return res.text();
    }
}
