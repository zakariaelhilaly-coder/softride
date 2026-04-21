import { NextRequest, NextResponse } from 'next/server'
import { initDb, query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await initDb()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const featured = searchParams.get('featured') || ''

  let sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `
  const args: (string | number)[] = []

  if (q) { sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`; args.push(`%${q}%`, `%${q}%`) }
  if (category) { sql += ` AND c.slug = ?`; args.push(category) }
  if (featured === '1') sql += ` AND p.featured = 1`
  sql += ` ORDER BY p.created_at DESC`

  const products = await query(sql, args)
  return NextResponse.json(products)
}
