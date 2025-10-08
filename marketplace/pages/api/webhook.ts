import type { NextApiRequest, NextApiResponse } from 'next'

interface Notification {
  id: string;
  user: string;
  type: string;
  message: string;
  data: {
    amount: string;
    tokenId: string;
    contractId: string;
    status?: string;
    donations?: string;
    name?: string;
  };
  timestamp: number;
  read: boolean;
}

const notifications: Notification[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { type, payload } = req.body;

      if (type === 'payment-due') {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          user: payload.client.toLowerCase(),
          type: 'payment-due',
          message: `Payment due for Charity NFT ${payload.token_id || payload.tokenId}`,
          data: {
            amount: payload.pay || payload.amount,
            tokenId: payload.token_id || payload.tokenId,
            contractId: payload.contract_id || payload.contractId,
            status: payload.status || "1",
            donations: payload.donations || "0",
            name: `Charity NFT #${payload.token_id || payload.tokenId}`
          },
          timestamp: Date.now(),
          read: false
        };
        notifications.push(newNotification);
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Invalid notification type" });
    } catch (error) {
      console.error("Error handling POST:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "GET") {
  try {
    const { user } = req.query;
    
    if (!user) {
      return res.status(400).json({ error: "User address required" });
    }

    const now = Math.floor(Date.now() / 1000);
    const userNotifications = notifications.filter(
      n => n.user.toLowerCase() === user.toString().toLowerCase() && 
           Number(n.data.status) <= now
    );

    return res.status(200).json({ notifications: userNotifications });
  } catch (error) {
    console.error("Error handling GET:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

  res.status(405).end();
}