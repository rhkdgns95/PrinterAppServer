# Install
1. yarn add graphql-yoga graphql
2. yarn add ts-node nodemon 
3. yarn add cors @types/cors
4. yarn add babel-cli --dev
* babel참고 https://gompro.postype.com/post/1699968 
5. yarn add @babel/core @babel/node @babel/preset-env --dev
6. yarn add helmet morgan cors
7. yarn add @types/cors @types/helmet @types/morgan --dev
8. yarn add steno
9. yarn add pify object-hash nodemailer lowdb lodash is-promise graceful-fs 
10. yarn add image-data-uri

# API
- [X] AppOptions
- [X] AppStart
- [ ] execute

# TIP
- GhostScript 참고
: https://stackoverflow.com/questions/21624741/gpl-ghostscript-9-10-could-not-open-temporary-file-unable-to-open
- local file preview
: 로컬이미지를 프론트에서 보여줄때, 보안상 브라우저애서 로컬영역으로 접근이 불가능하다. 이런점으로 yarn add image-data-uri를 설치하여 로컬 이미지 경로를 encoding방식으로 변경시켜서 접근할 수 있도록 해준다.

# ETC
- 실행: $ yarn dev 

# Execute
- Server에서 프린트 미들웨어 서버를 열어둔다. PORT: 9100으로
- 문서요청(인쇄)을 하면, 다음 2가지의 방법으로 나뉜다.

1. 파일을 웹 서버에 저장
: 요청된 문서를 웹서버에 저장한다음 클라이언트는 해당 웹서버에서 파일들을 가져올수있다.
(서버가 종료되도 파일은 존재하며, 사용자가 원하는 파일을 가져올수있으며, 이러한 방식일경우, Client측에서 파일을 따로 저장/삭제 관리에 용이하다.) => 클라이언트에게 파일관리성이 유연함.

2. 파일을 Graphql 서버 객체(new App().app)의 Context값으로 저장시켜서 관리한다.
: 파일을 메모리상에서 관리한다. 이것은 클라이언트에게 서버 객체의 Context값의 정보를 전달해준다.
(서버가 종료된다면, 메모리상에서도 저장된 파일을 가지고있지 않는다.) => 서버측에서 파일관리를 메모리상에서 진행하므로, 클라이언트는 해당 파일을 TCP통신요청으로만 저장할 수 있게 된다.

3. Graphql의 Mutation Args
: Mutation의 인자로는 항상 기본 scalar type을 갖도록 해야한다.


## Todo
1. client에서 setHeader({})로 localStorage의 값을 Graphql의 Context로 받을수 있도록한다. => 확인
2. server에서는 해당 Grouping의 ID를 가지고와서 몇번째값인지 확인 하도록 한다. OR 배열의 index가아니라, grouping Name으로 확인이 가능하다.
3. 2번을 마치고 실행 StartForGrouping을 완성시킨뒤, Client에게 Return되는 데이터를 작성한다.


