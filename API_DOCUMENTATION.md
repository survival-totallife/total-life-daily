# Total Life Daily API Documentation

This document provides everything needed to integrate the Total Life Daily backend into your frontend application.

---

## Quick Start

### Environment Setup

Create a `.env` file in the project root with the following variables:

```
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Your Google Gemini API key. Get one at https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | No | The Gemini model to use. Defaults to `gemini-2.0-flash` if not set. Options: `gemini-2.0-flash`, `gemini-2.5-flash`, `gemini-2.5-pro` |

### Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

**API Documentation:** http://localhost:8000/docs (interactive Swagger UI)

---

## Table of Contents

1. [Wellness Chatbot API](#wellness-chatbot-api)
2. [Article Management API](#article-management-api)

---

## Wellness Chatbot API

### POST `/chat`

Send a wellness/health question and receive an AI-generated answer backed by PubMed research.

---

## Request

**URL:** `POST http://localhost:8000/chat`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "message": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The user's wellness or health-related question |

---

## Response

**Success Response (200 OK):**
```json
{
  "answer": "string",
  "sources": [
    {
      "id": "string",
      "title": "string",
      "authors": "string",
      "journal": "string",
      "year": "string",
      "url": "string"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | AI-generated response. May contain Markdown formatting and source citations. |
| `sources` | array | List of PubMed articles used for the response. Empty array if no research was found. |

### Source Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | PubMed ID (PMID) - matches citations in the answer text |
| `title` | string | Article title |
| `authors` | string | Author names (formatted, may include "et al." for many authors) |
| `journal` | string | Journal name |
| `year` | string | Publication year |
| `url` | string | Direct link to the PubMed article |

---

## Example Response

**Request:** `"What are the benefits of vitamin D?"`

**Answer:**
```
Vitamin D is important for many aspects of your health, not just your bones! It plays a vital 
role in supporting your immune system [Source: 32679784] [Source: 37686873], brain function, 
prenatal health, and cardiovascular health [Source: 39861407]. Vitamin D also helps your body 
absorb calcium, which is important for maintaining healthy bones [Source: 32679784].

Many people have low vitamin D levels [Source: 39861407], so maintaining adequate levels is 
essential for overall well-being [Source: 32679784]. Aiming for a serum concentration above 
30 ng/mL may help lower the risk of disease and mortality [Source: 39861407].

While vitamin D can be obtained through sun exposure, food, and supplements, it's always a 
good idea to discuss your individual needs with your healthcare provider. They can help you 
determine the right amount of vitamin D for you based on your specific health status.
```

**Sources:**
```json
[
  {
    "id": "39861407",
    "title": "Vitamin D: Evidence-Based Health Benefits and Recommendations for Population Guidelines.",
    "authors": "Grant WB, Wimalawansa SJ, Pludowski P, et al.",
    "journal": "Nutrients",
    "year": "2025",
    "url": "https://pubmed.ncbi.nlm.nih.gov/39861407"
  },
  {
    "id": "32679784",
    "title": "Immunologic Effects of Vitamin D on Human Health and Disease.",
    "authors": "Charoenngam N, Holick MF",
    "journal": "Nutrients",
    "year": "2020",
    "url": "https://pubmed.ncbi.nlm.nih.gov/32679784"
  },
  {
    "id": "37686873",
    "title": "Infections and Autoimmunity-The Immune System and Vitamin D: A Systematic Review.",
    "authors": "Wimalawansa SJ",
    "journal": "Nutrients",
    "year": "2023",
    "url": "https://pubmed.ncbi.nlm.nih.gov/37686873"
  },
  {
    "id": "24119980",
    "title": "Effects of vitamin D supplements on bone mineral density: a systematic review and meta-analysis.",
    "authors": "Reid IR, Bolland MJ, Grey A",
    "journal": "Lancet (London, England)",
    "year": "2014",
    "url": "https://pubmed.ncbi.nlm.nih.gov/24119980"
  },
  {
    "id": "37299383",
    "title": "Benefits of Vitamin D in Health and Diseases.",
    "authors": "Passeri G, Giannini S",
    "journal": "Nutrients",
    "year": "2023",
    "url": "https://pubmed.ncbi.nlm.nih.gov/37299383"
  }
]
```

---

### cURL

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the benefits of omega-3?"}'
```

---

## Response Format Details

### Markdown Content

The `answer` field may contain Markdown formatting:
- **Bold text** using `**text**`
- *Italic text* using `*text*`
- Bullet lists
- Numbered lists

**Recommendation:** Use a Markdown rendering library (e.g., `react-markdown`, `marked`, `markdown-it`) to display the response properly.

### Source Citations

When the AI finds relevant PubMed research, it includes citations in this format:

```
Vitamin D is important for bone health [Source: 22716179].
```

The number (e.g., `22716179`) is a PubMed ID (PMID). You can optionally make these clickable:

```javascript
function formatCitations(text) {
  return text.replace(
    /\[Source: (\d+)\]/g,
    '<a href="https://pubmed.ncbi.nlm.nih.gov/$1" target="_blank">[Source: $1]</a>'
  );
}
```

### No Research Found

If no PubMed articles are found for the question, the response will begin with something like:

