'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const {stringify} = require('query-string')

let agent = null
if (!process.browser) {
	const {Agent} = require('https')
	agent = new Agent({
		minVersion: 'TLSv1',
	})
}

const endpoint = 'https://www.eco-public.com/ParcPublic/'
const userAgent = 'derhuerst/eco-counter-client'

const request = (route, query) => {
	const cfg = {
		method: 'post',
		mode: 'cors',
		redirect: 'follow',
		headers: {
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'user-agent': userAgent
		},
		body: stringify(query)
	}
	if (agent) cfg.agent = agent

	return fetch(endpoint + route, cfg)
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
}

module.exports = request
