/* let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
}); */
var currentlyRetrievedServerInfo = {};

function getServerInfo() {
  var guild_id_string = document.getElementById('targetGuildId').value;
  axios.get('http://localhost:2000/warfarin/'+guild_id_string+'/info')
      .then(response => {
        console.log(response);
          if (response.status === 200) {
              $('#serverInfoRow').removeClass('d-none');
              document.getElementById('serverNameId').innerText = response.data.name;
              document.getElementById('serverLogoId').src = response.data.icon;
              document.getElementById('serverTagsId').innerText = response.data.tags.join(', ');
              currentlyRetrievedServerInfo = response.data;
              currentlyRetrievedServerInfo.guildId = guild_id_string;
          }
      })
}

function useServer() {
  // simpan di storage
  chrome.storage.local.set({'currentUsedServer' : currentlyRetrievedServerInfo}, function() {
    alert("Server info updated!");
  });
  // load ke context menu
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      title : "Send to Discord",
      contexts : ["image"],
      id : "WARFARIN_001"
    });
    var tags = currentlyRetrievedServerInfo.tags;
    for (const tagObj of tags) {
      chrome.contextMenus.create({
          title : tagObj,
          parentId : "WARFARIN_001",
          contexts : ["image"],
          documentUrlPatterns : ["https://*.twitter.com/*", "https://twitter.com/*"],
          id : "WARFARIN_002_" + tagObj
      });
      chrome.contextMenus.create({
          title : tagObj,
          parentId : "WARFARIN_001",
          contexts : ["image", "link"],
          documentUrlPatterns : ["https://*.pixiv.net/*/artworks/*"],
          id : "WARFARIN_PIXIV_" + tagObj
      });
    }
  })
  
}

document.getElementById('retrieveButton').addEventListener('click', getServerInfo);
document.getElementById('useThisServerButton').addEventListener('click', useServer);
$(document).ready(function(){
  $('body').on('click', 'a', function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
});