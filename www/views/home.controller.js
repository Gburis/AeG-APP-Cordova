(function(){
  angular.module('home', [
    'appComponents'
  ])
    .controller('homeController', function($scope, Upload, serviceFactory, $window){
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
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
        
        $scope.newProduto = {};
        $scope.newProduto.qtd = 1;
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
              if(result.success){
                $scope.successMsg('Novo produto adicionado a lista atual');
                $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});

                const id = $window.localStorage.getItem('id');
                const nome = $window.localStorage.getItem('nome');
                const notification = {
                  id: id,
                  nome: nome,
                  produto: $scope.newProduto.nome
                }
                service.notification(notification);
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
            if(result.success){
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
            result = result.data;
            if(result.success){
              $scope.loadProgess = false;
              _closeAllModal();
              $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});
              $scope.successMsg(`Produto ${produto.comprado > 0 ? 'Desmarcado' : 'marcado'}`);
            }else{
              console.log(result)
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

      $scope.editarProduto = function(prd){
        $scope.editPrd = angular.copy(prd);
        $scope.editPrd.tab = $scope.tabAtual._id;
        $scope.editPrd.qtd = Number($scope.editPrd.qtd); 
        $scope.calcTotal(false);
        $scope.openModal('modal-editar-produto');
      }

      $scope.salvarAlteracaoProduto = function(form){
        $scope.formEdit.$setSubmitted();
        if(!form.$valid)  return $scope.warningMsg('Preencha todos os campos !');

        $scope.loadProgess = true;
        service.editarProduto($scope.editPrd)
        .then(function(result){
          result = result.data;
          if(result.success){
            _closeAllModal();
            $scope.successMsg('Produto alterado!');
            $scope.$emit('carregarProntudos', {tab: $scope.tabAtual});
          }
          else{
            $scope.errorMsg('Erro ao editar produto');
          }
          $scope.loadProgess = false;
        })
        .catch(function(err){
          console.log(err);
          $scope.loadProgess = false;
          $scope.errorMsg('Erro ao editar produto');
        });
      }

      $scope.quantidade = function(newPrd, add){
        if(newPrd){
          $scope.newProduto.qtd = add 
            ? $scope.newProduto.qtd >= 10 
              ? 10 : $scope.newProduto.qtd + 1 
            : $scope.newProduto.qtd <= 1 
              ? 1 : $scope.newProduto.qtd - 1;
          
          $scope.newProduto.total = $scope.newProduto.valor * $scope.newProduto.qtd;
        }else{
          $scope.editPrd.qtd = add 
            ? $scope.editPrd.qtd >= 10 
              ? 10 : $scope.editPrd.qtd + 1 
            : $scope.editPrd.qtd <= 1 
              ? 1 : $scope.editPrd.qtd - 1;
          
          $scope.editPrd.total = $scope.editPrd.valor * $scope.editPrd.qtd;
        }
      }

      $scope.calcTotal = function(newPrd){
        if(newPrd) 
          $scope.newProduto.total = $scope.newProduto.valor * $scope.newProduto.qtd;
        else
          $scope.editPrd.total = $scope.editPrd.valor * $scope.editPrd.qtd;
      }

      function _closeAllModal(modal = false){
        modalInstance.forEach(function(instance){
          if(modal && instance.id == modal || !modal)instance.close();
        });
      }
    });
})();
