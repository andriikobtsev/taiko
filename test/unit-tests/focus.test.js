const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
let {
  openBrowser,
  goto,
  textBox,
  closeBrowser,
  focus,
  setConfig,
} = require('../../lib/taiko');
let {
  createHtml,
  openBrowserArgs,
  removeFile,
} = require('./test-util');
const test_name = 'Focus';

describe(test_name, () => {
  let filePath;
  before(async () => {
    let innerHtml =
      '<input type="text" name="unfocusable" disabled>unfocusable</input>' +
      '<input type="text" name="inputTypeText" disabled>inputTypeText</input>' +
      '<input type="text" name="inputTypeText" >inputTypeText</input>' +
      '<input type="text" name="focusableTypeText" >focusableTypeText</input>';
    filePath = createHtml(innerHtml, test_name);
    await openBrowser(openBrowserArgs);
    await goto(filePath);
    await setConfig({ waitForNavigation: false });
  });

  after(async () => {
    await setConfig({ waitForNavigation: true });
    await closeBrowser();
    removeFile(filePath);
  });

  describe('focus Element', () => {
    it('should focus on the given element if it is focusable', async () => {
      await expect(focus(textBox('focusableTypeText'))).not.to.be
        .eventually.rejected;
    });

    it('should throw error if the given element is not focusable', async () => {
      await expect(
        focus(textBox('unfocusable')),
      ).to.be.eventually.rejectedWith(
        'Error: Element is not focusable\n',
      );
    });

    it('should write into the first focusable element', async () => {
      await expect(focus(textBox('inputTypeText'))).not.to.be
        .eventually.rejected;
    });
  });
});
