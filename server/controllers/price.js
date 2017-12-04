//
const Price = require('../models/price');


exports.get = function (req, res) {
  Price.get().then((result) => {
    const price = {};
    price.btc = getPrice(result, 'btc');
    price.eth = getPrice(result, 'ether');

    return res.status(200).send(price);
  }).catch((err) => {
    return res.status(500).send({ err });
  });
};


function getPrice(data, key) {
  return {
    sell: data[`${key}_sell`],
    buy: data[`${key}_buy`],
  };
}

exports.all = function (req, res) {
  Price.all().then((result) => {
    return res.status(200).send(result);
  }).catch((err) => {
    return res.status(500).send({ err });
  });
};
