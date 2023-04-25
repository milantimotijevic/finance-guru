module.exports = {
	info() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[32m', 'INFO:', args.join(','), '\x1b[0m');
	},
	warn() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[33m', 'WARNING:', args.join(','), '\x1b[0m');
	},
	error() {
		const args = Array.prototype.slice.call(arguments);
		console.log('\x1b[31m', 'ERROR:', args.join(','), '\x1b[0m');
	},
};
