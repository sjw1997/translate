scp index.html springboot:/home/acs/translate-web/
scp -r ./static springboot:/home/acs/translate-web/
ssh springboot "cd ~/translate-web && ./run.sh"