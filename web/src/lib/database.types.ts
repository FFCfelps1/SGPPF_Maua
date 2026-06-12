export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      advisings: {
        Row: {
          advisor_id: string
          co_advisor_id: string | null
          created_at: string
          end_date: string | null
          id: number
          level: Database["public"]["Enums"]["advising_level"]
          project_id: number | null
          scholarship_agency: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["advising_status"]
          student_name: string
          updated_at: string
          work_title: string | null
        }
        Insert: {
          advisor_id: string
          co_advisor_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: never
          level: Database["public"]["Enums"]["advising_level"]
          project_id?: number | null
          scholarship_agency?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["advising_status"]
          student_name: string
          updated_at?: string
          work_title?: string | null
        }
        Update: {
          advisor_id?: string
          co_advisor_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: never
          level?: Database["public"]["Enums"]["advising_level"]
          project_id?: number | null
          scholarship_agency?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["advising_status"]
          student_name?: string
          updated_at?: string
          work_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisings_co_advisor_id_fkey"
            columns: ["co_advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      funding: {
        Row: {
          agency: string
          approved_amount: number
          created_at: string
          currency: string
          end_date: string | null
          id: number
          modality: string | null
          pending_amount: number | null
          project_id: number
          received_amount: number
          start_date: string | null
          status: Database["public"]["Enums"]["funding_status"]
          updated_at: string
        }
        Insert: {
          agency: string
          approved_amount?: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: never
          modality?: string | null
          pending_amount?: number | null
          project_id: number
          received_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["funding_status"]
          updated_at?: string
        }
        Update: {
          agency?: string
          approved_amount?: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: never
          modality?: string | null
          pending_amount?: number | null
          project_id?: number
          received_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["funding_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          affiliation_date: string | null
          area_of_expertise: string | null
          created_at: string
          department: string | null
          email: string
          employment_type: string | null
          full_name: string
          google_scholar_id: string | null
          id: string
          is_active: boolean
          lattes_url: string | null
          orcid: string | null
          position: string | null
          research_gate_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          unit: string | null
          updated_at: string
        }
        Insert: {
          affiliation_date?: string | null
          area_of_expertise?: string | null
          created_at?: string
          department?: string | null
          email: string
          employment_type?: string | null
          full_name: string
          google_scholar_id?: string | null
          id: string
          is_active?: boolean
          lattes_url?: string | null
          orcid?: string | null
          position?: string | null
          research_gate_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          unit?: string | null
          updated_at?: string
        }
        Update: {
          affiliation_date?: string | null
          area_of_expertise?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employment_type?: string | null
          full_name?: string
          google_scholar_id?: string | null
          id?: string
          is_active?: boolean
          lattes_url?: string | null
          orcid?: string | null
          position?: string | null
          research_gate_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string
          dedication_hours: number
          id: number
          profile_id: string
          project_id: number
          role: string | null
        }
        Insert: {
          created_at?: string
          dedication_hours?: number
          id?: never
          profile_id: string
          project_id: number
          role?: string | null
        }
        Update: {
          created_at?: string
          dedication_hours?: number
          id?: never
          profile_id?: string
          project_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_submissions: {
        Row: {
          abstract: string | null
          cp_approval_at: string | null
          created_at: string
          department: string | null
          dept_approval_at: string | null
          estimated_budget: number | null
          funding_agency: string | null
          funding_agency_status: Database["public"]["Enums"]["agency_project_status"] | null
          id: number
          internal_feedback: string | null
          knowledge_area: string | null
          maua_approval_at: string | null
          methodology: string | null
          modality: string | null
          objectives: string | null
          partners: string | null
          research_duration: string | null
          researcher_id: string
          status: Database["public"]["Enums"]["submission_status"]
          title: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          cp_approval_at?: string | null
          created_at?: string
          department?: string | null
          dept_approval_at?: string | null
          estimated_budget?: number | null
          funding_agency?: string | null
          funding_agency_status?: Database["public"]["Enums"]["agency_project_status"] | null
          id?: never
          internal_feedback?: string | null
          knowledge_area?: string | null
          maua_approval_at?: string | null
          methodology?: string | null
          modality?: string | null
          objectives?: string | null
          partners?: string | null
          research_duration?: string | null
          researcher_id: string
          status?: Database["public"]["Enums"]["submission_status"]
          title: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          cp_approval_at?: string | null
          created_at?: string
          department?: string | null
          dept_approval_at?: string | null
          estimated_budget?: number | null
          funding_agency?: string | null
          funding_agency_status?: Database["public"]["Enums"]["agency_project_status"] | null
          id?: never
          internal_feedback?: string | null
          knowledge_area?: string | null
          maua_approval_at?: string | null
          methodology?: string | null
          modality?: string | null
          objectives?: string | null
          partners?: string | null
          research_duration?: string | null
          researcher_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          title?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code: string | null
          created_at: string
          department: string | null
          description: string | null
          end_date: string | null
          id: number
          lead_id: string
          modality: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          end_date?: string | null
          id?: never
          lead_id: string
          modality?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          end_date?: string | null
          id?: never
          lead_id?: string
          modality?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_authors: {
        Row: {
          author_position: number | null
          id: number
          is_corresponding: boolean
          profile_id: string
          publication_id: number
        }
        Insert: {
          author_position?: number | null
          id?: never
          is_corresponding?: boolean
          profile_id: string
          publication_id: number
        }
        Update: {
          author_position?: number | null
          id?: never
          is_corresponding?: boolean
          profile_id?: string
          publication_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "publication_authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_authors_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          authors_text: string | null
          citation_count: number | null
          created_at: string
          doi: string | null
          id: number
          impact_factor: number | null
          issn: string | null
          knowledge_area: string | null
          qualis: string | null
          title: string
          type: Database["public"]["Enums"]["publication_type"] | null
          updated_at: string
          url: string | null
          venue: string | null
          year: number | null
        }
        Insert: {
          authors_text?: string | null
          citation_count?: number | null
          created_at?: string
          doi?: string | null
          id?: never
          impact_factor?: number | null
          issn?: string | null
          knowledge_area?: string | null
          qualis?: string | null
          title: string
          type?: Database["public"]["Enums"]["publication_type"] | null
          updated_at?: string
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Update: {
          authors_text?: string | null
          citation_count?: number | null
          created_at?: string
          doi?: string | null
          id?: never
          impact_factor?: number | null
          issn?: string | null
          knowledge_area?: string | null
          qualis?: string | null
          title?: string
          type?: Database["public"]["Enums"]["publication_type"] | null
          updated_at?: string
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      submission_members: {
        Row: {
          created_at: string
          dedication_hours: number
          id: number
          profile_id: string
          role: string | null
          submission_id: number
        }
        Insert: {
          created_at?: string
          dedication_hours?: number
          id?: never
          profile_id: string
          role?: string | null
          submission_id: number
        }
        Update: {
          created_at?: string
          dedication_hours?: number
          id?: never
          profile_id?: string
          role?: string | null
          submission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "submission_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_members_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_dashboard_stats: {
        Args: { p_department?: string }
        Returns: {
          active_funded_projects: number
          advisings_by_dept: Json
          completed_advisings: number
          funds_received: number
          projects_by_dept: Json
          publications_by_dept: Json
          recent_publications: number
          researchers_by_dept: Json
          total_advisings: number
          total_publications: number
        }[]
      }
      my_permissions: {
        Args: never
        Returns: Database["public"]["Enums"]["app_permission"][]
      }
    }
    Enums: {
      advising_level:
        | "scientific_initiation"
        | "undergraduate_thesis"
        | "masters"
        | "doctorate"
        | "postdoc"
      advising_status: "in_progress" | "completed" | "cancelled"
      app_permission:
        | "researchers:read"
        | "researchers:write"
        | "researchers:delete"
        | "researchers:create"
        | "groups:read"
        | "groups:manage"
        | "projects:read"
        | "projects:write"
        | "projects:delete"
        | "publications:read"
        | "publications:write"
        | "publications:delete"
        | "advisings:read"
        | "advisings:write"
        | "advisings:delete"
        | "funding:read"
        | "funding:write"
        | "funding:delete"
        | "users:manage"
        | "submissions:read"
        | "submissions:write"
        | "submissions:approve"
      app_role: "admin" | "researcher" | "consultant" | "dept_manager" | "cp_manager" | "maua_manager"
      funding_status: "approved" | "in_execution" | "completed" | "cancelled"
      project_status: "planned" | "in_progress" | "completed" | "cancelled"
      publication_type:
        | "article"
        | "conference_paper"
        | "book"
        | "book_chapter"
        | "technical_report"
        | "patent"
      submission_status:
        | "draft"
        | "submitted"
        | "approved_dept"
        | "approved_cp"
        | "approved_maua"
        | "rejected"
      agency_project_status:
        | "em_analise"
        | "pendente"
        | "aprovado"
        | "em_execucao"
        | "concluido"
        | "rejeitado"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      advising_level: [
        "scientific_initiation",
        "undergraduate_thesis",
        "masters",
        "doctorate",
        "postdoc",
      ],
      advising_status: ["in_progress", "completed", "cancelled"],
      app_permission: [
        "researchers:read",
        "researchers:write",
        "researchers:delete",
        "researchers:create",
        "groups:read",
        "groups:manage",
        "projects:read",
        "projects:write",
        "projects:delete",
        "publications:read",
        "publications:write",
        "publications:delete",
        "advisings:read",
        "advisings:write",
        "advisings:delete",
        "funding:read",
        "funding:write",
        "funding:delete",
        "users:manage",
        "submissions:read",
        "submissions:write",
        "submissions:approve",
      ],
      app_role: ["admin", "researcher", "consultant", "dept_manager", "cp_manager", "maua_manager"],
      funding_status: ["approved", "in_execution", "completed", "cancelled"],
      project_status: ["planned", "in_progress", "completed", "cancelled"],
      publication_type: [
        "article",
        "conference_paper",
        "book",
        "book_chapter",
        "technical_report",
        "patent",
      ],
      submission_status: [
        "draft",
        "submitted",
        "approved_dept",
        "approved_cp",
        "approved_maua",
        "rejected",
      ],
      agency_project_status: [
        "em_analise",
        "pendente",
        "aprovado",
        "em_execucao",
        "concluido",
        "rejeitado",
        "cancelado",
      ],
    },
  },
} as const;

