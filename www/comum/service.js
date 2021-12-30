(function(){
  angular.module('service', [
    'config'
  ])
  .factory('serviceFactory', function($http, API){
    return{
      listarTabs: function(){
        return $http.get(`${API}/api/listar-tabs`);
      },
      getProdutos: function(id){
        return $http.post(`${API}/api/listar-produtos`, {"id": id});
      },
      saveProduto: function(produtos){
        return $http.post(`${API}/api/cadastrar-produtos`, produtos);
      },
      delteProduto: function(id){
        return $http.post(`${API}/api/deletar-produto`, {"prd_id":id});
      }
    }
  });
})();
