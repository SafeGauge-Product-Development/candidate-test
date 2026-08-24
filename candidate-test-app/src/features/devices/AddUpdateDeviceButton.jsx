import { useAuth } from '../auth/useAuth';
import { UserPermissions } from '../auth/UserPermissions';

export function AddUpdateDeviceButton({ mode = 'update', deviceId, onAdd, onUpdate }) {
    const { session } = useAuth();
    const { isAdmin } = UserPermissions({ session });
    const isUpdate = mode === 'update';
    const handleClick = () => {
        if (isUpdate) onUpdate?.(deviceId)
        else onAdd?.()
    };

    return (
        <span title={!isAdmin ? 'User role allows read only' : undefined}>
            <button disabled={!isAdmin} onClick={handleClick}>
                {isUpdate ? 'Update Device' : 'Add Device'}
            </button>
        </span>
    );
}