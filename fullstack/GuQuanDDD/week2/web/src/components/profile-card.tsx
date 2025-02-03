import { DisplayProfile } from "@/type";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
    profile: DisplayProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-6 border-2 border-gray-200 p-6 rounded-lg w-full max-w-2xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                        Name
                    </label>
                    <p className="text-lg font-medium">{profile.name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                        Bio
                    </label>
                    <p className="text-lg">{profile.description}</p>
                </div>
            </div>

            {profile.assets && (
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(profile.assets).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                            <h2 className="text-lg font-medium">{key}</h2>
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                                {value.length}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium">Folders</h2>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {profile.folders.length}
                </span>
            </div>
            <Button onClick={() => {
                navigate(`/user`, { state: { profile: profile } })
            }}>
                Manage
            </Button>
        </div>
    )
}

export default ProfileCard;