browser.runtime.onMessage.addListener(function (request,sender,sendResponse) {
  // request, sender, sendResponse
  console.log(request,sender,sendResponse);
});

