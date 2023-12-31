#!/bin/sh

# Tell openrc loopback and net are already there, since docker handles the networking
cp /etc/rc.conf.bk /etc/rc.conf
echo 'rc_provide="loopback net"' >> /etc/rc.conf

# get inside the container bash
rc-service nginx restart

# Start node
node dist/main