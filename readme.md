# eco-counter-client

**Fetch data about [bicycle counters](https://en.wikipedia.org/wiki/Traffic_count#Bicycle_and_pedestrian_traffic_counting_devices) from the [Eco Counter](http://www.eco-compteur.com/en/) API.**

[![npm version](https://img.shields.io/npm/v/eco-counter-client.svg)](https://www.npmjs.com/package/eco-counter-client)
[![build status](https://img.shields.io/travis/derhuerst/eco-counter-client.svg)](https://travis-ci.org/derhuerst/eco-counter-client)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/eco-counter-client.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install eco-counter-client
```


## Usage

An organisation seems to be just a set of counters. You need to pass in an organisation ID. See [`eco-counter-organisations`](https://github.com/derhuerst/eco-counter-organisations) for a list.

```js
const {counters, data} = require('eco-counter-client')

counters(4728) // Berlin
.then((counters) => {
	const c = counters[0]
	console.log(c)
	return data(c.organisation.id, c.id, c.instruments, c.periodStart, c.periodEnd)
})
.then(console.log)
.catch(console.error)
```

`counters(org)` returns a `Promise` that resolves with an array of bike counters. A single result looks like this:

```js
{
	id: '100024661',
	name: 'Jannowitzbrücke',
	url: 'http://www.stadtentwicklung.berlin.de/verkehr/lenkung/vlb/de/erhebungen.shtml',
	coordinates: {
		latitude: 52.5140658632566,
		longitude: 13.41775102070807,
		country: 'de'
	},
	organisation: {
		id: 4728,
		name: 'VERKEHRSLENKUNG BERLIN'
	},
	count: 492398,
	periodStart: 2016-01-01T00:00:00.000Z, // JS Date object
	periodEnd: 2020-03-21T23:00:00.000Z, // JS Date object
	instruments: [101024661, 102024661],
	photos: ['https://www.eco-visio.net/Photos/100024661/14677966316060.jpg'],
	logo: 'https://www.eco-visio.net/Logos/4728/1485517072671.jpg'
}
```

`data(org, id, instruments, start, end)` returns a `Promise` that resolves with an array days. They look like this:

```js
[
	{day: '2016-01-01', count: 950},
	// …
	{day: '2016-26-01', count: 5819},
	// …
	{day: '2016-24-02', count: 6202},
	// …
	{day: '2016-30-03', count: 5556},
	// …
]
```


## Contributing

If you have a question or have difficulties using `eco-counter-client`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/eco-counter-client/issues).
