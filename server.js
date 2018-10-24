const Hapi = require('hapi');
const server = new Hapi.Server();
const port = process.env.PORT || 3000;
server.connection({ port: port, host: 'localhost'});
const path = require('path');
const handler = function (request, reply) {
    return reply({ status: 'ok' });
};

server.register([require('inert')], function (err) {
    if (err) console.log(err);
});

const routes = {
        css: {
            method: 'GET',
            path: '/styles/{path*}',
            handler: createDirectoryRoute('styles')
        },
        js: {
            method: 'GET',
            path: '/scripts/{path*}',
            handler: createDirectoryRoute('scripts')
        },
        assets: {
            method: 'GET',
            path: '/assets/{path*}',
            handler: createDirectoryRoute('assets')
        },
        templates: {
            method: 'GET',
            path: '/templates/{path*}',
            handler: createDirectoryRoute('templates')
        },
        spa: {
            method: 'GET',
            path: '/{path*}',
            handler: function (request, reply) {
                 reply.file(path.join(__dirname, '/dist/index.html'));
            }
        }
    };

server.route([ routes.spa ]);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log( 'Server running on port', port );
})

function createDirectoryRoute( directory ) {
    return function (request, reply) {
        reply(path.join(__dirname, '/dist/', directory));
    }
}

module.exports = server;
