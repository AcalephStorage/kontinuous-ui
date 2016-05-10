FROM mhart/alpine-node:4

RUN apk update && \
    apk add git ca-certificates bash && \
    rm -rf /var/cache/apk/*

# Install forego, and caddy
RUN wget https://github.com/mholt/caddy/releases/download/v0.8.3/caddy_linux_amd64.tar.gz -O /tmp/caddy.tar.gz && \
    mkdir -pv /tmp/caddy && \
    tar xvz -C /tmp/caddy -f /tmp/caddy.tar.gz && \
    mv /tmp/caddy/caddy_linux_amd64 /usr/local/bin/caddy && \
    rm -r /tmp/caddy && \
    rm /tmp/caddy.tar.gz

# Install ember and bower
RUN npm install -g ember-cli@2.5.0 && \
    npm install -g bower@1.7.9

ADD . /home/apps/kontinuous-ui
WORKDIR /home/apps/kontinuous-ui

RUN npm install && \
    bower install --allow-root

ENV EMBER_ENV production

ENV KUBERNETES_API_URL kubernetes.default
ENV KUBERNETES_API_TOKEN_PATH /run/secrets/kubernetes.io/serviceaccount/token
ENV KUBERNETES_API_TOKEN token

EXPOSE 5000

CMD ["/home/apps/kontinuous-ui/start.sh"]
