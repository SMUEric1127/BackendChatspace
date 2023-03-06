"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptSchema = void 0;
const mongoose = require("mongoose");
exports.PromptSchema = new mongoose.Schema({
    status: { type: String, required: true },
    username: { type: String, required: true },
    response: { type: String, required: false },
    tokens: { type: Number, required: false },
});
//# sourceMappingURL=prompt.model.js.map