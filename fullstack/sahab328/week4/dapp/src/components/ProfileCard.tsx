import { DisplayProfile } from "@/type";
import Link from "next/link";

interface ProfileCardProps {
    profile: DisplayProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps ) => {
    
    return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-300 mb-4">Profile</h3>

        <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <span className="text-sm font-medium text-gray-400">Name</span>
                <span className="text-lg text-gray-300 break-all">{profile.name}</span>
            </div>

            {/* Profile 信息 */}
            <div className="grid grid-cols-2 gap-4">
                <span className="text-sm font-medium text-gray-400">Description</span>
                <span className="text-lg text-gray-300">{profile.description}</span>
            </div>

            {profile.assets && (
                Object.entries(profile.assets).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4">
                        <span className="text-sm font-medium text-gray-400">{key}</span>
                        <span className="text-lg text-gray-300">
                            {value.length}
                        </span>
                    </div>
                ))
            )}

            <div className="grid grid-cols-2 gap-4">
                <span className="text-sm font-medium text-gray-400">Folders</span>
                <span className="text-lg text-gray-300">{profile.folders.length}</span>
            </div>

            <div className="flex justify-end w-full">
                <Link href={`/user`}>
                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Manage
                    </button>
                </Link>
            </div>
        </div>
    </div>
    );
}

export default ProfileCard;