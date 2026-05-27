// Netlify Scheduled Function: keepalive
// Doel: Supabase free tier pauzeert na 7 dagen inactiviteit.
//       Deze functie doet elke 5 dagen een lichte query om het project wakker te houden.

import { createClient } from '@supabase/supabase-js'

export const handler = async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
  )

  const { count, error } = await supabase
    .from('reservaties')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Keepalive ping mislukt:', error.message)
    return { statusCode: 500, body: 'Ping mislukt' }
  }

  console.log(`Keepalive OK — ${count} reservaties in tabel`)
  return { statusCode: 200, body: 'OK' }
}
