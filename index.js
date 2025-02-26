const fs = require("fs");
const path = require("path");

const playsPath = path.join(__dirname, "src", "plays.json");
const invoicesPath = path.join(__dirname, "src", "invoices.json");

const plays = JSON.parse(fs.readFileSync(playsPath, "utf8"));
const invoices = JSON.parse(fs.readFileSync(invoicesPath, "utf8"));

console.log("Mostrando Names", plays);

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `Statement for ${invoice[0].customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimunFractionDigits: 2,
  }).format;

  for (let perf of invoice[0].performaces) {
    const play = plays[perf.playID];

    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;

        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;

        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    // Soma créditos por volumes
    volumeCredits += Math.max(perf.audience - 30, 0);

    // Soma um crédito extra para cada dez espectadores de comédia
    if ("comedy" === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // Exibe linha para esta requisição
    result += `${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;

    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;

  result += `You earned ${volumeCredits} credits\n`;

  return result;
}

teste = statement(invoices, plays);

console.log(teste);
