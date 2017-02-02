/**
 * Created by user on 2017. 2. 2..
 */


/*
[node]
Chrome V8 엔진으로 빌드된 Javascript 런타임
Event Driven, Non Blocking I/O 방식

2017.2.2 기준 v6.9.5 최신, 현재 v.4.4.5에서 테스트
releases표시 방식은 v메이저.마이너.패치

메이저 : 하위 호환성 깨질 위험
마이너 : API나 서브 시스템 추가 및 개선. 크리티컬한 이슈가 아니면 호환성 유지
패치 : 버그, 성능, 보안 개선

현재 V8 버전 확인
node -p process.versions.v8

API를 확인해보니 암호화, DNS, HTTP, File System 등 다양한 API가 제공됨
*/

/*
[ES6]
http://node.green/ 에서 ES6 호환성 확인 가능
메이저 v6 이상은 대부분의 ES6 문법을 지원하는 것으로 보임(예외 있음)
*/

/*
[npm]
npm install을 할 경우 --save 옵션을 주면 package.json에 의존성이 자동 등록됨
npm install polymer와 bower install polymer의 결과가 다르게 나옴
bower의 경우 webcompnent polyfill과 polymer lib의 조합. 프론트엔드 전용 라이브러리가 나옴
npm의 경우 'Pre-processor system for automatic template compiling.' 라는게 나옴
몰랐는데 관리하는 개념이 다른게 아니라 저장소도 완전 다르다(당연한건데..)
jQuery의 경우 같은 방식으로 설치했는데 두 패키지 관리자 모두 동일한 jQuery가 있었음
*/

//대신 node js에서는 전역변수를 global으로 접근
//Browser 환경이 아니므로 window(BOM), document(DOM) 객체가 존재하지 않음
console.log(typeof global, typeof window, typeof document);

//console에서 info, warn, assert 등 브라우저에서와 동일하게 사용가능
//warn과 같은 경우 prompt에 붉은 색 표시
console.info("console.info");
console.warn("console.warn");

