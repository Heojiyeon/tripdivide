# 🛫 TripDivide (여행 정산 엔진)

> **"여행에서 발생한 지출을 입력하면, 참여자 분배와 최소 송금 관계를 계산해주는 정산 엔진"**  
> 데이터 모델링과 리소스 중심 API 설계를 통해 여행 정산 도메인을 구현한 프로젝트

---

## 🔗 Project Links

- **Live Demo**: [tripdivide.vercel.app](https://tripdivide.vercel.app/)
- **Tech Stack**: Next.js (App Router), Prisma, PostgreSQL (Supabase), Tailwind CSS

---

## 🎯 프로젝트 핵심 목표

1. **도메인 중심 사고**: UI 중심 사고에서 벗어나, 비즈니스 규칙(정산)을 뒷받침하는 데이터 구조를 직접 설계
2. **리소스 중심 API**: 확장성 있고 예측 가능한 RESTful API 인터페이스 구축
3. **효율적인 정산 알고리즘**: 참여자 간 송금 횟수를 최소화하는 '최소 송금 관계' 엔진 구현

---

## 🛠 설계 및 아키텍처 (Key Highlights)

### 1. 데이터 모델링 (ERD)

- **Problem**: 지출(Expense)과 참여자(Participant) 간의 다대다 관계 처리 및 결제 주체 명시
- **Solution**: `Trip` - `Participant` - `Expense` 간의 관계를 정규화하고, 각 지출마다 결제자와 정산 참여자를 분리하여 데이터 무결성 확보
- **Key Insight**: 지출과 참여자 사이의 N:N 관계를 단순 연결이 아닌 "분담 금액이 포함된 관계"로 모델링, 이를 위해 ExpenseSplit을 별도 엔티티로 분리

### 2. API 설계 리팩토링: 동사 중심에서 리소스 중심으로

기존의 기능 위주 엔드포인트를 리소스(Resource) 체계로 재설계하여 유지보수성과 가독성 향상

| 구분          | 비포 (Action-based) | 애프터 (Resource-based)     |
| ------------- | ------------------- | --------------------------- |
| **여행 생성** | `POST /addTrip`     | `POST /trips`               |
| **지출 추가** | `POST /addExpense`  | `POST /trips/:id/expenses`  |
| **정산 결과** | `GET /getResult`    | `GET /trips/:id/settlement` |

### 3. 기술적 트레이드오프 & 트러블슈팅

#### 🔹 페이로드 최적화: 요약 정보와 상세 정보의 분리

- **현상**: 여행 목록 조회 시 모든 지출과 참여자 데이터를 한 번에 포함하여 응답 페이로드가 과도하게 커지는 문제 발생
- **결정**: 메인 리스트용 요약 정보 API와 개별 상세 페이지용 API를 분리해 초기 로딩 속도를 개선하고 불필요한 네트워크 비용을 절감

#### 🔹 Prisma 에러 핸들링 및 상태 코드 세분화

- **현상**: Prisma 에러 발생 시 일괄적으로 500 에러가 반환되어 클라이언트에서 원인 파악이 불분명
- **결정**: Next.js API Route에서 에러 타입을 인터셉트하여 400(Invalid Request), 404(Not Found) 등 표준 HTTP 상태 코드로 세분화하여 클라이언트의 대응 로직 강화

---

## 💡 AI 협업 및 보조 도구 활용

- **설계 검토**: DB 스키마 초안과 API Request / Response 구조에 대한 피드백 보조
- **로직 검증**: 정산 알고리즘 테스트 케이스 초안 생성 및 엣지 케이스 점검에 활용
- **품질 관리**: 릴리즈 준비 상태 리뷰(Release Readiness Review)를 통한 API 에러 핸들링 및 예외 상황(Edge Case) 식별
- **코드 안정성 확보**: 타입 일관성 검토 및 비즈니스 로직 유효성 검사 누락 지점 보완

---

## 🚀 주요 기능

- **여행 그룹 생성**: 고유 키(Demo Key) 기반의 독립적인 여행 세션 관리
- **유연한 지출 입력**: 결제자와 참여자를 각각 설정하여 복잡한 N분의 1 상황 대응
- **정산 결과 계산**: 참여자별 부담 금액과 최소 송금 관계 계산

---

## ⚙️ 실행 방법

1. 패키지 설치

```bash
pnpm install
```

2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 설정합니다.

```env
DATABASE_URL=your_database_url
```

3. 개발 서버 실행

```bash
pnpm dev
```

4. 브라우저에서 확인

- [http://localhost:3000](http://localhost:3000)
