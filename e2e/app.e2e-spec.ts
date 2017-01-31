import { ColornetPage } from './app.po';

describe('colornet App', function() {
  let page: ColornetPage;

  beforeEach(() => {
    page = new ColornetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
