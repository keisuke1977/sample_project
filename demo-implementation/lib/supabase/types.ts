export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          plan: 'lite' | 'standard' | 'premium'
          employee_limit: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: 'lite' | 'standard' | 'premium'
          employee_limit?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: 'lite' | 'standard' | 'premium'
          employee_limit?: number
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          company_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          created_at?: string
        }
      }
      invite_codes: {
        Row: {
          id: string
          company_id: string
          code: string
          max_uses: number
          used_count: number
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          code: string
          max_uses?: number
          used_count?: number
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          code?: string
          max_uses?: number
          used_count?: number
          expires_at?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          clerk_user_id: string
          company_id: string
          department_id: string | null
          age_group: '20s' | '30s' | '40s' | '50s'
          life_stage: 'menstrual' | 'trying_to_conceive' | 'postpartum' | 'menopause'
          consent_at: string
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          company_id: string
          department_id?: string | null
          age_group: '20s' | '30s' | '40s' | '50s'
          life_stage: 'menstrual' | 'trying_to_conceive' | 'postpartum' | 'menopause'
          consent_at: string
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          company_id?: string
          department_id?: string | null
          age_group?: '20s' | '30s' | '40s' | '50s'
          life_stage?: 'menstrual' | 'trying_to_conceive' | 'postpartum' | 'menopause'
          consent_at?: string
          deleted_at?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          clerk_user_id: string
          company_id: string
          role: 'admin' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          company_id: string
          role?: 'admin' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          company_id?: string
          role?: 'admin' | 'viewer'
          created_at?: string
        }
      }
      consent_records: {
        Row: {
          id: string
          user_id: string
          policy_version: string
          consented_at: string
        }
        Insert: {
          id?: string
          user_id: string
          policy_version: string
          consented_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          policy_version?: string
          consented_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          sleep_score: number
          fatigue_score: number
          mood_score: number
          menstrual_status: 'menstrual' | 'premenstrual' | 'normal'
          feedback_message: string | null
          check_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sleep_score: number
          fatigue_score: number
          mood_score: number
          menstrual_status: 'menstrual' | 'premenstrual' | 'normal'
          feedback_message?: string | null
          check_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sleep_score?: number
          fatigue_score?: number
          mood_score?: number
          menstrual_status?: 'menstrual' | 'premenstrual' | 'normal'
          feedback_message?: string | null
          check_date?: string
          created_at?: string
        }
      }
      check_in_symptoms: {
        Row: {
          id: string
          check_in_id: string
          symptom: 'headache' | 'abdominal_pain' | 'bloating' | 'hot_flash' | 'fatigue' | 'other'
        }
        Insert: {
          id?: string
          check_in_id: string
          symptom: 'headache' | 'abdominal_pain' | 'bloating' | 'hot_flash' | 'fatigue' | 'other'
        }
        Update: {
          id?: string
          check_in_id?: string
          symptom?: 'headache' | 'abdominal_pain' | 'bloating' | 'hot_flash' | 'fatigue' | 'other'
        }
      }
      contents: {
        Row: {
          id: string
          title: string
          body: string
          category: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental'
          content_type: 'article' | 'video'
          thumbnail_url: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          category: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental'
          content_type?: 'article' | 'video'
          thumbnail_url?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          body?: string
          category?: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental'
          content_type?: 'article' | 'video'
          thumbnail_url?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
        }
      }
      content_categories: {
        Row: {
          id: string
          slug: string
          label: string
          sort_order: number
        }
        Insert: {
          id?: string
          slug: string
          label: string
          sort_order?: number
        }
        Update: {
          id?: string
          slug?: string
          label?: string
          sort_order?: number
        }
      }
      specialists: {
        Row: {
          id: string
          clerk_user_id: string
          display_name: string
          role: 'nurse' | 'midwife' | 'obgyn'
          bio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          display_name: string
          role: 'nurse' | 'midwife' | 'obgyn'
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          display_name?: string
          role?: 'nurse' | 'midwife' | 'obgyn'
          bio?: string | null
          created_at?: string
        }
      }
      specialist_slots: {
        Row: {
          id: string
          specialist_id: string
          starts_at: string
          ends_at: string
          is_booked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          specialist_id: string
          starts_at: string
          ends_at: string
          is_booked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          specialist_id?: string
          starts_at?: string
          ends_at?: string
          is_booked?: boolean
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          specialist_id: string | null
          category: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental' | 'other'
          status: 'pending' | 'active' | 'closed'
          created_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          specialist_id?: string | null
          category: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental' | 'other'
          status?: 'pending' | 'active' | 'closed'
          created_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          specialist_id?: string | null
          category?: 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental' | 'other'
          status?: 'pending' | 'active' | 'closed'
          created_at?: string
          closed_at?: string | null
        }
      }
      consultation_messages: {
        Row: {
          id: string
          consultation_id: string
          sender_type: 'user' | 'specialist' | 'system'
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          consultation_id: string
          sender_type: 'user' | 'specialist' | 'system'
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          consultation_id?: string
          sender_type?: 'user' | 'specialist' | 'system'
          body?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          specialist_id: string
          slot_id: string
          consultation_type: 'text' | 'video'
          status: 'scheduled' | 'completed' | 'cancelled'
          video_room_url: string | null
          scheduled_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialist_id: string
          slot_id: string
          consultation_type: 'text' | 'video'
          status?: 'scheduled' | 'completed' | 'cancelled'
          video_room_url?: string | null
          scheduled_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialist_id?: string
          slot_id?: string
          consultation_type?: 'text' | 'video'
          status?: 'scheduled' | 'completed' | 'cancelled'
          video_room_url?: string | null
          scheduled_at?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'checkin_reminder' | 'consultation_reply'
          channel: 'push' | 'email' | 'both'
          scheduled_time: string | null
          is_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'checkin_reminder' | 'consultation_reply'
          channel: 'push' | 'email' | 'both'
          scheduled_time?: string | null
          is_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'checkin_reminder' | 'consultation_reply'
          channel?: 'push' | 'email' | 'both'
          scheduled_time?: string | null
          is_enabled?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      department_monthly_summary: {
        Row: {
          department_id: string
          department_name: string
          company_id: string
          month: string
          total_checkins: number
          avg_mood_score: number | null
          avg_sleep_score: number | null
          avg_fatigue_score: number | null
          active_users: number | null
        }
      }
      company_monthly_summary: {
        Row: {
          company_id: string
          month: string
          active_users: number
          avg_mood_score: number
          avg_sleep_score: number
          avg_fatigue_score: number
        }
      }
    }
  }
}

export type ConsultationMessage = Database['public']['Tables']['consultation_messages']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']
