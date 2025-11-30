import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.resolve(__dirname, 'db/cars.json');

app.use(cors());
app.use(express.json());

interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
}

// Helper function to read the database
const readCars = async (): Promise<Car[]> => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error: unknown) {
        // If the file doesn't exist, return an empty array
        if (typeof error === 'object' && error !== null && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Helper function to write to the database
const writeCars = async (cars: Car[]): Promise<void> => {
    await fs.writeFile(dbPath, JSON.stringify(cars, null, 2));
};

// Get all cars
app.get('/api/cars', async (req, res) => {
    const cars = await readCars();
    res.json(cars);
});

// Get a single car by ID
app.get('/api/cars/:id', async (req, res) => {
    const cars = await readCars();
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (car) {
        res.json(car);
    } else {
        res.status(404).send('Car not found');
    }
});

// Create a new car
app.post('/api/cars', async (req, res) => {
    const cars = await readCars();
    const newCar: Car = {
        id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
    };
    cars.push(newCar);
    await writeCars(cars);
    res.status(201).json(newCar);
});

// Update a car
app.put('/api/cars/:id', async (req, res) => {
    const cars = await readCars();
    const index = cars.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        const updatedCar = { ...cars[index], ...req.body };
        cars[index] = updatedCar;
        await writeCars(cars);
        res.json(updatedCar);
    } else {
        res.status(404).send('Car not found');
    }
});

// Delete a car
app.delete('/api/cars/:id', async (req, res) => {
    let cars = await readCars();
    const initialLength = cars.length;
    cars = cars.filter(c => c.id !== parseInt(req.params.id));
    if (cars.length < initialLength) {
        await writeCars(cars);
        res.status(204).send();
    } else {
        res.status(404).send('Car not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
