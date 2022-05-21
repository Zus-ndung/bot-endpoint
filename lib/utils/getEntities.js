"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEntities = void 0;
const extractEntities = (result) => {
    const results = {};
    const entites = result.entities;
    const instance = entites.$instance;
    for (const value of Object.values(instance)) {
        const tmp = value[0];
        if (tmp.score >= 0.5) {
            results[tmp.type] = tmp.text;
        }
    }
    return results;
};
exports.extractEntities = extractEntities;
//# sourceMappingURL=getEntities.js.map