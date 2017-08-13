'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const {stringify} = require('query-string')

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

module.exports = request
