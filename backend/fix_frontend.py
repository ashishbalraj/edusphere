import os, glob

replacements = {
    "moduleType: 'Coding Mentor'": "moduleType: 'coding_mentor'",
    "moduleType: 'Chat with PDF'": "moduleType: 'chat_pdf'",
    "moduleType: 'Career Coach'": "moduleType: 'career_coach'",
    "moduleType: 'AI Tutor'": "moduleType: 'tutor'",
    "module_type: 'Study Planner'": "module_type: 'study_planner'",
    "module_type: 'Resume Builder'": "module_type: 'resume'",
    "module_type: 'Research Assistant'": "module_type: 'research_assistant'",
    "module_type: 'Quiz Generator'": "module_type: 'quiz'",
    "module_type: 'Project Recommendations'": "module_type: 'project_recommendation'",
    "module_type: 'Notes Generator'": "module_type: 'notes'",
    "module_type: 'Mock Interview'": "module_type: 'mock_interview'",
    "module_type: 'Flashcards'": "module_type: 'flashcard'",
    "module_type: 'Assignment Assistant'": "module_type: 'assignment'"
}

count = 0
for filepath in glob.glob(r'e:\ASHISH\frontend\src\pages\ai\*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f'Updated {os.path.basename(filepath)}')

print(f'Total files updated: {count}')
