import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Simple keyword-based retrieval function
function retrieveDocuments(query: string, documents: any[], k: number = 5) {
  const queryLower = query.toLowerCase()
  const queryWords = new Set(queryLower.match(/\b\w+\b/g) || [])
  
  const scoredChunks = documents
    .map(doc => {
      const content = doc.content || ''
      const contentLower = content.toLowerCase()
      const contentWords = new Set(contentLower.match(/\b\w+\b/g) || [])
      
      // Calculate word overlap score
      const overlap = [...queryWords].filter(word => contentWords.has(word)).length
      
      return { overlap, doc }
    })
    .filter(item => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, k)
    .map(item => item.doc)
  
  return scoredChunks
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // Get documents from Supabase
    const { data: documents, error } = await supabase
      .from('documents')
      .select('content, metadata')
    
    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ 
        answer: 'I apologize, but I don\'t have access to the knowledge base at the moment. Please try again later.',
        sources: []
      })
    }

    // Retrieve relevant documents
    const relevantDocs = retrieveDocuments(question, documents, 5)
    
    if (relevantDocs.length === 0) {
      return NextResponse.json({ 
        answer: 'I couldn\'t find relevant information in the knowledge base for your question. Please try rephrasing your question or ask about Panchakarma therapy, Ayurvedic treatments, or related topics.',
        sources: []
      })
    }

    // Combine retrieved content
    const context = relevantDocs
      .map((doc, index) => 
        `Source ${index + 1}: ${doc.metadata?.source || 'Unknown'}\nContent: ${doc.content}`
      )
      .join('\n\n')

    // Create prompt for the AI
    const prompt = `You are a Panchakarma AI assistant. Answer the user's question based on the provided context from the knowledge base.

Context:
${context}

Question: ${question}

Please provide a clear, concise, and well-structured answer based on the context. Keep your response under 400 words and use the following format:

1. Start with a brief definition or overview
2. Use bullet points for key information
3. Include practical details when available
4. End with any important notes or considerations

Use markdown formatting:
- Use ## for main headings
- Use **bold** for important terms
- Use bullet points (*) for lists
- Keep paragraphs short and focused

If the context doesn't contain enough information, say so clearly. Be concise and avoid repetition.

Answer:`

    // Get response from Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    // Prepare sources for the response
    const sources = relevantDocs.map((doc, index) => ({
      content: doc.content,
      metadata: doc.metadata
    }))

    return NextResponse.json({
      answer,
      sources
    })

  } catch (error) {
    console.error('Error in chatbot API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      answer: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.'
    }, { status: 500 })
  }
}
