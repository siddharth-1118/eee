import { Student, Session, PortalStats, SmtpStatus } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getStats(): Promise<PortalStats> {
    const res = await fetch('/api/stats');
    return res.json();
  },

  async getStudents(): Promise<Student[]> {
    const res = await fetch('/api/students');
    return res.json();
  },

  async addStudent(student: Partial<Student>): Promise<{ success: boolean; student: Student }> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  async addStudentsBulk(students: Partial<Student>[]): Promise<{
    success: boolean;
    addedCount: number;
    students: Student[];
    totalCount: number;
  }> {
    const res = await fetch('/api/students/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
    return res.json();
  },

  async getSessions(): Promise<Session[]> {
    const res = await fetch('/api/sessions');
    return res.json();
  },

  async createSession(sessionData: Partial<Session> & { sendMail?: boolean }): Promise<{
    success: boolean;
    session: Session;
    dispatchResult?: {
      success: boolean;
      deliveredCount: number;
      failedCount: number;
      results: Array<{ recipient: string; messageId: string }>;
    };
  }> {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    return res.json();
  },

  async deleteSession(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/sessions/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async sendSmtpEmail(params: {
    recipients: string[];
    session: {
      title: string;
      date: string;
      time: string;
      link: string;
      notes?: string;
    };
  }) {
    const res = await fetch('/api/smtp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async getSmtpStatus(): Promise<SmtpStatus> {
    const res = await fetch('/api/smtp/status');
    return res.json();
  }
};
