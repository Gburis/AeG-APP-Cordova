(function(){
    angular.module('config', [])
    //-- LOCAL --//
    // .constant('API', 'http://localhost')
    // .constant('BUKET', 'http://localhost/upload-imgs/')

    //-- PROD --//
    .constant('API', 'https://gburis.com.br')
    .constant('BUKET', 'https://gburis.com.br/upload-imgs/')
})();