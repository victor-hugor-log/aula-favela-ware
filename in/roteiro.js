// =========================================
// ROTEIRO DE EXEMPLO - COMANDOS DISPONÍVEIS
// =========================================
//
// esperar(segundos)           → pausa o script pelo tempo informado
// abrirSite(url)              → abre o site especificado
// buscarElemento(xpath)       → encontra um elemento na página
// clicar(elemento)            → clica em um elemento
// escrever(elemento, texto)   → digita texto dentro de um campo
// ler(elemento)               → lê o texto de um elemento
// mostrar(texto)              → exibe uma mensagem no console
//
// Você pode guardar elementos em variáveis, ex:
// campo = buscarElemento("//input[@name='q']")
//
// Comentários iniciam com "//" e são ignorados
// =========================================

abrirSite("https://www.sympla.com.br/evento/devfest-belo-horizonte/3103493")

esperar(5)

ingresso = buscarElemento("/html/body/div[2]/div[1]/section[2]/div/div[1]")

texto = ler(ingresso)

mostrar(texto)


