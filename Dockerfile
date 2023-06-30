FROM devdotnetorg/libgpiod:latest

RUN apk update
RUN apk add git npm avahi avahi-tools avahi-dev avahi-libs avahi-compat-libdns_sd\
    nodejs bash python3 py3-pip make g++
# RUN pip install GPIOSimulator

RUN sed -i 's/.*enable-dbus=.*/enable-dbus=no/' /etc/avahi/avahi-daemon.conf
# RUN sed -i 's/.*use-ipv4=.*/use-ipv4=yes/' /etc/avahi/avahi-daemon.conf
# RUN sed -i 's/.*use-ipv6=.*/use-ipv6=yes/' /etc/avahi/avahi-daemon.conf

RUN avahi-daemon -D

#copy everything from the parent directory exept docker folder into the container

RUN mkdir /circlebar
COPY ./ /circlebar
RUN rm -rf /circlebar/docker

COPY ./docker/.envtest /circlebar/.env
COPY ./docker/admin.jsontest /circlebar/admin.json

RUN cd circlebar && npm install
RUN cd circlebar && npm fund
RUN cd circlebar && npm audit fix

CMD [ "npm" "start" "--prefix" "/circlebar" ]
