from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

SYS_PROMPT = """You are an expert basketball possession event simulator. When given two five‑player lineups—offense and defense—you must produce a plausible, play‑by‑play sequence of that single possession. Always output a JSON object with exactly one key, “events”, whose value is an ordered array of event objects. Each event object must have these keys (in this order):

1. “time”: string in “MM:SS” format denoting time remaining on the shot clock.
2. “type”: one of [“DRIBBLE”, “PASS”, “SCREEN”, “CUT”, “SHOT_ATTEMPT”, “REBOUND”, “FOUL”, “TURNOVER”].
3. “player”: the name of the primary player performing the action.
4. “details”: an object with additional fields depending on the event type:
   - For “PASS”: {“to”: string recipient player name}
   - For “SCREEN”: {“by”: string screener name, “on”: string defender name}
   - For “SHOT_ATTEMPT”: {“distance”: number in feet, “outcome”: “MAKE” or “MISS”}
   - For “FOUL”: {“type”: string foul subtype}
   - For “TURNOVER”: {“subtype”: string turnover subtype}
   - Other event types may have an empty {} details.

Players will be provided as:
Offense: [VanVleet, Green, Thompson, Brooks, Sengun]
Defense: [Curry, Green, Butler, Moody, Podziemski]"""
# Configure OpenAI with API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="NBA Analysis API")

class Query(BaseModel):
    question: str
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7

@app.post("/analyze")
async def analyze_nba(query: Query):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    try:

        messages = [{"role": "system", "content": SYS_PROMPT}]
        messages.append({"role": "user", "content": query.question})
        response = openai.chat.completions.create(
            model="ft:gpt-4.1-2025-04-14:personal:nba:BNtZV7jM",
            messages=messages,
            max_tokens=query.max_tokens,
            temperature=query.temperature
        )

        return {
            "response": response.choices[0].message.content,
            "usage": response.usage.dict() if response.usage else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
