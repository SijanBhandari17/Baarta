const whiteList = require("./whiteList");
const options = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("cross origin error"));
    }
  },
  credentials: true,
  methods: ["PUT", "DELETE", "OPTIONS"],
};
module.exports = options;


