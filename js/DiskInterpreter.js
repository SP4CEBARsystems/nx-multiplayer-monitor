export default class DiskInterpreter {
    /** @type {number|undefined} */
    playerCount
    
    /** @type {number|undefined} */
    maxPlayers
    
    /** @type {number|undefined} */
    round
    
    /** @type {number|undefined} */
    gameSettings
    
    /** @type {number[]} */
    playerResponses = []

    constructor() {

    }

    /**
     * 
     * @param {string|undefined} data 
     * @returns 
     */
    interpret(data) {
        if (!data) {
            return
        }

        const F_CLIENT_COUNT  = 0;
        const F_MAX_CLIENTS   = 1;
        const F_ROUND_NUMBER  = 2;
        const F_GAME_SETTINGS = 3;
        const F_CLIENT_0_DATA = 4;

        const parsedData = DiskInterpreter.parse(data);
        this.playerCount = DiskInterpreter.extractProperty(parsedData, F_CLIENT_COUNT);
        this.maxPlayers = DiskInterpreter.extractProperty(parsedData, F_MAX_CLIENTS);
        this.round = DiskInterpreter.extractProperty(parsedData, F_ROUND_NUMBER);
        this.gameSettings = DiskInterpreter.extractProperty(parsedData, F_GAME_SETTINGS);
        this.playerResponses = DiskInterpreter.extractProperties(parsedData, F_CLIENT_0_DATA);
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
        const markerRegex = /#([0-9]|1[0-5]):(.*)(?:\r\n|\r|\n)((?:\d|\r\n|\r|\n)*)/g;

        /** @type {{ index: number, name:string, data: string }[]} */
        const result = [];

        const matches = [...text.matchAll(markerRegex)];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const index = Number(match[1]);
            const name = match[2];
            const data = match[3].replace(/(\r\n|\r|\n)/g, "");
            result.push({ index, name, data });
        }

        return result;
    }

    isDefined() {
        return this.playerCount !== undefined &&
            this.maxPlayers !== undefined &&
            this.round !== undefined &&
            this.gameSettings !== undefined;
    }
}