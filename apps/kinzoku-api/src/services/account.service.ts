import { accountRepository } from "../repositories/account.repository";
import { userRepository } from "../repositories/user.repository";
import { 
  P2pTransferInput, 
  AddMoneyInput, 
  CreateRequestInput 
} from "@kinzoku/shared";

export class AccountService {

  async getBalance(userId: string) {
    const account = await accountRepository.getAccount(userId);
    if (!account) throw new Error("Account not found");
    return { balance: account.balance / 100 }; // Convert Paise -> Rupees
  }

  async addMoney(userId: string, payload: AddMoneyInput) {
    return await accountRepository.deposit(userId, payload.amount, payload.provider);
  }

  async transferMoney(fromUserId: string, payload: P2pTransferInput) {
    const { recipient, amount, note } = payload;

    // Resolve Email -> UUID
    const toUser = await userRepository.findByEmail(recipient);
    if (!toUser) throw new Error("Recipient not found");
    if (toUser.status !== "ACTIVE") throw new Error("Recipient account is suspended");
    if (toUser.id === fromUserId) throw new Error("Cannot transfer to yourself");

    return await accountRepository.transfer(fromUserId, toUser.id, amount, note);
  }

  // --- REQUESTS ---

  async createRequest(requesterId: string, payload: CreateRequestInput) {
    const { recipient, amount, note } = payload;
    
    const payer = await userRepository.findByEmail(recipient);
    if (!payer) throw new Error("Recipient not found");
    if (payer.id === requesterId) throw new Error("Cannot request money from yourself");

    return await accountRepository.createRequest(requesterId, payer.id, amount, note);
  }

  async acceptRequest(payerId: string, requestId: string) {
    const request = await accountRepository.getRequestById(requestId);
    
    if (!request) throw new Error("Request not found");
    if (request.payerId !== payerId) throw new Error("Unauthorized to accept this request");
    if (request.status !== RequestStatus.PENDING) throw new Error("Request already processed");

    // Execute the Transfer (Payer -> Requester)
    // Note: 'transfer' automatically updates the Request status to ACCEPTED
    return await accountRepository.transfer(
      payerId, 
      request.requesterId, 
      request.amount, 
      "Request Accepted", 
      requestId
    );
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await accountRepository.getRequestById(requestId);
    if (!request) throw new Error("Request not found");
    
    // Only the payer can reject (or maybe the requester can cancel?)
    if (request.payerId !== userId && request.requesterId !== userId) {
      throw new Error("Unauthorized");
    }
    
    if (request.status !== RequestStatus.PENDING) throw new Error("Request already processed");

    const newStatus = request.payerId === userId ? RequestStatus.REJECTED : RequestStatus.EXPIRED; // or Cancelled
    return await accountRepository.updateRequestStatus(requestId, newStatus);
  }

  async getRequests(userId: string) {
    return await accountRepository.getUserRequests(userId);
  }
}

export const accountService = new AccountService();