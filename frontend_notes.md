# Frontend Implementation Notes

Notes on how to handle the backend

---

## Handling the Response

The backend returns a single `answer` field containing the AI-generated text. This text is not plain—it contains Markdown formatting and citation markers that need to be processed before displaying to the user.

---

## Citation Handling (IMPORTANT)

Citations appear inline in the text using the format `[Source: PMID]` where PMID is a PubMed article identifier (e.g., `[Source: 22716179]`). You should transform these into clickable elements that link to the actual PubMed article.

The link format is simple: `https://pubmed.ncbi.nlm.nih.gov/{PMID}`. For example, PMID 22716179 links to `https://pubmed.ncbi.nlm.nih.gov/22716179`.

Consider displaying citations as superscript numbers rather than showing the full PMID inline. This keeps the text clean and readable while still providing access to sources. You can renumber citations based on order of appearance (first citation becomes [1], second becomes [2], etc.) for a cleaner presentation.

## Markdown Parsing

The response often includes Markdown syntax like double asterisks for bold text and single asterisks for italics. You should parse these into proper HTML elements. Bold text improves readability by emphasizing key terms, and italics help with scientific names or subtle emphasis. A Markdown parsing library is recommended rather than writing your own regex, as responses may include lists, headers, or other formatting in the future.

- NOTE: I am unsure if we want to either keep the markdown, or tell the LLM to output in normal text without markdown formatting (bold, italics, etc). We will have to see.

---

## Building a References Section

The backend returns a `sources` array alongside the answer, containing full metadata for each PubMed article retrieved. Each source object includes the PMID, title, authors, journal name, publication year, and a direct URL to the article.

To build the references section, extract unique PMIDs from the answer text and match them to the corresponding source objects. Display them in order of first appearance in the text. This gives users a rich, informative references list with clickable titles rather than just raw PMID numbers.

---

## Handling "No Research" Responses

When the backend can't find relevant PubMed articles, the response will begin with a phrase like "While I couldn't find specific research articles on this topic, here's what I can share:". These responses won't contain any `[Source: ...]` citations.

---

## Loading States

Backend responses typically take 3-10 seconds due to PubMed API calls and LLM generation.
