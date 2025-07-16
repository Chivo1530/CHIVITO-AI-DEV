import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

// Real-time conversation storage (in production, use database)
let conversationHistory = []

export async function GET() {
  return NextResponse.json({
    success: true,
    conversationHistory,
    systemInfo: {
      model: 'gpt-4o',
      provider: 'openai',
      personality: 'Ponch - Street CEO Energy'
    }
  })
}

export async function POST(request) {
  try {
    const { message, context } = await request.json()
    
    // Add user message to history
    const userMessage = {
      id: conversationHistory.length + 1,
      type: 'user',
      message,
      timestamp: new Date().toISOString(),
      context
    }
    
    conversationHistory.push(userMessage)
    
    // Generate AI response using OpenRouter
    const aiResponse = await generateRealAIResponse(message, context)
    
    const aiMessage = {
      id: conversationHistory.length + 1,
      type: 'ai',
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      context: aiResponse.context,
      ponchInsight: aiResponse.ponchInsight
    }
    
    conversationHistory.push(aiMessage)
    
    return NextResponse.json({
      success: true,
      response: aiMessage,
      conversationHistory
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function generateRealAIResponse(userMessage, context) {
  try {
    // Create a temporary Python script to use emergentintegrations
    const pythonScript = `
import asyncio
import os
import sys
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

async def main():
    # Initialize the chat with OpenRouter API key
    api_key = "${process.env.OPENROUTER_API_KEY}"
    
    # Create Ponch AI system message with 3D COMMS structure
    system_message = '''You are Ponch, 18-year-old founder of CHIVITO AI. Recently laid off from 3 jobs, now 100% locked in on building an empire.

PERSONALITY: Street-CEO energy (GaryVee x Hormozi x Ponch). Real operator who's been in the trenches with Tahoe Essentials clothing brand.

COMMUNICATION STYLE - 3D COMMS:
1. ANCHOR: Build trust fast with real experience
2. PROBE: Ask NEPQ-style questions that reveal intent 
3. PUNCHLINE: Drop value, proof, or CTA cleanly

POWER WORDS: "run", "move", "build", "automate", "lock in", "results", "dialed", "hands-free", "execute", "scale"

AVOID: "Hey there!", "Let me explain...", paragraphs, over-teaching

REAL EXPERIENCE:
- Built Tahoe Essentials (clothing brand) at 18
- Inventory nightmares, supply chain chaos, marketing struggles
- Learned most businesses drown in manual work
- DTF printing and manufacturing experience

RESPONSE FORMAT:
- 1-2 lines per beat
- Always qualify before suggesting features
- No fluff, all execution
- Built for conversion, not just conversation

EXAMPLES:
Q: "What does CHIVITO AI do?"
A: "It automates moves most people still do by hand.
Think lead gen, emails, site ops, memory — all running while you're locked in elsewhere.

You trying to replace manual work or scale something specific?"

Be authentic, hungry, and results-focused. This is all I have right now, and I have a plan.'''

    # Create chat instance
    chat = LlmChat(
        api_key=api_key,
        session_id="ponch_ai_session",
        system_message=system_message
    ).with_model("openai", "gpt-4o").with_max_tokens(500)
    
    # Create user message
    user_msg = UserMessage(text="${userMessage}")
    
    # Send message and get response
    response = await chat.send_message(user_msg)
    
    # Return structured response
    result = {
        "message": response,
        "context": {"ai_generated": True, "model": "gpt-4o"},
        "ponchInsight": "Real AI response with Ponch personality"
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    asyncio.run(main())
    `
    
    // Write the Python script to a temporary file
    const tempFile = path.join('/tmp', `ponch_ai_${Date.now()}.py`)
    await fs.writeFile(tempFile, pythonScript)
    
    // Execute the Python script
    const result = await new Promise((resolve, reject) => {
      const python = spawn('python3', [tempFile], {
        env: { ...process.env, PYTHONPATH: '/root/.venv/lib/python3.11/site-packages' }
      })
      
      let output = ''
      let errorOutput = ''
      
      python.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      python.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })
      
      python.on('close', (code) => {
        if (code === 0) {
          try {
            const jsonResponse = JSON.parse(output)
            resolve(jsonResponse)
          } catch (parseError) {
            reject(new Error(`Failed to parse JSON: ${parseError.message}`))
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${errorOutput}`))
        }
      })
    })
    
    // Clean up temporary file
    await fs.unlink(tempFile)
    
    return result
    
  } catch (error) {
    console.error('AI generation error:', error)
    
    // Fallback to 3D COMMS structured response
    return {
      message: "System's running a bit slow right now.\n\nWhat's the biggest bottleneck in your business?\n\nLet me show you how CHIVITO handles it automatically.",
      context: { fallback: true },
      ponchInsight: "Fallback response with 3D COMMS structure"
    }
  }
}