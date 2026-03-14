// ============================================
// PASSENGER ENTRY POINT
// ============================================
// This file is required by Phusion Passenger
// It imports and exports only the Express app from server.js
// ============================================
const app = require('./server.js');

app.listen('passenger', () => {
  console.log('Passenger: app is now accepting requests');
});