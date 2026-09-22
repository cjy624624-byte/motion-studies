# Noomo Showcase · Three.js recreation

참고: https://showcase.noomoagency.com/

## 실행

`시작.cmd`를 실행하고 표시되는 localhost 주소를 엽니다.

Node.js와 npm이 있는 환경에서는:

```sh
npm install
npm run dev
npm run build
npm run preview
```

현재 환경에서는 아래 명령으로도 실행할 수 있습니다.

```sh
node node_modules/vite/bin/vite.js --configLoader native --host 127.0.0.1
```

## 구현

- Three.js WebGLRenderer, GLTFLoader, Draco 압축 모델
- 원본 공개 타이포그래피·로고·프로젝트 3D 모델, 폰트와 9개 영상
- 반사·굴절 로고, 입체 영상 크리스털, 우주 입자와 절차적 배경
- 색수차와 필름 그레인 후처리
- 스크롤 프로젝트 전환, 마우스 반응, 선택형 배경 음악
- 모바일 레이아웃 및 reduced-motion 대응

`src/main.js`에서 장면과 프로젝트 정보를, `src/style.css`에서 UI를 수정합니다.

## 확인 결과

프로덕션 빌드 통과. 데스크톱과 390×844 모바일에서 첫 화면, 시작 버튼, 프로젝트 영상/정보 전환, 사운드 토글 확인. 브라우저 콘솔 오류 없음.

원본의 공개 리소스를 활용한 독립적인 재구현입니다. 원본의 커스텀 셰이더·물리 시뮬레이션·카메라 타임라인을 그대로 복제한 것은 아니므로 굴절, 파편 움직임, 전환 연출에는 차이가 있습니다. 공개 배포 시 원본 브랜드와 리소스의 사용 권한을 확인하세요.

## 분위기·배치 변경

사용자 요청에 따라 3D/스크롤 구조는 유지하고 코퍼·아이보리 색상, 좌우 분할 첫 화면, 금속성 궤도 조형물, 프로젝트 좌측 설명 레이아웃으로 변경했습니다. 프로젝트 정보·영상·원본 링크는 유지합니다. 변경 전 소스는 `backups/original-recreation/`에 보관했습니다.

## Cloudflare 배포

Cloudflare Pages 직접 업로드용 설정을 `wrangler.jsonc`에 추가했습니다.

```sh
npx wrangler login
npm run deploy
```

첫 배포 전 `npx wrangler pages project create motion-studies --production-branch main`으로 프로젝트를 생성합니다. 직접 업로드 방식이며 GitHub push만으로 자동 배포되지는 않습니다. Cloudflare 인증 정보는 저장소에 포함하지 않습니다.
