'use strict'

const test = require('tape')

const {counters, data} = require('.')

const berlin = 4728
const validISODate = /^\d{4}-\d{2}-\d{2}$/

test('seems to work', (t) => {
	counters(berlin)
	.then((counters) => {
		t.ok(Array.isArray(counters))
		t.ok(counters.length > 0, 'no counters returned')
		for (let i = 0; i < counters.length; i++) {
			const c = counters[i]

			t.equal(typeof c.id, 'string')
			t.equal(typeof c.name, 'string')
			if (c.url) t.equal(typeof c.url, 'string')

			const coords = c.coordinates
			t.ok(coords)
			t.equal(typeof coords.latitude, 'number')
			t.equal(typeof coords.longitude, 'number')
			if (coords.country) t.equal(typeof coords.country, 'string')

			const org = c.organisation
			t.ok(org)
			t.equal(typeof org.id, 'number')
			t.equal(typeof org.name, 'string')
			t.equal(typeof c.table, 'string')

			t.equal(typeof c.count, 'number', i + ' count')
			if (c.periodStart) t.ok(c.periodStart instanceof Date)
			if (c.periodEnd) t.ok(c.periodEnd instanceof Date)

			t.ok(Array.isArray(c.instruments))
			t.ok(c.instruments.length > 0, i + ' no instruments')
			for (let i of c.instruments) t.ok(i)

			t.ok(Array.isArray(c.photos))
			for (let p of c.photos) t.equal(typeof p, 'string')
			t.equal(typeof c.logo, 'string')
		}

		const c = counters[0]
		return data(c.organisation.id, c.table, c.id, c.instruments, c.periodStart, c.periodEnd)
	})
	.then((data) => {
		t.ok(Array.isArray(data))
		t.ok(data.length > 0, 'no data points returned')
		for (let i = 0; i < data.length; i++) {
			const d = data[i]
			t.ok(d)

			t.equal(typeof d.day, 'string')
			t.ok(validISODate.test(d.day))

			t.equal(typeof d.count, 'number')
			t.ok(d.count >= 0)
		}

		t.end()
	})
	.catch(t.ifError)
})
