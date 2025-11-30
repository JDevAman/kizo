import { paiseToRupees } from "@kinzoku/shared";

export const formatTransaction = (t: any, currentUserId: string) => {
  // 1. Identify IDs safely (Prisma uses 'fromUserId', not 'from._id')
  const fromId = t.fromUserId;
  const toId = t.toUserId;

  // 2. Determine Direction
  // Logic: If I am the sender, I sent money.
  // Note: For DEPOSIT, fromId is null, so it defaults to 'received'.
  const isSender = fromId === currentUserId;
  const direction = isSender ? "sent" : "received";

  // 3. Determine "Other Party" (The person you transacted with)
  let otherParty = null;

  if (t.type === "DEPOSIT") {
    // Deposits come from the Bank/System
    otherParty = {
      firstName: "Bank",
      lastName: "Deposit",
      userName: "system",
      avatar: null
    };
  } else if (isSender) {
    // I sent money -> Show the Receiver (toUser)
    if (t.toUser) {
      otherParty = {
        firstName: t.toUser.firstName,
        lastName: t.toUser.lastName,
        userName: t.toUser.userName,
        avatar: t.toUser.avatar || null
      };
    }
  } else {
    // I received money -> Show the Sender (fromUser)
    if (t.fromUser) {
      otherParty = {
        firstName: t.fromUser.firstName,
        lastName: t.fromUser.lastName,
        userName: t.fromUser.userName,
        avatar: t.fromUser.avatar || null
      };
    }
  }

  // 4. Return Data matching @kinzoku/shared 'TransactionData'
  return {
    id: t.id, // Prisma uses 'id', not '_id'
    amount: paiseToRupees(t.amount), // Convert Integer (Paisa) -> Float (Rupees)
    status: t.status,
    type: t.type,
    date: t.createdAt.toISOString(), // Convert Date object to String for JSON
    direction: direction,
    description: t.description || "",
    referenceId: t.referenceId || "",
    otherParty: otherParty,
    
    // Optional: Keep these if your frontend strictly needs them
    // initiatedById: t.initiatedById || null,
    // relatedTransactionId: t.relatedTxId || null
  };
};