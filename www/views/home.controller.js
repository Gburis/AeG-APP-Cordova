(function(){
  angular.module('home', [
    'homeComponents'
  ])
    .controller('homeController', function($scope, Upload, serviceFactory){
      const service = serviceFactory
      const elems = document.querySelectorAll('.modal');
      const modalInstance = M.Modal.init(elems);
      //scope
      $scope.tabs = [];
      $scope.newProduto = {};
      $scope.tabAtual = {};
      $scope.successMsg = function(msg){M.toast({html: msg, classes: 'green rounded center'});}
      $scope.warningMsg = function(msg){M.toast({html: msg, classes: 'orange rounded center'});}
      $scope.errorMsg = function(msg){M.toast({html: msg, classes: 'red rounded center'});}

      $scope.openModal = function(modal){
        $scope.newProduto = {};
        var isntatual = modalInstance.find(function(inst){return inst.id == modal;})
        isntatual.open();
      }

      $scope.salvarProduto = function(form){
        $scope.form.$setSubmitted();
        if(!form.$valid)  return $scope.warningMsg('Preencha todos os campos !');
        
        $scope.loadProgess = true;

        Upload.base64DataUrl($scope.fileImg)
          .then(function(buffer){
            $scope.newProduto.img = angular.copy(buffer);
            $scope.newProduto.tab_id = $scope.tabAtual._id;
            $scope.newProduto.type_img = $scope.fileImg.type;

            if(!['image/png', 'image/jpeg', 'image/gif'].includes($scope.fileImg.type)) {
              $scope.loadProgess = false;
              return $scope.warningMsg('Formato de arquivo não permitido!');
            }
              

            service.saveProduto($scope.newProduto)
            .then(function(result){
              result = result.data;
              if(result.status){
                $scope.successMsg('Novo produto adicionado a lista atual');
                $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});
              }
              else{
                $scope.errorMsg('Erro ao salvar novo produto');
              }
              $scope.loadProgess = false;
            })
            .catch(function(err){
              console.log(err);
              $scope.loadProgess = false;
              $scope.errorMsg('Erro ao salvar novo produto');
            });
          })
          .catch(function(err){
            console.log(err)
            $scope.loadProgess = false;
            $scope.errorMsg('Erro ao adicionar nova imagem');
          });
      }

      $scope.excluirProduto = function(id){
        $scope.loadProgess = true;
        service.delteProduto(id)
          .then(function(result){
            result = result.data
            if(result.status){
              $scope.loadProgess = false;
              _closeAllModal();
              $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});
              $scope.successMsg('Produto deletado');
            }else{
              $scope.loadProgess = false;
              $scope.errorMsg('Erro ao deletar produto');
            }
          })
          .catch(function(err){
            console.log(err)
            $scope.loadProgess = false;
            $scope.errorMsg('Erro ao deletar produto');
          });
      }

      $scope.changeCompra = function(produto){
        $scope.loadProgess = true;
        let params = {
          "prd_id": produto._id,
          "status": produto.comprado > 0 ? 0 : 1
        }
        service.marcarCompra(params)
          .then(function(result){
            if(result.status){
              $scope.loadProgess = false;
              _closeAllModal();
              $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});
              $scope.successMsg(`Produto ${produto.comprado > 0 ? 'Desmarcado' : 'marcado'}`);
            }else{
              $scope.loadProgess = false;
              $scope.errorMsg('Erro ao Marcar/Desmarcar');
            }
          })
          .catch(function(err){
            console.log(err)
            $scope.loadProgess = false;
            $scope.errorMsg('Erro ao Marcar/Desmarcar');
          })
      }

      function _closeAllModal(){
        modalInstance.forEach(function(instance){instance.close();});
      }
    });
})();
