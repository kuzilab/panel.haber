var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoEssaySchema = new Schema({

    userId: {
        type: String
    },

    videoessayname: {
        type: String
    },
    videoessaysubject: {
        type: String
    },
    videoessaylink: {
        type: String
    },
    videoessaycontent: {
        type: String
    },
    savedDate: {
        type: String
    },
    timestamp: {
        type: Number
    },
    publishTime: {
        type: String
    },
    keywords: {
        type: []
    },
    categoryId: {
        type: String
    },
    subCategoryId: {
        type: String
    },
    viewed: {
        type: Number
    },
    categoryName: {
        type: String
    },
    routePath: {
        type: String
    },
    categoryPath: {
        type: String
    }

});

module.exports = mongoose.model('VideoEssay', VideoEssaySchema);