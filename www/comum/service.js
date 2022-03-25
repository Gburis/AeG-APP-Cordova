(function(){
  angular.module('service', [
    'config'
  ])
  .factory('serviceFactory', function($http, API){
    return{
      login: function(user){
        return $http.post(`${API}/api/login`, user);
      },
      auth: function(){
        return $http.get(`${API}/api/check-auth`);
      },
      listarTabs: function(){
        return $http.get(`${API}/api/listar-tabs`);
      },
      getProdutos: function(id, comprado){
        return $http.post(`${API}/api/listar-produtos`, {"id": id, "comprado": comprado});
      },
      saveProduto: function(produtos){
        return $http.post(`${API}/api/cadastrar-produtos`, produtos);
      },
      editarProduto: function(produto){
        return $http.post(`${API}/api/editar-produtos`, produto);
      },
      delteProduto: function(id){
        return $http.post(`${API}/api/deletar-produto`, {"prd_id":id});
      },
      marcarCompra: function(params){
        return $http.post(`${API}/api/marcar-compra`, params);
      },
      device: function(params){
        return $http.post(`${API}/api/device`, params);
      },
      notification: function(params){
        return $http.post(`${API}/api/cloud-messaging`, params);
      }
    }
  });
})();
