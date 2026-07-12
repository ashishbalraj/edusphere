import os
import base64

ico_data = b'AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='

os.makedirs('static', exist_ok=True)
with open('static/favicon.ico', 'wb') as f:
    f.write(base64.b64decode(ico_data))
print("Favicon created at static/favicon.ico")
