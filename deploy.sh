#!/usr/bin/env bash
set -euo pipefail

# Default arguments for Hugo
if [ -z ${var+x}]; then
    HUGOARGS="--cleanDestinationDir"
fi

# Loop through arguments
for arg in "$@"; do
    echo "Step: ${arg}"

    case "${arg}" in
	less)
	    lessc static/css/styles.less static/css/styles.css
	    ;;
	hugo)
	    hugo ${HUGOARGS}
	    ;;
	minify)
	    minify -aro public/ public/
	    ;;
        ipfs)
            ipfs add -r public/
            ;;
	ipfs-publish)
	    ipfs add -qr public/ | tee ipfs.log
	    ipfs name publish /ipfs/$(tail -n1 ipfs.log)
	    ;;
    esac
done
