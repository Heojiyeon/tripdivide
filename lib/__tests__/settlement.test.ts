import { calculateSettlement } from "../settlement";
import { ErrorCode, SettlementExpense } from "../../types/api";

describe("calculateSettlement", () => {
  // 기본 케이스
  describe("기본 정산", () => {
    it("2명, 한 명이 전액 결제 → 나머지 한 명이 절반 송금", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
      ];
      const expenses = [
        {
          amount: 50000,
          paidById: "p1",
          splits: [
            { participantId: "p1", shareAmount: 25000 },
            { participantId: "p2", shareAmount: 25000 },
          ],
        },
      ];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(50000);
      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toEqual({ from: "승우", to: "지연", amount: 25000 });
    });

    it("3명, 한 명이 전액 결제 → 나머지 2명이 각각 송금", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
        { id: "p3", name: "루이" },
      ];
      const expenses = [
        {
          amount: 30000,
          paidById: "p1",
          splits: [
            { participantId: "p1", shareAmount: 10000 },
            { participantId: "p2", shareAmount: 10000 },
            { participantId: "p3", shareAmount: 10000 },
          ],
        },
      ];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(30000);
      expect(transactions).toHaveLength(2);
      expect(transactions[0].amount).toBe(10000);
      expect(transactions[1].amount).toBe(10000);
    });
  });

  // 엣지 케이스
  describe("엣지 케이스", () => {
    it("expenses가 없으면 transactions는 빈 배열", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
      ];

      const expenses = [] as SettlementExpense[];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(0);
      expect(transactions).toHaveLength(0);
    });

    it("모든 지출을 각자 부담하면 transactions는 빈 배열", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
      ];
      const expenses = [
        {
          amount: 20000,
          paidById: "p1",
          splits: [{ participantId: "p1", shareAmount: 20000 }],
        },
        {
          amount: 20000,
          paidById: "p2",
          splits: [{ participantId: "p2", shareAmount: 20000 }],
        },
      ];

      const { transactions } = calculateSettlement({ participants, expenses });

      expect(transactions).toHaveLength(0);
    });

    it("여러 지출이 있을 때 최소 송금으로 정산", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우 " },
        { id: "p3", name: "루이" },
      ];
      const expenses = [
        {
          amount: 30000,
          paidById: "p1",
          splits: [
            { participantId: "p1", shareAmount: 10000 },
            { participantId: "p2", shareAmount: 10000 },
            { participantId: "p3", shareAmount: 10000 },
          ],
        },
        {
          amount: 30000,
          paidById: "p2",
          splits: [
            { participantId: "p1", shareAmount: 10000 },
            { participantId: "p2", shareAmount: 10000 },
            { participantId: "p3", shareAmount: 10000 },
          ],
        },
      ];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(60000);
      // p1: 낸돈 30000, 써야할돈 20000 → +10000
      // p2: 낸돈 30000, 써야할돈 20000 → +10000
      // p3: 낸돈 0, 써야할돈 20000 → -20000
      expect(transactions).toHaveLength(2);
    });

    it("균등 분배 시 나머지 원 처리 (10000 / 3)", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
        { id: "p3", name: "루이" },
      ];
      const expenses = [
        {
          amount: 10000,
          paidById: "p1",
          splits: [
            { participantId: "p1", shareAmount: 3334 },
            { participantId: "p2", shareAmount: 3333 },
            { participantId: "p3", shareAmount: 3333 },
          ],
        },
      ];

      const { totalAmount } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(10000);
    });

    it("존재하지 않는 participantId가 paidById로 들어오면 에러", () => {
      const participants = [{ id: "p1", name: "지연" }];
      const expenses = [
        {
          amount: 10000,
          paidById: "unknown",
          splits: [{ participantId: "p1", shareAmount: 10000 }],
        },
      ];

      expect(() => calculateSettlement({ participants, expenses })).toThrow(
        ErrorCode.PARTICIPANT_NOT_FOUND,
      );
    });

    it("splits에 존재하지 않는 participantId가 들어오면 에러", () => {
      const participants = [{ id: "p1", name: "지연" }];
      const expenses = [
        {
          amount: 10000,
          paidById: "p1",
          splits: [{ participantId: "unknown", shareAmount: 10000 }],
        },
      ];

      expect(() => calculateSettlement({ participants, expenses })).toThrow(
        ErrorCode.PARTICIPANT_NOT_FOUND,
      );
    });

    it("결제자가 splits에 없어도 결제 금액과 분담 금액 기준으로 정산", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
        { id: "p3", name: "루이" },
      ];
      const expenses = [
        {
          amount: 30000,
          paidById: "p1",
          splits: [
            { participantId: "p2", shareAmount: 15000 },
            { participantId: "p3", shareAmount: 15000 },
          ],
        },
      ];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(30000);
      expect(transactions).toEqual([
        { from: "승우", to: "지연", amount: 15000 },
        { from: "루이", to: "지연", amount: 15000 },
      ]);
    });

    it("0원 분담자는 거래를 만들지 않는다", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
        { id: "p3", name: "루이" },
      ];
      const expenses = [
        {
          amount: 20000,
          paidById: "p1",
          splits: [
            { participantId: "p1", shareAmount: 0 },
            { participantId: "p2", shareAmount: 20000 },
            { participantId: "p3", shareAmount: 0 },
          ],
        },
      ];

      const { transactions } = calculateSettlement({ participants, expenses });

      expect(transactions).toEqual([{ from: "승우", to: "지연", amount: 20000 }]);
    });

    it("여러 채무자와 채권자를 입력 순서대로 최소 거래로 매칭", () => {
      const participants = [
        { id: "p1", name: "지연" },
        { id: "p2", name: "승우" },
        { id: "p3", name: "루이" },
        { id: "p4", name: "민지" },
      ];
      const expenses = [
        {
          amount: 50000,
          paidById: "p1",
          splits: [{ participantId: "p3", shareAmount: 50000 }],
        },
        {
          amount: 30000,
          paidById: "p2",
          splits: [{ participantId: "p4", shareAmount: 30000 }],
        },
        {
          amount: 10000,
          paidById: "p3",
          splits: [{ participantId: "p1", shareAmount: 10000 }],
        },
        {
          amount: 10000,
          paidById: "p4",
          splits: [{ participantId: "p2", shareAmount: 10000 }],
        },
      ];

      const { totalAmount, transactions } = calculateSettlement({ participants, expenses });

      expect(totalAmount).toBe(100000);
      expect(transactions).toEqual([
        { from: "루이", to: "지연", amount: 40000 },
        { from: "민지", to: "승우", amount: 20000 },
      ]);
    });
  });
});
