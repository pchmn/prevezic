#!/bin/sh
set -e

wget --no-verbose --tries=1 --spider http://localhost/health || exit 1