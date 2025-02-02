import { useState } from 'react';

interface CreateProfileProps {
    onSubmit: (name: string, description: string ) => void;
}

const CreateProfile = ({ onSubmit } : CreateProfileProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleCreateProfile = () => {
        onSubmit(name, description);
    };
    return (
        <main className="flex flex-col">
            <form className="w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-300 mb-4">Create Your Profile</h3>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
                </label>
                <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
                </label>
                <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a description"
                ></textarea>
            </div>

            <div className="flex justify-end w-full">
                <button
                    type="button"
                    onClick={handleCreateProfile}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create
                </button>
            </div>
            </form>
        </main>
    )
}

export default CreateProfile;