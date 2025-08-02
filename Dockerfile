ARG UBUNTU_VERSION=22.04
FROM ubuntu:${UBUNTU_VERSION}


# set timezone
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

# install uv
ARG UV_VERSION=0.6.0
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
    && curl -LsSf https://astral.sh/uv/${UV_VERSION}/install.sh | sh \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*
ENV PATH=/root/.local/bin/:${PATH} \
    UV_NO_CACHE=1 \
    UV_LINK_MODE=copy

# install bun
ARG BUN_VERSION=1.2.12

RUN set -x \
    && apt-get update \
    && apt-get install -y unzip \
    && curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}" \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun


WORKDIR /app

# install node
ARG NODE_VERSION=22
RUN apt-get update && \
    apt-get install -y curl gettext-base && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN set -x \
    && cd frontend \
    && bun install \
    && bun run build 

RUN set -x \
    && apt-get update \
    && apt-get install -y build-essential \
    && cd backend \
    && uv sync

WORKDIR /app/backend

ENTRYPOINT ["uv","run","src/main.py"]
