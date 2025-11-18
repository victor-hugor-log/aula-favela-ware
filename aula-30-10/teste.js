const { Builder, By, Key, until } = require("selenium-webdriver");
async function main() {
const driver = await new Builder().forBrowser("chrome").build();
await driver.get("https://www.coca-cola.com/br/pt");
}


main()
