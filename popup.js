// Checks if any promotions have expired and/or are about to expire
// Deletes expired promotions and italicizes soon to expire promotions
var today = new Date().toLocaleDateString();

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(null, (result) => {
    for (key in result)
    {
      if (Date.parse(today) > Date.parse(result[key][2]))
      {
        chrome.storage.sync.remove(result[key]);
      }
      else
      {
        var daysRem = ((Date.parse(result[key][2]) - Date.parse(today)) / 86400000);
        if (daysRem <= 2)
        {
          document.getElementsByTagName("table")[0].innerHTML += "<tr class='fst-italic'><td>"+"! " + result[key][0]+"</td><td>"+result[key][1]+"</td><td>"+result[key][2]+ "</td></tr>";
        }
        else
        {
          document.getElementsByTagName("table")[0].innerHTML += "<tr><td>"+result[key][0]+"</td><td>"+result[key][1]+"</td><td>"+result[key][2]+ "</td></tr>";
        }
      }
    }
  })
}); 

document.addEventListener("submit", (event) => {
  event.preventDefault();
  var form = document.getElementById('add'); 
  manualAdd(form);
  setTimeout(function(){
    window.location.reload();
  },3);
})

function manualAdd(form) {
  const data = new FormData(form);
  // Create unique key from Date object based on milliseconds from Dec 24, 2022 3:00pm 
  var key = new Date().getTime();
  var key_s = (key % 1671915564738).toString();
  var expiration = new Date(data.get('exp')).toLocaleDateString();
  chrome.storage.sync.set({ [key_s] : [data.get('sender'), data.get('promo'), expiration] });
  chrome.storage.sync.get(key_s).then((result) => {
    console.log("Stored promotion is " + result[key_s]);
  });
}

