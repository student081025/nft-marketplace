const fetch = require('node-fetch');

async function triggerNotification(user) {
  try {
    const response = await fetch('https://app-1-kappa.vercel.app/api/webhook', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VERCEL_AUTH_TOKEN}`
      },
      body: JSON.stringify({
        type: "payment-due",
        payload: {
          client: user,
          pay: "100000000000000000",
          token_id: "123",
          contract_id: "456",
          status: "1",
          donations: "500000000000000000"
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Webhook response:", data);
  } catch (err) {
    console.error("Webhook notification failed:", err);
  }
}

triggerNotification("0x8064700776446D45cF96E4caf3cFf67075bfC3F7");