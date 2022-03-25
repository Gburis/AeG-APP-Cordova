(function(){
    angular.module('config', [])
    //-- LOCAL --//
    // .constant('API', 'http://192.168.3.68')
    // .constant('BUKET', 'http://192.168.3.68/upload-imgs/')

    //-- PROD --//
    .constant('API', 'https://gburis.com.br')
    .constant('BUKET', 'https://gburis.com.br/upload-imgs/')
})();