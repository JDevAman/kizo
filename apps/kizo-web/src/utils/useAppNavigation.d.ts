export declare function useAppNavigation(): {
    goToProfile: () => void | Promise<void>;
    goToSignIn: () => void | Promise<void>;
    goToSignUp: () => void | Promise<void>;
    goToForgotPassword: () => void | Promise<void>;
    goToDashboard: () => void | Promise<void>;
    goToPayment: () => void | Promise<void>;
    goToTransactions: () => void | Promise<void>;
    goToTransactionDetails: (id: string) => void | Promise<void>;
    goHome: () => void;
    logout: () => Promise<void>;
};
//# sourceMappingURL=useAppNavigation.d.ts.map