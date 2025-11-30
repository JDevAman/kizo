export const formatTransaction = (t: any, userId: string) => {
  // Always read IDs as strings
  const fromId = t.from?._id?.toString?.() || t.from?.toString() || null;
  const toId = t.to?._id?.toString?.() || t.from?.toString() || null;

  // Always read emails/usernames from stored fields
  const fromEmail = t.fromEmail || (fromId === null ? "system" : "");
  const toEmail = t.toEmail || (toId === null ? "system" : "");

  // Compute direction
  const direction =
    t.type === "request"
      ? toId === userId
        ? "incoming"
        : "outgoing"
      : t.type === "transfer"
      ? fromId === userId
        ? "outgoing"
        : "incoming"
      : "incoming";

  return {
    id: t._id.toString(),
    type: t.type,
    amount: t.amount / 100,
    status: t.status,
    to: toId,
    from: fromId,
    fromEmail,
    toEmail,
    description: t.description || "",
    direction,
    createdAt: t.createdAt,
    finalizedAt: t.finalizedAt || null,
    expiresAt: t.expiresAt || null,
    relatedTransactionId: t.relatedTransaction?.toString() || null,
    initiatedById: t.initiatedBy?.toString() || null,
  };
};
