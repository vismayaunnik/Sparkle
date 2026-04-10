import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sidcpzfovnyipuhfqcbv.supabase.co'
const supabaseAnonKey = 'sb_publishable_530o2bK6uqaSHs6cEgVS3Q_79NLz69-'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
