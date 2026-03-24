import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

async function main() {
  // List auth users
  const { data: { users }, error } = await s.auth.admin.listUsers()
  if (error) {
    console.error('Error listing users:', error.message)
    return
  }

  console.log(`\n👤 Auth users: ${users.length}`)
  for (const u of users) {
    console.log(`   ${u.id} | ${u.email} | ${u.user_metadata?.full_name || '-'}`)

    // Check if UserProfile exists
    const { data: profile } = await s.from('UserProfile').select('id').eq('id', u.id).single()
    if (!profile) {
      console.log(`   ⚠️  No UserProfile! Creating...`)
      const { error: insertErr } = await s.from('UserProfile').insert({
        id: u.id,
        email: u.email || '',
        name: u.user_metadata?.full_name || u.user_metadata?.name || '',
        avatar_url: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
      })
      if (insertErr) {
        console.log(`   ❌ Failed: ${insertErr.message}`)
      } else {
        console.log(`   ✅ Created UserProfile`)
      }
    } else {
      console.log(`   ✅ UserProfile exists`)
    }
  }
}

main()
