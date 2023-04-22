"""Logging module"""
import logging
import colorlog
import sys
import types

_LOGGING = logging.getLogger(__name__)

log_level = logging.DEBUG


def setup(system: sys):
    # Format for log messages
    log_format = "%(log_color)s[%(asctime)s] [%(threadName)s] [%(name)s] [%(levelname)s]: %(message)s%(reset)s"
    
    # logging.getLogger("__main__").setLevel(logging.DEBUG)
    # logging.getLogger("websockets.server").setLevel(logging.DEBUG)
    # logging.getLogger("discover").setLevel(logging.DEBUG)
    # logging.getLogger("display").setLevel(logging.DEBUG)

    # Set up logging with colorlog
    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(
        log_format,
        log_colors={
            'DEBUG': 'blue',
            'INFO': 'green',
            'WARNING': 'yellow',
            'WARN': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red,bg_white,bold',
        },
    ))

    def exception_handler(exc_type: type, exc_value: BaseException, exc_traceback: types.TracebackType):
        # Log the error information using the logging module
        logging.error(f"Uncaught exception",
                      exc_info=(exc_type, exc_value, exc_traceback))

    # Set the custom exception handler using sys.excepthook
    system.excepthook = exception_handler

    # Configure logging to use the colorlog handler
    logging.basicConfig(level=log_level, handlers=[handler])


def set_level(name: str, level):
    logger = logging.getLogger(name)
    logger.setLevel(level)


def getloggers() -> dict:
    # Dictionary to store logger names and debug logging status
    logger_dict = {}

    # Iterate over all loggers and check if debug logging is enabled
    for logger_name in sorted(logging.Logger.manager.loggerDict):
        logger = logging.getLogger(logger_name)
        logger_dict[logger_name] = logger.getEffectiveLevel() == logging.DEBUG
    return logger_dict
