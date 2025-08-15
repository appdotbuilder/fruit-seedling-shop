import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    image_url: string | null;
    category: string;
    is_active: boolean;
}

interface Sale {
    id: number;
    customer_id: number;
    cashier_id: number;
    total_amount: string;
    status: string;
    notes: string | null;
    created_at: string;
    customer?: {
        id: number;
        name: string;
        email: string;
    };
    cashier?: {
        id: number;
        name: string;
        email: string;
    };
    items?: Array<{
        id: number;
        product: Product;
        quantity: number;
        unit_price: string;
        total_price: string;
    }>;
}

interface Props {
    userRole: 'admin' | 'cashier' | 'customer';
    // Admin data
    totalProducts?: number;
    totalSales?: number;
    totalCustomers?: number;
    totalRevenue?: string;
    recentSales?: Sale[];
    lowStockProducts?: Product[];
    // Cashier data
    todaySales?: number;
    todayRevenue?: string;
    availableProducts?: number;
    // Customer data
    featuredProducts?: Product[];
    myOrders?: Sale[];
    totalOrders?: number;
    [key: string]: unknown;
}

export default function Dashboard({
    userRole,
    totalProducts,
    totalSales,
    totalCustomers,
    totalRevenue,
    recentSales = [],
    lowStockProducts = [],
    todaySales,
    todayRevenue,
    availableProducts,
    featuredProducts = [],
    myOrders = [],
    totalOrders,
}: Props) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppShell>
            <Head title={`Dashboard - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`} />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        {userRole === 'admin' && '👨‍💼 Admin Dashboard'}
                        {userRole === 'cashier' && '💰 Cashier Dashboard'}
                        {userRole === 'customer' && '🛒 Customer Dashboard'}
                    </h1>
                    <p className="text-green-100">
                        {userRole === 'admin' && 'Manage your fruit seedling shop with complete control'}
                        {userRole === 'cashier' && 'Process sales and manage customer transactions'}
                        {userRole === 'customer' && 'Browse and order premium fruit seedlings'}
                    </p>
                </div>

                {/* Admin Dashboard */}
                {userRole === 'admin' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">📦</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">💰</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSales}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">👥</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">💵</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {totalRevenue ? formatCurrency(totalRevenue) : '$0.00'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚀 Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={route('products.create')}
                                    className="flex items-center justify-center p-4 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">➕</span>
                                    <span className="font-medium">Add Product</span>
                                </Link>
                                <Link
                                    href={route('sales.create')}
                                    className="flex items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">🛒</span>
                                    <span className="font-medium">New Sale</span>
                                </Link>
                                <Link
                                    href={route('users.create')}
                                    className="flex items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">👤</span>
                                    <span className="font-medium">Add User</span>
                                </Link>
                                <Link
                                    href={route('products.index')}
                                    className="flex items-center justify-center p-4 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">📊</span>
                                    <span className="font-medium">View Reports</span>
                                </Link>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        {lowStockProducts.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">⚠️ Low Stock Alert</h2>
                                <div className="grid gap-3">
                                    {lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded">
                                            <span className="font-medium">{product.name}</span>
                                            <span className="text-red-600 dark:text-red-400 font-bold">
                                                {product.stock_quantity} remaining
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Sales */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">📈 Recent Sales</h2>
                                <Link
                                    href={route('sales.index')}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            {recentSales.length > 0 ? (
                                <div className="space-y-3">
                                    {recentSales.map((sale) => (
                                        <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div>
                                                <p className="font-medium">Sale #{sale.id}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {sale.customer?.name} • {formatDate(sale.created_at)}
                                                </p>
                                            </div>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(sale.total_amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent sales</p>
                            )}
                        </div>
                    </>
                )}

                {/* Cashier Dashboard */}
                {userRole === 'cashier' && (
                    <>
                        {/* Today's Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">🛒</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Sales</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{todaySales || 0}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">💰</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {todayRevenue ? formatCurrency(todayRevenue) : '$0.00'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">📦</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Products</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableProducts || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚀 Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Link
                                    href={route('sales.create')}
                                    className="flex items-center justify-center p-4 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">🛒</span>
                                    <span className="font-medium">New Sale</span>
                                </Link>
                                <Link
                                    href={route('shop')}
                                    className="flex items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">📦</span>
                                    <span className="font-medium">View Products</span>
                                </Link>
                                <Link
                                    href={route('sales.index')}
                                    className="flex items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl mr-2">📊</span>
                                    <span className="font-medium">View Sales</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Sales */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">📈 My Recent Sales</h2>
                                <Link
                                    href={route('sales.index')}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            {recentSales.length > 0 ? (
                                <div className="space-y-3">
                                    {recentSales.map((sale) => (
                                        <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div>
                                                <p className="font-medium">Sale #{sale.id}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {sale.customer?.name} • {formatDate(sale.created_at)}
                                                </p>
                                            </div>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(sale.total_amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent sales</p>
                            )}
                        </div>
                    </>
                )}

                {/* Customer Dashboard */}
                {userRole === 'customer' && (
                    <>
                        {/* Customer Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">📦</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Orders</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders || 0}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">🌱</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Products</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredProducts.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">⭐</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Browse Products */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">🌟 Featured Products</h2>
                                <Link
                                    href={route('shop')}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    Browse All
                                </Link>
                            </div>
                            {featuredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featuredProducts.slice(0, 6).map((product) => (
                                        <div key={product.id} className="border dark:border-gray-700 rounded-lg p-4">
                                            <div className="h-24 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 rounded mb-3 flex items-center justify-center">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded" />
                                                ) : (
                                                    <span className="text-3xl">🌱</span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    product.stock_quantity > 10 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                        : product.stock_quantity > 0
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                                }`}>
                                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No products available</p>
                            )}
                        </div>

                        {/* Recent Orders */}
                        {myOrders.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Recent Orders</h2>
                                <div className="space-y-3">
                                    {myOrders.map((order) => (
                                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div>
                                                <p className="font-medium">Order #{order.id}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(order.created_at)} • {order.status}
                                                </p>
                                            </div>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(order.total_amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    );
}