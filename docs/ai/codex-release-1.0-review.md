# Release 1.0 AI Review

TripDivide 1.0 릴리즈 전 실제 코드 흐름 기준으로 AI에게 리뷰 요청

## Prompt

Review the current TripDivide project code for release 1.0 readiness.

Focus on:

- user flow stability
- API error handling
- modal/share link behavior
- release blockers vs post-release improvements
- type consistency between API responses and client usage

## Codex Feedback

1. 여행 상세 페이지에서 `404` 외 API 실패 시 `result.data`를 바로 접근하여 렌더 에러가 발생할 수 있음
2. 지출 상세 조회 실패 시 토스트 표시 후 early return 없이 `result.data`를 계속 접근할 수 있음
3. 정산 상태 변경 실패 시에도 `router.refresh()`가 실행되어 실패 UX가 애매할 수 있음
4. `ApiErrorResponse` 타입과 실제 `apiError()` 응답 구조가 불일치함
5. `@modal/settlement/page.tsx`와 `settlement/page.tsx`는 라우트 목적이 다르므로 유지하되, 추후 정산 결과 UI 본문은 공통 컴포넌트로 분리 가능
6. `settlement` API의 `SETTLEMENT_NOT_FOUND`는 실제로 trip 조회 실패를 의미하고 있어, 릴리즈 이후 에러 코드 의미를 더 명확히 정리할 수 있음

## API Validation Improvements

릴리즈 전 API 보완 과정에서 다음 검증을 추가하거나 강화함

- `demoKey`가 필요한 API에서 `DemoSession` 존재 여부를 검증하여 유효하지 않은 접근을 차단
- 여행 생성 전 `demoKey` 유효성 검증 추가
- 참여자 생성 전 대상 trip 존재 여부와 `SETTLED` 상태 여부 검증
- trip 상태 변경 전 대상 trip 존재 여부 검증
- 지출 생성 시 `title` 빈 값, `amount <= 0`, `NaN` 등 잘못된 입력 차단
- 지출 생성 시 `paidById`가 현재 trip 소속 participant인지 검증
- 지출 생성 시 `splits.participantId`가 현재 trip 소속 participant인지 일괄 검증
- 지출 생성 시 split 금액 합계와 지출 총액이 일치하는지 검증
- `SETTLED` 상태의 trip에는 지출/참여자 추가를 차단

## Decisions & Changes

- 실패 후 `return` 처리와 에러 타입 공통화를 우선 수정하기로 결정
- API 보완은 클라이언트 입력을 신뢰하지 않고, 서버에서 리소스 존재 여부와 소속 문맥을 다시 검증하는 방향으로 진행
- `demoKey` 단위 API는 `DemoSession` 검증을 기준으로 삼고, trip 단위 API는 `demoKey + tripId` 문맥 검증을 유지
- 정산 결과 모달과 공유 링크 페이지는 서로 다른 진입 목적이 있으므로 라우트 분리를 유지
- 공유 링크로 직접 진입한 정산 결과 페이지는 닫기 시 홈으로 이동하도록 유지
- 내부 모달과 공유 링크 페이지의 중복 UI는 릴리즈 이후 공통 컴포넌트로 분리 검토

## Why

- 실패 시 화면이 깨지지 않는 안정성 강화가 필요하다고 판단
- `notFound`, fallback UI, redirect는 실패 원인에 따라 구분되어야 하며, 모든 실패를 404 화면으로 보내면 사용자 경험이 부정확해질 수 있음
- 정산 결과 공유 링크는 외부 사용자도 접근할 수 있으므로, 상세 여행 정보로 이동시키지 않는 것이 더 안전하다고 판단
- 중복 라우트는 의도된 설계지만, 동일한 정산 결과 UI를 두 파일에서 유지하면 이후 수정 누락 위험이 있어 추후 공통화 대상으로 분류
- API는 프론트엔드 우회 요청에도 데이터 무결성을 지켜야 하므로, trip/participant/split의 소속 문맥 검증을 서버에서 책임지는 것이 적절하다고 판단

