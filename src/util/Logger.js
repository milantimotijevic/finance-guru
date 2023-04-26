module.exports = {
	info() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[32m', args.join(','), '\x1b[0m');
	},
	warn() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[33m', args.join(','), '\x1b[0m');
	},
	error() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[31m', args.join(','), '\x1b[0m');
	},
};
