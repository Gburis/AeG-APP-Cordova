(function(){
 'use strict';
  angular.module('appComponents')
    .controller('menuController', function($scope, serviceFactory, BUKET, $rootScope){
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
          _changeTab($scope.tabs[0]);
        }

        function _changeTab(tab){
          $scope.loadProgess = true;
          let comprado = true;

          if(tab.flg_add_item > 0) comprado = false;

          service.getProdutos(tab._id, comprado)
            .then(function(result){
              result = result.data;
              if(result.success){
                $scope.produtos = result.data;
                $scope.tabAtual = tab;
                $scope.vlr = result.values;
                $scope.loadProgess = false;
              }else{
                $scope.loadProgess = false;
                $scope.errorMsg('Erro ao carregar produtos !');
              }
            })
            .catch(function(err){
              console.log(err);
              $scope.loadProgess = false;
              $scope.errorMsg('Erro ao carregar produtos !');
            });
        }

        $scope.$on('carregarProntudos', function(evt, agrs){
          if(agrs.tab) _changeTab(agrs.tab);
        })

        $scope.prdOptions = function(prd){
          $scope.prd_opt = angular.copy(prd);
          $scope.openModal('modal-option-produto');
        }

        $scope.logout = function(){
          $rootScope.$broadcast('$logout');
        }
    });
})();