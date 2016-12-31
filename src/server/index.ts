import * as Hapi from 'hapi';
import * as inert from 'inert';
import * as path from 'path';

// import {Routes} from './routes';

const server = new Hapi.Server();
server.connection({
	port: 8080,
});

server.register(inert, function(err) {
	if (err) {
		throw err;
	}

	server.route({
		handler: {
			file: path.normalize(__dirname + '/../../build/client/index.html'),
		},
		method: 'GET',
		path: '/',
	});
});

server.start(function(err) {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`); //tslint:disable-line
});

server.route({
	handler: {
		directory: {
			index: false,
			path: path.normalize(__dirname + '/../client/'),
			redirectToSlash: true,
		},
	},
	method: 'GET',
	path: '/resources/{param*}',
});
