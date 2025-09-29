# import basics
import os
from dotenv import load_dotenv
import streamlit as st
import google.generativeai as genai

load_dotenv()

# import langchain
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.vectorstores import SupabaseVectorStore
from langchain.chains import RetrievalQA

# import supabase db
from supabase.client import Client, create_client

# load environment variables
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# initiating supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# initiating embeddings model
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# initiating vector store
vector_store = SupabaseVectorStore(
    embedding=embeddings,
    client=supabase,
    table_name="documents",
    query_name="match_documents",
)

# initiating llm
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

# create retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# create RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)

# initiating streamlit app
st.set_page_config(page_title="Agentic RAG Chatbot", page_icon="🧠")
st.title("🤖 Agentic RAG Chatbot")

# initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# display chat messages from history on app rerun
for message in st.session_state.messages:
    if isinstance(message, HumanMessage):
        with st.chat_message("user"):
            st.markdown(message.content)
    elif isinstance(message, AIMessage):
        with st.chat_message("assistant"):
            st.markdown(message.content)

# create the bar where we can type messages
user_question = st.chat_input("Ask me something about your docs...")

# did the user submit a prompt?
if user_question:
    with st.chat_message("user"):
        st.markdown(user_question)
        st.session_state.messages.append(HumanMessage(user_question))

    result = qa_chain(user_question)
    ai_message = result["result"]

    # show AI response
    with st.chat_message("assistant"):
        st.markdown(ai_message)
        st.session_state.messages.append(AIMessage(ai_message))

    # optionally show sources
    with st.expander("Sources"):
        for doc in result["source_documents"]:
            st.write(f"Source: {doc.metadata}")
            st.write(doc.page_content[:500])  # preview first 500 chars
