var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    profile: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },
    passwordPlain: {
        type: String,
        required: true,
        select: false
    },
    phone: {
        type: String,
        required: false,
        select: false
    },
    userType: {
        type: String,
        required: false,
        select: false
    }
});

UserSchema.pre('save', function (next) {

    // this  = UserSchema
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});


UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);