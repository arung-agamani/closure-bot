/* eslint-disable no-console */
chrome.runtime.onInstalled.addListener(async () => {
  const url = chrome.runtime.getURL('popup/index.html');
  const tab = await chrome.tabs.create({ url });
  console.log(`Created tab!${tab.id}`);
});
