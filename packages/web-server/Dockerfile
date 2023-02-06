########################################################################
#                stage-0 : node 소스코드 빌드                           #
########################################################################
FROM node:16.14.2

# 이미지 내에서 명령어를 실행할 디렉토리 설정
WORKDIR /usr/src/app

COPY . .

# 빌드 
RUN yarn run web-build

########################################################################
#             stage-1 : 빌드된 어플리케이션 nginx로 제공                 #
########################################################################
FROM nginx:1.21.6-alpine

# state:0에서 빌드된 파일을 /var/www/http 로 가져오는 법
COPY --from=0 /usr/src/app/packages/web-server/build /var/www/http
# nginx 설정파일 가져옴
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g",  "daemon off;"]