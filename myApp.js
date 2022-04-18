const express = require('express');
const helmet = require("helmet");
const app = express();
app.use(helmet.hidePoweredBy());
// Don't allow me to be in ANY frames:
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

// Add HSTS
const strictTransportSecurity = require("hsts");
app.use(
    strictTransportSecurity({
        maxAge: 90 * 24 * 60 * 60,
        includeSubDomains: true,
    })
);
const contentSecurityPolicy = require("helmet-csp");
app.use(
    contentSecurityPolicy({
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted-cdn.com"],
        },
        reportOnly: false,
    })
);


// Items that we may not want in a performance server
app.use(helmet.dnsPrefetchControl())    // DNS prefetch for links
app.use(helmet.noCache())               // Disable cache







































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