> "While I couldn't find specific research articles on this topic, here's what I can share:"

This indicates the answer is based on general knowledge rather than specific research citations.

---

## Error Handling

| Status Code | Meaning | Suggested Action |
|-------------|---------|------------------|
| 200 | Success | Display the answer |
| 422 | Validation Error | Check request format (missing `message` field) |
| 500 | Server Error | Display error message, allow retry |

### Example Error Response (422)

```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## CORS

The backend is configured to accept requests from any origin (`*`). This should work for local development. For production, the backend should be configured with specific allowed origins.

---

## Notes

1. **Response Time:** Expect 3-10 seconds per request (searches PubMed, then generates response via Gemini)
2. **Rate Limits:** PubMed API has rate limits; the backend handles this internally
3. **Content:** Responses include a reminder to consult healthcare providers for personal medical advice

Feel free to change anything if you think it would improve it 

## TODO

- [ ] **Upgrade Gemini Model:** Currently using `gemini-2.0-flash` which is fast but less capable. Update the `GEMINI_MODEL` environment variable to switch models.
- [ ] **Set API Key Cost Limits:** Add a spending/usage limit to the Gemini API key in the Google Cloud Console to prevent unexpected charges. (incase someone spams the api)

---

## Article Management API

### Overview

RESTful API for managing blog articles. Articles are stored in markdown format with automatic timestamp tracking.

**Database Schema:**
- `article_id` (Integer, Primary Key, Auto-increment)
- `article_markdown` (Text, Required)
- `created_at` (DateTime, Auto-generated)
- `updated_at` (DateTime, Auto-updated)

---

### POST `/articles`

Create a new article.

**Request:**

```json
{
  "article_markdown": "# Article Title\n\nArticle content in **markdown** format..."
}
```

**Response (201 Created):**

```json
{
  "article_id": 1,
  "article_markdown": "# Article Title\n\nArticle content in **markdown** format...",
  "created_at": "2025-11-28T10:30:00",
  "updated_at": "2025-11-28T10:30:00"
}
```

**Example:**

```bash
curl -X POST http://localhost:8000/articles \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# My Article\n\nContent here..."}'
```

---

### GET `/articles`

Get all articles with pagination.

**Query Parameters:**
- `skip` (optional, default: 0) - Number of articles to skip
- `limit` (optional, default: 100) - Maximum number of articles to return

**Response (200 OK):**

```json
[
  {
    "article_id": 1,
    "article_markdown": "# Article 1\n\nContent...",
    "created_at": "2025-11-28T10:30:00",
    "updated_at": "2025-11-28T10:30:00"
  },
  {
    "article_id": 2,
    "article_markdown": "# Article 2\n\nMore content...",
    "created_at": "2025-11-28T11:00:00",
    "updated_at": "2025-11-28T11:00:00"
  }
]
```

**Example:**

```bash
# Get first 10 articles
curl http://localhost:8000/articles?skip=0&limit=10

# Get next 10 articles
curl http://localhost:8000/articles?skip=10&limit=10
```

---

### GET `/articles/{article_id}`

Get a single article by ID.

**Path Parameters:**
- `article_id` (required) - The ID of the article to retrieve

**Response (200 OK):**

```json
{
  "article_id": 1,
  "article_markdown": "# Article Title\n\nFull article content...",
  "created_at": "2025-11-28T10:30:00",
  "updated_at": "2025-11-28T10:30:00"
}
```

**Error Response (404 Not Found):**

```json
{
  "detail": "Article not found"
}
```

**Example:**

```bash
curl http://localhost:8000/articles/1
```

---

### PUT `/articles/{article_id}`

Update an existing article.

**Path Parameters:**
- `article_id` (required) - The ID of the article to update

**Request:**

```json
{
  "article_markdown": "# Updated Title\n\nUpdated content..."
}
```

**Response (200 OK):**

```json
{
  "article_id": 1,
  "article_markdown": "# Updated Title\n\nUpdated content...",
  "created_at": "2025-11-28T10:30:00",
  "updated_at": "2025-11-28T15:45:00"
}
```

**Error Response (404 Not Found):**

```json
{
  "detail": "Article not found"
}
```

**Example:**

```bash
curl -X PUT http://localhost:8000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# Updated Article\n\nNew content..."}'
```

---

### DELETE `/articles/{article_id}`

Delete an article.

**Path Parameters:**
- `article_id` (required) - The ID of the article to delete

**Response (204 No Content):**

No response body.

**Error Response (404 Not Found):**

```json
{
  "detail": "Article not found"
}
```

**Example:**

```bash
curl -X DELETE http://localhost:8000/articles/1
```

---

## Error Handling

| Status Code | Meaning | Suggested Action |
|-------------|---------|------------------|
| 200 | Success | Process the response |
| 201 | Created | New resource created successfully |
| 204 | No Content | Operation successful, no content to return |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Check request format |
| 500 | Server Error | Display error message, allow retry |

---

## Testing

A test script is provided to verify all CRUD operations:

```bash
# Make sure the server is running first
python test_articles.py
```

This will test:
1. Creating an article
2. Getting all articles
3. Getting a single article
4. Updating an article
5. Deleting an article

---
