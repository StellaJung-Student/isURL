const utilService = require('../service/utilService');

const ISVERSION = {
  correct: ['-v'],
  incorrect: ['v'],
};

describe('Test urlService', () => {
  it('should return true when isUrl function is called with correct data', () => {
    expect(utilService.isVersion(ISVERSION.correct)).toBe(true);
  });

  it('should return false when isUrl function is called with incorrect data', () => {
    expect(utilService.isVersion(ISVERSION.incorrect)).toBe(false);
  });
});
