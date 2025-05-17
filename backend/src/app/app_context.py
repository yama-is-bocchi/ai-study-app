from app import App


class AppContext:
    def __init__(self, app: App) -> None:
        self.app = app
