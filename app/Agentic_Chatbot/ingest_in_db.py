# import basics
import os
from dotenv import load_dotenv

load_dotenv('.env.local')  

# import langchain
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

# import supabase
from supabase.client import Client, create_client

# initiate supabase db
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# initiate HuggingFace embeddings for better similarity search
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

# load pdf docs from folder 'documents'
loader = PyPDFDirectoryLoader("app/Agentic_Chatbot/documents")
print("Loading documents from 'app/Agentic_Chatbot/documents/' folder...")
documents = loader.load()
if not documents:
    print("No documents found in the 'documents' folder. Please add your PDF files there.")
    exit()
print(f"Loaded {len(documents)} document(s).")

# split the documents in multiple chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = text_splitter.split_documents(documents)
print(f"Split {len(documents)} document(s) into {len(docs)} chunks.")

# Process in smaller batches to avoid memory issues
batch_size = 50
print(f"Processing {len(docs)} chunks in batches of {batch_size}...")

for i in range(0, len(docs), batch_size):
    batch = docs[i:i + batch_size]
    print(f"Processing batch {i//batch_size + 1}/{(len(docs) + batch_size - 1)//batch_size} ({len(batch)} chunks)...")
    
    try:
        vector_store = SupabaseVectorStore.from_documents(
            batch,
            embeddings,
            client=supabase,
            table_name="documents",
            query_name="match_documents",
            chunk_size=1000,
        )
        print(f"✅ Batch {i//batch_size + 1} processed successfully!")
    except Exception as e:
        print(f"❌ Error processing batch {i//batch_size + 1}: {e}")
        continue

print("🎉 Ingestion complete!")
