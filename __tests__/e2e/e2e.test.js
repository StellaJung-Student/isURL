const run = require('../../service/run');

describe('e2e test urlpilgrim', () => {
  test('prints help message with arguments: -h', async () => {
    const { stderr, stdout, exitCode } = await run('-h');
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  /*  
  > The following tests require managing chalk colors on snapshots. 
  > https://github.com/chalk/supports-color

  test('prints error when no arguments given', async () => {
    const { stderr, stdout, exitCode } = await run();
    expect(exitCode).toBe(1);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('prints good and bad against the file: url_e2e_test.txt', async () => {
    const { stderr, stdout, exitCode } = await run('-f', 'url_e2e_test.txt');
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  }); */
});
