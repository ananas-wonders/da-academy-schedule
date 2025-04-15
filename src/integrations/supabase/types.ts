export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          category: string | null
          course_code: string | null
          created_at: string
          description: string | null
          duration: number | null
          id: string
          lab_hours: number | null
          lecture_hours: number | null
          notes: string | null
          number_of_sessions: number | null
          scheduled_sessions: number | null
          self_study_hours: number | null
          status: string | null
          term: string | null
          title: string
          total_hours: number | null
          track_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          course_code?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          lab_hours?: number | null
          lecture_hours?: number | null
          notes?: string | null
          number_of_sessions?: number | null
          scheduled_sessions?: number | null
          self_study_hours?: number | null
          status?: string | null
          term?: string | null
          title: string
          total_hours?: number | null
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          course_code?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          lab_hours?: number | null
          lecture_hours?: number | null
          notes?: string | null
          number_of_sessions?: number | null
          scheduled_sessions?: number | null
          self_study_hours?: number | null
          status?: string | null
          term?: string | null
          title?: string
          total_hours?: number | null
          track_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          imageUrl: string | null
          name: string
          notes: string | null
          phone: string | null
          specialization: string[] | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          specialization?: string[] | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          specialization?: string[] | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          count: number | null
          created_at: string
          custom_end_time: string | null
          custom_start_time: string | null
          day_id: string
          id: string
          instructor: string | null
          time: string | null
          title: string
          total: number | null
          track_id: string
          type: string
          updated_at: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          custom_end_time?: string | null
          custom_start_time?: string | null
          day_id: string
          id: string
          instructor?: string | null
          time?: string | null
          title: string
          total?: number | null
          track_id: string
          type: string
          updated_at?: string
        }
        Update: {
          count?: number | null
          created_at?: string
          custom_end_time?: string | null
          custom_start_time?: string | null
          day_id?: string
          id?: string
          instructor?: string | null
          time?: string | null
          title?: string
          total?: number | null
          track_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_groups: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          color?: string | null
          created_at?: string
          id: string
          name: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      track_permissions: {
        Row: {
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          assignment_folder: string | null
          attendance_form: string | null
          code: string | null
          created_at: string
          deputy_supervisor: string | null
          grade_sheet: string | null
          group_id: string | null
          id: string
          name: string
          student_coordinator: string | null
          students_count: number | null
          supervisor: string | null
          teams_link: string | null
          telegram_course_group: string | null
          telegram_general_group: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          assignment_folder?: string | null
          attendance_form?: string | null
          code?: string | null
          created_at?: string
          deputy_supervisor?: string | null
          grade_sheet?: string | null
          group_id?: string | null
          id: string
          name: string
          student_coordinator?: string | null
          students_count?: number | null
          supervisor?: string | null
          teams_link?: string | null
          telegram_course_group?: string | null
          telegram_general_group?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          assignment_folder?: string | null
          attendance_form?: string | null
          code?: string | null
          created_at?: string
          deputy_supervisor?: string | null
          grade_sheet?: string | null
          group_id?: string | null
          id?: string
          name?: string
          student_coordinator?: string | null
          students_count?: number | null
          supervisor?: string | null
          teams_link?: string | null
          telegram_course_group?: string | null
          telegram_general_group?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager", "viewer"],
    },
  },
} as const
