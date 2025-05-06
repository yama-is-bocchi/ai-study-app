ARG UBUNTU_VERSION=22.04
FROM ubuntu:${UBUNTU_VERSION}

# install dev tools
RUN apt-get update \
    && apt-get install -y \
    build-essential \
    cmake \
    libomp-dev \
    python3-dev \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# japanize
RUN set -x \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

# create user
ARG USERNAME=vscode
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo \
    && groupadd --gid 5000 ${USERNAME} \
    && useradd --uid 5000 --gid 5000 --home-dir /home/${USERNAME} --create-home --shell /bin/bash ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >>/etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

USER ${USERNAME}

# install uv
ARG UV_VERSION=0.7.2
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    sudo apt-get update \
    && sudo apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
    && curl -LsSf https://astral.sh/uv/${UV_VERSION}/install.sh | sh \
    && echo 'eval "$(uv generate-shell-completion bash)"' >> /home/${USERNAME}/.bashrc \
    && echo 'eval "$(uvx --generate-shell-completion bash)"' >> /home/${USERNAME}/.bashrc
ENV PATH=/home/${USERNAME}/.local/bin/:${PATH} \
    UV_NO_CACHE=1 \
    UV_LINK_MODE=copy


# install python
ARG PYTHON_VERSION=3.13.3
RUN uv python install ${PYTHON_VERSION} --default --preview

# install node
ARG NODE_VERSION=22
RUN sudo apt-get update && \
    sudo apt-get install -y curl gettext-base && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    sudo apt-get install -y nodejs

# install bun
ARG BUN_VERSION=1.2.12
RUN sudo apt-get update \
    && sudo apt-get install -y unzip \
    && curl -fsSL https://bun.sh/install | sudo -u ${USERNAME} bash -s "bun-v${BUN_VERSION}"

# install psql client
ARG PSQL_VERSION=17
RUN sudo apt-get update && sudo apt-get install -y wget gnupg lsb-release \
    && echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
        | sudo tee /etc/apt/sources.list.d/pgdg.list \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc \
        | gpg --dearmor | sudo tee /usr/share/keyrings/postgresql.gpg > /dev/null \
    && sudo apt-get update \
    && sudo apt-get install -y postgresql-client-${PSQL_VERSION}