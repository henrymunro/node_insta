#!/usr/bin/env bash
# https://developers.supportbee.com/blog/setting-up-cucumber-to-run-with-Chrome-on-Linux/
# https://gist.github.com/curtismcmullan/7be1a8c1c841a9d8db2c
# http://stackoverflow.com/questions/10792403/how-do-i-get-chrome-working-with-selenium-using-php-webdriver
# http://stackoverflow.com/questions/26133486/how-to-specify-binary-path-for-remote-chromedriver-in-codeception
# http://stackoverflow.com/questions/40262682/how-to-run-selenium-3-x-with-chrome-driver-through-terminal
# http://askubuntu.com/questions/760085/how-do-you-install-google-chrome-on-ubuntu-16-04

# Remove existing downloads and binaries so we can start from scratch.
rm ~/google-chrome-stable_current_amd64.deb
rm ~/selenium-server-standalone-3.0.1.jar
rm ~/chromedriver_linux64.zip
sudo rm /usr/local/bin/chromedriver
sudo rm /usr/local/share/chromedriver
sudo rm /usr/local/bin/selenium-server-standalone-3.0.1.jar
sudo rm /usr/local/share/selenium-server-standalone-3.0.1.jar

# Install dependencies.
sudo apt-get update
sudo apt-get install -y openjdk-8-jre-headless xvfb libxi6 libgconf-2-4

# Install Chrome.
wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/
sudo dpkg -i --force-depends ~/google-chrome-stable_current_amd64.deb
sudo apt-get -f install -y
sudo dpkg -i --force-depends ~/google-chrome-stable_current_amd64.deb

# Install ChromeDriver.
apt install unzip
wget -N http://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
rm ~/chromedriver_linux64.zip
sudo mv -f ~/chromedriver /usr/local/share/
sudo chmod +x /usr/local/share/chromedriver
sudo ln -s /usr/local/share/chromedriver /usr/local/bin/chromedriver

# Install Selenium.
wget -N http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar -P ~/
sudo mv -f ~/selenium-server-standalone-3.0.1.jar /usr/local/share/
sudo chmod +x /usr/local/share/selenium-server-standalone-3.0.1.jar
sudo ln -s /usr/local/share/selenium-server-standalone-3.0.1.jar /usr/local/bin/selenium-server-standalone-3.0.1.jar


## Work around for headless chrome not working untill version 2.31
# run X Frame Xvfb 
# https://gist.github.com/alonisser/11192482
sudo apt-get -y install xvfb gtk2-engines-pixbuf
sudo apt-get -y install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
# echo "Starting X virtual framebuffer (Xvfb) in background..."
Xvfb -ac :99 -screen 0 1280x1024x16 &
export DISPLAY=:99

## Check to see if Xvfb is already running 
# pidof /usr/bin/Xvfb
# sub in value found above to below $pids
# ps --format command --no-headers -ww --pid $pids

## RUN USING XVFB script
# put the contents of the gist as a file residing at /etc/init.d/xvfb
# you'll probably need to make it executable chmod +x /etc/init.d/xvfb
# and then you can start it with /etc/init.d/xvfb start
