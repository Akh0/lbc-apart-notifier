const query = require('./query.json')
const fs = require('fs')
const axios = require('axios')
const notifier = require('node-notifier')
const crypto = require('crypto');

const md5sum = crypto.createHash('md5')

const hashFilepath = './.queryhash'

let previousHash = null

try {
	previousHash = fs.readFileSync(hashFilepath, 'utf8')
} catch (e) {}

axios.post('https://api.leboncoin.fr/finder/search', query).then(({data}) => {
	const hash = md5sum.update(JSON.stringify(data)).digest('hex')
	console.log(hash)

	if (hash === previousHash) {
		fs.writeFile(hashFilepath, hash, () => {})

		notifier.notify({
	  		title: 'Le Bon Coin',
	  		message: 'De nouvelles annonces sont disponibles !',
	  		open: 'https://www.leboncoin.fr/aw/mes-recherches/'
	  	});
	}
})
