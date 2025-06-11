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
      areas: {
        Row: {
          created_at: string | null
          id: string
          name: string
          responsible_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lifegroups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          responsible_id: string | null
          sector_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          sector_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          sector_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lifegroups_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          address: string | null
          birth_date: string | null
          contact: string | null
          created_at: string | null
          discipler_id: string | null
          id: string
          is_assistant: boolean | null
          is_leader: boolean | null
          lifegroup_id: string | null
          name: string
          steps: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          discipler_id?: string | null
          id?: string
          is_assistant?: boolean | null
          is_leader?: boolean | null
          lifegroup_id?: string | null
          name: string
          steps?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          discipler_id?: string | null
          id?: string
          is_assistant?: boolean | null
          is_leader?: boolean | null
          lifegroup_id?: string | null
          name?: string
          steps?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_discipler_id_fkey"
            columns: ["discipler_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_lifegroup_id_fkey"
            columns: ["lifegroup_id"]
            isOneToOne: false
            referencedRelation: "lifegroups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          contact: string | null
          created_at: string | null
          full_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          full_name: string
          id: string
          updated_at?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sectors: {
        Row: {
          area_id: string
          created_at: string | null
          id: string
          name: string
          responsible_id: string | null
          updated_at: string | null
        }
        Insert: {
          area_id: string
          created_at?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          updated_at?: string | null
        }
        Update: {
          area_id?: string
          created_at?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sectors_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      user_role:
        | "admin"
        | "area_leader"
        | "sector_leader"
        | "lifegroup_leader"
        | "user"
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
      user_role: [
        "admin",
        "area_leader",
        "sector_leader",
        "lifegroup_leader",
        "user",
      ],
    },
  },
} as const
