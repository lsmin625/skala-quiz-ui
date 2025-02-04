export interface Instructor {
  id: number,
  instructorEmail: string,
  instructorPassword: string,
  instructorName: string,
}

export interface Subject {
  id: number,
  subjectName: string,
  instructor: Instructor
}

export interface SubjectSetting {
  id: number,
  subjectName: string,
}

export interface Quiz {
  id: number,
  quizQuestion: string,
  quizDifficulty: number,
  quizType: number,
  quizAnswer: string,
  quizScore: number,
  subject: SubjectSetting,
  quizOptionList: string[]
}
