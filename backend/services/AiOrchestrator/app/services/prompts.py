import json


class AIPrompts:

    @staticmethod
    def get_resume_extraction_prompt(raw_text: str, expected_schema: dict) -> str:
        return f"""
You are a highly accurate resume parsing engine used in a professional recruitment system.

Your task is to analyze the resume text and extract a structured candidate profile.

========================
RESUME TEXT
========================
{raw_text}

========================
OBJECTIVE
========================

Extract structured information about the candidate including:

• Personal details
• Education
• Work experience
• Projects (if any)
• Certifications
• Core skills
• Tools / software
• Platforms
• Achievements

The resume may belong to ANY professional field including but not limited to:

Engineering  
Marketing  
Finance  
Human Resources  
Healthcare  
Design  
Education  
Sales  
Law  
Business / Management  
Operations  
Research  
Customer Support  
Administration  

Your extraction must work correctly regardless of the domain.

========================
PRIMARY SKILL DISCOVERY RULE
========================

When extracting skills, FIRST locate and carefully read the **SKILLS section** of the resume.

If a skills section exists:
• Extract all items listed there.

Then scan the rest of the resume to find **additional skills mentioned in**:

• Work experience
• Projects
• Responsibilities
• Certifications
• Coursework
• Tools sections
• Achievements
• Technologies used

Combine all discovered skills before categorizing them.

========================
SKILL CATEGORY DEFINITIONS
========================

You MUST classify discovered items into THREE categories:

1️⃣ CORE SKILLS  
Professional abilities, competencies, or domain expertise.

Examples:
Leadership  
Strategic Planning  
Financial Analysis  
Customer Relationship Management  
Digital Marketing  
Teaching  
Negotiation  
Project Management  
Patient Care  
Data Analysis  
Machine Learning  

These represent **capabilities**, not software.

---

2️⃣ TOOLS / SOFTWARE  
Specific software, technologies, programming languages, or systems used to perform work.

Examples:
Python  
Java  
SQL  
Microsoft Excel  
Adobe Photoshop  
Salesforce  
Figma  
Tableau  
Google Analytics  
QuickBooks  

These represent **software tools or technologies**.

---

3️⃣ PLATFORMS  
Large systems, ecosystems, or environments where tools or skills are applied.

Examples:
AWS  
Google Cloud Platform  
Microsoft Azure  
Shopify  
WordPress  
HubSpot  
Meta Ads Manager  
ServiceNow  

These represent **platform environments**.

========================
IMPORTANT CLASSIFICATION RULES
========================

1. Each item MUST appear in ONLY ONE category.
2. Do NOT place the same item in multiple categories.

Example:

Correct:
Core Skills:
Data Analysis

Tools:
Python
SQL

Platforms:
AWS

Incorrect:
Python appearing in both core skills and tools.

3. If an item is clearly software → Tools.
4. If an item represents professional ability → Core Skills.
5. If an item represents a digital ecosystem/service environment → Platforms.

========================
SKILL EXTRACTION RULES
========================

1. Scan the ENTIRE resume before final extraction.

2. Extract BOTH:
• Explicit skills listed in the skills section  
• Implicit skills mentioned in job responsibilities or projects

Example:

"Managed digital campaigns using Google Analytics and Meta Ads."

Core Skills:
Digital Marketing  
Campaign Management  

Tools:
Google Analytics  

Platforms:
Meta Ads Manager

3. Do NOT invent skills that do not appear in the resume.

4. Normalize duplicates.
Example:
MS Excel → Microsoft Excel

5. Maintain deduplicated lists within each category.

========================
PROJECT EXTRACTION RULES
========================

Each project must include:

• project_name  
• description  
• tools_used  

Only include **software/tools used in the project** in tools_used.

Do NOT include general skills there.

========================
EXPERIENCE EXTRACTION RULES
========================

Each experience entry must include:

• company_name  
• role  
• duration  
• responsibilities  
• tools_used  

========================
STRICT OUTPUT RULES
========================

You MUST return ONLY a valid JSON object.

Do NOT include:
• explanations
• markdown
• commentary
• extra text

Your JSON MUST strictly follow this schema:

{json.dumps(expected_schema)}

If a section does not exist in the resume, return an empty array [].

========================
FINAL VALIDATION STEP
========================

Before generating the final JSON:

1. Ensure no item appears in more than one category.
2. Ensure all skills listed in the resume's SKILLS section are included.
3. Ensure technologies mentioned in projects or experience are also included.
4. Ensure lists contain unique items only.
"""

    @staticmethod
    def get_gap_analysis_prompt(profile: dict, target_role: str, schema: dict) -> str:
        return f"""
You are a Senior Career Strategy Consultant and Technical Recruiter.

### TASK
Conduct a rigorous gap analysis between a candidate's profile and the industry standards for: {target_role}.

### INPUT DATA
- Candidate Profile: {json.dumps(profile)}
- Target Role: {target_role}

### ANALYSIS GUIDELINES
1. **Critical Comparison:** Compare the profile against the top 15 in-demand skills for a {target_role} in 2026.
2. **Identify Missing Skills:** You MUST identify at least 5-8 specific technical skills or tools that are NOT in the profile but are essential for the role.
3. **Be Strict:** Even if they have basics, look for missing advanced tools (e.g., Redis, Docker, System Design).
4. **Scoring:** Role readiness score from 0-100.

### OUTPUT INSTRUCTIONS
- Return ONLY a JSON object.
- Use the key 'missing_skills' exactly as defined in the schema.
- Follow this schema: {json.dumps(schema)}
"""

    @staticmethod
    def get_roadmap_generator_prompt(skills_to_learn: list, target_role: str, schema: dict) -> str:
        return f"""
You are an expert Technical Curriculum Designer.

### TASK
Create a high-impact, 4-WEEK accelerated learning roadmap to become a: {target_role}.

### SUBJECTS TO COVER
Focus ONLY on mastering these skills: {json.dumps(skills_to_learn)}

### CURRICULUM REQUIREMENTS
1. **Duration:** Exactly 4 weeks (Milestones).
2. **Efficiency:** Group related skills to maximize speed.
3. **Actionable Goals:** Each week must have 3-4 'learning_goals'.
4. **Resources:** Provide 2-3 'recommended_resources' per week.

### OUTPUT INSTRUCTIONS
- Return ONLY a valid JSON object.
- **CRITICAL:** Use the exact keys: 'week', 'topic', 'learning_goals', 'recommended_resources'.
- Do NOT use 'topics' or 'resources' as keys.
- Strictly follow this schema: {json.dumps(schema)}
"""
    @staticmethod
    def get_interview_generator_prompt(payload: dict, schema: dict) -> str:
        return f"""
You are an expert Technical Interviewer for the role of: {payload['targetRole']}.

### TASK
Generate a structured technical interview containing exactly {payload['distribution']['previous']['count'] + payload['distribution']['roadmap']['count'] + payload['distribution']['general']['count']} questions.

### DISTRIBUTION REQUIREMENTS
1. **Previous Skills ({payload['distribution']['previous']['count']} questions):** Test existing knowledge from: {payload['distribution']['previous']['skills']}. Category MUST be 'previous_skills'.
2. **Roadmap Skills ({payload['distribution']['roadmap']['count']} questions):** Test recently learned concepts from: {payload['distribution']['roadmap']['skills']}. Category MUST be 'roadmap_skills'.
3. **General Role ({payload['distribution']['general']['count']} questions):** Broad architectural questions for a {payload['targetRole']}. Category MUST be 'general_role'.

### OUTPUT INSTRUCTIONS
- Return ONLY a valid JSON object. Do not include markdown backticks like ```json.
- You MUST populate the `questions` array with the exact number of required questions.
- Strictly follow this exact JSON structure:

{{
    "questions": [
        {{
            "question": "The technical question here",
            "category": "previous_skills",
            "relatedSkill": "Name of the specific skill",
            "expectedAnswerPoints": [
                "Key concept 1 the candidate must mention",
                "Key concept 2",
                "Key concept 3"
            ]
        }}
    ]
}}
"""
    @staticmethod
    def get_evaluation_prompt(question: str, expected_points: list, user_answer: str, schema: dict) -> str:
        import json
        
        return f"""
You are a strict, senior Technical Interviewer grading a candidate's response.

### TASK
Evaluate the candidate's answer against the expected key points.

### INTERVIEW DATA
- **Question:** {question}
- **Expected Key Points (Rubric):** {json.dumps(expected_points)}
- **Candidate's Answer:** {user_answer}

### STRICT ZERO-TOLERANCE RULE
If the candidate's answer is "I don't know", "I am not sure", left empty, or is a clear refusal to answer, you MUST give a score of exactly 0. Do not give points for honesty.

### GRADING RUBRIC
- **9-10:** Mentions almost all expected points accurately with excellent technical depth and context.
- **6-8:** Mentions the core concepts but misses some specific technical details or expected points.
- **3-5:** Vague, partially incorrect, lacks depth, or misses the majority of the expected points.
- **1-2:** Completely wrong or entirely irrelevant attempt at answering.
- **0:** Explicitly states they do not know or leaves the answer blank.

### OUTPUT INSTRUCTIONS
- Return ONLY a valid JSON object. Do not include markdown formatting like ```json.
- Provide a `score` (integer 0-10), brief actionable `feedback` (1-2 sentences on what they missed), and a pass/fail boolean (`is_passing`, true if score >= 6).
- Strictly follow this exact JSON schema: {json.dumps(schema)}
"""