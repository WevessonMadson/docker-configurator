### Visão Geral

Este guia explica como instalar e configurar o VRMobileServer utilizando Docker.

Ao final do processo você terá:

- Container do VRMobileServer em execução na porta 9016
- Comunicação com o banco de dados configurada

### Pré-requisitos

Antes de iniciar, verifique estas informações:

- Banco de dados: ip, porta, usuário, senha (podem ser encontradas no **vr.properties**)
- número da loja: normalmente é 1
- Ip do service manager: precisa ser um ip válido (não pode ser ip do modo NAT da VIRTUAL BOX, por exemplo)
- Se o computador comunica com o ip do banco de dados

### Gerar o Docker Compose

Com as informações do passo anterior: 

1- Acesse a Aba Gerador de Docker Compose:
![Configuração Docker](/assets/docker-config.png)

2- Clique em "Gerar Compose"
![Botao Gerar](/assets/gerar.png)

3- Clique em Baixar Docker Compose \(Se necessário, valide os dados na previsualização antes de baixar\)
![Botao Baixar](/assets/baixar.png)

Obs.: O arquivo será baixado com o nome:`docker-compose-vrmobileserver.yml`
![Arquivo foi baixado](/assets/baixou.png)

### Colocar o arquivo na pasta correta

O arquivo baixado deve ser colocado na pasta `.vr` dentro da pasta do usuário
![pasta .vr com o arquivo dentro](/assets/pasta-vr.png)

Obs.: é raro, mas pode acontecer dos arquivos do docker estarem dentro da pasta /vr

### Iniciando o container VRMobileServer

Abra um Terminal (`Ctrl + Alt + T`)

1- `docker-compose -f ~/.vr/docker-compose-vrmobileserver.yml up -d`
    
    1.1- Se for a primeira vez, ele pode dar erro pedindo para criar a `vr-network`:
![erro do vr-network](/assets/erro-network.png)
comando: `docker network create vr-network`, e depois roda o comando de novo

2- Depois disso, ele vai executar o container, e você terá esta informação no terminal:
![container rodando](/assets/up-ok.png)

### Colocando para o container iniciar com o Linux

Após subir o container, é muito importante que coloque para iniciar com o linux:

1- No terminal rodar: `echo "docker-compose -f $HOME/.vr/docker-compose-vrmobileserver.yml up -d"` e copiar a saída:
![copiando a saida](/assets/echo.png)

2- Ir no menu principal, procurrar por `"sessao"`
![sessao menu](/assets/sessao-menu.png)

3- Ir em `inicio automatico de aplicativos`, clicar no mais, preencher `Nome` e `comando`, e salvar:
![salvando comando na sessao](/assets/salvar-comando.png)

## Validando se o VRMobileServer está funcionando sem erro

Ao final, é muito importante validar se o VR Mobile Server está rodando sem erro, e fazemos isso através do log:

1- Abra o terminal e execute: `docker logs -f vr_vrmobileserver_1`

Se tudo estiver certo, você verá essas informações no terminal
![logs do serviço](/assets/logs-mobile.png)

## Passando os dados para o cliente

Agora, você já pode informar ao cliente o ip e a porta para ele configurar no VR Mobile (app)

IP: **o mesmo do service manager**

PORTA: **9016**