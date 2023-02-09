// Scripts that can manipulate the page’s DOM and run in the context of a particular page.
import * as InboxSDK from '@inboxsdk/core';

InboxSDK.load(2, "secret").then((sdk) => {
    sdk.Toolbars.registerThreadButton({   
        title: "Save Promotion",
        iconUrl: "https://gdurl.com/oW2R",
        onClick(){
          savePromotion();
        }
    });
  });

function savePromotion() {
  // Get name of sender that sent the promotion email
  var sender = document.querySelector(".gD").getAttribute('name');
  // Get the title of the email and parse to find the actual discount/promotion
  // If no discount is explicitly found, use the title of the email
  var promotion = document.getElementsByClassName('hP')[0].innerHTML;
  var promotions = "";
  // Regular expressions array for finding % discounts and $ discounts
  const re = [/\d+\%/g, /\$\d+/g];
  for (ex of re)
  {
    var matches = promotion.match(ex);
    if (matches != null)
    {
      for (var deal in matches)
      {
        if (promotions == "")
        {
          promotions = matches[deal];
        }
        else
        {
          promotions += ", " + matches[deal];
        }
      }
    }
  }
  if (promotions != "")
  {
    promotion = promotions;
  }
 
  // Get expiration date selected/highlighted by user
  var exp_input = document.getSelection().toString();
  if (!exp_input) {
    window.alert("Please highlight the expiration date");
    return;
  }
  var expiration = new Date(exp_input).toLocaleDateString();
  if (!expiration || expiration == "Invalid Date"){
    window.alert("Extension only accepts certain expiration date formats ( {mm/dd/yyyy}, {mm-dd-yyyy}, {month day, year} )")
    return;
  }
  // Create unique key from Date object based on milliseconds from Dec 24, 2022 3:00pm 
  var key = new Date().getTime();
  var key_s = (key % 1671915564738).toString();
  chrome.storage.sync.set({ [key_s] : [sender, promotion, expiration] });
  chrome.storage.sync.get(key_s).then((result) => {
    console.log("Stored promotion is " + result[key_s]);
  });
}