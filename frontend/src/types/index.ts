export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuizType = 'mcq' | 'true_false' | 'short_answer' | 'long_answer';

export type NoteStyle = 'summary' | 'detailed' | 'bullet' | 'revision';

export type FileType = 'pdf' | 'docx' | 'pptx';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';

export type AIModuleType =
  | 'tutor'
  | 'chat_pdf'
  | 'notes'
  | 'quiz'
  | 'flashcard'
  | 'study_planner'
  | 'assignment'
  | 'coding_mentor'
  | 'resume'
  | 'career'
  | 'mock_interview'
  | 'project_recommendation'
  | 'research';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  phone: string | null;
  bio: string | null;
  institution: string | null;
  grade_level: string | null;
  subjects: string[];
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string;
  order: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  teacher_name: string;
  category: string;
  difficulty: Difficulty;
  thumbnail_url: string | null;
  syllabus: string | null;
  is_published: boolean;
  enrollment_count: number;
  materials?: CourseMaterial[];
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  course: Course;
  progress: number;
  enrolled_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string;
  file_url: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
}

export interface Quiz {
  id: string;
  course_id: string | null;
  created_by: string;
  title: string;
  difficulty: Difficulty;
  time_limit: number;
  is_ai_generated: boolean;
  question_count: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_type: QuizType;
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  total_points: number;
  time_taken: number;
  completed_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  module_type: AIModuleType;
  title: string;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  file_type: FileType;
  file_size: number;
  extracted_text: string | null;
  uploaded_at: string;
}

export interface GeneratedNote {
  id: string;
  document_id: string;
  user_id: string;
  style: NoteStyle;
  title: string;
  content: string;
  created_at: string;
}

export interface FlashcardDeck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  card_count: number;
  mastered_count: number;
  created_at: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  is_mastered: boolean;
  review_count: number;
  last_reviewed: string | null;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  plan_type: 'daily' | 'weekly' | 'exam';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface StudyTask {
  id: string;
  plan_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  scheduled_date: string;
  start_time: string | null;
  end_time: string | null;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: Record<string, unknown>;
  ats_score: number | null;
  template: string;
  created_at: string;
}

export interface CareerProfile {
  id: string;
  user_id: string;
  current_skills: string[];
  target_role: string | null;
  experience_level: string | null;
  career_goals: string[];
  roadmap: Record<string, unknown> | null;
}

export interface MockInterview {
  id: string;
  user_id: string;
  interview_type: 'technical' | 'hr' | 'behavioral';
  role: string;
  score: number | null;
  feedback: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Attendance {
  id: string;
  course_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
}

export interface DashboardStats {
  total_courses: number;
  total_assignments: number;
  completed_assignments: number;
  average_score: number;
  study_hours: number;
  quiz_attempts: number;
  ai_interactions: number;
  streak_days: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
