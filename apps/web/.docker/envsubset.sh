#! /bin/sh
set -e

TARGET_DIR="/app/build"

echo "Replacing all VITE_ variables in the app build"

# Collect all VITE_ environment variables
env_vars=""
for i in $(env | grep "^VITE_"); do
  key=$(echo "$i" | cut -d '=' -f 1)
  value=$(echo "$i" | cut -d '=' -f 2-)
  
  echo "Preparing replacement: $key with $value"
  
  # Build sed script for all replacements
  if [ -z "$env_vars" ]; then
    env_vars="s|__${key}__|${value}|g"
  else
    env_vars="$env_vars; s|__${key}__|${value}|g"
  fi
done

if [ -n "$env_vars" ]; then
  echo "Applying all replacements in a single pass..."
  # Apply all replacements in a single find/sed operation
  find "$TARGET_DIR" -type f -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" | \
    xargs sed -i -e "$env_vars"
  echo "All VITE_ variables replaced successfully"
else
  echo "No VITE_ environment variables found"
fi
