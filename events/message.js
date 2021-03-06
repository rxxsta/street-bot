// for configurations variables that are public
const { prefix } = require('./../config.json');

// Create an event listener for messages
module.exports = {
	name: 'message',
	execute(message) {
		const bot = message.client;

		if (message.author.bot) return;
		if (message.content.includes('@here') || message.content.includes('@everyone')) return false;

		// When the bot is @'ed
		// if (message.mentions.has(bot.user.id)) {
		// 	message.reply({ files:['./media/street_hey.png'] });
		// }

		// ----------- HANDLES COMMANDS WITH PREFIX AFTER THIS POINT -------------
		if (!message.content.startsWith(prefix)) return;

		// holds any arguments e.g. !ping all; where all is an arg
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// if a command given by user is not in our commands folder or in the aliases section then return
		if (!command) return;

		try {
		// executes the execute() function of the command
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command!');
		}
	},
};