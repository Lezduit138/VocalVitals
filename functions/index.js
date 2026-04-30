
const { initializeApp } = require('firebase-admin/app');
initializeApp();

exports.auth = require('./src/auth/onUserCreate');
exports.analysis = require('./src/analysis');
exports.doctors = require('./src/doctors/searchDoctors');
exports.diseases = require('./src/diseases/getDiseaseInfo');
exports.reports = require('./src/reports');
