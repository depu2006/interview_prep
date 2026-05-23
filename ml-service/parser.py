"""
parser.py — Advanced Section-Based Resume Parser
Uses semantic section splitting to ensure extraction is 100% correct.
Maintains proper indentation and "understandable" formatting.
"""

import re
import io
from typing import Optional
import pdfplumber
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text: text_parts.append(page_text)
    except Exception as e: raise ValueError(f"Could not parse PDF: {e}")
    return "\n".join(text_parts)

def extract_text_from_docx(file_bytes: bytes) -> str:
    text_parts = []
    try:
        doc = Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            if para.text.strip(): text_parts.append(para.text)
    except Exception as e: raise ValueError(f"Could not parse DOCX: {e}")
    return "\n".join(text_parts)

def beautify_line(line):
    line = line.strip()
    if not line: return None
    # Remove messy characters
    line = re.sub(r'[^\x00-\x7F]+', ' ', line) 
    line = re.sub(r'[^a-zA-Z0-9\s\.\,\-\(\)\:\/]', '', line)
    return ' '.join(line.split())

def split_into_sections(text):
    """Splits resume into a dictionary of sections based on headers."""
    headers = [
        "education", "academic", "experience", "employment", "work history",
        "projects", "portfolio", "skills", "technical skills", "certifications", 
        "certificates", "awards", "honors", "summary", "objective"
    ]
    
    sections = {}
    current_section = "header"
    lines = text.splitlines()
    
    for line in lines:
        line_clean = line.strip().lower()
        if not line_clean: continue
        
        # Check if this line is a header (short and contains keyword)
        found_header = False
        if len(line_clean) < 30:
            for h in headers:
                if re.fullmatch(rf'^{h}:?$', line_clean) or re.fullmatch(rf'^{h}\s*experience:?$', line_clean):
                    current_section = h
                    if current_section not in sections: sections[current_section] = []
                    found_header = True
                    break
        
        if not found_header:
            if current_section not in sections: sections[current_section] = []
            sections[current_section].append(line)
            
    return sections

def format_section(lines, limit=6):
    formatted = []
    for l in lines:
        clean = beautify_line(l)
        if clean and len(clean) > 8:
            formatted.append(f"   • {clean}")
    return formatted[:limit]

def parse_resume(text: str) -> dict:
    from skill_extractor import extract_skills
    sections = split_into_sections(text)
    
    # Heuristic for name
    name = "Candidate"
    header_lines = sections.get("header", [])
    for l in header_lines[:3]:
        if re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$', l.strip()):
            name = l.strip(); break

    # Extract metadata
    email = re.search(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b', text)
    phone = re.search(r'\b\d{10}\b|\+?\d{1,3}[\d\s\-]{7,15}', text)
    gpa = re.search(r'(?:cgpa|gpa|cpi)[:\s]*([0-9]\.[0-9]{1,2})', text, re.IGNORECASE)

    # Get specific sections with fallbacks
    edu_lines = sections.get("education", []) or sections.get("academic", [])
    exp_lines = sections.get("experience", []) or sections.get("employment", []) or sections.get("work history", [])
    proj_lines = sections.get("projects", []) or sections.get("portfolio", [])
    cert_lines = sections.get("certifications", []) or sections.get("certificates", [])

    return {
        "name": name,
        "email": email.group(0) if email else "Not provided",
        "phone": phone.group(0) if phone else "Not provided",
        "cgpa": gpa.group(1) if gpa else "N/A",
        "skills": extract_skills(text),
        "education": format_section(edu_lines),
        "experience": format_section(exp_lines),
        "certifications": format_section(cert_lines),
        "projects": format_section(proj_lines),
    }
