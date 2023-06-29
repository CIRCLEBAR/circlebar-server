#!/bin/bash
# Compress Nodejs project files into a zip file

# Get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get the project name
PROJECT_NAME=$(basename $DIR)

# Compress the project
zip -r $PROJECT_NAME.zip . -x "*.git*" -x "*.DS_Store" -x "node_modules/*" -x "package-lock.json" -x "*.zip" -x "*.sh" -x "*.md" -x "*.log" -x "*.txt" -x "*.lock" -x "*.yml" -x "*.c" -x "*.h" -x "*.cpp" -x "*.hpp" -x "*.o" -x "*.a" -x "*.so" -x "*.dll" -x "*.exe" -x "*.bin" -x "*.png" -x "*.jpg" -x "*.jpeg" -x "*.gif" -x "*.bmp" -x "*.ico" -x "*.svg" -x "*.ttf" -x "*.woff" -x "*.woff2" -x "*.eot" -x "*.mp3" -x "*.mp4" -x "*.avi" -x "*.mkv" -x "*.flv" -x "*.swf" -x "*.zip" -x "*.rar" -x "*.7z" -x "*.gz" -x "*.tar" -x "*.bz2" -x "*.xz" -x "*.pdf" -x "*.doc" -x "*.docx" -x "*.xls" -x "*.xlsx" -x "*.ppt" -x "*.pptx" -x "*.exe" -x "*.msi" -x "*.ipa" -x "*.apk" -x "*.dmg" -x "*.pkg" -x "*.deb" -x "*.rpm" -x "*.jar" -x "*.war" -x "*.ear" -x "*.class" -x "*.pyc" -x "*.pyo" -x "*.o" -x "*.a" -x "*.so" -x "*.dll" -x "*.exe" -x "*.bin" -x "*.app" -x "*.ipa" -x "*.apk" -x "*.dmg" -x "*.pkg" -x "*.deb" -x "*.rpm" -x "*.jar" -x "*.war" -x "*.ear" -x "*.class" -x "*.pyc" -x "*.pyo" -x "*.o" -x "*.a" -x "*.so" -x "*.dll" -x "*.exe" -x "*.bin" -x "*.app" -x "*.ipa" -x "*.apk" -x "*.dmg" -x "*.pkg" -x "*.deb" -x "*.rpm" -x "*.jar" -x "*.war" -x "*.ear" -x "*.class" -x "*.pyc" -x "*.pyo" -x "*.o" -x "*.a" -x "*.so"
