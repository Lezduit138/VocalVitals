
const { onCall } = require("firebase-functions/v2/https");
exports.shareReport = onCall(async (request) => { return { shareUrl: '' }; });
exports.generatePDF = onCall(async (request) => { return { pdfUrl: '' }; });
