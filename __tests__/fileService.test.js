const readline = require('readline');
const fileService = require('../service/fileService');
const urlService = require('../service/urlService');

const FILE_PARAMETERS = {
  filename: 'posts.txt',
  fileIgnoreWithNull: null,
};

describe('Test fileService', () => {
  it('should return rejected empty object when readFiles function is called with incorrect data', async () => {
    const result = await fileService.readFiles(
      FILE_PARAMETERS.filename,
      FILE_PARAMETERS.fileIgnoreWithNull
    );
    expect(result.length).toBe(10);
  });

  it('should return rejected error message when readFiles function is called with wrong filename', () => {
    const filename = '';
    expect(fileService.readFiles(filename, FILE_PARAMETERS.fileIgnoreWithNull)).rejects.toEqual(
      new Error(`Could not find file: ${filename}`)
    );
  });

  it('should return rejected error messages when there is regexIgnored urls', () => {
    readline.createInterface = jest
      .fn()
      .mockReturnValue(['http://www.google.ca', 'https://www.example.com']);
    expect(fileService.readFiles(FILE_PARAMETERS.filename, 'not null')).rejects.toEqual(
      new Error('Invalid file to ignore URLs')
    );
  });

  it('should return rejected error messages when ignoreUrls exists', () => {
    urlService.isURL = jest.fn().mockReturnValue(true);
    readline.createInterface = jest
      .fn()
      .mockReturnValue([
        'http://localhost:3000/posts/af35025667',
        'http://localhost:3000/posts/9ba4c34271',
      ]);
    expect(fileService.readFiles(FILE_PARAMETERS.filename, 'not null')).rejects.toEqual(
      new Error('No http exists')
    );
  });

  it('should return rejected error messages when there is no data in the functions2', () => {
    readline.createInterface = jest.fn().mockReturnValue([]);
    expect(
      fileService.readFiles(FILE_PARAMETERS.filename, FILE_PARAMETERS.fileIgnoreWithNull)
    ).rejects.toEqual(new Error('No http exists'));
  });
});
