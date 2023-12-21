# 이미지의 기반이 될 이미지 선택
FROM node:20.10.0

# 앱의 소스코드를 포함할 디렉토리 생성
WORKDIR /app

# package.json 파일을 복사한다. 만약 다시 빌드할 때 변경사항이 없을 경우 npm install까지 그냥 넘어간다.
COPY package.json /app


# 이미지를 받으면 npm install을 자동으로 해줌
RUN npm install

# 어떤 파일이 이미지에 들어가야 하는지 
# 첫 번째 .은 이 프로젝트의 모든 폴더 및 파일들 (Dockerfile을 제외한)
# 두 번째 .은 파일을 저장할 컨테이너 내부 경로 (ex /app)
COPY . /app

# 앱 빌드
RUN npm run build


# 포트 설정
EXPOSE 3001

# 프로그램 실행
CMD ["npm","run","preview"]