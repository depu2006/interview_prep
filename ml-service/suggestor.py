"""
suggestor.py — AI Growth Engine (Modules 5 & 10)
Includes strategic roadmap and Interview Preparation Suggestions.
"""

YOUTUBE_RESOURCES = {
    "React": "https://www.youtube.com/watch?v=bMknfKXIFA8",
    "Node.js": "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
    "Python": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    "Machine Learning": "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
    "Cloud Architecture": "https://www.youtube.com/watch?v=6mYpAbB3rEw",
    "System Design": "https://www.youtube.com/watch?v=SqcXvc34Rv0",
    "CI/CD Pipelines": "https://www.youtube.com/watch?v=scEDHsr3APg",
    "Unit Testing": "https://www.youtube.com/watch?v=7r4xVDI2vho",
    "Docker": "https://www.youtube.com/watch?v=pTFZFxd4hOI",
    "Kubernetes": "https://www.youtube.com/watch?v=X48VuDVv0do",
    "SQL": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    "NoSQL": "https://www.youtube.com/watch?v=0buKQHokLK8",
    "AWS": "https://www.youtube.com/watch?v=RrKRN9zRBKo",
    "Azure": "https://www.youtube.com/watch?v=Nke5JKiQfFE",
    "Java": "https://www.youtube.com/watch?v=A74TOX803D0",
    "JavaScript": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    "Full Stack": "https://www.youtube.com/watch?v=mSgO47X5O5c",
    "Portfolio": "https://www.youtube.com/watch?v=M9-Z0vW7ZXY",
    "Interview": "https://www.youtube.com/watch?v=66pS8P49pIs",
    "Frontend": "https://www.youtube.com/watch?v=bMknfKXIFA8",
    "Backend": "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
    "DevOps": "https://www.youtube.com/watch?v=scEDHsr3APg",
    "Data Science": "https://www.youtube.com/watch?v=GwIo3gDZCVQ"
}

def generate_suggestions(parsed_data, evaluation):
    missing_skills = evaluation.get("missing_skills", [])
    
    # Module 5: Tech Gaps
    tech_gaps = [s.capitalize() for s in missing_skills[:6]] if missing_skills else ["System Design", "Cloud Architecture"]

    # Module 10: Interview Prep Suggestions
    interview_prep = {
        "coding_topics": [
            {"topic": "Data Structures", "sub": "Arrays, Linked Lists, Trees"},
            {"topic": "Algorithms", "sub": "Sorting, Searching, Dynamic Programming"},
            {"topic": "System Design", "sub": "Scalability, Caching, Databases"}
        ],
        "aptitude": [
            "Quantitative Reasoning (Speed, Distance, Time)",
            "Logical Deduction (Syllogisms, Patterns)",
            "Data Interpretation (Graphs, Charts)"
        ],
        "communication": [
            "Refine the 'Tell me about yourself' pitch.",
            "Practice STAR method for behavioral questions.",
            "Improve technical explanation clarity."
        ]
    }

    # Module 5: Roadmap
    roadmap = []
    main_gap = tech_gaps[0] if tech_gaps else "Full Stack"
    
    roadmap.append({
        "phase": "Phase 1: Foundation (Weeks 1-4)",
        "title": "Mastering Key Technologies",
        "tasks": [
            {"task": f"Complete Mastery of {main_gap}", "link": YOUTUBE_RESOURCES.get(main_gap, f"https://www.youtube.com/results?search_query={main_gap}+full+tutorial")},
            {"task": "Deep Dive into System Design", "link": YOUTUBE_RESOURCES.get("System Design")}
        ]
    })
    
    roadmap.append({
        "phase": "Phase 2: Building (Weeks 5-8)",
        "title": "Project Implementation",
        "tasks": [
            {"task": "Build & Deploy a Scalable App", "link": YOUTUBE_RESOURCES.get("Full Stack")},
            {"task": "Implement Modern CI/CD Pipelines", "link": YOUTUBE_RESOURCES.get("CI/CD Pipelines")}
        ]
    })
    
    roadmap.append({
        "phase": "Phase 3: Finalization (Weeks 9-12)",
        "title": "Strategic Branding",
        "tasks": [
            {"task": "Optimize Portfolio & LinkedIn", "link": YOUTUBE_RESOURCES.get("Portfolio")},
            {"task": "Practice High-Performance Interviews", "link": YOUTUBE_RESOURCES.get("Interview")}
        ]
    })

    return {
        "tech_gaps": tech_gaps,
        "skill_priorities": [
            {"skill": "Technical Depth", "tip": "Focus on mastery, not just familiarity."},
            {"skill": "Live Proof", "tip": "A working link beats a bullet point."}
        ],
        "roadmap": roadmap,
        "interview_prep": interview_prep
    }
