"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define status and priority enums
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["OPEN"] = "open";
    ReportStatus["IN_PROGRESS"] = "in_progress";
    ReportStatus["RESOLVED"] = "resolved";
    ReportStatus["CLOSED"] = "closed";
    ReportStatus["REJECTED"] = "rejected";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
const CommentSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    user: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const ReportSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    reportedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    client: {
        id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
        email: { type: String, required: true },
    },
    comments: [CommentSchema],
    status: {
        type: String,
        enum: Object.values(ReportStatus),
        default: ReportStatus.OPEN,
    },
    jobId: { type: String, required: true, trim: true },
    category: String,
    resolutionDetails: String,
    resolvedAt: Date,
}, { timestamps: true });
const ReportModel = mongoose_1.default.model("Report", ReportSchema);
exports.default = ReportModel;
//# sourceMappingURL=ReportModel.js.map