# Settlement test review

Codex CLI 정산 로직 엣지 케이스 리뷰

## Prompt

Write tests for lib/settlement.ts .
Focus on missing edge cases in settlement calculation, and add to lib/**tests**/settlement.test.ts .
Run the test suite using 'pnpm test', tell me what changed.

## Codex Feedback

1. settlement.test.ts에 ErrorCode를 import해 구체적인 에러 코드를 명시함
2. 채권자와 채무자가 각각 여러 명인 경우, 첫 번째 채권자의 `balance`가 0이 되면 다음 채권자를 탐색하지 않고 반복문이 종료되는 버그를 발견함

## API Validation Improvements

settlement.ts 정산 로직을 수정함

- `remaining == 0` 의 경우, 현재 채무자의 정산이 완료되었으므로 탐색 중단
- `creditor.balance === 0` 의 경우, 현재 채권자의 정산이 완료 되었으므로 다음 채권자로 이동

## Decisions & Changes

- Codex CLI가 제안한 테스트 보강과 버그 리포트를 검토한 뒤 수용함
- 여러 채무자와 여러 채권자가 있는 정산 케이스를 테스트로 추가함
- 채권자 탐색 루프에서 `break` 조건을 분리해 정산 누락 가능성을 수정함

## Why

- 채권자와 채무자가 여러 명인 경우에도 모든 정산 관계가 올바르게 매칭되도록 하기 위함.
