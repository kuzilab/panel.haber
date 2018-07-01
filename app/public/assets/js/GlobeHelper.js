var globe = {}

globe.getDate = function () {

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    curr_month++;
    if (curr_month < 10) {
        curr_month = "0" + curr_month;
    }
    var curr_year = d.getFullYear();
    curr_date = curr_date + "/" + curr_month + "/" + curr_year;
    return curr_date;
}


globe.getExpertiseWithComma = function (items) {
    var text = "";
    angular.forEach(items, function (item) {
        text = text + item + ",";
    });
    var index = text.lastIndexOf(',');
    var text = text.substring(0, index);
    return text;

}

globe.showToast = function (element, message) {

    element.show(
        element.simple()
        .textContent(message)
        .position("top right")
        .hideDelay(1000)
    );
}


globe.getExtension = function (filename) {
    var index = filename.indexOf('.');
    var extension = filename.substring(index);
    return extension;
}

globe.calculateProfile = function (user) {

    var sayac = 52;

    if (user.address !== "") {
        sayac = sayac + 6;
    }
    if (user.bureau !== "") {
        sayac = sayac + 6;
    }
    if (user.experience !== "") {
        sayac = sayac + 6;
    }
    if (user.iswebsite) {
        sayac = sayac + 6;
    }
    if (user.isbureauweb) {
        sayac = sayac + 6;
    }
    if (user.biography) {
        sayac = sayac + 6;
    }

    if (user.islicence) {
        sayac = sayac + 6;
    }

    if (user.ishlicence) {
        sayac = sayac + 6;
    }

    if (user.iplicence) {
        sayac = sayac + 6;
    }
    return sayac;
}