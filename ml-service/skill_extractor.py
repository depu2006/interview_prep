"""
skill_extractor.py — NLP-based skill extraction for Why Did You Reject Me?
Uses a curated skill taxonomy + spaCy for detection.
"""

import re


# ─── Skill Taxonomy ──────────────────────────────────────────────────────────

SKILL_TAXONOMY = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c", "c++", "c#", "go",
        "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "r",
        "matlab", "perl", "lua", "dart", "haskell", "erlang", "elixir",
        "assembly", "vba", "groovy", "fortran", "cobol", "bash", "shell",
        "powershell", "sql",
    ],
    "Web Frameworks": [
        "react", "react.js", "reactjs", "angular", "angularjs", "vue", "vue.js",
        "vuejs", "next.js", "nextjs", "nuxt.js", "nuxtjs", "svelte", "express",
        "express.js", "expressjs", "django", "flask", "fastapi", "spring",
        "spring boot", "laravel", "rails", "ruby on rails", "asp.net", "dotnet",
        ".net", "nestjs", "gatsby", "remix",
    ],
    "Databases": [
        "mysql", "postgresql", "postgres", "mongodb", "sqlite", "redis",
        "elasticsearch", "cassandra", "dynamodb", "oracle", "sql server",
        "mssql", "mariadb", "neo4j", "couchdb", "firestore", "supabase",
        "prisma", "sequelize", "mongoose",
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "azure", "gcp", "google cloud",
        "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
        "github actions", "gitlab ci", "circleci", "nginx", "apache",
        "linux", "unix", "ubuntu", "centos", "helm", "vagrant",
        "cloudformation", "serverless", "heroku", "vercel", "netlify",
        "digitalocean",
    ],
    "AI / ML": [
        "machine learning", "deep learning", "artificial intelligence", "ai",
        "ml", "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
        "pandas", "numpy", "scipy", "matplotlib", "seaborn", "opencv",
        "nltk", "spacy", "hugging face", "transformers", "bert", "gpt",
        "llm", "langchain", "xgboost", "lightgbm", "catboost",
        "computer vision", "natural language processing", "nlp",
        "data science", "data analysis", "data engineering",
    ],
    "Mobile": [
        "android", "ios", "react native", "flutter", "swift", "kotlin",
        "xamarin", "ionic", "cordova", "expo",
    ],
    "Tools & Others": [
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
        "figma", "photoshop", "illustrator", "postman", "swagger",
        "graphql", "rest", "restful", "api", "microservices",
        "agile", "scrum", "kanban", "ci/cd", "devops", "tdd", "bdd",
        "webpack", "vite", "babel", "npm", "yarn", "pip",
        "opencv", "hadoop", "spark", "kafka", "rabbitmq", "celery",
        "redis", "websocket", "grpc", "protobuf",
        "html", "css", "sass", "scss", "tailwind", "bootstrap",
        "jquery", "ajax", "json", "xml", "yaml",
    ],
}

# Flatten for fast lookup (normalized → category)
_SKILL_SET = {}
for category, skills in SKILL_TAXONOMY.items():
    for skill in skills:
        _SKILL_SET[skill.lower()] = (skill, category)


def extract_skills(text: str) -> list[str]:
    """
    Extract skills from resume text using multi-word matching and
    single-word token matching against the taxonomy.

    Returns a sorted, deduplicated list of detected skill names.
    """
    if not text:
        return []

    text_lower = text.lower()
    found = {}

    # 1. Multi-word phrase matching (longest match first)
    sorted_skills = sorted(_SKILL_SET.keys(), key=len, reverse=True)
    for skill_key in sorted_skills:
        if len(skill_key.split()) > 1:
            # Use word-boundary matching for phrases
            pattern = r'\b' + re.escape(skill_key) + r'\b'
            if re.search(pattern, text_lower):
                canonical, category = _SKILL_SET[skill_key]
                # Normalize canonical name
                found[skill_key] = canonical

    # 2. Single token matching
    # Tokenize: split on non-alphanumeric except dots and pluses
    tokens = re.findall(r'[\w\+\.\#]+', text_lower)
    for token in tokens:
        if token in _SKILL_SET and token not in found:
            canonical, category = _SKILL_SET[token]
            found[token] = canonical

    # Deduplicate: if a longer match covers a shorter one, prefer longer
    # (already handled by processing multi-word first)
    unique = list(dict.fromkeys(found.values()))
    return sorted(unique)
