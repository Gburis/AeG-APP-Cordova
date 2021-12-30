(function(){
 'use strict';
  angular.module('homeComponents')
    .controller('menuController', function($scope, serviceFactory, BUKET){
      const service = serviceFactory;
      $scope.changeTab = _changeTab
      $scope.loadProgess = true;
      $scope.buket =  BUKET;
      
      service.listarTabs()
        .then(function(result){
          result = result.data;
          _carregarTela(result.data);
        })
        .catch(function(err){
          console.log(err);
          $scope.loadProgess = false;
          $scope.errorMsg('Erro ao carregar menu!');
        });

        function _carregarTela(tabs){
          //ordernar menu
          tabs.sort(function(a,b) {
            return a.ordem < b.ordem ? -1 : a.ordem > b.ordem ? 1 : 0;
          });

          $scope.tabs = tabs;
          //buscar produtos da primeira taba do menu
          _changeTab($scope.tabs[0]._id, $scope.tabs[0].name);
        }

        function _changeTab(id, nome){
          $scope.loadProgess = true;
          service.getProdutos(id)
            .then(function(result){
              result = result.data;
              $scope.produtos = result.data;
              $scope.tabAtual = id;
              $scope.nomeTabeAtual = nome;
              $scope.loadProgess = false;
            })
            .catch(function(err){
              console.log(err);
              $scope.loadProgess = false;
              $scope.errorMsg('Erro ao carregar produtos !');
            });
        }

        $scope.$on('carregarProntudos', function(evt, agrs){
          if(agrs.id) _changeTab(agrs.id, agrs.nome);
        })

        $scope.prdOptions = function(prd){
          $scope.prd_opt = angular.copy(prd);
          $scope.openModal('modal-option-produto');
        }
    });
})();