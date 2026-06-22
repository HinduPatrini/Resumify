const groq = require('../config/groq');
const Resume = require('../models/Resume');
const pdf = require('pdf-parse');

// Helper to sanitize and parse JSON returned from Groq
const parseJSONResponse = (text) => {
  let cleaned = text.trim();
  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse JSON response from Groq:', cleaned);
    throw new Error('Invalid JSON format returned from AI model.');
  }
};

// @desc    Improve a resume bullet point using Groq Llama-3 AI
// @route   POST /api/ai/improve-bullet
const improveBullet = async (req, res) => {
  try {
    const bulletText = req.body.bulletText || req.body.bullet;
    const { jobTitle = '', tone = 'metrics-focused' } = req.body;

    if (!bulletText || !bulletText.trim()) {
      return res.status(400).json({ message: 'Bullet point text is required.' });
    }

    const systemPrompt = `You are an elite executive resume writer. Your job is to improve the user's resume bullet point. 
Rewrite the bullet point to make it sound highly professional, start with a strong action verb, highlight measurable impact, or indicate technical complexity.
You must generate 2 to 3 alternative variations according to the requested tone: "${tone}".
${jobTitle ? `The candidate's target job title/role is: "${jobTitle}". Use this for professional context.` : ''}

You must respond ONLY with a valid JSON object containing an array of strings under the key "suggestions". 
Example output format:
{
  "suggestions": [
    "Improved version 1 starting with active verb.",
    "Improved version 2 focusing on metrics/scale.",
    "Improved version 3 showing technical impact."
  ]
}
Do NOT wrap the suggestions in quotation marks inside the array elements, do NOT add bullet symbols (e.g. • or -), and do NOT add intro/outro comments. Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: bulletText.trim() }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const parsed = parseJSONResponse(resultText);
    const suggestions = parsed.suggestions || [bulletText];

    // Maintain backwards compatibility by also returning single "improvedBullet"
    res.json({
      suggestions,
      improvedBullet: suggestions[0] || bulletText
    });
  } catch (error) {
    console.error('Groq improveBullet failed:', error.message);
    res.status(500).json({ message: 'Failed to improve bullet point with AI.' });
  }
};

// @desc    Run an ATS score and optimization check on a resume
// @route   POST /api/ai/ats-check
const atsCheck = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required.' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Job description is required.' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    // Prepare resume content summary for Groq
    const resumeText = `
RESUME TITLE: ${resume.title || 'Untitled'}
SUMMARY: ${resume.summary || 'None'}
SKILLS: ${(resume.skills || []).join(', ') || 'None'}
EXPERIENCE:
${(resume.experience || []).map(exp => `
- Role: ${exp.role || 'N/A'} at ${exp.company || 'N/A'}
  Duration: ${exp.startDate || ''} to ${exp.endDate || ''}
  Bullets:
  ${(exp.bullets || []).map(b => `  * ${b}`).join('\n')}
`).join('\n')}
EDUCATION:
${(resume.education || []).map(edu => `
- Degree: ${edu.degree || 'N/A'} in ${edu.fieldOfStudy || 'N/A'} at ${edu.institution || 'N/A'}
  GPA: ${edu.gpa || 'N/A'}
`).join('\n')}
PROJECTS:
${(resume.projects || []).map(proj => `
- Title: ${proj.title || 'N/A'}
  Description: ${proj.description || ''}
  Tech Stack: ${(proj.techStack || []).join(', ')}
`).join('\n')}
`;

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) simulator and resume auditor.
Your job is to analyze the candidate's resume text against the provided Job Description.
Evaluate the resume for overall relevance, keyword matches, formatting warnings, length/word count, missing sections, and weak phrasing.

You MUST respond with a valid JSON object matching the following structure:
{
  "overallScore": 78,
  "keywordMatch": { 
    "score": 65, 
    "matchedKeywords": ["React", "TypeScript"], 
    "missingKeywords": ["AWS", "Docker"] 
  },
  "formatIssues": ["Resume has no contact links", "Some bullet points do not start with action verbs"],
  "lengthCheck": { "wordCount": 420, "status": "good" },
  "sectionCompleteness": { "missing": ["Certifications"] },
  "weakPhrasing": ["Responsible for updating code (change to: Orchestrated code updates)"],
  "suggestions": ["Add AWS keyword to Projects section", "Start experience bullets with active impact verbs"]
}
Do NOT return any markdown preamble, text introduction, or footnotes. Return ONLY the JSON object.`;

    const userMessage = `
--- RESUME ---
${resumeText}

--- JOB DESCRIPTION ---
${jobDescription}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const parsed = parseJSONResponse(resultText);

    res.json(parsed);
  } catch (error) {
    console.error('Groq atsCheck failed:', error.message);
    res.status(500).json({ message: 'Failed to perform ATS optimization check.' });
  }
};

// @desc    Parse LinkedIn profile text or PDF into structured resume fields
// @route   POST /api/ai/parse-linkedin
const parseLinkedin = async (req, res) => {
  try {
    let textToParse = '';

    if (req.file) {
      // PDF file upload route
      const parsedPdf = await pdf(req.file.buffer);
      textToParse = parsedPdf.text;
    } else if (req.body.rawText) {
      // Paste raw text route
      textToParse = req.body.rawText;
    }

    if (!textToParse || !textToParse.trim()) {
      return res.status(400).json({ message: 'Please upload a PDF file or paste your LinkedIn profile text.' });
    }

    const systemPrompt = `You are a state-of-the-art parser specializing in converting unstructured LinkedIn profile exports (pasted text or PDF text) into structured resume JSON objects.
Analyze the profile text and populate the following keys as accurately as possible. 

The JSON structure you MUST return:
{
  "personalInfo": {
    "fullName": "Full Name",
    "email": "Email if found",
    "phone": "Phone if found",
    "location": "City, Country or Region",
    "linkedin": "LinkedIn profile URL",
    "github": "",
    "portfolio": ""
  },
  "summary": "Professional summary paragraph",
  "education": [
    {
      "institution": "University/School",
      "degree": "Degree (e.g. BS, MS)",
      "fieldOfStudy": "Major/Subject",
      "startDate": "Start date (YYYY-MM-DD or MM/YYYY format if possible, otherwise empty)",
      "endDate": "End date (YYYY-MM-DD, MM/YYYY, or empty if present)",
      "gpa": ""
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "Start date (YYYY-MM-DD or MM/YYYY format if possible)",
      "endDate": "End date (YYYY-MM-DD, MM/YYYY, or Present)",
      "bullets": [
        "Detail accomplishment 1",
        "Detail accomplishment 2"
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": []
}

Rules:
1. Leave fields empty or blank strings/arrays if the information is not present. Do NOT hallucinate details.
2. Group responsibilities under the experience "bullets" array.
3. Clean up the dates to standard string formats (e.g., ISO dates or "Month Year") if parsing allows, otherwise pass them as readable strings.
4. Do NOT output markdown code blocks (like \`\`\`json) outside the JSON. Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: textToParse }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const parsed = parseJSONResponse(resultText);

    res.json(parsed);
  } catch (error) {
    console.error('Groq parseLinkedin failed:', error.message);
    res.status(500).json({ message: 'Failed to parse LinkedIn profile.' });
  }
};

module.exports = {
  improveBullet,
  atsCheck,
  parseLinkedin,
};
