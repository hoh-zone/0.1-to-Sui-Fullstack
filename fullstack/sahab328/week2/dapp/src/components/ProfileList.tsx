import { State } from "@/type";

interface ProfileListProps {
    state: State | null;
}
const ProfileList = ({ state } : ProfileListProps) => {
    return (
        <main className="flex flex-col w-full">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Profile List</h3>
                
                {/* 表格容器 */}
                <div className="overflow-x-auto">
                <table className="w-full">
                    {/* 表头 */}
                    <thead>
                    <tr className="bg-gray-800">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Owner</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Profile</th>
                    </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-600">
                        {state && state.users.length > 0 ? (
                            state.users.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-800/50">
                                    <td className="px-4 py-2 text-sm text-gray-300">{user.address}</td>
                                    <td className="px-4 py-2 text-sm text-gray-300">{user.profile}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-sm text-gray-300 text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </main>
    );
};

export default ProfileList;