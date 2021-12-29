(async function(){
  const action = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(action, {direction: 'top'});

	const el = document.getElementById('tabs')
	let eventTabs = M.Tabs.init(el);

	const elements = document.getElementsByClassName("disabled");

	Array.from(elements).forEach(function(element) {
		element.addEventListener('click', () =>{
			M.toast({html: 'Em desenvolvimento função não dinsponivel!', classes: 'orange rounded'});
		});
	});

	const elems = document.querySelectorAll('.modal');
  const modalInstance = M.Modal.init(elems);

	const controller = {
		addTabs: async () =>{
			let adicionar  = document.getElementById('add-tab');
			adicionar.addEventListener('click', async ()=>{
        try {
          let nome = document.getElementById('nome').value;
		
          if(nome == '') return  M.toast({html: 'Obrigatorio inserir um nome para o menu', classes: 'orange rounded'});
      
          const data = { nome: nome };

          const resp = await fetch('http://localhost/api/cadastrar-tabs', {
            method: 'POST',
            body: JSON.stringify(data),
          });

          if(!resp.status) return M.toast({html: 'Erro ao cadastrar Tabs!', classes: 'Red rounded'});
          
          await controller.carregar_tabs(true);

          setTimeout(()=>{
            modalInstance[0].close();
          },1000);
        } catch (error) {
          console.log(error)
          return M.toast({html: 'Erro ao cadastrar Tabs!', classes: 'Red rounded'})
        }			
			});
		},
    render: data =>{
      let objectEsl = '';
      for(let produto of data){
        objectEsl+=`
        <div class="row">
          <div class="col s10 offset-s1">
            <div class="card">
              <div class="card-image">
                <img class="activator" src="${produto.img}">
              </div>
              <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">${produto.nome} <i class="material-icons right">arrow_drop_up</i></span>
                <p><a target="_blank" href="${produto.link}"> <i class="material-icons right">insert_link</i> Site para compra</a></p>
              </div>
              <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${produto.nome} <i class="material-icons right">arrow_drop_down</i></span>
                <p>${produto.desc}</p>
                <br>
                <p>Preço ${produto.value}</p>
              </div>
            </div>
          </div>		
        </div>	
        `;
      }
      return objectEsl;
    },
    carregar_tabs: async (refresh = false) =>{
      try {
        const url = `http://localhost/api/listar-tabs`;
        let tabs = await fetch(url).then(response => response.json());

        if(tabs.status){
          eventTabs.destroy();

          // body 
          let tab_body = document.getElementById('tabs-body');

          let html = '';
          let menu = ''
          tabs.data.forEach(tab =>{
            html += `<div id="${tab._id}"><h4 class="text-center">Não existem itens adiconados ao menu <br> "${tab.name}"</h4></div>`;
            menu += `<li class="tab col s5"><a href="#${tab._id}">${tab.name}</a></li>`
          });

          el.innerHTML = menu;
          tab_body.innerHTML = html;

          eventTabs =  M.Tabs.init(el);

          // pegar ultimo item adicionado ao carregar tela,
          let ultimaTab = tabs.data.shift();
		
				  eventTabs.select(ultimaTab._id);
        }else{
          M.toast({html: 'erro ao carregar tabs', classes: 'red rounded'});
        }
      } catch (error) {
        console.log(error);
        M.toast({html: 'erro ao carregar tabs', classes: 'red rounded'});
      }
      
    },
    start:async ()=>{
      await controller.addTabs();
      await controller.carregar_tabs();
    }
	}

  controller.start();
})();