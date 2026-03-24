import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

async function main() {
  // Check UserProfile
  const { data: up, error: upErr } = await s.from('UserProfile').select('id').limit(1)
  console.log('UserProfile:', upErr ? `ERROR: ${upErr.message}` : `OK (${up?.length ?? 0} rows)`)

  // Check Plan
  const { data: plans, error: planErr } = await s.from('Plan').select('id, name, price')
  console.log('Plan:', planErr ? `ERROR: ${planErr.message}` : JSON.stringify(plans))

  // Check Claim
  const { data: claims, error: claimErr } = await s.from('Claim').select('id').limit(1)
  console.log('Claim:', claimErr ? `ERROR: ${claimErr.message}` : `OK (${claims?.length ?? 0} rows)`)

  // Check Payment
  const { data: pay, error: payErr } = await s.from('Payment').select('id').limit(1)
  console.log('Payment:', payErr ? `ERROR: ${payErr.message}` : `OK (${pay?.length ?? 0} rows)`)

  // Check trigger
  const { data: trigger, error: trigErr } = await s.rpc('handle_new_user' as never).select()
  console.log('Trigger function:', trigErr ? `Exists (cannot call directly): ${trigErr.message}` : 'OK')
}

main()
