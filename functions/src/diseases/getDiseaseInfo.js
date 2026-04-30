
const { onCall } = require("firebase-functions/v2/https");
exports.getDiseaseInfo = onCall(async (request) => { return { disease: null }; });
exports.getAllDiseases = onCall(async (request) => { return { diseases: [] }; });
