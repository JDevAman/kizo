export const formatTransaction = (t: any, currentUserId: string) => {
  const fromId = t.fromUserId;
  const toId = t.toUserId;

  // Direction: sender -> sent, otherwise received
  const isSender = fromId === currentUserId;

  let otherParty = null;

  if (t.type === "DEPOSIT") {
    otherParty = {
      firstName: "Bank",
      lastName: "Deposit",
      userName: "system",
      avatar: null,
    };
  } else if (isSender && t.toUser) {
    otherParty = {
      firstName: t.toUser.firstName,
      lastName: t.toUser.lastName,
      userName: t.toUser.userName,
      avatar: t.toUser.avatar || null,
    };
  } else if (!isSender && t.fromUser) {
    otherParty = {
      firstName: t.fromUser.firstName,
      lastName: t.fromUser.lastName,
      userName: t.fromUser.userName,
      avatar: t.fromUser.avatar || null,
    };
  }

  return {
    id: t.id,
    amount: Number(t.amount), // bigint → number
    status: t.status,
    type: t.type,
    date: t.createdAt.toISOString(),
    description: t.description ?? "",
    referenceId: t.referenceId ?? "",
    otherParty,
  };
};
