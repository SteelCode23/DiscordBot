const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ],
});

// Log in to Discord with your app's token
client.login(process.env.BOT_TOKEN);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Single event listener for multiple commands
client.on('messageCreate', async (message) => {
  // Avoid responding to bots
  if (message.author.bot) return;

  // Command 1: !hello
  if (message.content.toLowerCase() === '!hello') {
    message.reply('Hello! I’m your bot!');
  }

  // Command 2: !Bitcoin
  if (message.content.toLowerCase() === '!bitcoin') {
    message.reply('75000!');
  }

  // Command 3: !price <crypto-name> - Crypto Price Check
  if (message.content.toLowerCase().startsWith('!price')) {
    const args = message.content.split(' ');
    const cryptoName = args[1]?.toLowerCase();

    if (!cryptoName) {
      return message.reply('Please specify a cryptocurrency (e.g., `!price bitcoin`).');
    }

    try {
      // Fetch cryptocurrency data from CoinGecko API
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=usd`);
      const price = response.data[cryptoName]?.usd;

      if (price) {
        message.reply(`The current price of ${cryptoName.charAt(0).toUpperCase() + cryptoName.slice(1)} is $${price}.`);
      } else {
        message.reply(`Sorry, I couldn't find the price for ${cryptoName}. Please check the name and try again.`);
      }
    } catch (error) {
      console.error(error);
      message.reply('There was an error while fetching the price. Please try again later.');
    }
  }
});
