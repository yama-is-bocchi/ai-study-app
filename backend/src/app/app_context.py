from app import App


class AppContext:
    def __init__(self, app: App) -> None:
        self.app = app


def get_app_context() -> AppContext:
    msg = "override required"
    raise NotImplementedError(msg)
