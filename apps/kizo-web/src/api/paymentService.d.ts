export interface PaymentPayload {
  recipient: string;
  amount: number;
  note?: string;
}
export declare const paymentService: {
  transferPayment(
    payload: PaymentPayload,
  ): Promise<import("axios").AxiosResponse<any, any, {}>>;
  depositMoney(
    amount: number,
  ): Promise<import("axios").AxiosResponse<any, any, {}>>;
  withdrawMoney(
    amount: number,
  ): Promise<import("axios").AxiosResponse<any, any, {}>>;
  getBalance(): Promise<any>;
};
//# sourceMappingURL=paymentService.d.ts.map
