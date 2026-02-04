import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export type MediaStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type Category = 'GAME' | 'SCIENCE' | 'MATH' | 'THAI' | 'ENGLISH' | 'SOCIAL' | 'OTHER'

export interface Media {
  id: string
  slug: string
  title: string
  url: string
  thumbnail: string | null
  description: string | null
  category: Category
  tags: string // JSON string array
  status: MediaStatus
  submitted_by: string | null
  view_count: number
  play_count: number
  created_at: string
  updated_at: string
}

// Helper functions to query media
export const mediaQueries = {
  // Get all approved media
  async getApproved() {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Media[]
  },

  // Get popular media (approved, sorted by views)
  async getPopular(limit = 8) {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('status', 'APPROVED')
      .order('view_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Media[]
  },

  // Get media by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Media
  },

  // Get pending media (for admin)
  async getPending() {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Media[]
  },

  // Get media by category
  async getByCategory(category: Category, status: MediaStatus = 'APPROVED') {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('category', category)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Media[]
  },

  // Search media
  async search(query: string, status: MediaStatus = 'APPROVED') {
    const { data, error } = await supabase
      .from('ai_edugame')
      .select('*')
      .eq('status', status)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Media[]
  },

  // Create new media
  async create(media: Omit<Media, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'play_count'>) {
    const { data, error } = await supabase
      .from('ai_edugame')
      .insert([media])
      .select()
      .single()

    if (error) throw error
    return data as Media
  },

  // Update media status (approve/reject)
  async updateStatus(id: string, status: MediaStatus) {
    const { data, error } = await supabase
      .from('ai_edugame')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Media
  },

  // Increment view count
  async incrementViews(id: string) {
    const { data, error } = await supabase.rpc('increment_view_count', {
      media_id: id
    })

    if (error) {
      // Fallback if function doesn't exist
      const media = await this.getBySlug(id)
      const { error: updateError } = await supabase
        .from('ai_edugame')
        .update({ view_count: (media.view_count || 0) + 1 })
        .eq('id', id)

      if (updateError) throw updateError
    }

    return data
  },

  // Increment play count
  async incrementPlays(id: string) {
    const { data, error } = await supabase.rpc('increment_play_count', {
      media_id: id
    })

    if (error) {
      // Fallback if function doesn't exist
      const media = await this.getBySlug(id)
      const { error: updateError } = await supabase
        .from('ai_edugame')
        .update({ play_count: (media.play_count || 0) + 1 })
        .eq('id', id)

      if (updateError) throw updateError
    }

    return data
  },

  // Delete media
  async delete(id: string) {
    const { error } = await supabase
      .from('ai_edugame')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
