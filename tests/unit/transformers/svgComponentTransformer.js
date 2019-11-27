const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return (
      'module.exports = ' +
      JSON.stringify({ template: path.basename(filename) }) +
      ';'
    );
  },
};
