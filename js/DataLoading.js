export default class DataLoading {
    /**
     * 
     * @param {string} url 
     */
    static async getString(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.text();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }
}