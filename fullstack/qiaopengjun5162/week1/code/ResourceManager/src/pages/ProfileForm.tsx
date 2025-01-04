// week1/code/ResourceManager/src/ProfileForm.tsx
import React from 'react';

interface ProfileFormProps {
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (description: string) => void;
    handleCreateProfile: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ name, setName, description, setDescription, handleCreateProfile }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-white">Create Profile</h1>
                <p className="text-gray-400">
                    Enter your details to create your on-chain profile
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-400">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full p-2 pl-10 text-base text-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-white">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block w-full p-2 pl-10 text-sm text-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button onClick={handleCreateProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Create Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileForm;
