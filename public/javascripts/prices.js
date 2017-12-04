/*eslint-disable*/



$(function() {

  function getPrice() {
    $.get("/price", function(data) {
      CONFIG.price = data;
      console.log(CONFIG.price);

      printPrice(data);
      printProfitability(data);
      recalculateAssetValues(data);
    });
  }

function printPrice() {
  $("#sell-btc").text(parseToMoney(CONFIG.price.btc.sell));
  $("#buy-btc").text(parseToMoney(CONFIG.price.btc.buy));
  $("#sell-eth").text(parseToMoney(CONFIG.price.eth.sell));
  $("#buy-eth").text(parseToMoney(CONFIG.price.eth.buy));
}

function getAmount(currency) {
  var amount = $("#"+ currency + "-amount").html();
  return parseFloat(amount);
}

function getInventary(currency) {
  var amount = $("#"+ currency + "-value-inventary").html();
  return parseFloat(amount);
}

function porcentage(p1, p2) {
  return ((p2 - p1)/ p1 * 100).toString() + "%";
}

function printProfitability() {
  var btc = getAmount('btc');
  var eth = getAmount('eth');
  var btcInventary = getInventary('btc');
  var ethInventary = getInventary('eth');
  var btcValue = btc * CONFIG.price.btc.buy;
  var ethValue = eth * CONFIG.price.eth.buy;
  var key = 'profitability';
  printText(key, 'btc', porcentage(btcInventary, btcValue));
  printText(key, 'eth', porcentage(ethInventary, ethValue));

}

function printText(key, currency, value) {
  $("#"+ currency + "-" + key).text(value);
}

function recalculateAssetValues() {
    var btc = getAmount('btc');
    var ether = getAmount('eth');
    var btcValue = btc * CONFIG.price.btc.buy;
    var etherValue = ether * CONFIG.price.eth.buy;
    printAssetValues(btcValue, etherValue);
}


function printTotalAssetValue() {
  var value = 0;
  var currencies = ['clp', 'btc', 'eth'];
  for (var i = 0; i < currencies.length; i++) {
    var v = $("#"+ currencies[i] + "-value").text();
    value += parseFloat(v);
  }
  $("#total-asset").text(value);

}

function printAssetValues(btcValue, etherValue) {
  printText('value', 'btc', btcValue);
  printText('value', 'eth', etherValue);
  printTotalAssetValue();

}


  function parseToMoney(price) {
    str = price;
    if(typeof price !== 'string'){
       str = price.toString();
    }

    var i = str.indexOf('.');
    console.log(i);
    i = i == -1? i = str.length : i = i;
    console.log(i);
    var n = str.substring(0, i);
    var s = '';
    k = i - 3;
    while (k > 0) {
      s = '.' + str.substring(k,i) + s;
      i -= 3;
      k -= 3;
    }
    s = s.substring(1, s.length);
    s = str.substring(0,i) +  '.' + s;
    return s;
  }

  getPrice();

  var oneSec = 1000;
  var oneMin = 60 * oneSec;
  var fifteenMin = 15 * oneMin;
  setInterval(getPrice, fifteenMin);
});
