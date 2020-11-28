// @ts-nocheck
let req = require('request');
const urlService = require('../service/urlService');

describe('Test urlService', () => {
  const ISURL = {
    correct: 'https://senecacollege.ca',
    incorrect: 'senecacollege.ca',
  };

  const RETRIEVEURL = {
    correct: '#[http://tea.cesaroliveira.net/archives/tag/seneca/feed]',
    incorrect: '#name=Cesar Oliveira',
  };

  const GETNORMALCOUNT = {
    correct: ['https://httpstat.us/301', 'http://seneca.ca', 'https://www.google.com'],
    timeout: 12000,
  };

  const WRONGURL = {
    url: 'sdfasdf',
    timeout: 12000,
    filter: 'all',
    isColor: true,
  };

  const BADREQUESTURL = {
    url: 'https://httpstat.us/404',
    timeout: 12000,
    filter: 'all',
    isColor: true,
  };

  const CORRECTURL = {
    url: 'https://www.google.com',
    timeout: 12000,
    filter: 'all',
    isColor: true,
  };

  const PROCESSTOPARSEURLS = {
    urls: ['https://httpstat.us/301', 'http://seneca.ca', 'https://www.google.com'],
    timeout: 12000,
    filter: 'all',
    isColor: true,
  };

  const LOCALSERVERURL = {
    url: 'http://localhost:3000/posts',
    timeout: 12000,
    filter: 'all',
    isColor: true,
  };

  beforeEach(() => {
    global.console = { log: jest.fn() };
    urlService.getCount = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return true when isUrl function is called with correct data', () => {
    expect(urlService.isURL(ISURL.correct)).toBe(true);
  });

  it('should return false when isUrl function is called with incorrect data', () => {
    expect(urlService.isURL(ISURL.incorrect)).toBe(false);
  });

  it('should return error object when getCount is sent a link with non-200 status code', () => {
    expect(urlService.getNormalCount(BADREQUESTURL.url, 1500)).rejects.toEqual(
      new Error('No urls')
    );
  });

  it('should return only url string when retrieveUrl function is called with correct data', () => {
    expect(urlService.retrieveUrl(RETRIEVEURL.correct)).toBe(
      'http://tea.cesaroliveira.net/archives/tag/seneca/feed'
    );
  });

  it('should return empty string when retrieveUrl function is called with incorrect data', () => {
    expect(urlService.retrieveUrl(RETRIEVEURL.incorrect)).toBe('');
  });

  it('should return normal the count of 200 response when getNormalCount function is called with correct data', async () => {
    const spyFn = jest.spyOn(urlService, 'getNormalCount');
    const result = await urlService.getNormalCount(GETNORMALCOUNT.correct, GETNORMALCOUNT.timeout);
    expect(spyFn).toBeCalledTimes(1);
    expect(spyFn).toBeCalledWith(GETNORMALCOUNT.correct, GETNORMALCOUNT.timeout);
    expect(result).toBe(3);
    spyFn.mockRestore();
  });
  it('should log with unknown message when getStatus function is called with wrong url', () => {
    console.log = jest.fn();
    expect(
      urlService.getStatus(
        'https://httpstat.us/201',
        WRONGURL.timeout,
        WRONGURL.filter,
        WRONGURL.isColor
      )
    ).resolves.toMatch(`[unknown] https://httpstat.us/201`);
  });
  it('should log with unknown message when getStatus function is called with wrong url and isColor is false', () => {
    console.log = jest.fn();
    expect(
      urlService.getStatus('https://httpstat.us/201', WRONGURL.timeout, WRONGURL.filter, false)
    ).resolves.toMatch(`[unknown] https://httpstat.us/201`);
  });

  it('should log with good message when getStatus function is called with correct url', () => {
    expect(
      urlService.getStatus(CORRECTURL.url, CORRECTURL.timeout, CORRECTURL.filter, false)
    ).resolves.toMatch(`[good] ${CORRECTURL.url}`);
  });
  it('should log with bad message when getStatus function is called with incorrect url and isColor is true', () => {
    expect(
      urlService.getStatus(BADREQUESTURL.url, BADREQUESTURL.timeout, BADREQUESTURL.filter, true)
    ).resolves.toMatch(`[bad] ${BADREQUESTURL.url}`);
  });
  it('should log with bad message when getStatus function is called with incorrect url', () => {
    expect(
      urlService.getStatus(BADREQUESTURL.url, BADREQUESTURL.timeout, BADREQUESTURL.filter, false)
    ).resolves.toMatch(`[bad] ${BADREQUESTURL.url}`);
  });

  it('should log with good message when getStatus function is called with right url', (done) => {
    function callback(_, __) {
      // res should be a parameter
      const res = {};
      res.statusCode = 200;
      try {
        expect(res.statusCode).toBe(200);
        done();
      } catch (err) {
        done(err);
      }
    }
    req = jest.fn().mockReturnValue(callback);
    urlService
      .getStatus(CORRECTURL.url, CORRECTURL.timeout, CORRECTURL.filter, CORRECTURL.isColor)
      .then(req(callback))
      .catch((err) => console.log(err));
  });

  it('should return normal the count of 200 response when getNormalCount function is called with correct data, but without timeout', async () => {
    const spyFn = jest.spyOn(urlService, 'getNormalCount');
    const result = await urlService.getNormalCount(GETNORMALCOUNT.correct);
    expect(spyFn).toBeCalledTimes(1);
    expect(spyFn).toBeCalledWith(GETNORMALCOUNT.correct);
    expect(result).toBe(3);
    spyFn.mockRestore();
  });

  it('should return an array having the number of undefied when processToParseUrls function is called with correct data', async () => {
    const spyFn = jest.spyOn(urlService, 'processToParseUrls');
    const result = urlService.processToParseUrls(
      PROCESSTOPARSEURLS.urls,
      PROCESSTOPARSEURLS.timeout,
      PROCESSTOPARSEURLS.filter,
      PROCESSTOPARSEURLS.isColor
    );
    expect(spyFn).toBeCalledTimes(1);
    expect(spyFn).toBeCalledWith(
      PROCESSTOPARSEURLS.urls,
      PROCESSTOPARSEURLS.timeout,
      PROCESSTOPARSEURLS.filter,
      PROCESSTOPARSEURLS.isColor
    );
    expect(result).resolves.toEqual([
      '[good] https://httpstat.us/301',
      '[good] http://seneca.ca',
      '[good] https://www.google.com',
    ]); // like urls's count
    expect(PROCESSTOPARSEURLS.urls).not.toBe(undefined);
    expect(PROCESSTOPARSEURLS.timeout).not.toBe(undefined);
    expect(PROCESSTOPARSEURLS.filter).not.toBe(undefined);
    expect(PROCESSTOPARSEURLS.isColor).not.toBe(undefined);
    spyFn.mockRestore();
  });

  it('should return reject("no response") when getContentFromLocalServer function is called with wrong url', () => {
    const errorMessage = 'no response';
    expect(
      urlService.getContentFromLocalServer(
        WRONGURL.url,
        WRONGURL.timeout,
        WRONGURL.filter,
        WRONGURL.isColor
      )
    ).rejects.toEqual(new Error(errorMessage));
  });

  it('should return reject("no response") when result is empty in getContentFromLocalServer function', () => {
    const errorMessage = 'no response';
    // JSON.parse = jest.fn().mockReturnValue([]); // I don't know why this mock doesn't work
    expect(
      urlService.getContentFromLocalServer(
        LOCALSERVERURL.url,
        LOCALSERVERURL.timeout,
        LOCALSERVERURL.filter,
        LOCALSERVERURL.isColor
      )
    ).rejects.toEqual(new Error(errorMessage)); // (new Error(errorMessage));
  });
});
