var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CertificateSchema = new Schema({

    userId: {
        type: String
    },

    certificateFileName: {
        type: String
    },
    certificateName: {
        type: String
    },
    fileType: {
        type: String
    },
    filePath: {
        type: String
    },
    savedDate: {
        type: String
    }
});


module.exports = mongoose.model('Certificate', CertificateSchema);