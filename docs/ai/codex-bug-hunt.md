# Codex User Scenario Bug Hunt

## Prompt

Act as bug hunter for this project.\
Read the settlement flow, expense creation flow, and trip settlement flow.\
Find realistic bugs that a user could trigger.\
Do not edit files. Give me the top 5 with reproduction steps.

---

Review these 5 bug candidates.\
For each one, check whether it is actually reproducible in the current codebase.\
Do not edit files.\
Classify each as Confirmed, Likely, Unclear, or False Positive.\
Include the exact files and code paths involved.

## Findings

| No  | Bug Candidate                                                                              | Reproduction Summary                                                                                                                                                     | Status    |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| 1   | 정산이 확정되지 않은 여행이어도 url에 직접 접근해 정산 결과를 확인할 수 있음               | 정산 완료인 경우, 정산 확정 버튼이 사라지지만 정산 결과 페이지나 API는 해당 상태를 강제하지 않음                                                                         | Confirmed |
| 2   | 참여자의 이름이 중복되는 경우, 정산 결과가 모호해짐                                        | 참여자 정보는 고유성 검증이 이루어지지 않은 채 저장되며, 정산 결과 조회 시 참여자 이름만 반환                                                                            | Confirmed |
| 3   | 지출 추가 버튼을 빠르게 반복 클릭 하는 경우, 지출이 중복으로 생성됨                        | 폼 제출 클릭 시 로딩 처리가 되지만, handleSubmit 함수에 중복 방지 로직이 없고 서버에 멱등성 제거 기능이 없음                                                             | Unclear   |
| 4   | API는 소수점 금액을 막지 않는데, DB는 정수만 받도록 되어 있어서 서버 내부에서 터질 수 있음 | prisma 내에서 타입 불일치 문제로 DB 내에서 에러가 발생해 400 에러가 아닌, 500 에러를 반환                                                                                | Confirmed |
| 5   | 중복된 정산 참여자 ID 요청이 DB 제약 조건 에러로 이어질 수 있음                            | `splits`에 동일한 `participantId`가 두 번 포함된 요청을 보내는 경우, 참여자 존재 여부와 금액 합계 검증은 통과하나 제약 조건 때문에 Prisma create 단계에서 실패할 수 있음 | Confirmed |
