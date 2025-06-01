import inspect


def get_func_name(default_name: str = "unknown") -> str:
    """実行中の関数名を取得します."""
    frame = inspect.currentframe()
    if frame is not None and frame.f_back is not None:
        return frame.f_back.f_code.co_name
    return default_name
