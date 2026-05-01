import { createClient } from '@/lib/supabase/server'

async function checkPlans() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('Plan').select('*')
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Plans:', JSON.stringify(data, null, 2))
  }
}

checkPlans()