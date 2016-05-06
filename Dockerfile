FROM mhart/alpine-node:0.12

RUN apk update && \
    apk add git ca-certificates && \
    rm -rf /var/cache/apk/*

# Install ember, bower, forego, and caddy
RUN npm install -g ember-cli@1.13.8 && \
    npm install -g bower@1.7.9  && \
    wget https://bin.equinox.io/c/ekMN3bCZFUn/forego-stable-linux-amd64.tgz -O /tmp/forego.tar.gz && \
    tar xvz -C /usr/local/bin -f /tmp/forego.tar.gz && \
    rm /tmp/forego.tar.gz && \
    chmod 0744 /usr/local/bin/forego && \
    wget https://github.com/mholt/caddy/releases/download/v0.7.6/caddy_linux_amd64.tar.gz -O /tmp/caddy.tar.gz && \
    tar xvz -C /usr/local/bin -f /tmp/caddy.tar.gz && \
    rm /tmp/caddy.tar.gz

ADD . /home/apps/kontinuous-ui
WORKDIR /home/apps/kontinuous-ui

RUN npm install && \
    bower install --allow-root
ENV KUBERNETES_API_URL kubernetes.default
ENV KUBERNETES_API_TOKEN_PATH /run/secrets/kubernetes.io/serviceaccount/token
ENV KUBERNETES_API_TOKEN token

CMD ["/usr/local/bin/forego", "start", "-f", "config/Procfile", "-p", "5000"]
