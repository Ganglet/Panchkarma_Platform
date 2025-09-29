# Simple RAG system using BM25 keyword retrieval instead of embeddings
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from supabase.client import Client, create_client
from rank_bm25 import BM25Okapi

# Load environment variables
load_dotenv('.env.local')

# Configure Google AI
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initiate Supabase
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Retrieve documents from Supabase using BM25 keyword retrieval
def retrieve_documents_from_db(query, k=5):
    try:
        result = supabase.table('documents').select('content, metadata').execute()
        documents = result.data
        if not documents:
            return []

        # Build BM25 index
        corpus = [doc['content'] for doc in documents]
        tokenized_corpus = [re.findall(r'\b\w+\b', content.lower()) for content in corpus]
        bm25 = BM25Okapi(tokenized_corpus)

        # Process query
        tokenized_query = re.findall(r'\b\w+\b', query.lower())
        scores = bm25.get_scores(tokenized_query)

        # Rank documents
        ranked = sorted(zip(scores, documents), key=lambda x: x[0], reverse=True)
        top_docs = ranked[:k]

        # Convert to Document-like objects
        chunks = []
        for score, doc in top_docs:
            chunk = type('Document', (), {
                'page_content': doc['content'],
                'metadata': doc.get('metadata', {})
            })()
            chunks.append(chunk)

        return chunks

    except Exception as e:
        print(f"Error retrieving from database: {e}")
        return []

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-flash", temperature=0)

def ask_question(question):
    try:
        print(f"Question: {question}")
        print("Searching database...")

        # Retrieve relevant chunks from database
        relevant_chunks = retrieve_documents_from_db(question, k=5)
        print(f"Found {len(relevant_chunks)} relevant chunks")

        if not relevant_chunks:
            return "I couldn't find relevant information in the knowledge base."

        # Combine retrieved content
        context = "\n\n".join([
            f"Source: {chunk.metadata.get('source', 'Unknown')}\nContent: {chunk.page_content}"
            for chunk in relevant_chunks
        ])

        # Create prompt
        prompt = f"""
You are a Panchakarma AI assistant. Answer the user's question based on the provided context from the knowledge base.

Context:
{context}

Question: {question}

Please provide a comprehensive answer based on the context. If the context doesn't contain enough information to answer the question, please say so clearly.

Answer:"""

        # Get response from LLM
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    # Test questions
    questions = [
        "What oils are commonly used in Nasya therapy?",
        "What is Matra Basti and when is it indicated?",
        "What is the purpose of Vamana therapy?",
        "What are the preparatory steps before Virechana?"
    ]

    for question in questions:
        print("\n" + "="*60)
        answer = ask_question(question)
        print(f"\nAnswer: {answer}")
        print("\n" + "="*60)
