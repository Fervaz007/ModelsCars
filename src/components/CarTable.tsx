'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car } from './CarCard';
import { useRouter } from 'next/navigation';

const CarTable: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchCars = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cars');
            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }
            const data = await response.json();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this car?')) {
            try {
                const response = await fetch(`/api/cars/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete car');
                }
                // Refresh the list of cars after deletion
                fetchCars();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading) return <p className="text-center">Loading cars...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Cars</h1>
                <div className="flex gap-4">
                    <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        ← Back to Showcase
                    </Link>
                    <Link href="/admin/new" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                        Add New Car
                    </Link>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Brand</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{car.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{car.brand}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{car.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{car.year}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/edit/${car.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarTable;
