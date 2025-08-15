<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $user = auth()->user();
        
        if (!$user) {
            // For guests, show welcome page with product showcase
            $featuredProducts = Product::active()
                ->inRandomOrder()
                ->limit(6)
                ->get();
                
            return Inertia::render('welcome', [
                'featuredProducts' => $featuredProducts
            ]);
        }
        
        // For authenticated users, show role-based dashboard
        $data = [];
        
        if ($user->isAdmin()) {
            $data = [
                'totalProducts' => Product::count(),
                'totalSales' => Sale::completed()->count(),
                'totalCustomers' => User::customers()->count(),
                'totalRevenue' => Sale::completed()->sum('total_amount'),
                'recentSales' => Sale::with(['customer', 'cashier'])
                    ->latest()
                    ->limit(5)
                    ->get(),
                'lowStockProducts' => Product::where('stock_quantity', '<=', 10)
                    ->where('is_active', true)
                    ->get(),
            ];
        } elseif ($user->isCashier()) {
            $data = [
                'todaySales' => Sale::where('cashier_id', $user->id)
                    ->whereDate('created_at', today())
                    ->count(),
                'todayRevenue' => Sale::where('cashier_id', $user->id)
                    ->whereDate('created_at', today())
                    ->sum('total_amount'),
                'availableProducts' => Product::active()
                    ->where('stock_quantity', '>', 0)
                    ->count(),
                'recentSales' => Sale::with(['customer'])
                    ->where('cashier_id', $user->id)
                    ->latest()
                    ->limit(5)
                    ->get(),
            ];
        } else {
            // Customer view
            $data = [
                'featuredProducts' => Product::active()
                    ->where('stock_quantity', '>', 0)
                    ->inRandomOrder()
                    ->limit(8)
                    ->get(),
                'myOrders' => Sale::with(['items.product'])
                    ->where('customer_id', $user->id)
                    ->latest()
                    ->limit(5)
                    ->get(),
                'totalOrders' => Sale::where('customer_id', $user->id)->count(),
            ];
        }
        
        return Inertia::render('dashboard', array_merge([
            'userRole' => $user->role
        ], $data));
    }
}