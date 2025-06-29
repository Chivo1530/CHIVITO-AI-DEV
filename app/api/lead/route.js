## 4. Create folder `app/api/lead/` and inside create `route.js`
```javascript
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const leadData = await request.json()
    
    // AI-powered lead scoring logic
    let score = 0
    if (leadData.email && leadData.email.includes('.com')) score += 20
    if (leadData.message && leadData.message.length > 50) score += 25
    if (leadData.message && leadData.message.toLowerCase().includes('urgent')) score += 25
    if (leadData.name && leadData.name.length > 2) score += 10
    
    const priority = score > 50 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW'
    
    const processedLead = {
      ...leadData,
      score,
      priority,
      aiResponse: `Hi ${leadData.name}! 🚀 Thanks for reaching out to CHIVITO AI. Based on your inquiry, I've identified you as a ${priority} priority lead. Our AI agents are analyzing your needs and will connect you with the perfect solution within 24 hours!`,
      processed: true,
      timestamp: new Date().toISOString()
    }
    
    // TODO: Forward to your Railway n8n webhook when ready
    console.log('Lead processed:', processedLead)
    
    return NextResponse.json({
      success: true,
      message: 'Lead processed by CHIVITO AI',
      ...processedLead
    })
    
  } catch (error) {
    console.error('Lead processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}
```

## Final Structure Should Look Like:
```
your-repo/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── api/
│       └── lead/
│           └── route.js
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── postcss.config.js
├── requirements.txt
└── tailwind.config.js
```
