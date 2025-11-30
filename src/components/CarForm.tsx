'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from './CarCard';

interface CarFormProps {
    car?: Car;
    isNew?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ car, isNew = false }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState<number | ''>(
        new Date().getFullYear()
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (car) {
            setBrand(car.brand);
            setModel(car.model);
            setYear(car.year);
        }
    }, [car]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const carData = { brand, model, year: Number(year) };

        const url = isNew ? '/api/cars' : `/api/cars/${car.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carData),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isNew ? 'create' : 'update'} car`);
            }

            alert(`Car successfully ${isNew ? 'created' : 'updated'}!`);
            router.push('/admin');
            router.refresh(); // Refresh server components
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">{isNew ? 'Add New Car' : 'Edit Car'}</h1>
            
            <div className="mb-4">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required 
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div className="mb-6">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input type="number" id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} required min="1886" max={new Date().getFullYear() + 1}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div className="flex items-center justify-end pt-4">
                <button type="button" onClick={() => router.push('/admin')} disabled={isSubmitting}
                    className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default CarForm;
