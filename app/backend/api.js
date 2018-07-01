//Dependencies
var https = require('https');
var express = require('express');
var apiHelper = require('../../app/backend/apiHelper');
var router = express.Router();
var User = require('../backend/models/user')
var Certificate = require('../backend/models/certificate')
var VideoEssay = require('../backend/models/videoessay')
var Essay = require('../backend/models/essay');
var Comment = require('../backend/models/comment')
var Category = require('../backend/models/category');
var SubCategory = require('../backend/models/subcategory');
var config = require('../../config');
var secretKey = config.secretKey;
var jwt = require('jsonwebtoken');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var multer = require('multer');
var uploadFile = multer({
    dest: './app/public/assets/uploads/'
});

var uploadCertificate = multer({
    dest: './app/public/assets/certificateUploads/'
});

var uploadEssay = multer({
    dest: './app/public/assets/essayUploads'
});


var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');



// upload methods
var up = {};
up.uploadProfile = "/uploadProfile";
up.uploadCertificate = "/uploadCertificate";
up.uploadEssay = "/uploadEssay";
up.deleteFile = "/deleteFile";


//authentication 
var auth = {};
auth.login = "/login";
auth.signup = "/signup";
auth.me = "/me";
auth.isUser = "/isUser"

//  crud methods

var crud = {};
crud.updateProfile = "/updateProfile";
crud.updateExtendProfile = "/updateExtendProfile";
crud.saveCertificate = "/saveCertificate"
crud.takeCertificate = "/takeCertificate"
crud.deleteCertificate = "/deleteCertificate"
crud.saveVideoEssay = "/saveVideoEssay";
crud.saveBasicEssay = "/saveBasicEssay";
crud.takeBasicEssays = "/takeBasicEssays";
crud.deleteBasicEssay = "/deleteBasicEssay";
crud.updateBasicEssay = "/updateBasicEssay";
crud.takeVideoEssays = "/takeVideoEssays"
crud.deleteVideoEssay = "/deleteVideoEssay"
crud.updateVideoEssay = "/updateVideoEssay";
crud.updateComment = "/updateComment"
crud.saveManyComment = "/saveManyComment"
crud.takeComments = "/takeComments"

crud.saveCategory = "/saveCategory";
crud.deleteCategory = "/deleteCategory";
crud.updateCategory = "/updateCategory";
crud.takeCategories = "/takeCategories";

crud.saveSubCategory = "/saveSubCategory";
crud.deleteSubCategory = "/deleteSubCategory";
crud.updateSubCategory = "/updateSubCategory";
crud.takeSubCategories = "/takeSubCategories";


crud.saveUser = "/saveUser";
crud.deleteUser = "/deleteUser";
crud.updateUser = "/updateUser";
crud.takeUsers = "/takeUsers";

crud.increaseEssayViewed = "/increaseEssayViewed";
crud.increaseVideoEssayViewed = "/increaseVideoEssayViewed"




// Authentication Methods
router.post(auth.signup, function (req, res) {

    var item = req.body.item;
    var user = new User({
        name: item.namesurname,
        email: item.email,
        password: item.password,
        passwordPlain: item.passwordPlain,
        phone: item.phone,
        userType: "2"
    });
    user.save(function (err) {
        if (err) {
            res.json({
                success: false,
                situation: "create_issue",
                message: err,
                token: undefined
            });
        } else {
            var token = apiHelper.createToken(user);
            res.json({
                success: true,
                situation: "user_created",
                message: "Kullanıcı Oluşturuldu",
                token: token,
                user: user
            });
        }
    });
});

router.post(auth.isUser, function (req, res) {
    var email = req.body.email;
    User.findOne({
        email: email
    }).select('email').exec(function (err, user) {

        if (user !== null) {
            res.send({
                success: false,
                situation: "user_exist",
                message: "Kullanıcı sistemde mevcut !!!"
            });
        } else {
            res.send({
                success: true,
                situation: "no_user",
                message: "Kullanıcı sistemde değil !!!"
            });
        }
    })
});

router.post(auth.login, function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        email: email
    }).select('_id name email password passwordPlain phone userType').exec(function (err, user) {


        // check User First Step
        if (user === null) {
            res.send({
                success: false,
                situation: "no_user",
                message: "Kullanıcı sistemde kayıtlı değil !!!"
            });

        } else if (user !== null) {



            // check password Second Step
            var validPassword = user.comparePassword(password);



            if (!validPassword) {
                res.send({
                    success: false,
                    situation: "invalid_password",
                    message: "Geçersiz Şifre !!!"
                });
            } else {
                var token = apiHelper.createToken(user);
                res.json({
                    success: true,
                    situation: "valid_user",
                    message: "Giriş Başarılı",
                    token: token,
                    user: user
                });
            }
        }
    });
});

