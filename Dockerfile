FROM node:14

ENV HOME=/app

RUN apt-get -qq autoremove -y
RUN apt-get -qq update -y
RUN apt-get -qq install -y sudo

WORKDIR $HOME

ADD . $HOME

RUN yarn install

CMD yarn start
