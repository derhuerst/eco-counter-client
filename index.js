'use strict'

const floor = require('floordate')

const request = require('./lib/request')

const endpoint = 'https://www.eco-public.com/ParcPublic/'
const userAgent = 'derhuerst/eco-counter-client'

const formatDate = (d) => { // DD/MM/YYYY
	// todo: what about the timezone? does the Eco Counter API assume Paris?
	return [
		('0' + d.getUTCDate()).slice(-2),
		('0' + (d.getUTCMonth() + 1)).slice(-2),
		('0000' + d.getUTCFullYear()).slice(-4)
	].join('/')
}

const invalidDate = new Date(NaN)
const parseDate = (s) => { // DD/MM/YYYY
	// todo: what about the timezone? does the Eco Counter API assume Paris?
	s = s.split('/')
	if (s.length !== 3) return invalidDate
	return new Date(s[2] + '-' + s[1] + '-' + s[0])
}

const dayToISO = (s) => { // DD/MM/YYYY -> YYYY-MM-DD
	// todo: what about the timezone? does the Eco Counter API assume Paris?
	s = s.split('/')
	if (s.length !== 3) return invalidDate
	return s.reverse().join('-')
}

const today = floor(new Date, 'day')
const parseCounter = (org) => (c) => {
	// todo: mainPratique, filtre, option1, lastDay, current_year_default, moyD, formule_site, sig
	return {
		id: c.idPdc,
		name: c.nom,
		url: 'http://www.eco-public.com/public2/?id=' + c.lienPublic,
		coordinates: {
			latitude: parseFloat(c.lat),
			longitude: parseFloat(c.lon),
			country: c.pays
		},

		// for further queries
		organisation: {
			id: org,
			name: c.nomOrganisme
		},

		// counting data
		count: c.total ? parseInt(c.total) : null,
		periodStart: c.debut && c.debut !== 'null' ? parseDate(c.debut) : null,
		periodEnd: c.fin && c.fin !== 'null' ? parseDate(c.fin) : today,
		instruments: c.pratique.map(p => p.id), // todo: find a better name

		// more information
		url: c.externalUrl,
		photos: Array.isArray(c.photo) ? c.photo.map(p => p.lien) : [],
		logo: c.logo
	}
}

const counters = (organisation) => {
	if ('number' !== typeof organisation) throw new Error('organisation must be a number')

	return request('GetCounterList', {id: organisation})
	.then(counters => counters.map(parseCounter(organisation)))
}

const parseData = (d) => {
	// todo: what is d[d.length - 1]?
	return d.slice(0, -1).map(([day, count]) => ({
		day: dayToISO(day),
		count: parseFloat(count)
	}))
}

// todo [breaking]: remove `table` parameter
const data = (org, table, counter, pratique, from, to) => {
	if ('number' !== typeof org) throw new Error('org must be a number')
	if ('string' !== typeof counter) throw new Error('counter must be a string')
	if (!(from instanceof Date)) throw new Error('from must be a Date object')
	if (!(to instanceof Date)) throw new Error('to must be a Date object')

	const query = {
		idOrganisme: org,
		idPdc: counter,
		interval: 4, // todo: what is this?
		pratiques: pratique.join(';'), // todo: what is this?
		debut: formatDate(from),
		fin: formatDate(to)
	}

	return request('CounterData', query)
	.then(parseData)
}

module.exports = {counters, data}
