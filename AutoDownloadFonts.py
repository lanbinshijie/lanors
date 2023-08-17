import os
import re
import requests

# 打开css文件，获取所有的font链接
filepath = "css/lanors.css"
with open(filepath, "r") as f:
    css_content = f.read()

# 使用正则表达式匹配所有以/assets/开头的链接
font_links = re.findall(r"url\((/assets/.*?)\)", css_content)

# 下载字体文件到本地的assets文件夹
base_url = "https://onebot.dev"
assets_folder = "assets"

if not os.path.exists(assets_folder):
    os.makedirs(assets_folder)

for link in font_links:
    url = base_url + link
    filename = link.split("/")[-1]
    filepath = os.path.join(assets_folder, filename)
    
    response = requests.get(url)
    with open(filepath, "wb") as f:
        f.write(response.content)
        
    print(f"下载 {filename} 完成.")
