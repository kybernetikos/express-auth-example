function auth(username, password, done) {
	if (username==='user' && password==='secret') {
		done(null, {name: username});
	} else {
		done(null, false, { message: 'Incorrect password.' });
	}
}
module.exports = auth;