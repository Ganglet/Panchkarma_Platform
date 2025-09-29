# Simple ingestion without heavy embeddings
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from supabase.client import Client, create_client
import uuid

load_dotenv('.env.local')

# Initiate Supabase
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def ingest_documents():
    print("Loading PDF documents...")
    
    # Load documents
    loader = PyPDFDirectoryLoader("app/Agentic_Chatbot/documents")
    documents = loader.load()
    print(f"Loaded {len(documents)} documents")
    
    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    
    # Clear existing documents
    print("Clearing existing documents...")
    supabase.table('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    
    # Insert chunks into database
    print("Inserting chunks into database...")
    batch_size = 50
    
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        print(f"Processing batch {i//batch_size + 1}/{(len(chunks) + batch_size - 1)//batch_size}")
        
        # Prepare batch data
        batch_data = []
        for chunk in batch:
            batch_data.append({
                'id': str(uuid.uuid4()),
                'content': chunk.page_content,
                'metadata': chunk.metadata,
                'embedding': [0.0] * 768  # Dummy embedding for now
            })
        
        # Insert batch
        try:
            result = supabase.table('documents').insert(batch_data).execute()
            print(f"✅ Inserted {len(batch_data)} chunks")
        except Exception as e:
            print(f"❌ Error inserting batch: {e}")
    
    print("🎉 Ingestion complete!")

if __name__ == "__main__":
    ingest_documents()
