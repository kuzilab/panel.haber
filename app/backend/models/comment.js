var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

    userId: {
        type: String
    },

    commenter: {
        type: String
    },
    commentcontent: {
        type: String
    },
    commentrating: {
        type: String
    },
    isComment: {
        type: Boolean
    },
    savedDate: {
        type: String
    }
});

module.exports = mongoose.model('Comment', CommentSchema);