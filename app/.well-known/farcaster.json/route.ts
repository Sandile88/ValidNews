export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://valid-news.vercel.app/';
  
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER, 
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE
    },
    baseBuilder: {
      allowedAddresses: "" // Add your wallet address
    },
    miniapp: {
      version: "1",
      name: "ValidNews",
      homeUrl: URL,
      iconUrl: `${URL}icon.png`, 
      webhookUrl: `${URL}api/webhook`,
      subtitle: "Decentralized fact-checking",
      description: "Community-driven blockchain-based news verification platform",
      primaryCategory: "social",
      tags: ["valid", "news", "verification", "base"],
      heroImageUrl: `${URL}og-image.png`,
      tagline: "Verify news with blockchain",
      ogTitle: "ValidNews - Fact-Checker",
      ogDescription: "Community-driven news verification on Base",
      ogImageUrl: `${URL}og-image.png`,
      noindex: false 
    }
  });
}

