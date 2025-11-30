'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CarForm from '@/components/CarForm';
import { Car } from '@/components/CarCard';

const EditCarPage = () => {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchCar = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/cars/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch car data');
                    }
                    const data = await response.json();
                    setCar(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchCar();
        }
    }, [id]);

    if (loading) return <p className="text-center mt-8">Loading car details...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
    if (!car) return <p className="text-center mt-8">Car not found.</p>;

    return <CarForm car={car} />;
};

export default EditCarPage;
