/**
 * Simple verification script for SuperLikeCreditService
 * This script checks if the service has all required methods and exports
 */

// Mock AsyncStorage for verification
const mockAsyncStorage = {
  getItem: async (key) => null,
  setItem: async (key, value) => undefined,
  multiSet: async (pairs) => undefined,
  multiRemove: async (keys) => undefined,
};

// Mock the module
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Import the service
const superLikeCreditService = require('./src/services/SuperLikeCreditService').default;
const { SuperLikeCreditService, PRICE_PER_CREDIT } = require('./src/services/SuperLikeCreditService');

console.log('✓ Service imported successfully');

// Check if service is an instance of SuperLikeCreditService
if (superLikeCreditService instanceof SuperLikeCreditService) {
  console.log('✓ Service is instance of SuperLikeCreditService');
} else {
  console.error('✗ Service is not instance of SuperLikeCreditService');
  process.exit(1);
}

// Check required methods
const requiredMethods = [
  'initialize',
  'getBalance',
  'purchase',
  'use',
  'getHistory',
  'migrateOldData',
  'calculatePrice',
  '_saveBalanceAndTransaction',
  '_clearAllData'
];

let allMethodsPresent = true;
for (const method of requiredMethods) {
  if (typeof superLikeCreditService[method] === 'function') {
    console.log(`✓ Method ${method} exists`);
  } else {
    console.error(`✗ Method ${method} is missing`);
    allMethodsPresent = false;
  }
}

// Check PRICE_PER_CREDIT constant
if (PRICE_PER_CREDIT === 2) {
  console.log('✓ PRICE_PER_CREDIT is correctly set to 2');
} else {
  console.error('✗ PRICE_PER_CREDIT is not set correctly');
  allMethodsPresent = false;
}

// Check calculatePrice method
if (superLikeCreditService.calculatePrice(5) === 10) {
  console.log('✓ calculatePrice works correctly');
} else {
  console.error('✗ calculatePrice does not work correctly');
  allMethodsPresent = false;
}

if (allMethodsPresent) {
  console.log('\n✓ All verification checks passed!');
  process.exit(0);
} else {
  console.error('\n✗ Some verification checks failed');
  process.exit(1);
}
