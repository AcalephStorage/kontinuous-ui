FROM mhart/alpine-node:4

RUN apk update && \
    apk add git ca-certificates && \
    rm -rf /var/cache/apk/*

# Install forego, and caddy
RUN wget https://bin.equinox.io/c/ekMN3bCZFUn/forego-stable-linux-amd64.tgz -O /tmp/forego.tar.gz && \
    tar xvz -C /usr/local/bin -f /tmp/forego.tar.gz && \
    rm /tmp/forego.tar.gz && \
    chmod 0744 /usr/local/bin/forego && \
    wget https://github.com/mholt/caddy/releases/download/v0.8.3/caddy_linux_amd64.tar.gz -O /tmp/caddy.tar.gz && \
    tar xvz -C /usr/local/bin -f /tmp/caddy.tar.gz && \
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

CMD ["/usr/local/bin/forego", "start", "-f", "config/Procfile", "-p", "5000"]
