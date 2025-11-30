'use client';

import React, { useEffect, useState } from 'react';
import CarCard, { Car } from './CarCard';

const CarList: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
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

        fetchCars();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading cars...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }
    
    if (cars.length === 0) {
        return <p className="text-center text-gray-500">No cars found. Try adding some in the admin panel.</p>;
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cars.map(car => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
};

export default CarList;
