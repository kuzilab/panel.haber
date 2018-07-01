var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubCategorySchema = new Schema({

    categoryId: {
        type: String
    },
    categoryName: {
        type: String
    },
    subname: {
        type: String
    },

    savedDate: {
        type: String
    },
    categoryPath: {
        type: String
    }
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);