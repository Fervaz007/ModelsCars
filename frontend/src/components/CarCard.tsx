import React from 'react';

export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
}

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Car Image</span>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{car.brand} {car.model}</h3>
                <p className="text-gray-600 dark:text-gray-300">Year: {car.year}</p>
            </div>
        </div>
    );
};

export default CarCard;
