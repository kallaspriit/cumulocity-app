# Cumulocity client application
**Mobile-friendly web application for displaying data from Cumulocity IoT platform.**

## Tasks
- `npm start` - starts the hot-reloaded dev server.
- `npm build` - builds the production version in "dist" folder.
- `npm server` - serves the production version from the "dist" folder.
- `npm lint` - lints the codebase for errors.

## Setting up pm2
You can use pm2 to serve the production version in your server.
- `npm i -g pm2` - installs pm2 globally.
- `pm2 install pm2-logrotate` - installs pm2 logrotate.
- `pm2 set pm2-logrotate:max_size 10M` - configure logrotate max size.
- `pm2 set pm2-logrotate:retain 7` - configure logrotate retention.
- `pm2 set pm2-logrotate:interval_unit DD` - configure logrotate interval.
- `pm2 start scripts/server.js -- name iot --interpreter ./node_modules/.bin/babel-node` - start the server.
