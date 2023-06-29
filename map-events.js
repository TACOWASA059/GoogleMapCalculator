const mutationCallback = function(mutationsList, observer) {
  const url = window.location.href;
  const coordinates = extractCoordinatesFromURL(url);
  if(!coordinates) {
    // coordinates が null の場合の処理
    console.log("Coordinates not found");
    return true;
  }
  const { latitude, longitude } = coordinates;
  //console.log(latitude, longitude);
  const place=exctractPlacefrom(url)
  if(place!=null){
    //console.log(place)
    const{x,z}=performCalculation(latitude, longitude)
    chrome.runtime.sendMessage({ action: "showResult", x: x, z: z, location: place }, function (response) {
      if (chrome.runtime.lastError) {
        setTimeout (mutationCallback, 1000);
      } 
    })
  }
  return true;
};
// MutationObserverの設定
const observerOptions = {
  childList: true, // 子要素の変更を監視する
  subtree: true, // サブツリー内の変更も監視する
  attributes: true, // 属性の変更も監視する
};
// MutationObserverの作成と監視対象の要素の指定
const observer = new MutationObserver(mutationCallback);
const targetElement = document.body;
//-------------------------------
function startObserving() {
  observer.observe(targetElement, observerOptions);
}
// function stopObserving() {
//   observer.disconnect();
// }
startObserving()
//------------------------------
//座標変換
function performCalculation(latitude,longitude){
  var x = 15374.0 + (6378137 * Math.PI * longitude / (924.0 * Math.sqrt(2.0) * 180));
    x = Math.floor(x * 100) / 100;
  var z = 9725.0 - (1.25 * 6378137 * Math.log(Math.tan(Math.PI / 4.0 + (latitude * 4.0 * Math.PI / 1800.0))) / (924.0 * Math.sqrt(2.0)));
    z = Math.floor(z * 100) / 100;
    return { x, z };
}
//URLから座標を取り出す
function extractCoordinatesFromURL(url) {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+),/;
  const match = url.match(regex);

  if (match && match.length === 3) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return { latitude, longitude };
  }

  return null;
}
//URLから場所を取り出す
function exctractPlacefrom(url){
  const regex = /\/place\/([^/]+)\//;
  const match = url.match(regex);
  if(match&&match.length>=2){
    const location = match[1];
    const decodedLocation = decodeURIComponent(location);
    return decodedLocation.replace(/\+/g,",");
  }
  return null;
}

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "stopObserving") {
//     stopObserving();
//   }
//   else if (message.action === "startObserving") {
//     startObserving();
//   }
// });