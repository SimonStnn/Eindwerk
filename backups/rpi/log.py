"""Logging module"""
import logging
import colorlog
import sys
import traceback
import types

_LOGGING = logging.getLogger(__name__)

log_level = logging.INFO


def setup(system: sys):
    # Format for log messages
    log_format = "%(log_color)s[%(asctime)s] [%(threadName)s] [%(name)s] [%(levelname)s]: %(message)s%(reset)s"

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
