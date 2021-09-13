/* eslint-disable no-unused-vars */
const { prefix } = require('./../../config.json');

module.exports = {
	name: 'userinfo',
	description: 'Displays info about a user',
	usage: '@<Username>',
	guildOnly: true,
	async execute(message, args) {
		const members = message.mentions.users;
		if (members.size !== 1) {
			message.reply('Usage: `' + prefix + this.name + ' ' + this.usage + '`');
			return;
		}
		const member = members.first();
		if (member.bot) return;

		const memberId = member.id;
		const memberUsername = member.username;
		const memberDiscriminator = member.discriminator;
		const memberAvatar = member.displayAvatarURL();
		const memberAge = formatDate(message, member.createdAt);

		const userFetched = await message.guild.members.fetch(memberId);

		const memberJoinedAt = formatDate(message, userFetched.joinedAt);
		const memberNickname = userFetched.nickname;

		const memberRoles = [];
		(userFetched._roles).forEach(role => memberRoles.push('<@&' + role + '>'));
		const memberRolesAmount = memberRoles.length;
		if (memberRolesAmount === 0) memberRoles.push('none');

		const embed = {
			color: 0xFF0000,
			author: {
				name: memberUsername + '#' + memberDiscriminator,
				icon_url: memberAvatar,
			},
			thumbnail: {
				url: memberAvatar,
			},
			fields: [
				{
					name: 'ID',
					value: memberId,
					inline: true,
				},
				{
					name: 'Nickname',
					value: memberNickname,
					inline: true,
				},
				{
					name: 'Created Date',
					value: memberAge + ' ' + ageCalculator(member.createdAt),
				},
				{
					name: 'Joined Date',
					value: memberJoinedAt + ' ' + ageCalculator(userFetched.joinedAt),
				},
				{
					name: 'Roles [' + memberRolesAmount + ']',
					value: memberRoles,
					inline: true,
				},
			],
		};

		message.channel.send({ embed: embed });
	},
};

function formatDate(message, date) {
	const locale = message.guild.preferredLocale;
	const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
	const fDate = date.toLocaleDateString(locale, options);

	return fDate;
}

function ageCalculator(date) {
	const now = new Date();

	const years = now.getFullYear() - date.getFullYear();

	const months = (now.getMonth() - date.getMonth()) / 12;

	let days = 0;
	if (years < 1 && months < 1) {
		days = (now.getTime() - date.geTime() / (1000 * 3600 * 24));
	}

	let age = '(';
	if (years !== 0) {
		if (years === 1) {
			age += years + ' year';
		}
		else {
			age += years + ' years';
		}
	}
	if (months >= 1) {
		if (months === 1) {
			age += ' ' + months + ' month';
		}
		else {
			age += ' ' + months + ' months';
		}
	}
	if (days !== 0) {
		if (days === 1) {
			age += days + ' day';
		}
		else {
			age += days + ' days';
		}
	}

	age += ' ago)';

	return age;
}