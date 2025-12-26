export const listTransactionDTO = (t: any, currentUserId: string) => {
  let direction: "SENT" | "RECEIVED" | "SYSTEM";

  if (t.fromUserId && t.toUserId) {
    direction = t.fromUserId === currentUserId ? "SENT" : "RECEIVED";
  } else {
    direction = "SYSTEM";
  }

  return {
    id: t.id,
    referenceId: t.referenceId,
    amount: t.amount.toString(),
    status: t.status,
    type: t.type,
    createdAt: t.createdAt.toISOString(),
    description: t.description ?? "",
    direction,
  };
};

export const detailTransactionDTO = (t: any, currentUserId: string) => {
  let direction: "SENT" | "RECEIVED" | "SYSTEM";

  if (t.fromUserId && t.toUserId) {
    direction = t.fromUserId === currentUserId ? "SENT" : "RECEIVED";
  } else {
    direction = "SYSTEM";
  }

  return {
    id: t.id,
    referenceId: t.referenceId,
    amount: t.amount.toString(),
    status: t.status,
    type: t.type,
    description: t.description ?? "",
    direction,

    from: t.fromUser
      ? {
          id: t.fromUser.id,
          email: t.fromUser.email,
        }
      : null,

    to: t.toUser
      ? {
          id: t.toUser.id,
          email: t.toUser.email,
        }
      : null,

    createdAt: t.createdAt.toISOString(),
    processedAt: t.processedAt?.toISOString() ?? null,
  };
};
