### Backend 기술 스택 (루트 폴더에 /backend에 위치) 및 앱 실행.(node v16이상에서 실행가능)

- nestjs 9 (angular inspired express, fastify wrapper)
- typeORM, mysql
- passport , jwt (로그인 후 인증) -oauth2 방식
- bcrypt (패스워드 암호화)
- 파일 업로드는 /backend/upload_files/ 위치에 파일이 업로드 됨
- <span style="color:orange"> 실행: cd backend && yarn install && yarn start </span>

---

### localhost mysql 접속 정보 (실행전에 다음으로 접속이 가능해야됨) 

<pre><code>
&nbsp;&nbsp; type: 'mysql' <br/>
&nbsp;&nbsp; host: 'localhost'<br/>
&nbsp;&nbsp; port: 3306<br/>
&nbsp;&nbsp; username: "admin"<br/>
&nbsp;&nbsp; password: "1114"<br/>
&nbsp;&nbsp; database: 'test002'<br/>
</code></pre>
---

### Frontend 기술 스택 (루트 폴더에 위치) 및 앱 실행 (node v14 이상에서 가능)

- vue 3 ( Composition API 방식으로 코드 작성)
- mobx , mobx-lite-vue (글로벌 상태 관리 )
- antd , ant-design-vue ( ui design system )
- vite (build tools, fast!)
- <span style="color:orange">  아키텍쳐 (비지니스 로직(feature) 별로 관련된 view, service를 한 폴더에 모아 두는 방식으로 , Nestjs에서 쓰는 방식과 동일 그외 컴퍼넌트, 라우터, 에셋등  특색별로 다론 폴더에 분류하는 방식으로 구성.,) </span>
- <span style="color:orange"> 실행: 루트 폴더에서 yarn install && yarn start </span>

### 기능 구현

- 회원가입 및 로그인 기능 - <span style="color:orange"> 회원가입, 로그인후 jwt 토큰을 발급하여 인증하는 oauth2 방식으로 구현. 로그인후 관련 API 호출시 발급된 토큰으로 해더가
  인증되어야 호출 가능하도록 처리. </span>
- 파일 업로드 및 다운로드 기능 - <span style="color:orange"> 구현 </span>
- 파일 휴지통 및 완전 삭제 기능 - <span style="color:orange"> 구현 </span>
- 파일 및 폴더 공유 기능 - <span style="color:orange"> 구현 </span>
- 권한 관리 - <span style="color:orange"> 구현 </span>
- 용량 제한 기능 (용량 랜덤 또는 임의 부여) - <span style="color:orange"> 전체 파일 업로드 용량 20MB 제한 </span>








