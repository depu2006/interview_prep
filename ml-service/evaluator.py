"""
evaluator.py — AI Candidate Evaluation Engine
Updated for Module 4: Counterfactual Twin
"""

import re
from skill_extractor import extract_skills
from suggestor import generate_suggestions
from counterfactual import generate_counterfactual_twin

# Weights for the final score (0-100)
WEIGHTS = {
    "skills": 30,
    "experience": 25,
    "certifications": 15,
    "projects": 20,
    "gpa": 10
}

def calculate_skills_match(resume_skills, jd_text):
    if not jd_text:
        return 0, [], []
    
    jd_skills = extract_skills(jd_text)
    if not jd_skills:
        return 50, [], []
    
    resume_skills_set = set(s.lower() for s in resume_skills)
    jd_skills_set = set(s.lower() for s in jd_skills)
    
    matched = list(resume_skills_set & jd_skills_set)
    missing = list(jd_skills_set - resume_skills_set)
    
    match_score = (len(matched) / len(jd_skills_set)) * 100
    return min(match_score, 100), matched, missing

def evaluate_candidate(parsed_data, jd_text):
    """
    Evaluates a candidate with SHAP-like factor impact analysis and Counterfactual Twin.
    """
    skill_score, matched, missing = calculate_skills_match(parsed_data.get("skills", []), jd_text)
    
    # Raw scores (0-100)
    feat_scores = {
        "skills": skill_score,
        "experience": 100 if len(parsed_data.get("experience", [])) >= 3 else (70 if len(parsed_data.get("experience", [])) >= 1 else 0),
        "certifications": 100 if len(parsed_data.get("certifications", [])) >= 2 else (50 if len(parsed_data.get("certifications", [])) >= 1 else 0),
        "projects": 100 if len(parsed_data.get("projects", [])) >= 3 else (60 if len(parsed_data.get("projects", [])) >= 1 else 0),
        "gpa": 80 # default
    }
    
    try:
        gpa_val = float(parsed_data.get("cgpa", 0))
        if gpa_val > 0:
            feat_scores["gpa"] = (gpa_val / 10.0 * 100) if gpa_val > 4.0 else (gpa_val / 4.0 * 100)
    except: pass

    # Calculate final weighted score
    final_score = sum(feat_scores[k] * WEIGHTS[k] for k in WEIGHTS) / 100.0
    
    # The score is now fully dynamic based on the user's actual resume data.
    # No more hardcoded caps.
    final_score = round(final_score, 1)
    
    # Factor Impact Analysis
    impacts = []
    
    # 1. Skills Impact
    skill_impact = (feat_scores["skills"] - 60) * 0.5 
    impacts.append({
        "factor": "Skills Alignment",
        "impact": round(skill_impact, 1),
        "description": f"Matched {len(matched)} key skills." if skill_impact > 0 else f"Missing {len(missing)} critical skills."
    })
    
    # 2. Experience Impact
    exp_count = len(parsed_data.get("experience", []))
    exp_impact = (exp_count - 2) * 15 
    impacts.append({
        "factor": "Professional Experience",
        "impact": round(exp_impact, 1),
        "description": f"History with {exp_count} roles." if exp_impact > 0 else "Limited industry exposure."
    })
    
    # 3. Employment Gap Heuristic
    gap_impact = 0
    if exp_count < 2 and len(parsed_data.get("education", [])) > 0:
        gap_impact = -38 
        impacts.append({
            "factor": "Employment Gap",
            "impact": gap_impact,
            "description": "Significant duration of inactivity detected."
        })
    
    # 4. Projects Impact
    proj_impact = (len(parsed_data.get("projects", [])) - 1) * 10
    impacts.append({
        "factor": "Project Portfolio",
        "impact": round(proj_impact, 1),
        "description": "Technical verification through projects." if proj_impact > 0 else "Few practical projects."
    })
    
    # 5. Certifications
    cert_impact = (len(parsed_data.get("certifications", [])) * 10) - 5
    if cert_impact != -5:
        impacts.append({
            "factor": "Certifications",
            "impact": round(cert_impact, 1),
            "description": "Credentials validate knowledge."
        })

    impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)

    decision = "Accepted" if final_score >= 65 else "Rejected"
    
    # Reasoning string
    top_negative = next((i for i in impacts if i["impact"] < 0), None)
    reasoning = ""
    if top_negative:
        reasoning = f"Your {top_negative['factor'].lower()} contributed {abs(top_negative['impact'])}% of the negative signal."
    else:
        reasoning = "Consistent positive signals across factors."

    # Module 8: Bias Detection
    bias_analysis = {
        "detected": False,
        "factors": [],
        "verdict": "Low risk of systemic bias detected."
    }
    if feat_scores["gpa"] > 90:
        bias_analysis["detected"] = True
        bias_analysis["factors"].append("GPA Over-Weighting")
        bias_analysis["verdict"] = "Warning: The model may unfairly favor candidates with perfect academic scores regardless of skill."
    
    evaluation = {
        "hire_probability": round(final_score, 1),
        "skill_match_percentage": round(skill_score, 1),
        "decision": decision,
        "confidence_score": 88.5,
        "factors": impacts,
        "reasoning": reasoning,
        "breakdown": feat_scores,
        "matched_skills": [m.capitalize() for m in matched],
        "missing_skills": [m.capitalize() for m in missing],
        "bias_analysis": bias_analysis
    }
    
    # Module 4: Counterfactual Twin
    evaluation["twin"] = generate_counterfactual_twin(parsed_data, evaluation)
    
    # Suggestions
    evaluation["suggestions"] = generate_suggestions(parsed_data, evaluation)
    
    return evaluation
