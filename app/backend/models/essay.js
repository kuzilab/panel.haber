var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EssaySchema = new Schema({

    userId: {
        type: String
    },
    editor: {
        type: String
    },
    essayname: {
        type: String
    },
    essaysubject: {
        type: String
    },
    essayImgPath: {
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
    },
    picSize: {
        type: String
    }
});

module.exports = mongoose.model('Essay', EssaySchema);