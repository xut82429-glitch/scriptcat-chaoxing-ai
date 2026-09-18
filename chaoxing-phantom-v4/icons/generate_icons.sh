#!/bin/bash
# 生成简单的占位图标 (实际使用请替换为真实 PNG)

# 使用 ImageMagick 创建渐变图标
convert -size 128x128 xc:none \
  -fill '#667eea' -draw "circle 64,64 64,10" \
  -fill '#764ba2' -draw "circle 64,64 64,118" \
  -fill white -pointsize 60 -gravity center -annotate 0 "👻" \
  icon128.png

convert -size 48x48 xc:none \
  -fill '#667eea' -draw "circle 24,24 24,4" \
  -fill '#764ba2' -draw "circle 24,24 24,44" \
  -fill white -pointsize 24 -gravity center -annotate 0 "👻" \
  icon48.png

convert -size 16x16 xc:none \
  -fill '#667eea' -draw "circle 8,8 8,2" \
  -fill '#764ba2' -draw "circle 8,8 8,14" \
  icon16.png

echo "图标生成完成"
