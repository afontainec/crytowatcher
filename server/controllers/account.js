//
const path = require('path');
const Account = require('../models/account');


exports.show = function (req, res) {
  const id = req.params.id;
  const walletPath = path.join(__dirname, '../', '../', 'views', 'dashboard.ejs');
  Account.get(id).then((account) => {
    return res.render(walletPath, {
      account,
    });
  }).catch((err) => {
    return res.render(walletPath, {
      err,
    });
  });
};
