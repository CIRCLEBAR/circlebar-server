FROM devdotnetorg/libgpiod:latest

RUN apk update
RUN apk add git npm avahi avahi-tools avahi-dev avahi-libs avahi-compat-libdns_sd\
    nodejs bash python3 make g++

RUN sed -i 's/.*enable-dbus=.*/enable-dbus=no/' /etc/avahi/avahi-daemon.conf
# RUN sed -i 's/.*use-ipv4=.*/use-ipv4=yes/' /etc/avahi/avahi-daemon.conf
# RUN sed -i 's/.*use-ipv6=.*/use-ipv6=yes/' /etc/avahi/avahi-daemon.conf

RUN avahi-daemon -D

# RUN git pull https://github.com/CIRCLEBAR/circlebar-server
COPY circlebar /circlebar

# RUN mysql -u root -p < circlebar/db.sql
# COPY [.env location] /circlebar/.env
# COPY [admin.json location] /circlebar/admin.json
# RIGHT NOW IS PRESET IN THE DOWNLOADED REPO, TO PULL FROM GITHUB EVENTUALLY

RUN cd circlebar && npm install
RUN cd circlebar && npm fund
RUN cd circlebar && npm start

ENTRYPOINT [ "/bin/bash" ]