'use strict'

const request = require('./lib/request')

const endpoint = 'https://www.eco-public.com/ParcPublic/'
const userAgent = 'derhuerst/eco-counter-client'

const request = (route, query) => {
	return fetch(endpoint + route, {
		method: 'post',
		mode: 'cors',
		redirect: 'follow',
		headers: {
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'user-agent': userAgent
		},
		body: stringify(query)
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
}

const counters = (organisation) => {
	if ('number' !== typeof organisation) throw new Error('organisation must be a number')

	return request('GetCounterList', {id: organisation})
	// todo: parse
}

const data = (org, table, counter, pratique, from, to) => {
	if ('number' !== typeof org) throw new Error('org must be a number')
	if ('string' !== typeof table) throw new Error('table must be a string')
	if ('string' !== typeof counter) throw new Error('counter must be a string')
	if (!(from instanceof Date)) throw new Error('from must be a Date object')
	if (!(to instanceof Date)) throw new Error('to must be a Date object')

	const query = {
		idOrganisme: org,
		table: table,
		idPdc: counter,
		interval: 4, // todo: what is this?
		pratiques: pratique.join(';'), // todo: what is this?
		debut: formatDate(from),
		fin: formatDate(to)
	}

	return request('CounterData', query)
	// todo: parse
}

module.exports = {counters, data}
