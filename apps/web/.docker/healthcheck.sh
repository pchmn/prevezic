#!/bin/sh
set -e

node -e "
  require('http').get('http://localhost/health', (res) => {
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
"