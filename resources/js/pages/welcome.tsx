import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

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

interface Props {
    featuredProducts?: Product[];
    [key: string]: unknown;
}

export default function Welcome({ featuredProducts = [] }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="🌱 Fruit Seedling Shop - Grow Your Own Paradise">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌱</span>
                            <h1 className="text-xl font-bold text-green-800 dark:text-green-200">
                                Fruit Seedling Shop
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <span className="mr-2">🏠</span>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-green-700 hover:text-green-900 transition-colors dark:text-green-300 dark:hover:text-green-100"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <span className="mr-2">🌿</span>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            🌱 Grow Your Own
                            <span className="text-green-600 dark:text-green-400 block">
                                Fruit Paradise
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Premium fruit seedlings for home gardeners. From tropical mangoes to crisp apples,
                            start your orchard journey with our high-quality plants.
                        </p>
                        
                        {/* Feature highlights */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-3">🍎</div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Premium Varieties</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Hand-selected fruit seedlings from the best nurseries
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-3">🚚</div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Expert Care</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Professional packaging and growing guides included
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-3">🌿</div>
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Guaranteed Growth</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Healthy plants with satisfaction guarantee
                                </p>
                            </div>
                        </div>

                        {!auth.user && (
                            <div className="space-x-4">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <span className="mr-2">🌱</span>
                                    Start Growing Today
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center px-8 py-3 border-2 border-green-600 text-green-600 text-lg rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                                >
                                    Browse Catalog
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="container mx-auto px-6 py-12">
                        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                            🌟 Featured Seedlings
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="h-48 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 flex items-center justify-center">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-6xl">🌱</span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                            {product.name}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                ${product.price}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.stock_quantity > 10 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                    : product.stock_quantity > 0
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                            }`}>
                                                {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {auth.user && (
                            <div className="text-center mt-8">
                                <Link
                                    href={route('shop')}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <span className="mr-2">🛒</span>
                                    View All Products
                                </Link>
                            </div>
                        )}
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-green-800 dark:bg-gray-900 text-white mt-16">
                    <div className="container mx-auto px-6 py-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <span className="text-2xl">🌱</span>
                                <h3 className="text-xl font-bold">Fruit Seedling Shop</h3>
                            </div>
                            <p className="text-green-100 mb-4">
                                Growing dreams, one seedling at a time
                            </p>
                            <div className="text-green-200 text-sm">
                                Built with ❤️ for garden enthusiasts everywhere
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}