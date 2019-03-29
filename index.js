const puppeteer = require('puppeteer');

const LOGIN_STEP1_BUTTON_SELECTOR = '#step-1 > div.slider-item-footer > button';
const LOGIN_STEP2_EMAIL_SELECTOR = '#email';
const LOGIN_STEP2_BUTTON_SELECTOR = '#email-form > div.slider-item-footer > button'
const LOGIN_STEP4_PASSWORD_SELECTOR = '#password';
const LOGIN_STEP4_BUTTON_SELECTOR = '#step-4 > form > div.slider-item-footer > button';

const FIRST_PAGE_NEXT_CLASSES_BTN_SELECTOR = 'body > div > div > div.block.md-dark-grey.date-handle.clearfix > div > div.controller > a';
const FOLLOWING_PAGE_NEXT_CLASSES_BTN_SELECTOR = 'body > div > div > div.block.md-dark-grey.date-handle.clearfix > div > div.controller > a.pull-right';

const CLASSLIST_BASE_URL = 'https://cfv.members.pushpress.com/schedule/index';
const CLASSLIST_UNCOMPLETED_CLASSES_SELECTOR = 'body > div > div > div.block.white.de-padding.clearfix > div > div.tbody > div.tr:not(.class-completed)';
const CLASSLIST_SELECT_BUTTON_SELECTOR = 'div.reservation-modal.in > div.modal-dialog > div > div.modal-footer > button';
const CLASSLIST_VALIDATE_BUTTON_SELECTOR = 'div.reservation-modal.in > div.modal-dialog > div > div.modal-body.vertical-form > div.content-block > div.form-group > button';


async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--blink-settings=imagesEnabled=false'
    ]
  });
  const page = await browser.newPage();

  await page.goto('https://cfv.members.pushpress.com/login');
  await page.click(LOGIN_STEP1_BUTTON_SELECTOR);
  await page.waitFor(500);

  await page.click(LOGIN_STEP2_EMAIL_SELECTOR);
  await page.keyboard.type('mail');
  await page.waitFor(500);
  await page.click(LOGIN_STEP2_BUTTON_SELECTOR);
  await page.waitFor(500);

  await page.click(LOGIN_STEP4_PASSWORD_SELECTOR);
  await page.keyboard.type('password');
  await page.waitFor(500);

  await Promise.all([
    page.waitForNavigation({}),
    page.click(LOGIN_STEP4_BUTTON_SELECTOR)
  ]);

  // todo : navigate directly toward good page.
  await page.goto(CLASSLIST_BASE_URL);

  await page.waitForSelector(FIRST_PAGE_NEXT_CLASSES_BTN_SELECTOR);
  await page.click(FIRST_PAGE_NEXT_CLASSES_BTN_SELECTOR);
  await page.waitForSelector(FOLLOWING_PAGE_NEXT_CLASSES_BTN_SELECTOR);
  await page.click(FOLLOWING_PAGE_NEXT_CLASSES_BTN_SELECTOR);
  await page.waitForSelector(FOLLOWING_PAGE_NEXT_CLASSES_BTN_SELECTOR);
  await page.click(FOLLOWING_PAGE_NEXT_CLASSES_BTN_SELECTOR);

  let choices = [];
  let options = await page.$$(CLASSLIST_UNCOMPLETED_CLASSES_SELECTOR);

  // todo select the interesting options.
  for (let i = 0; i < options.length; i++) {
    let element = options[i];
    let eventTimeString = await element.$eval('div.class-time > span.visible-xs', node => node.innerText);
    let eventTimestamp = await page.evaluate(node => node.getAttribute('data-checkin-start-timestamp'), element);
    let eventTitle = await element.$eval('div.col-sm-3.td.title', node => node.innerText);
    console.log(eventTimeString + ' ' + eventTimestamp + ' ' + eventTitle);
    choices.push(element);
  }

  await options[options.length-1].click();
  await page.waitFor(500);
  await page.click(CLASSLIST_SELECT_BUTTON_SELECTOR);
  await page.waitFor(500);
  await page.click(CLASSLIST_VALIDATE_BUTTON_SELECTOR);
  await page.waitFor(2000);
  
  browser.close();
}

run();