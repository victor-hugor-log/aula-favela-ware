/**
 * Interpretador Didático de Automação com Selenium
 */

const fs = require("fs");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function main() {
  // === Configuração do Chrome ===
  const options = new chrome.Options();
  options.addArguments("--start-maximized"); // Tela cheia
  options.addArguments("--disable-infobars");
  options.addArguments("--disable-notifications");
  options.addArguments("--disable-blink-features=AutomationControlled");

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  // === Lê e prepara o roteiro ===
  const script = fs.readFileSync("roteiro.js", "utf-8");
  const linhas = script
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("//")); // Ignora comentários e linhas vazias

  // === Contexto de variáveis ===
  const contexto = {};

  // === Mapeamento de comandos ===
  const comandos = {
    async esperar(segundos) {
      await new Promise(r => setTimeout(r, segundos * 1000));
    },
    async abrirSite(url) {
      await driver.get(url);
    },
    async buscarElemento(xpath) {
      const elemento = await driver.findElement(By.xpath(xpath))
      return elemento;
    },
    async clicar(elemento) {
      await elemento.click();
    },
    async escrever(elemento, texto) {
      await elemento.sendKeys(texto);
    },
    async ler(elemento) {
      return await elemento.getText();
    },
    async mostrar(texto) {
      console.log(texto);
    },
  };

  // === Função de interpretação ===
  async function interpretar(linha) {
    if (linha.includes("=")) {
      const [variavel, expressao] = linha.split("=").map(s => s.trim());
      const resultado = await interpretar(expressao);
      contexto[variavel] = resultado;
      return;
    }

    const match = linha.match(/^(\w+)\((.*)\)$/);
    if (!match) throw new Error("Comando inválido: " + linha);

    const nome = match[1];
    const argsString = match[2].trim();
    const args = argsString
      ? argsString.split(",").map(a => {
          a = a.trim();
          if (contexto[a]) return contexto[a];
          if (a.startsWith('"') || a.startsWith("'")) return a.slice(1, -1);
          if (!isNaN(Number(a))) return Number(a);
          return a;
        })
      : [];

    const func = comandos[nome];
    if (!func) throw new Error("Comando desconhecido: " + nome);
    return await func(...args);
  }

  // === Execução do roteiro ===
  for (const linha of linhas) {
    await interpretar(linha);
  }

  await driver.quit();
}

main().catch(console.error);
