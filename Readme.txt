Para executar os programas:
  - Abrir a pasta Webapp no Visual Studio Code
      ex: E:\git\sapui5\webapp - smartTable\webapp
  - Usar o botao 'Go Live' na barra de tarefas no rodape 
  
 ou 
    criar firstComponent e iniciar com yarn dev
	   ver CreateFirstComponent.txt
 ou
	criar firstManifest e iniciar com ui5 serve
	   - inicia o componente e cria o manifest.json
	   - com manifest não precisa do index.js para iniciar o componente porque já coloca o componente no body do index.html
	   ver CreateFirstManifest.txt
 ou 
   criar firstRouting e iniciar com ui5 serve 
       - usa o manifest para configurar as primeiras rotas e targets
	   - a diferenca para firstManifest é que inicializa o componente em component.js
	   - app.view deve estar vazio para iniciar myList, se não estiver vazio inicia app.view
	   
	
 