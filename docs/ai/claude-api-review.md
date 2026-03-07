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

## 적용한 개선사항

- REST API 구조 수정
- 데이터 정합성 규칙 정의
- HTTP 상태 코드 전략 정리
