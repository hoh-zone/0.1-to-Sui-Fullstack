import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function OwnedObjects() {
    const account = useCurrentAccount();
    const { data, isPending, error } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: account?.address as string,
        },
        {
            enabled: !!account,
        },
    );

    if (!account) return null;

    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-md">
                <p className="text-red-700">Error: {error.message}</p>
            </div>
        );
    }

    if (isPending || !data) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            {data.data.length === 0 ? (
                <p className="text-gray-500 text-center">No objects owned by the connected wallet</p>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Objects owned by the connected wallet
                    </h3>
                    <div className="space-y-2">
                        {data.data.map((object) => (
                            <div
                                key={object.data?.objectId}
                                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <p className="text-sm text-gray-600">
                                    Object ID: {object.data?.objectId}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
