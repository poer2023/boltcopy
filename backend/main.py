from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Paper(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    references: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# In-memory storage (replace with database in production)
papers = {}

@app.post("/api/papers")
async def create_paper(paper: Paper):
    paper_id = f"paper-{len(papers) + 1}"
    now = datetime.utcnow()
    paper.id = paper_id
    paper.created_at = now
    paper.updated_at = now
    papers[paper_id] = paper
    return paper

@app.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    if paper_id not in papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    return papers[paper_id]

@app.put("/api/papers/{paper_id}")
async def update_paper(paper_id: str, paper: Paper):
    if paper_id not in papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    paper.updated_at = datetime.utcnow()
    papers[paper_id] = paper
    return paper

@app.delete("/api/papers/{paper_id}")
async def delete_paper(paper_id: str):
    if paper_id not in papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    del papers[paper_id]
    return {"message": "Paper deleted"}

@app.get("/api/papers")
async def list_papers():
    return list(papers.values())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)