# 포트폴리오 리밸런서 (Portfolio Rebalancer)

정밀한 자산 배분과 포트폴리오 최적화를 위한 웹 애플리케이션입니다. 목표 비중을 설정하면 현재 자산 가치와 현금을 고려하여 최적의 매수/매도 수량을 계산.

## 주요 기능

*   **정밀한 리밸런싱**: 목표 비중과 현재가를 기반으로 정확한 매매 수량 계산
*   **리밸런싱 모드 지원**:
    *   **전체 재조정**: 매수/매도를 모두 포함하여 목표 비중 달성
    *   **매도 없음 (No Sell)**: 추가 매수만으로 비중 조절

## 실행 방법

### 설치
프로젝트를 클론하고 의존성을 설치합니다.

```bash
git clone https://github.com/iaruru/port-sync.git
cd port-sync
npm install
```

### 실행
개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

#### Docker로 실행

Docker가 설치되어 있다면 다음 명령어로 실행할 수 있습니다.

 **이미지 빌드**:

```bash
docker build -t rebalancing-app .
```

**컨테이너 실행**:

```bash
docker run -p 3000:3000 rebalancing-app
```

