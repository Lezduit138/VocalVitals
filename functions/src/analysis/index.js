
const uploadAudio = require('./uploadAudio');
const triggerAnalysis = require('./triggerAnalysis');
module.exports = {
  ...uploadAudio,
  ...triggerAnalysis
};
