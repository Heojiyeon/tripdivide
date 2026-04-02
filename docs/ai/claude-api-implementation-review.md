# Claude API Implementation Review

개발된 TripDivide API 대해 Claude에게 리뷰 요청

## Prompt

Review the following API implementation for:

- data validation robustness
- edge cases
- transaction safety
- REST consistency
- potential bugs

## Claude Feedback

1. `POST /expenses`, `POST /participants`의 경우, SETTLED 상태 여행에 지출/참여자 추가 방어 누락
2. `paidById` 및 `splits.participantId`가 해당 trip의 실제 참여자인지 검증 누락
3. 에러 코드/상태 코드 불일치 (`400` vs `404`, `TRIP_NOT_FOUND` vs `EXPENSE_NOT_FOUND`)

## Decisions & Changes

- 데이터 무결성을 위해 SETTLED 상태 여행에 대해 지출/참여자 추가를 차단하는 방어 로직 추가
- `paidById` 및 `splits.participantId`가 해당 trip의 유효한 participant인지 서버에서 검증
- 에러 코드와 상태 코드를 상황에 맞게 세분화하고, 리소스별 에러 네이밍을 일관되게 정리

## Why

- 정산 완료 이후에도 원본 데이터가 수정되면 settlement 결과와 실제 데이터 간 불일치가 발생할 수 있어, 상태 기반 수정 방어가 필요하다고 판단
- Expense 입력은 클라이언트에서 한 차례 검증하더라도, 서버에서 participant 유효성까지 확인해야 데이터 신뢰성을 보장할 수 있다고 판단
- 에러 코드와 상태 코드가 일관되지 않으면 클라이언트 분기 처리와 디버깅이 어려워지므로, API 응답 규칙을 명확히 유지할 필요가 있다고 판단
