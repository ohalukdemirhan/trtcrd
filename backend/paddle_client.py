# Import and re-export PaddleClient from the paddle.paddle module
from paddle.paddle import PaddleClient

# This is a bridge file that exposes PaddleClient from paddle.paddle 
# which is imported as paddle_client in the application code

__all__ = ['PaddleClient'] 