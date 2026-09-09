import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 1. GET: Ambil Semua Produk
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Gagal mengambil data dari Supabase',
        error_message: error.message,
      }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Server Error',
    }, { status: 500, headers: corsHeaders });
  }
}

// 2. POST: Tambah Produk Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.price !== 'number') {
      return NextResponse.json({
        success: false,
        message: 'Field "title" dan "price" wajib diisi!',
      }, { status: 400, headers: corsHeaders });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          title: body.title,
          price: body.price,
          stock: body.stock ?? 0,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Gagal menambah data ke Supabase',
        error_message: error.message,
      }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dibuat!',
      data: data[0],
    }, { status: 201, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Invalid Request Body',
    }, { status: 400, headers: corsHeaders });
  }
}

// 3. DELETE: Hapus Produk Berdasarkan Query Parameter ?id=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Query parameter "id" wajib disertakan!',
      }, { status: 400, headers: corsHeaders });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Gagal menghapus data dari Supabase',
        error_message: error.message,
      }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus!',
    }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Server Error',
    }, { status: 500, headers: corsHeaders });
  }
}