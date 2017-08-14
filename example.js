'use strict'

const {counters, data} = require('.')

counters(4728)
.then((counters) => {
	const c = counters[0]
	console.log(c)
	return data(c.organisation.id, c.table, c.id, c.instruments, c.periodStart, c.periodEnd)
})
.then(console.log)
.catch(console.error)
