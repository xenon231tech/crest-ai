const TelegramBot = require('node-telegram-bot-api');
const Groq = require('groq-sdk');

const token = 'TOKEN_BOT_LU';

const groq = new Groq({
  apiKey: 'GROQ_API_KEY_LU',
});

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // START
  if (text === '/start') {
    bot.sendMessage(
      chatId,
      `🔥 Crest AI Online!

Commands:
/ai <question>
/help
/ping`
    );
    return;
  }

  // HELP
  if (text === '/help') {
    bot.sendMessage(
      chatId,
      `📖 Crest AI Commands:

/ai <text> → Ask AI
/ping → Bot status
/help → Show commands`
    );
    return;
  }

  // PING
  if (text === '/ping') {
    bot.sendMessage(chatId, '🏓 Pong! Crest AI is alive.');
    return;
  }

  // AI CHAT
  if (text.startsWith('/ai ')) {
    const prompt = text.replace('/ai ', '');

    try {
      const chatCompletion =
        await groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'llama-3.3-70b-versatile',
        });

      const reply =
        chatCompletion.choices[0]?.message?.content ||
        'No response';

      bot.sendMessage(chatId, reply);

    } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, '⚠️ AI error.');
    }

    return;
  }

  // UNKNOWN COMMAND
  bot.sendMessage(
    chatId,
    '❓ Unknown command. Use /help'
  );
});

console.log('🔥 Crest AI running...');
