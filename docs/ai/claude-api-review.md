# Claude API Review

TripDivide API 설계 초안에 대해 Claude에게 리뷰 요청

## Prompt

"Review this API specification for REST design, data consistency, and validation, edge case."

## Claude Feedback

1. Demo 라우팅 구조가 이중 리소스 계층이 될 수 있음
2. split 금액 합이 expense 총액과 일치해야 함
3. settlement 상태 전환 API 필요 가능성
4. split 응답 구조에서 participant id와 split id 혼동 가능
5. GET /trips/:tripId 응답에서 over-fetching 가능성

## Decisions & Changes

- REST API 구조 수정으로 리소스 접근 방식에 일관성 부여 (/demo/:demoKey)
- 데이터 정합성 규칙 정의 (Expense POST 시 split 총합이 amount와 일치하는지 서버 검증 로직 추가)
- settlement 상태 전환을 위한 PATCH API 설계
- Expense 응답 구조에서 splits[].participant 형태로 반환하여 participant 정보와 split 데이터를 명확히 구분
- GET /trips/:tripId 응답에서 Expenses[]를 제외하고, 상세 정보 조회 API로 분리해 over-fetching 제거

## Why

- Trip 리소스 접근 경로가 `/trips/:tripId`와 `/demo/:demoKey/trips/:tripId`로 혼재될 수 있었으나, demoKey를 tenant key로 정의하고 경로를 통일하여 API 사용성과 일관성을 개선
- settlement 결과는 원본 데이터의 파생 값으로 판단하여, 데이터 중복 저장 대신 조회 시 계산하도록 설계
- 상세 조회 API와 계산 결과 API를 분리함으로써 각 API의 책임을 명확히 분리
