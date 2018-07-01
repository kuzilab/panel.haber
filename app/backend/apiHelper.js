var https = require('https');
var jwt = require('jsonwebtoken');
var User = require('../backend/models/user');
var helper = {};

helper.testme = function () {
    return "test me";
}

helper.convertSeoPath = function (item) {

    item = item.toLowerCase();
    item = item.split(' ').join('-');
    item = item.split(',').join('');
    item = item.split("'").join('');
    item = item.split(':').join('');
    item = item.split(';').join('');
    item = item.split('?').join('-');
    item = item.split('ç').join('c');
    item = item.split('ğ').join('g');
    item = item.split('ı').join('i');
    item = item.split('ö').join('o');
    item = item.split('ü').join('u');
    item = item.split('ş').join('s');
    item = item.split('#').join('-');
    item = item.split('!').join('');
    return item;

}

helper.editLink = function (link) {
    // Youtube Link
    if (link.includes('youtube')) {

        var index = link.indexOf("=");
        var id = link.substring(index + 1);
        var editLink = "https://www.youtube.com/embed/" + id;
        return editLink
    }
}

// create Token 
helper.createToken = function (user) {
    var user = {
        _id: user._id,
        email: user.email
    }

    var token = jwt.sign({
        user: user
    }, 'secretKey', {});

    return token;
}



module.exports = helper;