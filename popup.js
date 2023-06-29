//結果の表示
function showResult(result) {
  var location = result.location;
  var x=result.x;
  var z=result.z;
  var resultElement = document.getElementById('result');
  resultElement.innerHTML =location+"<br>"+"x:"+x+" / z:"+z+"<br>";

  var clipboardButton = document.createElement('button');
  clipboardButton.style.border = '2px solid #000';
  clipboardButton.style.borderRadius = '0';
  clipboardButton.style.background = '#fff';
  clipboardButton.style.fontSize = '18px';
  clipboardButton.style.width='250px';


  clipboardButton.addEventListener('mouseenter', function() {
    clipboardButton.style.color = '#fff';
    clipboardButton.style.background = '#000';
  });

  clipboardButton.addEventListener('mouseleave', function() {
    clipboardButton.style.color = ''; // ホバー解除時のスタイルを削除してデフォルトに戻す
    clipboardButton.style.background = '';
  });

  clipboardButton.textContent = 'tpコマンドをコピー';
  clipboardButton.addEventListener('click', function() {
    var clipboardText = '/tp ' + x + ' ~ ' + z;
    navigator.clipboard.writeText(clipboardText)
      .then(function() {
        console.log('Text copied to clipboard: ' + clipboardText);
      })
      .catch(function(error) {
        console.error('Failed to copy text to clipboard:', error);
      });
  });

  resultElement.appendChild(clipboardButton);
  return true;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "showResult") {
    showResult(message)
  }
  return true;
});

// window.addEventListener('beforeunload', function() {
//   chrome.runtime.sendMessage({ action: "stopObserving" });
//   return true;
// });

// window.addEventListener('DOMContentLoaded', function() {
//   chrome.runtime.sendMessage({ action: "startObserving" });
//   return true;
// })