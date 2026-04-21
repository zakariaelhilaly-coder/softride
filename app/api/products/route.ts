import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const featured = searchParams.get('featured') || ''

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `
  const params: (string | number)[] = []

  if (q) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`
    params.push(`%${q}%`, `%${q}%`)
  }
  if (category) {
    query += ` AND c.slug = ?`
    params.push(category)
  }
  if (featured === '1') {
    query += ` AND p.featured = 1`
  }

  query += ` ORDER BY p.created_at DESC`

  const products = db.prepare(query).all(...params)
  return NextResponse.json(products)
}
