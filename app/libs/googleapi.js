'use strict';

const google = require('googleapis');
const googleAuth = require('google-auth-library');
const googlePlus = google.plus('v1');
const calendar = google.calendar('v3');
const promise = require('bluebird');
const database = require('./database')();

promise.promisifyAll(googlePlus.people);
promise.promisifyAll(calendar.events);

module.exports = () => {
    function oauth2Client(credentials) {
        const auth = new googleAuth();
        const client = new auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uri
        );
        promise.promisifyAll(client);
        return client;
    }

    function authUrl(client, options) {
        return client.generateAuthUrl(options);
    }

    function getNewToken(client, code) {
        let token;
        return client.getTokenAsync(code)
        .then(_token => {
            token = _token;
            client.credentials = token;
            return googlePlus.people.getAsync({auth: client, userId: 'me'});
        })
        .then(user => {
            return {user, token};
        })
        .catch(err => {
            throw err;
        });
    }

    function saveToken({user, token}, slackId) {
        // console.log('saveToken', slackId, user, token);
        return database.save({user, token}, slackId);
    }

    function getToken(slackId) {
        return database.get(slackId);
    }

    function ping(client) {
        return calendar.events.listAsync({
            auth: client,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 1,
            singleEvents: true,
            orderBy: 'startTime'
        })
        .then(eventList => {
            return isAvailable(eventList.items);
        })
        .catch(err => {
            throw err;
        });
    }

    function isAvailable(eventList) {
        if (eventList.length === 0) {
            return {isAvailable: true};
        }
        const nextEvent = eventList[0];
        let isAvailable = true;
        let nextDateTime = nextEvent.start.dateTime;
        const nextDate = nextEvent.start.date;

        if (nextDateTime && (new Date(nextDateTime) <= new Date()) && nextEvent.status === 'confirmed') {
            isAvailable = false;
            nextDateTime = nextEvent.end.dateTime;
        }
        if (nextDate && (new Date(nextDate) <= new Date()) && nextEvent.status === 'confirmed') {
            isAvailable = false;
            nextDateTime = nextEvent.end.date;
        }
        return {isAvailable, nextDateTime};
    }

    return {
        auth: {
            client: oauth2Client,
            url: authUrl,
            getNewToken,
            saveToken,
            getToken
        },
        calendar: {
            ping
        }
    };
};
