export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      abouts: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          title: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abouts_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abouts_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      abouts_cmps: {
        Row: {
          cmp_id: number | null
          component_type: string | null
          entity_id: number | null
          field: string | null
          id: number
          order: number | null
        }
        Insert: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Update: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abouts_entity_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "abouts"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          action: string | null
          action_parameters: Json | null
          conditions: Json | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          properties: Json | null
          published_at: string | null
          subject: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          action?: string | null
          action_parameters?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          properties?: Json | null
          published_at?: string | null
          subject?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          action?: string | null
          action_parameters?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          properties?: Json | null
          published_at?: string | null
          subject?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_permissions_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions_role_lnk: {
        Row: {
          id: number
          permission_id: number | null
          permission_ord: number | null
          role_id: number | null
        }
        Insert: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          role_id?: number | null
        }
        Update: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_role_lnk_fk"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "admin_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_permissions_role_lnk_ifk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "admin_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_roles: {
        Row: {
          code: string | null
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_roles_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          blocked: boolean | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          email: string | null
          firstname: string | null
          id: number
          is_active: boolean | null
          lastname: string | null
          locale: string | null
          password: string | null
          prefered_language: string | null
          published_at: string | null
          registration_token: string | null
          reset_password_token: string | null
          updated_at: string | null
          updated_by_id: number | null
          username: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          firstname?: string | null
          id?: number
          is_active?: boolean | null
          lastname?: string | null
          locale?: string | null
          password?: string | null
          prefered_language?: string | null
          published_at?: string | null
          registration_token?: string | null
          reset_password_token?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          username?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          firstname?: string | null
          id?: number
          is_active?: boolean | null
          lastname?: string | null
          locale?: string | null
          password?: string | null
          prefered_language?: string | null
          published_at?: string | null
          registration_token?: string | null
          reset_password_token?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users_roles_lnk: {
        Row: {
          id: number
          role_id: number | null
          role_ord: number | null
          user_id: number | null
          user_ord: number | null
        }
        Insert: {
          id?: number
          role_id?: number | null
          role_ord?: number | null
          user_id?: number | null
          user_ord?: number | null
        }
        Update: {
          id?: number
          role_id?: number | null
          role_ord?: number | null
          user_id?: number | null
          user_ord?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_roles_lnk_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_roles_lnk_ifk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "admin_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_author_lnk: {
        Row: {
          article_id: number | null
          article_ord: number | null
          author_id: number | null
          id: number
        }
        Insert: {
          article_id?: number | null
          article_ord?: number | null
          author_id?: number | null
          id?: number
        }
        Update: {
          article_id?: number | null
          article_ord?: number | null
          author_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_lnk_fk"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_author_lnk_ifk"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_category_lnk: {
        Row: {
          article_id: number | null
          article_ord: number | null
          category_id: number | null
          id: number
        }
        Insert: {
          article_id?: number | null
          article_ord?: number | null
          category_id?: number | null
          id?: number
        }
        Update: {
          article_id?: number | null
          article_ord?: number | null
          category_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_lnk_fk"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_lnk_ifk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_cmps: {
        Row: {
          cmp_id: number | null
          component_type: string | null
          entity_id: number | null
          field: string | null
          id: number
          order: number | null
        }
        Insert: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Update: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_entity_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          email: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authors_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          slug: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          slug?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          slug?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      components_shared_media: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      components_shared_quotes: {
        Row: {
          body: string | null
          id: number
          title: string | null
        }
        Insert: {
          body?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          body?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      components_shared_rich_texts: {
        Row: {
          body: string | null
          id: number
        }
        Insert: {
          body?: string | null
          id?: number
        }
        Update: {
          body?: string | null
          id?: number
        }
        Relationships: []
      }
      components_shared_seos: {
        Row: {
          id: number
          meta_description: string | null
          meta_title: string | null
        }
        Insert: {
          id?: number
          meta_description?: string | null
          meta_title?: string | null
        }
        Update: {
          id?: number
          meta_description?: string | null
          meta_title?: string | null
        }
        Relationships: []
      }
      components_shared_sliders: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      files: {
        Row: {
          alternative_text: string | null
          caption: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          ext: string | null
          folder_path: string | null
          formats: Json | null
          hash: string | null
          height: number | null
          id: number
          locale: string | null
          mime: string | null
          name: string | null
          preview_url: string | null
          provider: string | null
          provider_metadata: Json | null
          published_at: string | null
          size: number | null
          updated_at: string | null
          updated_by_id: number | null
          url: string | null
          width: number | null
        }
        Insert: {
          alternative_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          ext?: string | null
          folder_path?: string | null
          formats?: Json | null
          hash?: string | null
          height?: number | null
          id?: number
          locale?: string | null
          mime?: string | null
          name?: string | null
          preview_url?: string | null
          provider?: string | null
          provider_metadata?: Json | null
          published_at?: string | null
          size?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
          url?: string | null
          width?: number | null
        }
        Update: {
          alternative_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          ext?: string | null
          folder_path?: string | null
          formats?: Json | null
          hash?: string | null
          height?: number | null
          id?: number
          locale?: string | null
          mime?: string | null
          name?: string | null
          preview_url?: string | null
          provider?: string | null
          provider_metadata?: Json | null
          published_at?: string | null
          size?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
          url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "files_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      files_folder_lnk: {
        Row: {
          file_id: number | null
          file_ord: number | null
          folder_id: number | null
          id: number
        }
        Insert: {
          file_id?: number | null
          file_ord?: number | null
          folder_id?: number | null
          id?: number
        }
        Update: {
          file_id?: number | null
          file_ord?: number | null
          folder_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_lnk_fk"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_folder_lnk_ifk"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "upload_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      files_related_mph: {
        Row: {
          field: string | null
          file_id: number | null
          id: number
          order: number | null
          related_id: number | null
          related_type: string | null
        }
        Insert: {
          field?: string | null
          file_id?: number | null
          id?: number
          order?: number | null
          related_id?: number | null
          related_type?: string | null
        }
        Update: {
          field?: string | null
          file_id?: number | null
          id?: number
          order?: number | null
          related_id?: number | null
          related_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_related_mph_fk"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      globals: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          site_description: string | null
          site_name: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          site_description?: string | null
          site_name?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          site_description?: string | null
          site_name?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "globals_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "globals_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      globals_cmps: {
        Row: {
          cmp_id: number | null
          component_type: string | null
          entity_id: number | null
          field: string | null
          id: number
          order: number | null
        }
        Insert: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Update: {
          cmp_id?: number | null
          component_type?: string | null
          entity_id?: number | null
          field?: string | null
          id?: number
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "globals_entity_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "globals"
            referencedColumns: ["id"]
          },
        ]
      }
      i18n_locale: {
        Row: {
          code: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "i18n_locale_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "i18n_locale_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_api_token_permissions: {
        Row: {
          action: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_api_token_permissions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_api_token_permissions_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_api_token_permissions_token_lnk: {
        Row: {
          api_token_id: number | null
          api_token_permission_id: number | null
          api_token_permission_ord: number | null
          id: number
        }
        Insert: {
          api_token_id?: number | null
          api_token_permission_id?: number | null
          api_token_permission_ord?: number | null
          id?: number
        }
        Update: {
          api_token_id?: number | null
          api_token_permission_id?: number | null
          api_token_permission_ord?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "strapi_api_token_permissions_token_lnk_fk"
            columns: ["api_token_permission_id"]
            isOneToOne: false
            referencedRelation: "strapi_api_token_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_api_token_permissions_token_lnk_ifk"
            columns: ["api_token_id"]
            isOneToOne: false
            referencedRelation: "strapi_api_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_api_tokens: {
        Row: {
          access_key: string | null
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          expires_at: string | null
          id: number
          last_used_at: string | null
          lifespan: number | null
          locale: string | null
          name: string | null
          published_at: string | null
          type: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          access_key?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          lifespan?: number | null
          locale?: string | null
          name?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          access_key?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          lifespan?: number | null
          locale?: string | null
          name?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_api_tokens_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_api_tokens_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_core_store_settings: {
        Row: {
          environment: string | null
          id: number
          key: string | null
          tag: string | null
          type: string | null
          value: string | null
        }
        Insert: {
          environment?: string | null
          id?: number
          key?: string | null
          tag?: string | null
          type?: string | null
          value?: string | null
        }
        Update: {
          environment?: string | null
          id?: number
          key?: string | null
          tag?: string | null
          type?: string | null
          value?: string | null
        }
        Relationships: []
      }
      strapi_database_schema: {
        Row: {
          hash: string | null
          id: number
          schema: Json | null
          time: string | null
        }
        Insert: {
          hash?: string | null
          id?: number
          schema?: Json | null
          time?: string | null
        }
        Update: {
          hash?: string | null
          id?: number
          schema?: Json | null
          time?: string | null
        }
        Relationships: []
      }
      strapi_history_versions: {
        Row: {
          content_type: string
          created_at: string | null
          created_by_id: number | null
          data: Json | null
          id: number
          locale: string | null
          related_document_id: string | null
          schema: Json | null
          status: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          created_by_id?: number | null
          data?: Json | null
          id?: number
          locale?: string | null
          related_document_id?: string | null
          schema?: Json | null
          status?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          created_by_id?: number | null
          data?: Json | null
          id?: number
          locale?: string | null
          related_document_id?: string | null
          schema?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_history_versions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_migrations: {
        Row: {
          id: number
          name: string | null
          time: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          time?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          time?: string | null
        }
        Relationships: []
      }
      strapi_migrations_internal: {
        Row: {
          id: number
          name: string | null
          time: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          time?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          time?: string | null
        }
        Relationships: []
      }
      strapi_release_actions: {
        Row: {
          content_type: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          entry_document_id: string | null
          id: number
          is_entry_valid: boolean | null
          locale: string | null
          published_at: string | null
          type: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          entry_document_id?: string | null
          id?: number
          is_entry_valid?: boolean | null
          locale?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          entry_document_id?: string | null
          id?: number
          is_entry_valid?: boolean | null
          locale?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_release_actions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_release_actions_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_release_actions_release_lnk: {
        Row: {
          id: number
          release_action_id: number | null
          release_action_ord: number | null
          release_id: number | null
        }
        Insert: {
          id?: number
          release_action_id?: number | null
          release_action_ord?: number | null
          release_id?: number | null
        }
        Update: {
          id?: number
          release_action_id?: number | null
          release_action_ord?: number | null
          release_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_release_actions_release_lnk_fk"
            columns: ["release_action_id"]
            isOneToOne: false
            referencedRelation: "strapi_release_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_release_actions_release_lnk_ifk"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "strapi_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_releases: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          released_at: string | null
          scheduled_at: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          released_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          released_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_releases_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_releases_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_transfer_token_permissions: {
        Row: {
          action: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_transfer_token_permissions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_transfer_token_permissions_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_transfer_token_permissions_token_lnk: {
        Row: {
          id: number
          transfer_token_id: number | null
          transfer_token_permission_id: number | null
          transfer_token_permission_ord: number | null
        }
        Insert: {
          id?: number
          transfer_token_id?: number | null
          transfer_token_permission_id?: number | null
          transfer_token_permission_ord?: number | null
        }
        Update: {
          id?: number
          transfer_token_id?: number | null
          transfer_token_permission_id?: number | null
          transfer_token_permission_ord?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_transfer_token_permissions_token_lnk_fk"
            columns: ["transfer_token_permission_id"]
            isOneToOne: false
            referencedRelation: "strapi_transfer_token_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_transfer_token_permissions_token_lnk_ifk"
            columns: ["transfer_token_id"]
            isOneToOne: false
            referencedRelation: "strapi_transfer_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_transfer_tokens: {
        Row: {
          access_key: string | null
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          expires_at: string | null
          id: number
          last_used_at: string | null
          lifespan: number | null
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          access_key?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          lifespan?: number | null
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          access_key?: string | null
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          lifespan?: number | null
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_transfer_tokens_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_transfer_tokens_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_webhooks: {
        Row: {
          enabled: boolean | null
          events: Json | null
          headers: Json | null
          id: number
          name: string | null
          url: string | null
        }
        Insert: {
          enabled?: boolean | null
          events?: Json | null
          headers?: Json | null
          id?: number
          name?: string | null
          url?: string | null
        }
        Update: {
          enabled?: boolean | null
          events?: Json | null
          headers?: Json | null
          id?: number
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
      strapi_workflows: {
        Row: {
          content_types: Json | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          content_types?: Json | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          content_types?: Json | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_workflows_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_workflows_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_workflows_stage_required_to_publish_lnk: {
        Row: {
          id: number
          workflow_id: number | null
          workflow_stage_id: number | null
        }
        Insert: {
          id?: number
          workflow_id?: number | null
          workflow_stage_id?: number | null
        }
        Update: {
          id?: number
          workflow_id?: number | null
          workflow_stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_workflows_stage_required_to_publish_lnk_fk"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "strapi_workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_workflows_stage_required_to_publish_lnk_ifk"
            columns: ["workflow_stage_id"]
            isOneToOne: false
            referencedRelation: "strapi_workflows_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_workflows_stages: {
        Row: {
          color: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_workflows_stages_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_workflows_stages_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_workflows_stages_permissions_lnk: {
        Row: {
          id: number
          permission_id: number | null
          permission_ord: number | null
          workflow_stage_id: number | null
        }
        Insert: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          workflow_stage_id?: number | null
        }
        Update: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          workflow_stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_workflows_stages_permissions_lnk_fk"
            columns: ["workflow_stage_id"]
            isOneToOne: false
            referencedRelation: "strapi_workflows_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_workflows_stages_permissions_lnk_ifk"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "admin_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      strapi_workflows_stages_workflow_lnk: {
        Row: {
          id: number
          workflow_id: number | null
          workflow_stage_id: number | null
          workflow_stage_ord: number | null
        }
        Insert: {
          id?: number
          workflow_id?: number | null
          workflow_stage_id?: number | null
          workflow_stage_ord?: number | null
        }
        Update: {
          id?: number
          workflow_id?: number | null
          workflow_stage_id?: number | null
          workflow_stage_ord?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strapi_workflows_stages_workflow_lnk_fk"
            columns: ["workflow_stage_id"]
            isOneToOne: false
            referencedRelation: "strapi_workflows_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strapi_workflows_stages_workflow_lnk_ifk"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "strapi_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      up_permissions: {
        Row: {
          action: string | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "up_permissions_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "up_permissions_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      up_permissions_role_lnk: {
        Row: {
          id: number
          permission_id: number | null
          permission_ord: number | null
          role_id: number | null
        }
        Insert: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          role_id?: number | null
        }
        Update: {
          id?: number
          permission_id?: number | null
          permission_ord?: number | null
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "up_permissions_role_lnk_fk"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "up_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "up_permissions_role_lnk_ifk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "up_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      up_roles: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          description: string | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          published_at: string | null
          type: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          description?: string | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          published_at?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "up_roles_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "up_roles_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      up_users: {
        Row: {
          blocked: boolean | null
          confirmation_token: string | null
          confirmed: boolean | null
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          email: string | null
          id: number
          locale: string | null
          password: string | null
          provider: string | null
          published_at: string | null
          reset_password_token: string | null
          updated_at: string | null
          updated_by_id: number | null
          username: string | null
        }
        Insert: {
          blocked?: boolean | null
          confirmation_token?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          id?: number
          locale?: string | null
          password?: string | null
          provider?: string | null
          published_at?: string | null
          reset_password_token?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          username?: string | null
        }
        Update: {
          blocked?: boolean | null
          confirmation_token?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          email?: string | null
          id?: number
          locale?: string | null
          password?: string | null
          provider?: string | null
          published_at?: string | null
          reset_password_token?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "up_users_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "up_users_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      up_users_role_lnk: {
        Row: {
          id: number
          role_id: number | null
          user_id: number | null
          user_ord: number | null
        }
        Insert: {
          id?: number
          role_id?: number | null
          user_id?: number | null
          user_ord?: number | null
        }
        Update: {
          id?: number
          role_id?: number | null
          user_id?: number | null
          user_ord?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "up_users_role_lnk_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "up_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "up_users_role_lnk_ifk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "up_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_folders: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          document_id: string | null
          id: number
          locale: string | null
          name: string | null
          path: string | null
          path_id: number | null
          published_at: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          path?: string | null
          path_id?: number | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          document_id?: string | null
          id?: number
          locale?: string | null
          name?: string | null
          path?: string | null
          path_id?: number | null
          published_at?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_folders_created_by_id_fk"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upload_folders_updated_by_id_fk"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_folders_parent_lnk: {
        Row: {
          folder_id: number | null
          folder_ord: number | null
          id: number
          inv_folder_id: number | null
        }
        Insert: {
          folder_id?: number | null
          folder_ord?: number | null
          id?: number
          inv_folder_id?: number | null
        }
        Update: {
          folder_id?: number | null
          folder_ord?: number | null
          id?: number
          inv_folder_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_folders_parent_lnk_fk"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "upload_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upload_folders_parent_lnk_ifk"
            columns: ["inv_folder_id"]
            isOneToOne: false
            referencedRelation: "upload_folders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
