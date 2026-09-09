import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handler untuk Preflight Request CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 1. GET (Single): Ambil detail 1 produk berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Diubah jadi Promise
) {
  try {
    const { id } = await params; // <-- Ditambahkan await

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data produk tidak ditemukan',
          error_message: error.message,
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Server Error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// 2. PUT: Update data produk berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Diubah jadi Promise
) {
  try {
    const { id } = await params; // <-- Ditambahkan await
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        title: body.title,
        price: body.price,
        stock: body.stock,
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengupdate data produk',
          error_message: error.message,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Produk berhasil diperbarui!',
        data: data[0],
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Server Error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}