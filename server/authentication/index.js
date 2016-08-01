"use strict";

const sha1 = require('sha1');

class Authentication {

	constructor (db) {
		this.db = db.connections[0];
	}

	getTokenByUserId(id, cb) {
		this.db.collection('accesstokens').findOne({userId:id}, (err, accessToken) => {
			if (err) return cb(err);
			return cb(null, accessToken);
		});
	}

	getAccessToken(token, cb) {
		this.db.collection('accesstokens').findOne({key:token}, (err, accessToken) => {
			if (err) return cb(err);
			return cb(null, accessToken);
		});
	}

	getUser(pseudo, password, cb) {
		this.db.collection('users').findOne({pseudo:pseudo}, (err, user) => {
			if (!user) return cb(err, false);
			if (err) return cb(err);
			var hashedpassword = sha1(password);
			this.db.collection('users').findOne({pseudo:pseudo, password: hashedpassword}, (err, user) => {
				return cb(err, user ? user : false);
			});
		});
	}

	getUserFromToken(token, cb) {
		this.db.collection('accesstokens').findOne({key: token}, (err, res) => {
			if (!res) return cb(err, false);
			if (err) return cb(err);
			return cb(null, res);
		});
	}

}

module.exports = Authentication;