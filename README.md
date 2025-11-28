# Total Life Daily

i was messing around with langgraph and gemini, I made this quick demo with it
- uses a javascript/html/css frontend just for demo purposes
- uses gemini api (gemini-2.0-flash)

# What GraphLang is doing
## Step 1: Turn user question into search field
1) Accepts initial user question
2) Calls Gemini LLM to convert natural language into optimized PubMed search terms    
3) Outputs search terms for free Pubmed API's

## Step 2: Search Pubmed API
1) Accepts search query from above as input
2) Calls 2 different free pubmed API's. 
- The first one (PubMed ESearch API) finds articles and grabs their PMID's
- The second one (PubMed EFetch API) searches uses those PMID's and grabs the actual articles, returning their infomration.
3) Parses information from the returned articles
4) Outputs different articles and their content

## Step 3: Final call to Gemini
1) Call Gemini, good system prompt, retrieved articles and original user question
2) Output the final content shown on screen, formatted to include the sources in the text.

## "The Graph Definition"
``` 
graph_builder = StateGraph(AgentState)

# Add the 3 nodes
graph_builder.add_node("enhance_query", enhance_query_node)
graph_builder.add_node("retrieve", retrieve_node)
graph_builder.add_node("generate", generate_node)

# Wire them together: START → enhance → retrieve → generate → END
graph_builder.add_edge(START, "enhance_query")
graph_builder.add_edge("enhance_query", "retrieve")
graph_builder.add_edge("retrieve", "generate")
graph_builder.add_edge("generate", END)

# Compile into executable graph
wellness_graph = graph_builder.compile()
``` 

# Important Notes
I made this pretty quickly, claude plugged in some probably unneeded dependencies. I think the major thing we can take away from this repository is the LangGraph code (main.py), this current system doesn't seem too bad! 