// Middleware ------------------------------------------------------------

// Destination B // provide a legitimate token

router.use(function (req, res, next) {

    console.log("Kullanıcı uygulamaya geldi.");

    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    // check if token exist
    if (token) {

        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                console.log(err);
                res.status(403).send({
                    success: false,
                    situation: "noauthenticate",
                    message: "Authenticate Başarısız !!!"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.status(403).send({
            success: false,
            situation: "notoken",
            message: "Token Sağlanmadı !!!"
        });
    }
});

// -----------------------------------------------------------------------


// INCREASE ESSAY and VIDEOESSAY VIEWED

router.post(crud.increaseEssayViewed, function (req, res) {

    Essay.find({}).select('_id viewed').exec(function (err, essays) {

        if (essays.length != 0) {
            var length = essays.length;
            var random = Math.floor(Math.random() * length);
            var essay = essays[random];
            console.log(essay);
            var _id = mongoose.Types.ObjectId(essay._id);

            essay.viewed = essay.viewed + 1;
            var condition = {
                "_id": _id
            }

            var update = {
                $set: {
                    "viewed": essay.viewed
                }
            }
            var options = {
                multi: true
            }
            Essay.update(condition, update, options, function (err, affected) {
                if (err) {
                    res.json({
                        success: false,
                        situation: "update_failed",
                        message: "Güncelleme Başarısız !!!",
                    });
                } else {

                    res.json({
                        success: true,
                        situation: "update_success",
                        message: "Güncelleme Başarılı",
                    });
                }
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });

});

router.post(crud.increaseVideoEssayViewed, function (req, res) {

    VideoEssay.find({}).select('_id viewed').exec(function (err, videoessays) {

        if (videoessays.length != 0) {
            var length = videoessays.length;
            var random = Math.floor(Math.random() * length);
            var essay = videoessays[random];

            var _id = mongoose.Types.ObjectId(essay._id);
            essay.viewed = essay.viewed + 1;
            var condition = {
                "_id": _id
            }

            var update = {
                $set: {
                    "viewed": essay.viewed
                }
            }
            var options = {
                multi: true
            }
            VideoEssay.update(condition, update, options, function (err, affected) {
                if (err) {
                    res.json({
                        success: false,
                        situation: "update_failed",
                        message: "Güncelleme Başarısız !!!",
                    });
                } else {

                    res.json({
                        success: true,
                        situation: "update_success",
                        message: "Güncelleme Başarılı",
                    });
                }
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });

});

// DELETE FILE -----------------------------------------------------------

router.post(up.deleteFile, function (req, res) {


    var filePath = req.body.item;
    var fs = require('fs');

    fs.unlinkSync(filePath);


})

// GET USER INFO ---------------------------------------------------------
router.get(auth.me, function (req, res) {
    res.json(req.decoded);
});

// USERS ACTIONS ---------------------------------------------------------

router.post(crud.saveUser, function (req, res) {

    var item = req.body.item;

    var user = new User({
        name: item.name,
        email: item.email,
        phone: item.phone,
        userType: item.userType
    });

    user.save(function (err) {

        if (err) {
            res.json({
                success: false,
                situation: "user_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "user_created",
                message: "Kullanıcı Oluşturuldu :)",
                user: user
            });
        }
    });

});

router.post(crud.takeUsers, function (req, res) {

    User.find().select('_id name email phone userType').exec(function (err, users) {

        if (users != null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Kullanıcılar Alındı",
                users: users
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});


router.post(crud.updateUser, function (req, res) {

    var obj = req.body.obj;
    var id = obj._id;
    var _id = mongoose.Types.ObjectId(id);

    var condition = {
        "_id": _id
    }

    var update = {
        $set: {
            "name": obj.subname,
            "phone": obj.phone,
            "email": obj.email,
            "userType": obj.userType,
            "savedDate": obj.savedDate
        }
    }
    var options = {
        multi: true
    }
    User.update(condition, update, options, function (err, affected) {
        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {

            res.json({
                success: true,
                situation: "update_success",
                message: "Güncelleme Başarılı",
            });
        }
    });
});


router.post(crud.deleteUser, function (req, res) {

    var obj = req.body.obj;
    var _idObj = mongoose.Types.ObjectId(obj._id);

    User.deleteOne({
        _id: _idObj,
    }, function (err, result) {

        if (err) {
            res.json({
                success: false,
                situation: "delete_issue",
                message: err
            });
        } else {
            res.json({
                success: true,
                situation: "delete_success",
                message: "Kullanıcı Silindi :)"
            });
        }
    });
});


// CATEGORY ACTIONS --------------------------------------------------------

router.post(crud.saveCategory, function (req, res) {

    var item = req.body.item;

    var category = new Category({
        name: item.name,
        savedDate: item.savedDate,
        categoryPath: apiHelper.convertSeoPath(item.name),
        routePath: "/kategori/" + apiHelper.convertSeoPath(item.name)
    });

    category.save(function (err) {

        if (err) {
            res.json({
                success: false,
                situation: "category_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "category_created",
                message: "Kategori Oluşturuldu :)",
                category: category
            });
        }
    });
});


router.post(crud.takeCategories, function (req, res) {

    Category.find().select('_id name savedDate categoryPath routePath').exec(function (err, categories) {

        if (categories != null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Kategoriler Alındı",
                categories: categories
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});

router.post(crud.updateCategory, function (req, res) {

    var obj = req.body.obj;
    var id = obj._id;
    var _id = mongoose.Types.ObjectId(id);

    var condition = {
        "_id": _id
    }

    var update = {
        $set: {
            "name": obj.name,
            "savedDate": obj.savedDate,
            "categoryPath": apiHelper.convertSeoPath(item.name),
            "routePath": "/kategori/" + apiHelper.convertSeoPath(item.name)
        }
    }
    var options = {
        multi: true
    }
    Category.update(condition, update, options, function (err, affected) {
        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {


            var condition = {
                "categoryId": _id
            }

            var update = {
                $set: {
                    "categoryName": obj.name,
                    "savedDate": obj.savedDate
                }
            }
            var options = {
                multi: true
            }
            SubCategory.update(condition, update, options, function (err, affected) {
                if (err) {
                    res.json({
                        success: false,
                        situation: "update_failed",
                        message: "Güncelleme Başarısız !!!",
                    });
                } else {

                    res.json({
                        success: true,
                        situation: "update_success",
                        message: "Güncelleme Başarılı",
                    });
                }
            });

        }
    });
});


router.post(crud.deleteCategory, function (req, res) {

    var obj = req.body.obj;
    var _idObj = mongoose.Types.ObjectId(obj._id);

    Category.deleteOne({
        _id: _idObj,
    }, function (err, result) {

        console.log(result);

        if (err) {
            res.json({
                success: false,
                situation: "delete_issue",
                message: err
            });
        } else {

            var _idObj = mongoose.Types.ObjectId(obj._id);

            SubCategory.deleteMany({
                categoryId: _idObj,
            }, function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        situation: "delete_issue",
                        message: err
                    });
                } else {
                    res.json({
                        success: true,
                        situation: "delete_success",
                        message: "Kategori ve Bağlı Alt Kategoriler Silindi :)"
                    });
                }
            });
        }
    });
});

// SUBCATEGORY ACTIONS -----------------------------------------------------

router.post(crud.saveSubCategory, function (req, res) {

    var item = req.body.item;
    console.log(item);

    var subcategory = new SubCategory({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        subname: item.subname,
        savedDate: item.savedDate,
        categoryPath: apiHelper.convertSeoPath(item.categoryName)
    });

    subcategory.save(function (err) {

        if (err) {
            res.json({
                success: false,
                situation: "subcategory_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "subcategory_created",
                message: "Alt Kategori Oluşturuldu :)",
                subcategory: subcategory
            });
        }

    });
});


router.post(crud.takeSubCategories, function (req, res) {

    SubCategory.find().select('_id categoryId categoryName subname savedDate categoryPath').exec(function (err, subcategories) {

        if (subcategories != null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Alt Kategoriler Alındı",
                subcategories: subcategories
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});

router.post(crud.updateSubCategory, function (req, res) {

    var obj = req.body.obj;
    var id = obj._id;
    var _id = mongoose.Types.ObjectId(id);

    var condition = {
        "_id": _id
    }

    var update = {
        $set: {
            "subname": obj.subname,
            "savedDate": obj.savedDate,
            "categoryPath": apiHelper.convertSeoPath(obj.categoryName)
        }
    }
    var options = {
        multi: true
    }
    SubCategory.update(condition, update, options, function (err, affected) {
        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {

            res.json({
                success: true,
                situation: "update_success",
                message: "Güncelleme Başarılı",
            });
        }
    });
});


router.post(crud.deleteSubCategory, function (req, res) {

    var obj = req.body.obj;
    var _idObj = mongoose.Types.ObjectId(obj._id);

    SubCategory.deleteOne({
        _id: _idObj,
    }, function (err, result) {

        console.log(result);

        if (err) {
            res.json({
                success: false,
                situation: "delete_issue",
                message: err
            });
        } else {
            res.json({
                success: true,
                situation: "delete_success",
                message: "Alt Kategori Silindi :)"
            });
        }
    });
});


// UPLOAD ESSAY --------------------------------------------------------------------

router.post(up.uploadEssay, uploadFile.any(), function (req, res) {

    var filename = req.body.filename;

    if (req.files) {

        req.files.forEach(function (file) {
            fs.rename(file.path, './app/public/assets/essayUploads/' + filename, function (err) {

                if (err) {
                    console.log(err);
                } else {
                    console.log("Dosya Yüklendi.")
                }
            });
        });
    }
});

// ESSAY ACTIONS -----------------------------------------------------------

router.post(crud.saveBasicEssay, function (req, res) {

    var item = req.body.item;
    var basicEssay = new Essay({
        picSize: item.picSize,
        userId: item.userId,
        editor: item.editor,
        essayname: item.essayname,
        essaysubject: item.essaysubject,
        essayImgPath: item.essayImgPath,
        timestamp: item.timestamp,
        savedDate: item.savedDate,
        keywords: item.keywords,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        viewed: item.viewed,
        categoryName: item.categoryName,
        routePath: apiHelper.convertSeoPath(item.essaysubject),
        categoryPath: apiHelper.convertSeoPath(item.categoryName),


    });

    console.log(basicEssay);

    basicEssay.save(function (err) {

        if (err) {
            res.json({
                success: false,
                situation: "basicessay_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "basicessay_created",
                message: "Haber Oluşturuldı :)",
                basicEssay: basicEssay
            });
        }
    });

});

router.post(crud.takeBasicEssays, function (req, res) {
    var userId = req.body.userId;
    Essay.find({
        userId: userId
    }).select('_id editor categoryId subCategoryId essayname essaysubject essayImgPath timestamp publishTime keywords savedDate viewed categoryName categoryPath routePath picSize').exec(function (err, basicessays) {

        if (basicessays != null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Yazı Haber Alındı",
                basicessays: basicessays
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});

router.post(crud.updateBasicEssay, function (req, res) {

    var obj = req.body.obj;
    var id = obj._id;
    var userId = obj.userId;
    var _id = mongoose.Types.ObjectId(id);

    var condition = {
        "_id": _id,
        "userId": userId
    }

    var update = {
        $set: {
            "editor": obj.editor,
            "essayname": obj.essayname,
            "essaysubject": obj.essaysubject,
            "essayImgPath": obj.essayImgPath,
            "keywords": obj.keywords,
            "savedDate": obj.savedDate,
            "categoryId": obj.categoryId,
            "subCategoryId": obj.subCategoryId,
            "categoryName": obj.categoryName,
            "routePath": apiHelper.convertSeoPath(obj.essaysubject),
            "categoryPath": "/kategori/" + apiHelper.convertSeoPath(obj.categoryName),
            "picSize": obj.picSize
        }
    }
    var options = {
        multi: true
    }

    Essay.update(condition, update, options, function (err, affected) {

        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {

            res.json({
                success: true,
                situation: "update_success",
                message: "Güncelleme Başarılı",
            });
        }
    });
});


router.post(crud.deleteBasicEssay, function (req, res) {

    var obj = req.body.obj;
    var _idObj = mongoose.Types.ObjectId(obj._id);
    var userId = obj.userId;

    Essay.deleteOne({
        _id: _idObj,
        userId: userId
    }, function (err, result) {

        console.log(result);

        if (err) {
            res.json({
                success: false,
                situation: "delete_issue",
                message: err
            });
        } else {
            res.json({
                success: true,
                situation: "delete_success",
                message: "Haber Silindi :)"
            });
        }
    });
});

// VIDEO ESSAY ACTIONS ---------------------------------------------------------------------


router.post(crud.saveVideoEssay, function (req, res) {

    var item = req.body.item;

    var videoessay = new VideoEssay({
        userId: item.userId,
        videoessayname: item.videoessayname,
        videoessaysubject: item.videoessaysubject,
        videoessaycontent: item.videoessaycontent,
        videoessaylink: apiHelper.editLink(item.videoessaylink),
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        keywords: item.keywords,
        timestamp: item.timestamp,
        savedDate: item.savedDate,
        viewed: item.viewed,
        categoryName: item.categoryName,
        routePath: apiHelper.convertSeoPath(item.videoessaysubject),
        categoryPath: "/kategori/" + apiHelper.convertSeoPath(item.categoryName)
    });

    videoessay.save(function (err) {
        if (err) {
            res.json({
                success: false,
                situation: "videoessay_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "videoessay_created",
                message: "Makale Oluşturuldu :)",
                videoessay: videoessay
            });
        }
    });
});


router.post(crud.updateVideoEssay, function (req, res) {

    var obj = req.body.obj;
    var id = obj._id;
    var userId = obj.userId;
    var _id = mongoose.Types.ObjectId(id);

    var condition = {
        "_id": _id,
        "userId": userId
    };

    var update = {
        $set: {
            "videoessayname": obj.videoessayname,
            "videoessaysubject": obj.videoessaysubject,
            "videoessaylink": obj.videoessaylink,
            "videoessaycontent": obj.videoessaycontent,
            "categoryId": obj.categoryId,
            "subCategoryId": obj.subCategoryId,
            "keywords": obj.keywords,
            "savedDate": obj.savedDate,
            "categoryName": obj.categoryName,
            "routePath": apiHelper.convertSeoPath(obj.videoessaysubject),
            "categoryPath": apiHelper.convertSeoPath(obj.categoryName)
        }
    }
    var options = {
        multi: true
    };


    VideoEssay.update(condition, update, options, function (err, affected) {

        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {

            res.json({
                success: true,
                situation: "update_success",
                message: "Güncelleme Başarılı",
            });
        }
    });

});


router.post(crud.deleteVideoEssay, function (req, res) {

    var obj = req.body.obj;
    var _id = obj._id;
    var _idObj = mongoose.Types.ObjectId(_id);

    VideoEssay.deleteOne({
        _id: _idObj,
        userId: obj.userId
    }, function (err, result) {


        if (err) {
            res.json({
                success: false,
                situation: "delete_issue",
                message: err
            });
        } else {
            res.json({
                success: true,
                situation: "delete_success",
                message: "Makale Silindi :)"
            });
        }
    });
});


router.post(crud.takeVideoEssays, function (req, res) {

    var userId = req.body.userId;
    VideoEssay.find({
        userId: userId
    }).select('_id userId categoryId subCategoryId videoessayname videoessaysubject videoessaylink videoessaycontent timestamp publishTime savedDate viewed categoryName routePath categoryPath').exec(function (err, videoessays) {

        if (videoessays !== null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Video Makaleler Alındı",
                videoessays: videoessays
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});


// PROFILE ACTIONS -----------------------------------------------------------------

router.post(up.uploadProfile, uploadFile.any(), function (req, res) {


    if (req.files) {

        req.files.forEach(function (file) {

            var filename = req.decoded.user._id + ".png";
            console.log(filename);
            fs.rename(file.path, './app/public/assets/uploads/' + filename, function (err) {

                if (err) {
                    console.log(err);
                } else {
                    console.log("Dosya Yüklendi.")
                }
            });
        });
    }
});

router.post(crud.updateProfile, function (req, res) {

    console.log("updateProfiledayım");

    var item = req.body.item;
    var id = mongoose.Types.ObjectId(item.id);

    bcrypt.hash(item.password, null, null, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            item.password = hash;
            var condition = {
                "_id": id
            };
            var update = {
                $set: {
                    "name": item.namesurname,
                    "password": item.password,
                    "passwordPlain": item.passwordPlain,
                    "email": item.email,
                    "phone": item.phone
                }
            }
            var options = {
                multi: true
            };

            User.update(condition, update, options, function (err, affected) {

                if (err) {
                    res.json({
                        success: false,
                        situation: "update_failed",
                        message: "Güncelleme Başarısız !!!",
                    });
                } else {

                    res.json({
                        success: true,
                        situation: "update_success",
                        message: "Güncelleme Başarılı",
                    });
                }
            });
        }
    });
});


// CERTIFICATE ACTIONS ---------------------------------------------------------------------


router.post(crud.saveCertificate, function (req, res) {

    var item = req.body.item;
    var certificate = new Certificate({
        userId: item.userId,
        certificateFileName: item.certificateFileName,
        certificateName: item.certificateName,
        fileType: item.fileType.fileType,
        filePath: item.filePath,
        savedDate: item.savedDate
    });


    certificate.save(function (err) {
        if (err) {
            res.json({
                success: false,
                situation: "create_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "certificate_created",
                message: "Dosya Oluşturuldu :)",
                certificate: certificate
            });
        }
    });
});


router.post(crud.takeCertificate, function (req, res) {

    var userId = req.body.userId;
    Certificate.find({
        userId: userId
    }).select('_id userId certificateFileName certificateName fileType filePath savedDate').exec(function (err, certificates) {

        if (certificates !== null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Dosyalar Alındı",
                certificates: certificates
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });

});



// EXTEND PROFILE ACTIONS ----------------------------------------------------------------

router.post(crud.updateExtendProfile, function (req, res) {

    var item = req.body.item;
    var id = mongoose.Types.ObjectId(item.id);

    bcrypt.hash(item.password, null, null, function (err, hash) {

        if (err) {
            res.json({
                success: false,
                situation: "hash_failed",
                message: err,
            });
        } else {

            item.password = hash;
            var condition = {
                "_id": id
            };
            var update = {
                $set: {
                    "bureau": item.bureau,
                    "address": item.address,
                    "experience": item.experience,
                    "website": item.website,
                    "bureauweb": item.bureauweb,
                    "biography": item.biography,
                    "licence": item.licence,
                    "highlicence": item.highlicence,
                    "licenceyear": item.licenceyear,
                    "highlicence": item.highlicence,
                    "highlicenceyear": item.highlicenceyear,
                    "postlicence": item.postlicence,
                    "postlicenceyear": item.postlicenceyear,
                    "iswebsite": item.iswebsite,
                    "isbureauweb": item.isbureauweb,
                    "islicence": item.islicence,
                    "ishlicence": item.ishlicence,
                    "isplicence": item.isplicence,
                    "keywords": item.keywords,
                }
            }
            var options = {
                multi: true
            };

            User.update(condition, update, options, function (err, affected) {

                if (err) {
                    res.json({
                        success: false,
                        situation: "update_failed",
                        message: "Güncelleme Başarısız !!!",
                    });
                } else {

                    res.json({
                        success: true,
                        situation: "update_success",
                        message: "Güncelleme Başarılı",
                    });
                }
            });
        }
    });
});


// COMMENTS ACTIONS -----------------------------------------------------------------------


router.post(crud.saveManyComment, function (req, res) {
    var obj = req.body.obj;
    var comment = new Comment({
        userId: obj.userId,
        commenter: obj.commenter,
        commentcontent: obj.commentcontent,
        commentrating: obj.commentrating,
        isComment: obj.isComment,
        savedDate: obj.savedDate
    });

    Comment.collection.insert(obj.comments, function (err, docs) {
        if (err) {
            res.json({
                success: false,
                situation: "create_issue",
                message: err
            });
        } else {

            res.json({
                success: true,
                situation: "comment_created",
                message: "Yorum Oluşturuldu :)",
                comments: comments
            });
        }
    });

});

router.post(crud.takeComments, function (req, res) {

    var userId = req.body.userId;
    Comment.find({
        userId: userId
    }).select('_id userId commenter commentcontent commentrating isComment savedDate').exec(function (err, comments) {

        if (comments !== null) {
            res.json({
                success: true,
                situation: "get_success",
                message: "Yorumlar Alındı",
                comments: comments
            });
        } else {
            res.json({
                success: false,
                situation: "get_failed",
                message: err
            });
        }
    });
});


router.post(crud.updateComment, function (req, res) {
    var obj = req.body.obj;
    var id = obj._id;
    var _id = mongoose.Types.ObjectId(id);
    var userId = obj.userId;

    var condition = {
        "_id": _id,
        "userId": userId
    };
    var update = {
        $set: {
            "isComment": obj.isComment
        }
    }
    var options = {
        multi: true
    };

    Comment.update(condition, update, options, function (err, affected) {
        if (err) {
            res.json({
                success: false,
                situation: "update_failed",
                message: "Güncelleme Başarısız !!!",
            });
        } else {

            res.json({
                success: true,
                situation: "update_success",
                message: "Güncelleme Başarılı",
            });
        }
    });
});

// Return  router
module.exports = router;