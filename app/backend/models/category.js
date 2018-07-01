var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({

    name: {
        type: String
    },

    savedDate: {
        type: String
    },
    routePath: {
        type: String
    },
    categoryPath: {
        type: String
    }
});

module.exports = mongoose.model('Category', CategorySchema);